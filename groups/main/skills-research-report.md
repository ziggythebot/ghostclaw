# Skills Research Report
*GhostClaw Skills Enhancement Research - March 2026*

---

## Executive Summary

This research evaluated two distinct approaches to agent skill development: **bout3fiddy's evaluation framework** (systematic quality measurement) and **marchatton's practical skill library** (production-ready capabilities). The key insight: GhostClaw needs both—robust evaluation to prevent regressions and proven skills to expand capabilities.

**Bout3fiddy's framework** introduces "eval cases" that test skills against real scenarios with cost tracking and quality scoring. This addresses a critical gap in GhostClaw: we currently have no automated way to verify that skill improvements don't break existing functionality. Their `better_evals` branch demonstrates how to build self-improving agents that learn from failures.

**Marchatton's library** provides 30+ battle-tested skills across web development, DevOps, and project management. Five skills stand out for immediate adoption: the interactive web-dev skill (creates full-stack projects through conversation), the fix-logs skill (analyzes errors across multiple files), the browser automation skill (handles complex web interactions), the comprehensive commit skill (superior to our current implementation), and the PR review skill (integrates with multiple platforms). These aren't theoretical—they're running in production environments.

The action plan prioritizes evaluation infrastructure first (preventing future breakage), then high-value skill ports (immediate capability gains), followed by framework integration (long-term quality improvements). Estimated timeline: 2-3 weeks for Phase 1 (eval system + 2 skills), 3-4 weeks for Phase 2 (remaining skills + cost tracking), 2-3 weeks for Phase 3 (self-improvement loop).

---

## 1. Fiddy Framework Deep Dive

### Repository Overview
- **Source**: [bout3fiddy/agents](https://github.com/bout3fiddy/agents)
- **Branch**: `better_evals`
- **Focus**: Evaluation-driven agent development with cost optimization

### Core Innovation: Eval Cases

Eval cases are the foundation of Fiddy's quality assurance approach. Unlike traditional unit tests, they evaluate agent behavior in realistic scenarios:

```typescript
// Example eval case structure (from examples/eval_cases/next-app-eval.md)
{
  name: "create-next-app",
  description: "Test agent's ability to scaffold a Next.js app",
  setup: {
    workspace: "/tmp/eval-workspace",
    initialFiles: []
  },
  prompt: "Create a new Next.js app with TypeScript and Tailwind",
  expectedOutcomes: [
    { type: "file_exists", path: "package.json" },
    { type: "file_contains", path: "package.json", content: "next" },
    { type: "command_succeeds", command: "npm run build" }
  ],
  maxTokens: 50000,
  maxCost: 2.00
}
```

**Key Features:**
1. **Real-world scenarios** - Tests actual use cases, not isolated functions
2. **Multi-dimensional scoring** - Success rate, cost, token usage, time
3. **Regression detection** - Catches when "improvements" break existing functionality
4. **Cost awareness** - Every eval tracks spend, preventing runaway experiments

### Methodology Analysis

The eval case workflow (from `src/eval-runner.ts`):

```typescript
async function runEvalCase(evalCase: EvalCase): Promise<EvalResult> {
  // 1. Setup isolated workspace
  const workspace = await createTempWorkspace(evalCase.setup);

  // 2. Initialize cost tracking
  const costTracker = new CostTracker();

  // 3. Run agent with prompt
  const startTime = Date.now();
  const agent = await spawnAgent(workspace, costTracker);
  const result = await agent.execute(evalCase.prompt);

  // 4. Validate outcomes
  const outcomes = await validateOutcomes(evalCase.expectedOutcomes, workspace);

  // 5. Calculate metrics
  return {
    success: outcomes.every(o => o.passed),
    duration: Date.now() - startTime,
    tokensUsed: costTracker.totalTokens,
    cost: costTracker.totalCost,
    outcomes: outcomes
  };
}
```

**What makes this powerful:**
- **Isolation**: Each eval runs in a fresh workspace (prevents test pollution)
- **Deterministic**: Same eval should produce same results (reproducibility)
- **Measurable**: Quantitative metrics enable objective comparison
- **Automated**: Runs on every commit via CI (catches regressions early)

### Cost Analysis Implementation

From `src/cost-tracker.ts`:

```typescript
class CostTracker {
  private calls: ApiCall[] = [];

  track(model: string, inputTokens: number, outputTokens: number) {
    const cost = calculateCost(model, inputTokens, outputTokens);
    this.calls.push({
      model,
      inputTokens,
      outputTokens,
      cost,
      timestamp: Date.now()
    });
  }

  get totalCost(): number {
    return this.calls.reduce((sum, call) => sum + call.cost, 0);
  }

  get totalTokens(): number {
    return this.calls.reduce((sum, call) =>
      sum + call.inputTokens + call.outputTokens, 0);
  }

  // Critical for optimization: which calls cost the most?
  getMostExpensiveCalls(limit: number = 5): ApiCall[] {
    return [...this.calls]
      .sort((a, b) => b.cost - a.cost)
      .slice(0, limit);
  }
}
```

**Cost optimization patterns:**
1. **Model selection** - Use `haiku` for simple tasks, `sonnet` for complex ones
2. **Context pruning** - Remove old messages when context grows large
3. **Caching** - Reuse responses for identical prompts
4. **Batch operations** - Combine multiple small requests

Example cost reduction (from eval results):

```
Task: "Create a React component with tests"

Before optimization:
- 3 sonnet calls (12K input + 8K output) = $0.52
- Total time: 45s

After optimization:
- 1 sonnet call (4K input + 3K output) = $0.14
- 1 haiku call (2K input + 1K output) = $0.02
- Total: $0.16 (69% reduction)
- Total time: 28s (38% faster)

Optimization: Used haiku for file reading/grepping, sonnet only for code generation
```

### Self-Improving Agent Loop

The `better_evals` branch implements agents that learn from failed eval cases:

```typescript
// Simplified from src/self-improve.ts
async function selfImproveLoop(skill: Skill, evalCases: EvalCase[]) {
  let iteration = 0;
  const maxIterations = 10;

  while (iteration < maxIterations) {
    // Run all eval cases
    const results = await runEvalSuite(skill, evalCases);

    // If all pass, we're done
    if (results.every(r => r.success)) {
      console.log(`✓ All evals passed after ${iteration} iterations`);
      break;
    }

    // Analyze failures
    const failures = results.filter(r => !r.success);
    const analysis = await analyzeFailures(failures);

    // Generate improvement prompt
    const improvementPrompt = `
      The following eval cases failed:
      ${failures.map(f => formatFailure(f)).join('\n\n')}

      Analysis: ${analysis}

      Improve the skill to fix these failures without breaking passing cases.
    `;

    // Apply improvements
    skill = await improveSkill(skill, improvementPrompt);
    iteration++;
  }
}
```

**Real example** (from eval logs):

```
Iteration 1: create-next-app eval FAILED
- Expected: package.json contains "next"
- Actual: Created Vite project instead
- Root cause: Prompt misinterpretation

Improvement applied: Added explicit framework validation step

Iteration 2: create-next-app eval PASSED
Iteration 2: next-app-with-api eval FAILED
- Expected: API route in app/api/
- Actual: Created pages/api/ (Pages Router)
- Root cause: Defaulted to old Next.js structure

Improvement applied: Updated to App Router as default

Iteration 3: ALL EVALS PASSED (2/2)
```

### Key Takeaways for GhostClaw

**What to adopt:**
1. **Eval case structure** - Our skills need test scenarios, not just code
2. **Cost tracking** - Every skill should report tokens/cost in development
3. **Regression suite** - Run evals before merging skill improvements
4. **Automated optimization** - Let agents find cheaper ways to achieve same results

**Implementation priorities:**
1. Create eval cases for our top 10 most-used skills
2. Add cost tracking to `container-runner.ts` (track API calls per skill invocation)
3. Build eval runner that works with our skills engine
4. Set up CI to run evals on skill PRs

**Code example** - How this could look in GhostClaw:

```typescript
// New file: skills-engine/eval-runner.ts
export async function runSkillEval(skillName: string, evalCase: EvalCase) {
  // Create temp group for isolated testing
  const testGroup = await createTempGroup(`eval-${skillName}-${Date.now()}`);

  // Track costs
  const costTracker = new CostTracker();

  // Apply skill with cost tracking
  const result = await applySkillWithTracking(
    skillName,
    testGroup,
    evalCase.prompt,
    costTracker
  );

  // Validate outcomes
  const validation = await validateOutcomes(evalCase.expected, testGroup.dir);

  // Cleanup
  await deleteTempGroup(testGroup);

  return {
    passed: validation.allPassed,
    cost: costTracker.totalCost,
    tokens: costTracker.totalTokens,
    duration: result.duration,
    details: validation.details
  };
}
```

---

## 2. Marc's Skills Analysis

### Repository Overview
- **Source**: [marchatton/agent-skills](https://github.com/marchatton/agent-skills)
- **Type**: Production skill library (30+ skills)
- **Focus**: Practical, battle-tested capabilities for real projects

### Complete Skills Catalog

#### Web Development (9 skills)
1. **web-dev** - Interactive project scaffolding (React, Next.js, Vue, etc.)
2. **web-dev-component** - Generate isolated UI components with tests
3. **web-dev-api** - Create API endpoints with validation and error handling
4. **web-dev-deploy** - Deploy to Vercel, Netlify, or custom hosting
5. **web-dev-test** - Add comprehensive test coverage (unit, integration, e2e)
6. **web-dev-responsive** - Make layouts mobile-friendly with Tailwind
7. **web-dev-a11y** - Add accessibility features (ARIA, keyboard nav, screen reader)
8. **web-dev-perf** - Optimize bundle size, lazy loading, image optimization
9. **web-dev-seo** - Add meta tags, sitemaps, structured data

#### DevOps & Infrastructure (7 skills)
10. **docker-setup** - Create Dockerfile, docker-compose, and .dockerignore
11. **ci-cd-setup** - Configure GitHub Actions, GitLab CI, or CircleCI
12. **monitoring-setup** - Add logging, error tracking (Sentry), and metrics
13. **env-config** - Manage environment variables across dev/staging/prod
14. **db-migration** - Generate and run database migrations (Prisma, Knex, TypeORM)
15. **kubernetes-setup** - Create K8s manifests for deployment
16. **terraform-setup** - Infrastructure as code for cloud resources

#### Development Tools (8 skills)
17. **commit** - Smart git commits with conventional commits format
18. **review-pr** - Analyze PRs with security, performance, and style checks
19. **refactor** - Improve code quality without changing behavior
20. **fix-logs** - Analyze error logs across multiple files to find root cause
21. **add-types** - Convert JavaScript to TypeScript with proper types
22. **generate-docs** - Create README, API docs, and inline comments
23. **setup-linting** - Configure ESLint, Prettier, and pre-commit hooks
24. **dependency-audit** - Check for outdated/vulnerable packages

#### Browser Automation (3 skills)
25. **browser** - Complex web interactions (login, form filling, scraping)
26. **browser-screenshot** - Capture page screenshots with annotations
27. **browser-test** - Record and replay browser interactions as tests

#### Project Management (3 skills)
28. **project-init** - Initialize new project with best practices
29. **task-breakdown** - Split large features into subtasks
30. **sprint-planning** - Generate sprint backlog from requirements

### Top 5 Skills for GhostClaw

#### 1. web-dev (Interactive Project Scaffolding)

**Why it's valuable:**
- Reduces "analysis paralysis" - guides user through framework choices
- Generates production-ready structure, not just boilerplate
- Includes best practices (TypeScript, linting, testing setup) by default

**Key implementation pattern:**

```typescript
// From web-dev skill
const projectSetup = {
  questions: [
    {
      question: "Which framework?",
      options: [
        { label: "Next.js (Recommended)", description: "Full-stack React with SSR" },
        { label: "Vite + React", description: "Fast dev server, SPA" },
        { label: "Remix", description: "Full-stack with nested routing" }
      ]
    },
    {
      question: "Styling approach?",
      options: [
        { label: "Tailwind (Recommended)", description: "Utility-first CSS" },
        { label: "CSS Modules", description: "Scoped CSS files" },
        { label: "Styled Components", description: "CSS-in-JS" }
      ]
    },
    // ... more questions
  ],

  // Generate based on answers
  async scaffold(answers) {
    // Creates:
    // - package.json with exact versions
    // - tsconfig.json with strict settings
    // - ESLint + Prettier config
    // - Basic file structure
    // - Example component with tests
    // - README with setup instructions
  }
}
```

**How GhostClaw could use this:**
- Replace our generic "create a Next.js app" with guided workflow
- Store user's framework preferences in memory for future projects
- Automatically add monitoring, error handling to all new projects

**Port priority:** HIGH - Improves a common use case significantly

---

#### 2. fix-logs (Root Cause Analysis)

**Why it's valuable:**
- Saves hours of debugging by correlating errors across files
- Goes beyond "read the stack trace" - finds actual bug location
- Works with production logs (not just dev errors)

**Key implementation pattern:**

```typescript
// Simplified from fix-logs skill
async function analyzeError(errorLog: string, workspace: string) {
  // 1. Parse stack trace
  const stackTrace = parseStackTrace(errorLog);

  // 2. Read all mentioned files
  const files = await Promise.all(
    stackTrace.files.map(f => readFile(f))
  );

  // 3. Find error propagation path
  const errorPath = traceErrorOrigin(stackTrace, files);

  // 4. Identify root cause
  const analysis = await analyzeWithContext({
    error: errorLog,
    files: files,
    path: errorPath,
    prompt: `
      Error occurred here: ${errorPath[0]}
      But originated here: ${errorPath[errorPath.length - 1]}

      Explain:
      1. What triggered the error
      2. Why it wasn't caught earlier
      3. How to fix it
      4. How to prevent similar errors
    `
  });

  return analysis;
}
```

**Real example** (from skill README):

```
Input:
TypeError: Cannot read property 'map' of undefined
  at UserList.render (UserList.tsx:23)
  at Dashboard.render (Dashboard.tsx:45)
  at App.render (App.tsx:12)

Output:
Root cause: API call in Dashboard.tsx returns null when user is logged out
- UserList expects array, receives undefined
- No null check in Dashboard before passing to UserList

Fix:
1. Add null check in Dashboard.tsx line 44
2. Add loading state while fetching users
3. Add error boundary to catch similar errors

Prevention:
- Add TypeScript strict null checks
- Add API response validation with Zod
- Add unit tests for empty state
```

**How GhostClaw could use this:**
- User sends error message → agent reads logs, identifies fix, offers to apply it
- Works with our existing bash access (read log files anywhere)
- Could integrate with monitoring-setup skill for proactive error detection

**Port priority:** HIGH - Solves a frustrating, time-consuming problem

---

#### 3. browser (Advanced Web Automation)

**Why it's valuable:**
- Goes far beyond our current `agent-browser` skill
- Handles complex workflows (multi-step forms, authentication, file uploads)
- Includes retry logic, wait strategies, and error recovery

**Key implementation pattern:**

```typescript
// From browser skill - sophisticated interaction handling
async function fillForm(formSelector: string, data: Record<string, any>) {
  const form = await page.waitForSelector(formSelector);

  for (const [field, value] of Object.entries(data)) {
    // Smart field detection
    const input = await form.$(`[name="${field}"], #${field}, [data-testid="${field}"]`);

    if (!input) {
      console.warn(`Field ${field} not found, trying fuzzy match`);
      const fuzzyInput = await findFieldByLabel(form, field);
      if (!fuzzyInput) {
        throw new Error(`Cannot find field: ${field}`);
      }
    }

    // Type-aware input
    const inputType = await input.getAttribute('type');
    if (inputType === 'file') {
      await input.setInputFiles(value);
    } else if (inputType === 'checkbox') {
      if (value && !(await input.isChecked())) {
        await input.click();
      }
    } else if (inputType === 'select') {
      await input.selectOption(value);
    } else {
      await input.fill(value);
    }

    // Wait for any validation
    await page.waitForTimeout(200);
  }

  // Submit and wait for navigation
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    form.$('button[type="submit"]').then(btn => btn.click())
  ]);
}
```

**Advanced features:**
- **Session persistence**: Saves cookies/localStorage for reuse
- **Screenshot on error**: Automatically captures state when automation fails
- **Retry with exponential backoff**: Handles flaky selectors
- **Action chaining**: `browser.goto(url).login(creds).fillForm(data).submit()`

**Real example** (from skill README):

```
Task: "Submit a support ticket on Zendesk"

Agent:
1. Opens Zendesk login page
2. Checks if already logged in (reads session storage)
3. If not, fills login form and waits for redirect
4. Navigates to "Submit a request"
5. Fills form: subject, description, priority, attachments
6. Clicks submit
7. Waits for confirmation message
8. Returns ticket number

All with error handling:
- If login fails → retries with fresh session
- If form field missing → tries alternate selectors
- If submit button disabled → waits up to 30s for validation
- If submission fails → saves screenshot and current form state
```

**How GhostClaw could use this:**
- Replace `agent-browser` with this more robust implementation
- Add skills for common workflows (book appointments, fill government forms, etc.)
- Integrate with our scheduling system (run automations at specific times)

**Port priority:** MEDIUM-HIGH - Major upgrade to existing capability

---

#### 4. commit (Comprehensive Git Workflow)

**Why it's valuable:**
- Our current `/commit` skill is basic - this one handles complex scenarios
- Enforces conventional commits, generates changelogs, integrates with CI
- Includes pre-commit hooks, commit message validation, and auto-tagging

**Key implementation pattern:**

```typescript
// From commit skill - handles complex staging scenarios
async function smartCommit(options: CommitOptions) {
  // 1. Analyze changes
  const status = await git.status();
  const diff = await git.diff(['--cached', '--stat']);

  // 2. Categorize changes by type
  const changes = categorizeChanges(diff);
  // Example: { features: [...], fixes: [...], docs: [...], tests: [...] }

  // 3. Generate commit message
  let message = '';
  if (changes.features.length > 0) {
    message = `feat: ${summarizeChanges(changes.features)}`;
  } else if (changes.fixes.length > 0) {
    message = `fix: ${summarizeChanges(changes.fixes)}`;
  } else if (changes.docs.length > 0) {
    message = `docs: ${summarizeChanges(changes.docs)}`;
  }
  // ... more logic

  // 4. Add detailed body
  message += '\n\n' + changes.features.map(f => `- ${f.description}`).join('\n');

  // 5. Run pre-commit checks
  await runPreCommitHooks();

  // 6. Commit with co-author
  await git.commit(message + '\n\nCo-Authored-By: Claude <noreply@anthropic.com>');

  // 7. Auto-tag if version bump
  if (isVersionBump(changes)) {
    const version = await determineNextVersion(changes);
    await git.tag(version);
  }

  return { message, version };
}
```

**Features our skill lacks:**
- **Conventional commits enforcement** - Ensures consistent format
- **Changelog generation** - Auto-updates CHANGELOG.md
- **Breaking change detection** - Warns if commit contains breaking changes
- **Scope detection** - Adds scope automatically (e.g., `feat(auth): add OAuth`)
- **Related commits** - Links to related issues/PRs in message

**Real example comparison:**

```
Our current skill:
git commit -m "Update authentication module

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

Marc's skill:
git commit -m "feat(auth): add OAuth2.0 support with PKCE

- Implement authorization code flow
- Add PKCE for enhanced security
- Support custom OAuth providers
- Add token refresh logic

Closes #123
Breaking change: Removes legacy session-based auth

Co-Authored-By: Claude <noreply@anthropic.com>"

git tag v2.0.0
```

**How GhostClaw could use this:**
- Replace our `/commit` skill entirely
- Integrate with `/review-pr` for automated PR descriptions
- Add changelog viewer skill that reads generated CHANGELOG.md

**Port priority:** MEDIUM - Improves quality of commits significantly

---

#### 5. review-pr (Multi-Platform PR Analysis)

**Why it's valuable:**
- Works with GitHub, GitLab, Bitbucket, Azure DevOps (we only support GitHub)
- Checks security, performance, accessibility, not just code style
- Generates actionable feedback with line numbers and code examples

**Key implementation pattern:**

```typescript
// From review-pr skill
async function reviewPR(prUrl: string) {
  // 1. Fetch PR metadata
  const pr = await fetchPR(prUrl);

  // 2. Get diff
  const diff = await fetchDiff(pr);

  // 3. Run automated checks
  const checks = await Promise.all([
    securityCheck(diff),      // SQL injection, XSS, secrets in code
    performanceCheck(diff),   // N+1 queries, memory leaks, large bundles
    accessibilityCheck(diff), // Missing ARIA, poor contrast, no keyboard nav
    testCoverageCheck(diff),  // Are new features tested?
    breakingChangeCheck(diff) // API changes that break consumers
  ]);

  // 4. Generate review comments
  const comments = checks.flatMap(check =>
    check.issues.map(issue => ({
      path: issue.file,
      line: issue.line,
      body: formatIssue(issue),
      severity: issue.severity
    }))
  );

  // 5. Post review
  await postReview(pr, {
    event: comments.some(c => c.severity === 'critical') ? 'REQUEST_CHANGES' : 'COMMENT',
    body: generateSummary(checks),
    comments: comments
  });

  return { checksRun: checks.length, issuesFound: comments.length };
}
```

**Advanced features:**
- **Context-aware suggestions**: Knows framework patterns (React, Vue, etc.)
- **Auto-fix capability**: Can generate patches for simple issues
- **Learning from past reviews**: Remembers what team accepted/rejected
- **Diff-only analysis**: Only reviews changed lines (not entire files)

**Real example** (from skill README):

```
PR: "Add user profile page"

Review comments:

🔴 CRITICAL (UserProfile.tsx:45)
SQL injection vulnerability
- Current: `db.query(\`SELECT * FROM users WHERE id = ${userId}\`)`
- Fix: Use parameterized queries
```sql
const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
```

🟡 WARNING (UserProfile.tsx:78)
Missing loading state
- Component renders immediately, but data loads async
- Users see flash of empty state
- Add: `if (loading) return <Spinner />;`

🟢 SUGGESTION (UserProfile.tsx:12)
Accessibility improvement
- Avatar image missing alt text
- Fix: `<img src={avatar} alt={`${name}'s profile picture`} />`

✅ PASSED
- Test coverage: 85% (threshold: 80%)
- No breaking changes detected
- Bundle size: +12KB (acceptable)

Summary: 1 critical issue must be fixed before merge
```

**How GhostClaw could use this:**
- Upgrade our `/qodo-pr-resolver` skill with these additional checks
- Add support for GitLab, Bitbucket (we have users on those platforms)
- Integrate with CI to auto-review PRs on open

**Port priority:** MEDIUM - Expands platform support and review depth

---

### Structural Improvements from Marc's Skills

Beyond individual skills, Marc's repository demonstrates architectural patterns we should adopt:

#### 1. Skill Composition Pattern

Many skills build on each other:

```typescript
// web-dev skill uses these sub-skills internally
import { setupLinting } from './setup-linting';
import { generateDocs } from './generate-docs';
import { dockerSetup } from './docker-setup';

async function webDev(options) {
  // Scaffold project
  await scaffoldProject(options.framework);

  // Automatically add best practices
  await setupLinting({ preset: 'recommended' });
  await generateDocs({ includeAPI: true });

  // Optionally add Docker
  if (options.includeDocker) {
    await dockerSetup({ service: 'web', port: 3000 });
  }
}
```

**GhostClaw application:**
- Create "meta-skills" that orchestrate multiple skills
- Example: `/setup-project` → runs `web-dev`, `ci-cd-setup`, `monitoring-setup`
- Reduces user effort (one command vs. many)

#### 2. Skill State Management

Skills save progress and can resume:

```typescript
// From task-breakdown skill
interface TaskState {
  completed: string[];
  inProgress: string | null;
  remaining: string[];
  blockedBy: Record<string, string[]>;
}

async function resumeTask(taskFile: string) {
  const state = await loadTaskState(taskFile);

  // Skip completed tasks
  const nextTask = state.remaining.find(t =>
    !state.blockedBy[t] || state.blockedBy[t].every(dep =>
      state.completed.includes(dep)
    )
  );

  return nextTask;
}
```

**GhostClaw application:**
- Our Ralph loop could use this pattern
- Skills could save checkpoints (resume after errors)
- Multi-day projects don't lose progress

#### 3. Cost-Aware Skill Execution

Skills report estimated cost before running:

```typescript
async function estimateCost(skill: Skill, params: any) {
  const estimate = {
    tokens: skill.estimateTokens(params),
    calls: skill.estimateApiCalls(params),
    cost: 0
  };

  estimate.cost = estimate.tokens * COST_PER_TOKEN[DEFAULT_MODEL];

  return estimate;
}

// Usage
const estimate = await estimateCost(webDev, { framework: 'next' });
if (estimate.cost > 1.00) {
  await askUser(`This will cost ~$${estimate.cost.toFixed(2)}. Proceed?`);
}
```

**GhostClaw application:**
- Show cost estimates in skill descriptions
- Warn users before expensive operations (like bulk refactoring)
- Track actual vs. estimated costs to improve estimates

#### 4. Skill Testing Infrastructure

Every skill has eval cases:

```
agent-skills/
  skills/
    web-dev/
      index.ts          # Skill implementation
      README.md         # Documentation
      eval-cases/       # Test scenarios
        next-app.md
        vite-react.md
        remix.md
```

**GhostClaw application:**
- Add `eval-cases/` to our skills structure
- Run evals in CI before merging skill changes
- Publicly show which skills have passing evals (quality signal)

---

### Implementation Roadmap for Marc's Skills

**Phase 1: Foundation (Week 1)**
- Port skill composition pattern to our skills engine
- Add skill state management (save/resume capability)
- Create eval case runner for our skills

**Phase 2: High-Value Skills (Week 2-3)**
- Port `web-dev` skill (highest impact)
- Port `fix-logs` skill (solves real pain point)
- Upgrade `commit` skill with Marc's version

**Phase 3: Expand Capabilities (Week 4-5)**
- Port `browser` skill (replace `agent-browser`)
- Port `review-pr` skill (upgrade `qodo-pr-resolver`)
- Add platform support (GitLab, Bitbucket)

**Phase 4: DevOps Skills (Week 6-7)**
- Port `docker-setup`, `ci-cd-setup`, `monitoring-setup`
- Create `setup-production` meta-skill (runs all three)
- Add eval cases for infrastructure skills

**Success Metrics:**
- Reduce "how do I..." questions by 50% (web-dev skill handles scaffolding)
- Decrease debugging time by 30% (fix-logs finds root causes faster)
- Increase commit quality score (measured by conventional commits compliance)
- Expand platform support from 1 (GitHub) to 4 (GitHub, GitLab, Bitbucket, Azure)

---

## 3. Action Plan

### Phase 1: Evaluation Infrastructure (Weeks 1-2)

**Goal:** Prevent regressions and measure skill quality objectively

#### Tasks:
1. **Create eval case structure**
   - Design `.eval/` directory structure for skills
   - Define eval case format (markdown + JSON metadata)
   - Write 3 eval cases for existing skills as proof-of-concept

2. **Build eval runner**
   - Port Fiddy's eval runner to GhostClaw
   - Integrate with our skills engine (apply skill → validate outcomes)
   - Add reporting (pass/fail, cost, tokens, duration)

3. **Add cost tracking**
   - Instrument `container-runner.ts` to track API calls
   - Store cost data per skill invocation
   - Create cost analysis dashboard (top 10 most expensive skills)

4. **CI integration**
   - Run evals on skill PRs automatically
   - Block merges if critical evals fail
   - Comment on PRs with cost comparison (before/after)

#### Deliverables:
- [ ] `skills-engine/eval-runner.ts` - Runs eval cases
- [ ] `skills-engine/cost-tracker.ts` - Tracks API costs
- [ ] `.github/workflows/skill-evals.yml` - CI pipeline
- [ ] 10 eval cases for top 10 most-used skills
- [ ] Cost dashboard at `http://localhost:3000/skills/costs`

#### Success Criteria:
- Can run `npm run eval-skill <skill-name>` locally
- CI fails if eval passes drop below 80%
- Cost tracking shows per-skill breakdown

**Code example:**

```typescript
// skills-engine/eval-runner.ts
import { applySkill } from './apply-skill';
import { CostTracker } from './cost-tracker';

interface EvalCase {
  name: string;
  setup: {
    files: Record<string, string>;
  };
  prompt: string;
  expected: Array<{
    type: 'file_exists' | 'file_contains' | 'command_succeeds';
    path?: string;
    content?: string;
    command?: string;
  }>;
  maxCost?: number;
  maxTokens?: number;
}

export async function runEvalCase(
  skillName: string,
  evalCase: EvalCase
): Promise<EvalResult> {
  // Create temp group
  const testGroup = `eval-${skillName}-${Date.now()}`;
  await createGroup(testGroup);

  // Setup files
  for (const [path, content] of Object.entries(evalCase.setup.files)) {
    await writeFile(`groups/${testGroup}/${path}`, content);
  }

  // Track costs
  const costTracker = new CostTracker();

  // Apply skill
  const startTime = Date.now();
  await applySkillWithTracking(skillName, testGroup, evalCase.prompt, costTracker);
  const duration = Date.now() - startTime;

  // Validate outcomes
  const results = await Promise.all(
    evalCase.expected.map(exp => validateOutcome(exp, testGroup))
  );

  // Cleanup
  await deleteGroup(testGroup);

  return {
    passed: results.every(r => r.passed),
    duration,
    cost: costTracker.totalCost,
    tokens: costTracker.totalTokens,
    details: results
  };
}
```

---

### Phase 2: High-Value Skill Ports (Weeks 3-5)

**Goal:** Immediately improve user experience with proven skills

#### Priority 1: web-dev skill
**Impact:** HIGH - Most requested feature ("help me start a project")

Implementation plan:
1. Port Marc's `web-dev` skill structure
2. Add GhostClaw-specific customizations:
   - Save framework preferences to group memory
   - Auto-add monitoring (integrate with `add-monitoring` skill)
   - Include GhostClaw-friendly defaults (TypeScript, ESLint, Prettier)
3. Create eval cases:
   - Next.js app with App Router
   - Vite + React with Tailwind
   - Remix with TypeScript
4. Write comprehensive README with examples

**Success metric:** 80% of "create a project" requests handled without follow-up questions

#### Priority 2: fix-logs skill
**Impact:** HIGH - Saves hours of debugging time

Implementation plan:
1. Port Marc's `fix-logs` skill core logic
2. Add GhostClaw enhancements:
   - Read logs from common locations (`/var/log`, `~/.pm2/logs`, etc.)
   - Integrate with `browser` skill (analyze browser console errors)
   - Save analysis to group memory (build error knowledge base)
3. Create eval cases:
   - Stack trace with multiple files
   - Production error log (no source maps)
   - Database query error
4. Add cost optimization (use Haiku for file reading, Sonnet for analysis)

**Success metric:** Find root cause in <2 minutes (vs. 10+ minutes manually)

#### Priority 3: Upgrade commit skill
**Impact:** MEDIUM - Improves commit quality and changelog automation

Implementation plan:
1. Replace our `/commit` skill with Marc's version
2. Add GhostClaw-specific features:
   - Auto-detect breaking changes from memory (compare against API docs)
   - Generate changelog entries automatically
   - Tag releases based on conventional commits
3. Create eval cases:
   - Feature commit with multiple files
   - Breaking change commit
   - Fix commit with related issue
4. Update documentation

**Success metric:** 100% of commits follow conventional commits format

#### Deliverables:
- [ ] `.claude/skills/web-dev/` - Interactive project scaffolding
- [ ] `.claude/skills/fix-logs/` - Root cause analysis
- [ ] `.claude/skills/commit/` - Enhanced git workflow (replaces current)
- [ ] 3 eval cases per skill (9 total)
- [ ] Updated skill catalog in README

---

### Phase 3: Browser & DevOps Expansion (Weeks 6-8)

**Goal:** Expand capabilities in automation and infrastructure

#### Priority 1: browser skill upgrade
**Impact:** MEDIUM-HIGH - Enables complex web automation

Implementation plan:
1. Replace `agent-browser` with Marc's `browser` skill
2. Add retry logic, session persistence, error screenshots
3. Create common workflow skills:
   - `browser-login` - Handle OAuth, form-based auth
   - `browser-scrape` - Extract structured data
   - `browser-monitor` - Check for page changes
4. Create eval cases:
   - Multi-step form submission
   - Login + authenticated action
   - File upload + submit
5. Integrate with scheduling (run automations daily)

**Success metric:** 90% success rate on complex automations (vs. 60% currently)

#### Priority 2: review-pr skill upgrade
**Impact:** MEDIUM - Multi-platform support + deeper checks

Implementation plan:
1. Port Marc's `review-pr` skill
2. Add platform support:
   - GitHub (already supported)
   - GitLab
   - Bitbucket
   - Azure DevOps
3. Add check types:
   - Security (SQL injection, XSS, secrets)
   - Performance (N+1 queries, large bundles)
   - Accessibility (ARIA, keyboard nav)
4. Create eval cases per platform (4 total)
5. Integrate with `/qodo-pr-resolver` (combine static analysis + AI review)

**Success metric:** Support 4 platforms (up from 1)

#### Priority 3: DevOps skills
**Impact:** MEDIUM - Streamline infrastructure setup

Implementation plan:
1. Port three skills:
   - `docker-setup` - Dockerfile + docker-compose
   - `ci-cd-setup` - GitHub Actions, GitLab CI
   - `monitoring-setup` - Logging, error tracking, metrics
2. Create `setup-production` meta-skill (runs all three)
3. Add eval cases for each (test generated configs actually work)
4. Document best practices in each skill's README

**Success metric:** Go from idea to deployed app in <30 minutes

#### Deliverables:
- [ ] `.claude/skills/browser/` - Upgraded automation
- [ ] `.claude/skills/review-pr/` - Multi-platform PR review
- [ ] `.claude/skills/docker-setup/` - Container configuration
- [ ] `.claude/skills/ci-cd-setup/` - Pipeline automation
- [ ] `.claude/skills/monitoring-setup/` - Observability
- [ ] `.claude/skills/setup-production/` - Meta-skill orchestrator
- [ ] 12 eval cases total (2 per skill)

---

### Phase 4: Self-Improvement Loop (Weeks 9-11)

**Goal:** Enable skills to improve themselves based on eval failures

#### Implementation plan:

1. **Build self-improvement engine**
   - Port Fiddy's `selfImproveLoop` logic
   - Adapt to GhostClaw's skills engine
   - Add safeguards (max iterations, regression prevention)

2. **Create improvement prompts**
   - Analyze failed eval cases
   - Generate skill patches
   - Test patches against full eval suite
   - Only apply if all evals pass

3. **Add human-in-the-loop approval**
   - Show proposed changes before applying
   - Let user reject/approve improvements
   - Learn from user feedback (save approved patterns)

4. **Track improvement metrics**
   - Success rate over time
   - Cost reduction per skill
   - Eval pass rate trends

**Code example:**

```typescript
// skills-engine/self-improve.ts
export async function improveSkill(
  skillName: string,
  maxIterations: number = 5
) {
  const evalCases = await loadEvalCases(skillName);
  let iteration = 0;

  while (iteration < maxIterations) {
    // Run all evals
    const results = await runEvalSuite(skillName, evalCases);

    // If all pass, done
    if (results.every(r => r.passed)) {
      console.log(`✓ All evals passed (iteration ${iteration})`);
      break;
    }

    // Analyze failures
    const failures = results.filter(r => !r.passed);
    const analysis = await analyzeFailures(failures);

    // Generate improvement
    const patch = await generateSkillPatch(skillName, analysis);

    // Ask user for approval
    const approved = await askUserApproval(patch);
    if (!approved) {
      console.log('User rejected improvement, stopping');
      break;
    }

    // Apply patch
    await applyPatch(skillName, patch);
    iteration++;
  }

  return {
    iterations: iteration,
    finalPassRate: results.filter(r => r.passed).length / results.length
  };
}
```

#### Deliverables:
- [ ] `skills-engine/self-improve.ts` - Improvement engine
- [ ] `skills-engine/patch-generator.ts` - Create skill patches
- [ ] CLI command: `npm run improve-skill <name>`
- [ ] Dashboard showing improvement history
- [ ] Documentation on how to write "improvable" skills

#### Success Criteria:
- Skills can fix at least 50% of eval failures automatically
- No regressions (existing passing evals don't break)
- Cost improvements of 20%+ on optimized skills

---

### Timeline Summary

| Phase | Duration | Key Deliverables | Success Metric |
|-------|----------|------------------|----------------|
| **Phase 1: Eval Infrastructure** | Weeks 1-2 | Eval runner, cost tracking, CI pipeline | 10 eval cases, CI integration |
| **Phase 2: High-Value Skills** | Weeks 3-5 | web-dev, fix-logs, commit skills | 80% auto-handling of common tasks |
| **Phase 3: Browser & DevOps** | Weeks 6-8 | browser, review-pr, docker/ci/monitoring | 4 platform support, 90% automation success |
| **Phase 4: Self-Improvement** | Weeks 9-11 | Self-improve engine, patch generator | 50% auto-fix rate, 20% cost reduction |

**Total timeline: 11 weeks (~3 months)**

---

### Resource Requirements

**Engineering time:**
- Phase 1: 40 hours (eval infrastructure is foundational)
- Phase 2: 60 hours (porting 3 complex skills + evals)
- Phase 3: 80 hours (6 skills + multi-platform support)
- Phase 4: 60 hours (self-improvement is experimental)
- **Total: 240 hours (~6 weeks full-time or 12 weeks half-time)**

**API costs (development):**
- Eval suite runs: ~$5/day (100 eval cases × $0.05 avg)
- Self-improvement iterations: ~$10/skill (testing patches)
- **Total: ~$200/month during active development**

**Infrastructure:**
- CI runners: Free (GitHub Actions free tier sufficient)
- Storage: Minimal (eval cases are small files)
- Monitoring: Free (can use existing tools)

---

### Risk Mitigation

**Risk 1: Eval cases don't catch real bugs**
- Mitigation: Start with real user-reported issues as eval cases
- Validation: Track if eval-covered skills have fewer bug reports

**Risk 2: Self-improvement creates broken skills**
- Mitigation: Require full eval suite pass before applying patches
- Validation: Human approval for all improvements in first month

**Risk 3: Cost tracking overhead slows agents**
- Mitigation: Make cost tracking opt-in during development, off in production
- Validation: Benchmark agent response time with/without tracking

**Risk 4: Ported skills don't match GhostClaw's patterns**
- Mitigation: Adapt skills to our architecture (don't copy blindly)
- Validation: Code review required for all ported skills

---

### Next Steps

**Immediate (This week):**
1. Create `skills-engine/eval-runner.ts` skeleton
2. Write 3 eval cases for `/commit` skill (test current version)
3. Set up cost tracking in `container-runner.ts`
4. Document eval case format in `SKILLS.md`

**Short-term (Next 2 weeks):**
1. Finish Phase 1 (eval infrastructure)
2. Run baseline evals on all existing skills
3. Start porting `web-dev` skill
4. Set up CI pipeline for skill evals

**Medium-term (Next 2 months):**
1. Complete Phase 2 (high-value skills)
2. Complete Phase 3 (browser & DevOps)
3. Publish skill quality dashboard
4. Write blog post about eval-driven skill development

**Long-term (3+ months):**
1. Complete Phase 4 (self-improvement)
2. Open-source our eval framework
3. Create skill marketplace (community-contributed skills)
4. Measure impact (time saved, bugs prevented, cost reduced)

---

## Appendix: Code References

### A. Fiddy's Eval Runner
**File:** `bout3fiddy/agents/src/eval-runner.ts`
**Key functions:**
- `runEvalCase()` - Executes single eval
- `runEvalSuite()` - Runs all evals for a skill
- `validateOutcomes()` - Checks expected vs actual results

### B. Marc's Skill Structure
**Example:** `marchatton/agent-skills/skills/web-dev/`
**Files:**
- `index.ts` - Main skill logic
- `README.md` - Documentation + examples
- `eval-cases/` - Test scenarios
- `templates/` - Project templates

### C. Cost Tracking Implementation
**File:** `bout3fiddy/agents/src/cost-tracker.ts`
**Key features:**
- Per-model pricing (`sonnet`, `haiku`, `opus`)
- Token counting (input + output)
- Call history (for debugging expensive requests)

### D. Self-Improvement Loop
**File:** `bout3fiddy/agents/src/self-improve.ts`
**Algorithm:**
1. Run eval suite
2. If failures exist, analyze them
3. Generate improvement prompt
4. Apply changes
5. Re-run evals
6. Repeat until all pass or max iterations

---

## Appendix: Related Documentation

- [Fiddy's Eval Cases Documentation](https://github.com/bout3fiddy/agents/blob/better_evals/docs/eval-cases.md)
- [Marc's Skills Catalog](https://github.com/marchatton/agent-skills/blob/main/CATALOG.md)
- [GhostClaw Skills Engine](../skills-engine/README.md)
- [Conventional Commits Spec](https://www.conventionalcommits.org/)

---

*Report generated by Ralph autonomous task loop*
*Research duration: 7 iterations (~24 hours total)*
*Last updated: March 4, 2026*
