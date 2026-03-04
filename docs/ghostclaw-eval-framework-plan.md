# GhostClaw Skills Evaluation Framework
## Implementation Plan

**Date:** 2026-03-04
**Status:** Proposed
**Estimated Effort:** 16-24 hours (2-3 days)

---

## Executive Summary

Fiddy's `better_evals` framework is a comprehensive, production-grade evaluation system (~6,100 LOC) built on Gondolin sandboxes, QEMU VMs, and complex parallel execution. While excellent for large-scale agent research, **most of it is overkill for GhostClaw's needs**.

**Recommendation:** Cherry-pick the core concepts (case format, scoring model, minimal runner) and build a lightweight GhostClaw-native implementation.

---

## What's Worth Adopting

### 1. **Eval Case Format** ✅ (High Value, Low Effort)

**From Fiddy:**
```json
{
  "id": "CD-015",
  "suite": "codequality",
  "prompt": ["Multi-line", "prompt", "array"],
  "expectedSkills": ["coding"],
  "expectedRefs": ["skills/coding/references/code-smells/smells/ai-code-smell.md"],
  "disallowedSkills": [],
  "tools": ["read", "edit", "write"],
  "fileAssertions": [{
    "path": "output.py",
    "mustContain": ["http_types", "Request"],
    "mustNotContain": ["PLACEHOLDER"],
    "maxNonEmptyLines": 300
  }],
  "tokenBudget": null,
  "variants": [
    {
      "tag": "skill",
      "expectedSkills": ["coding"],
      "requireSkillFileRead": true
    },
    {
      "tag": "noskill",
      "disallowedSkills": ["coding"]
    }
  ]
}
```

**GhostClaw Adaptation:**
- Store cases as JSONL in `skills-evals/cases/`
- One file per case (e.g., `SK-001.jsonl`)
- Support variants for A/B testing (skill-enabled vs baseline)
- Add GhostClaw-specific fields:
  - `channel`: `"whatsapp"` | `"telegram"` | `"both"`
  - `groupType`: `"main"` | `"isolated"` (admin vs standard group)
  - `scheduledTask`: boolean (test scheduled task execution)

**Effort:** 2 hours (schema design + validator)

---

### 2. **Skill Router Tracking** ✅ (High Value, Medium Effort)

**From Fiddy:**
- Track which skill files the agent reads (`SKILL.md`)
- Track which reference files are accessed (under `skills/{name}/references/`)
- Infer skill activation from file reads
- Score: expected refs read, missing refs, unexpected refs

**GhostClaw Implementation:**
```typescript
// In agent-runner, intercept Read tool calls
interface SkillRouterCapture {
  skillFilesRead: string[];        // ["skills/coding/SKILL.md"]
  referencesRead: string[];        // ["skills/coding/references/..."]
  inferredSkills: string[];        // ["coding"] from path analysis
  expectedRefs: string[];          // From eval case
  missingRefs: string[];           // Expected but not read
  unexpectedRefs: string[];        // Read but not expected
  skillFileReadCount: number;      // Total SKILL.md reads
}
```

**Capture Strategy:**
- Add `PI_EVAL_WORKER=1` env var to agent runtime (like Fiddy)
- When active, agent-runner logs all Read tool calls to IPC
- Worker mode writes `routing-trace.json` to eval output dir
- No sandbox needed — just file read tracking

**Effort:** 4-6 hours (agent instrumentation + capture logic)

---

### 3. **File Assertions Engine** ✅ (High Value, Low Effort)

**From Fiddy:**
```typescript
interface FileAssertion {
  path: string;
  mustContain: string[];
  mustNotContain: string[];
  maxNonEmptyLines: number;
}
```

**GhostClaw Implementation:**
```typescript
// skills-evals/judge.ts
function judgeFileAssertion(
  filePath: string,
  assertion: FileAssertion
): AssertionResult {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim());

  const failures: string[] = [];

  // Check mustContain
  for (const pattern of assertion.mustContain) {
    if (!content.includes(pattern)) {
      failures.push(`Missing required pattern: ${pattern}`);
    }
  }

  // Check mustNotContain
  for (const pattern of assertion.mustNotContain) {
    if (content.includes(pattern)) {
      failures.push(`Found forbidden pattern: ${pattern}`);
    }
  }

  // Check line count
  if (lines.length > assertion.maxNonEmptyLines) {
    failures.push(`Exceeded max lines: ${lines.length} > ${assertion.maxNonEmptyLines}`);
  }

  return {
    passed: failures.length === 0,
    failures
  };
}
```

**Effort:** 2 hours (simple string matching + line counting)

---

### 4. **Minimal Report Generation** ✅ (Medium Value, Low Effort)

**From Fiddy:**
- Markdown reports with case results table
- Per-case trace artifacts (JSON)
- Index file for all reports

**GhostClaw Adaptation:**
```markdown
# Skill Eval Report: GhostClaw v1.0
**Date:** 2026-03-04
**Cases Run:** 12 / 12
**Pass Rate:** 83%

| Case | Suite | Pass | Skills Read | Refs Read | Missing Refs | Token Usage |
|------|-------|------|-------------|-----------|--------------|-------------|
| SK-001 | setup | ✅ | setup-ghostclaw | 2/2 | 0 | 15,234 |
| SK-002 | customize | ❌ | customize | 1/3 | 2 | 23,456 |
| SK-003 | add-telegram | ✅ | add-telegram | 4/4 | 0 | 18,901 |

## Failed Cases
### SK-002: customize
- **Failure:** Missing references: `skills/customize/references/telegram-setup.md`, `skills/customize/references/slack-setup.md`
- **Token Budget:** OK (23,456 / 50,000)
- **File Assertions:** PASS
```

**Storage:**
- `skills-evals/reports/ghostclaw-v1.md`
- `skills-evals/reports/traces/SK-001.json`

**Effort:** 3 hours (markdown generator + trace serialization)

---

### 5. **Cost Tracking** ✅ (High Value, Minimal Effort)

**From Fiddy:**
- Track token usage per case
- Enforce optional `tokenBudget` limits
- Report total eval run cost

**GhostClaw Implementation:**
- Claude SDK already provides usage metadata in responses
- Add `tokenBudget` field to case schema
- Fail case if budget exceeded
- Report total tokens + estimated cost in markdown

**Effort:** 1 hour (parse SDK response, add to report)

---

## What to Skip

### 1. **Gondolin Sandboxing** ❌ (Too Complex)

**Fiddy's Approach:**
- QEMU ARM64 VMs
- Custom Gondolin images
- Snapshot/restore via `qemu-img cow` mode
- 2,000+ LOC for sandbox lifecycle

**Why Skip:**
- GhostClaw agents already run in isolated group directories
- No filesystem contamination risk (each group = separate workspace)
- Adds 10+ hours of integration work
- Requires QEMU, Docker, image builds

**GhostClaw Alternative:**
- Use existing group isolation (`data/sessions/{group}/.claude`)
- Create ephemeral eval groups (`eval-temp-{timestamp}`)
- Delete after eval run completes
- **Zero additional infrastructure**

**Savings:** 10-12 hours

---

### 2. **Parallel Execution** ❌ (Premature Optimization)

**Fiddy's Approach:**
- Worker pool with configurable parallelism
- Batch execution by suite
- Process isolation per case
- ~800 LOC for parallel orchestration

**Why Skip:**
- GhostClaw has ~22 skills (vs Fiddy's 100+ cases)
- Serial execution = 10-15 min total (acceptable)
- Parallel adds complexity: race conditions, resource contention, harder debugging
- Can add later if eval suite grows

**GhostClaw V1:**
- Run cases serially, one at a time
- Simple progress logging
- Easy to debug failures

**Savings:** 6-8 hours

---

### 3. **Shared Sandbox Batching** ❌ (Not Applicable)

**Fiddy's Approach:**
- Group "safe" cases by suite
- Share single workspace across batch
- Detect filesystem contamination
- Restore from snapshot if needed

**Why Skip:**
- Not needed with ephemeral group approach
- Each case gets fresh group directory (cheap to create)
- No contamination = no detection needed

**Savings:** 4-6 hours

---

### 4. **Extended Thinking Mode Matrix** ❌ (Out of Scope)

**Fiddy's Approach:**
- Run same case against multiple models
- Test thinking modes: `low`, `medium`, `high`
- Generate comparison reports

**Why Skip:**
- GhostClaw uses single model (Sonnet 3.5)
- No multi-model testing needed
- Can add later if testing Opus/Haiku

**Savings:** 2-3 hours

---

## GhostClaw Architecture

### Directory Structure
```
skills-evals/
├── cases/                      # Eval case definitions
│   ├── SK-001-setup.jsonl
│   ├── SK-002-customize.jsonl
│   └── SK-003-add-telegram.jsonl
├── fixtures/                   # Test fixtures (like Fiddy)
│   └── telegram-config.json
├── reports/                    # Generated reports
│   ├── ghostclaw-v1.md
│   └── traces/
│       ├── SK-001.json
│       └── SK-002.json
├── runner.ts                   # Main eval orchestrator
├── judge.ts                    # File assertions + scoring
├── capture.ts                  # Skill router tracking
├── reporter.ts                 # Markdown generation
└── schema.ts                   # Case schema + validation
```

### Eval Flow
```
1. Load cases from cases/*.jsonl
2. For each case:
   a. Create ephemeral group (eval-{case-id}-{timestamp})
   b. Write fixtures to group workspace
   c. Launch agent with PI_EVAL_WORKER=1
   d. Send prompt via IPC
   e. Capture skill reads via agent-runner instrumentation
   f. Wait for completion
   g. Run file assertions
   h. Collect routing scorecard
   i. Generate trace JSON
   j. Delete ephemeral group
3. Generate markdown report
4. Write index.json
```

### Agent Instrumentation
```typescript
// container/agent-runner/src/index.ts
if (process.env.PI_EVAL_WORKER === '1') {
  // Intercept Read tool calls
  const originalRead = tools.find(t => t.name === 'Read');
  tools = tools.map(t => {
    if (t.name !== 'Read') return t;
    return {
      ...t,
      execute: async (params) => {
        const result = await originalRead.execute(params);

        // Log skill/reference reads to IPC
        const filePath = params.file_path;
        if (filePath.includes('/.claude/skills/')) {
          logSkillRead(filePath);
        }

        return result;
      }
    };
  });
}
```

### Minimal Case Schema
```typescript
interface EvalCase {
  id: string;                    // "SK-001"
  suite: string;                 // "setup" | "customize" | "add-telegram"
  prompt: string[];              // Multi-line prompt
  expectedSkills: string[];      // ["setup-ghostclaw"]
  expectedRefs: string[];        // Skill reference paths
  disallowedSkills: string[];    // Should NOT read these
  fileAssertions?: FileAssertion[];
  tokenBudget?: number;          // Optional limit
  channel?: "whatsapp" | "telegram" | "both";
  groupType?: "main" | "isolated";
}
```

---

## Development Effort Estimate

| Component | Hours | Priority |
|-----------|-------|----------|
| Case schema + validator | 2 | P0 |
| Agent router instrumentation | 5 | P0 |
| File assertion engine | 2 | P0 |
| Eval runner (serial) | 4 | P0 |
| Report generator | 3 | P0 |
| Cost tracking | 1 | P1 |
| First 5 test cases | 3 | P0 |
| **Total (MVP)** | **20** | |
| Additional test cases (10) | 4 | P1 |
| CI integration | 2 | P2 |
| **Total (Full)** | **26** | |

**MVP Scope (20 hours):**
- Basic runner + judge + reporter
- 5 representative cases (setup, customize, add-telegram, debug, run-ralph)
- Manual execution

**Full Scope (26 hours):**
- 15 total cases covering all skills
- Automated CI checks
- Regression detection

---

## Sample Eval Cases

### SK-001: Setup GhostClaw
```json
{
  "id": "SK-001",
  "suite": "setup",
  "prompt": ["Run /setup-ghostclaw to configure a fresh install"],
  "expectedSkills": ["setup-ghostclaw"],
  "expectedRefs": [
    "skills/setup-ghostclaw/references/dependencies.md"
  ],
  "tokenBudget": 30000,
  "channel": "telegram",
  "groupType": "main"
}
```

### SK-002: Customize Channel
```json
{
  "id": "SK-002",
  "suite": "customize",
  "prompt": [
    "I want to add Telegram as a channel.",
    "Use /customize to help me set it up."
  ],
  "expectedSkills": ["customize", "add-telegram"],
  "expectedRefs": [
    "skills/customize/references/telegram-setup.md"
  ],
  "fileAssertions": [{
    "path": "src/channels/telegram.ts",
    "mustContain": ["Grammy", "bot.start()"],
    "mustNotContain": ["TODO", "FIXME"]
  }],
  "tokenBudget": 50000
}
```

### SK-003: Schedule Morning Briefing
```json
{
  "id": "SK-003",
  "suite": "scheduling",
  "prompt": [
    "Schedule a morning briefing at 8am every day.",
    "It should include weather, calendar, and top news."
  ],
  "expectedSkills": ["add-morning-briefing"],
  "fileAssertions": [{
    "path": "$GHOSTCLAW_IPC_DIR/tasks/schedule_*.json",
    "mustContain": [
      "\"schedule_type\": \"cron\"",
      "\"schedule_value\": \"0 8 * * *\""
    ]
  }],
  "tokenBudget": 20000
}
```

---

## Success Metrics

**V1 Goals:**
1. ✅ Run 5 core eval cases automatically
2. ✅ Detect skill routing failures (missing references)
3. ✅ Enforce token budgets
4. ✅ Generate readable markdown reports
5. ✅ Complete eval run in < 15 minutes

**Future Enhancements:**
- Regression detection (compare reports across versions)
- Cost optimization tracking (token usage trends)
- Multi-model testing (Opus, Haiku)
- Parallel execution (if suite grows > 50 cases)

---

## Implementation Phases

### Phase 1: Foundation (8 hours)
- [ ] Create `skills-evals/` directory structure
- [ ] Define case schema + TypeScript types
- [ ] Build case validator
- [ ] Add agent-runner instrumentation (router tracking)
- [ ] Test with single hardcoded case

### Phase 2: Runner + Judge (6 hours)
- [ ] Build eval runner (ephemeral group creation)
- [ ] Implement file assertion engine
- [ ] Add cost tracking
- [ ] Test with 3 cases

### Phase 3: Reporting (3 hours)
- [ ] Markdown report generator
- [ ] Trace JSON serialization
- [ ] Index file generation

### Phase 4: Test Cases (3 hours)
- [ ] Write 5 core eval cases
- [ ] Run full eval suite
- [ ] Fix failures, iterate

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Agent behavior non-deterministic | Accept variance, focus on critical assertions |
| Skill routing detection fragile | Test with multiple read patterns, validate against known cases |
| Token costs during eval | Set conservative budgets, run on cheap model first |
| Ephemeral group cleanup failures | Add cleanup script, monitor disk usage |

---

## Recommendation

**Proceed with MVP implementation (20 hours):**
1. Start with Phase 1 (foundation)
2. Cherry-pick Fiddy's case format + skill tracking concepts
3. Skip sandboxing, parallelism, multi-model testing
4. Build GhostClaw-native runner using existing group isolation
5. Target: 5 working eval cases by end of Phase 4

**Expected ROI:**
- Catch skill routing regressions before production
- Validate skill quality systematically
- Foundation for future eval expansion
- Minimal infrastructure overhead

---

## Next Steps

1. **Create skills-evals directory structure**
2. **Define case schema (schema.ts)**
3. **Add router tracking to agent-runner**
4. **Build minimal runner (single case)**
5. **Write SK-001 test case (setup-ghostclaw)**
6. **Validate end-to-end flow**

---

**Document Version:** 1.0
**Author:** GhostClaw (Ralph Task #3)
**Review Status:** Pending
