# Skills Framework Research - Overnight Analysis Report

**Date:** 2026-03-04
**Author:** Ralph (Autonomous Task Agent)
**Status:** Complete

---

## Executive Summary

Two parallel investigations into skills framework improvements for GhostClaw:

1. **Fiddy's Evaluation Framework** (bout3fiddy/agents) - Methodology for measuring skill quality and cost-effectiveness
2. **Marc Hatton's Skills** (marchatton/agent-skills) - Professional skill architecture patterns and quality frameworks

**Key Finding:** Progressive disclosure patterns and operation contracts (from Marc) + eval methodology (from Fiddy) = data-driven skill development foundation for GhostClaw.

**Recommended Priority:**
- **Week 1:** Security guardrails + progressive disclosure pattern (9-12 hrs)
- **Week 2-3:** Code smells framework + PR review workflow (12-18 hrs)
- **Week 4:** Eval system foundation (basic routing traces + test cases) (16-24 hrs)

**Total Investment:** ~40-50 hours over 4 weeks
**Expected ROI:** Very High - transforms skill quality and enables systematic improvement

---

# Part 1: Fiddy's Evaluation Framework

## What It Is

bout3fiddy/agents contains a production-grade evaluation system for measuring AI agent skill effectiveness. The framework uses **variant-based comparison** (skill vs no-skill runs) with automated assertions to prove skills improve agent behavior.

**Core Concept:** Run the same task twice - once with skills enabled, once without. Compare quality, cost, and behavior.

## Why It Matters for GhostClaw

- **Quantifiable Impact:** Prove skills actually help (not just assumptions)
- **Cost Awareness:** Track token usage per skill (progressive disclosure ROI)
- **Quality Metrics:** Automated checks prevent skill regressions
- **Objective Development:** Data-driven decisions on skill improvements

## What to Adopt

### ✅ HIGH PRIORITY (Week 4)

#### 1. Eval Case Methodology
**Effort:** 1 day
**Value:** ⭐⭐⭐⭐⭐

JSONL case definitions with variants:
```json
{"case_id": "GC-001", "variant": "full_payload", "prompt": "Setup GhostClaw"}
{"case_id": "GC-001", "variant": "no_payload", "prompt": "Setup GhostClaw"}
```

**File Assertions:**
```json
"fileAssertions": [{
  "path": "{{artifactPath}}",
  "mustContain": ["authenticated", "services started"],
  "mustNotContain": ["ERROR", "failed"],
  "maxNonEmptyLines": 100
}]
```

**Why:** Core proof that skills work - lightweight, high value

#### 2. Routing Scorecard
**Effort:** 1 day
**Value:** ⭐⭐⭐⭐

Track which skills/references agents actually read:
```typescript
{
  "readSkills": ["setup-ghostclaw"],
  "readRefs": ["setup-ghostclaw/soul-prompt.md"],
  "missingRefs": [],
  "unexpectedRefs": []
}
```

**Implementation:** Hook Read tool in agent-runner, pattern match `.claude/skills/*` paths

**Why:** Validates agents use skills correctly, detects ignored guidance

#### 3. Token/Cost Tracking
**Effort:** 0.5 days
**Value:** ⭐⭐⭐⭐

```typescript
{
  "tokens": {
    "input": 21511,
    "output": 4249,
    "cacheRead": 132352,
    "totalTokens": 158112
  }
}
```

**Why:** Essential for progressive disclosure ROI measurement, data already available from Claude SDK

#### 4. File Assertions Validator
**Effort:** 0.5 days
**Value:** ⭐⭐⭐⭐

Automated quality checks:
- `mustContain`: Required strings present
- `mustNotContain`: Anti-patterns absent
- `maxNonEmptyLines`: Code conciseness

**Why:** Objective pass/fail criteria, prevents regressions

### ⚠️ MEDIUM PRIORITY (Future)

#### 5. Quality Reviewer (LLM Judge)
**Effort:** 1 day
**Value:** ⭐⭐⭐

Second LLM reviews outputs for subjective quality (conciseness, helpfulness, tone)

**Why:** Catches issues assertions miss, but adds cost and complexity

#### 6. Cached Token Tracking
**Effort:** 0.5 days
**Value:** ⭐⭐⭐

Separate tracking for prompt cache hits vs fresh tokens

**Why:** Shows progressive disclosure efficiency gains from repeated reference loads

### ❌ SKIP (Too Complex)

#### 7. Sandbox Execution
**Reason:** Fiddy's Docker sandbox + bash validation too heavyweight for GhostClaw's use case
**Alternative:** Manual verification or simple file assertions

#### 8. Automated Skill Sync
**Reason:** GhostClaw skills are TypeScript (not markdown), already installed
**Alternative:** Toggle skill availability via session isolation

#### 9. MCP Telemetry Extension
**Reason:** Requires modifying Claude SDK internals
**Alternative:** Agent-runner level instrumentation is sufficient

## GhostClaw Implementation Plan

### Phase 1: Foundation (Week 4, Days 1-2)
**Goal:** Basic eval harness running

1. **Eval Case Schema** (4 hrs)
   - Define GhostClaw eval case format (JSON schema)
   - Create `evals/fixtures/eval-cases/` directory
   - Port 2-3 example cases from Fiddy

2. **Session Isolation** (4 hrs)
   - Create isolated session dirs: `data/sessions/eval-{uuid}/`
   - Copy skills for full_payload, omit for no_payload
   - Hook into container-runner spawn logic

3. **Routing Instrumentation** (8 hrs)
   - Hook Read tool in agent-runner
   - Pattern match `.claude/skills/*` paths
   - Write routing trace to IPC on completion
   - Basic scorecard JSON output

### Phase 2: Metrics (Week 4, Days 3-4)
**Goal:** Cost and quality measurement

4. **Token Tracking** (4 hrs)
   - Capture SDK token metadata per-turn
   - Aggregate across eval run
   - Write to routing trace

5. **File Assertions** (4 hrs)
   - TypeScript validator reads generated files
   - String contains/excludes checks
   - Line counter (non-empty, non-comment)
   - Pass/fail reporting

6. **Basic Test Cases** (8 hrs)
   - Create 5-10 GhostClaw eval cases:
     - GC-001: Skill discovery (setup-ghostclaw)
     - GC-002: Code quality (qodo-pr-resolver)
     - GC-003: Integration config (customize Telegram)
     - GC-004: Debugging workflow
     - GC-005: Ralph task planning
   - Define file assertions for each
   - Document expected behaviors

### Phase 3: Validation (Week 5)
**Goal:** Prove the system works

7. **Run Baseline Evals** (8 hrs)
   - Execute all cases with current skills
   - Analyze routing accuracy
   - Measure token costs
   - Document baseline quality

8. **Iteration & Refinement** (8 hrs)
   - Fix issues found in baseline
   - Tune assertions for false positives
   - Add missing test coverage
   - Document eval workflow

## Cost-Benefit Analysis

**Investment:** 40 hours (1 week of focused work)

**Returns:**
- ✅ Objective skill quality measurement
- ✅ Data-driven progressive disclosure tuning
- ✅ Regression prevention (automated tests)
- ✅ Foundation for continuous improvement

**ROI Multiplier:** Every skill improvement benefits all users, all tasks - high leverage

---

# Part 2: Marc Hatton's Skills Analysis

## What It Is

Marc Hatton's [agent-skills](https://github.com/marchatton/agent-skills) repository represents **enterprise-grade skill architecture** with:
- 3 main skills (Coding, Design, Housekeeping)
- 48 total reference files
- Operation contracts defining agent behavior
- Progressive disclosure patterns
- Structured output formats

**Key Insight:** The skills themselves are too specialized for GhostClaw, but the **methodology and structure** are invaluable.

## Skills Catalog (Quality Ratings)

### ⭐⭐⭐⭐⭐ Coding Skill (Production-Grade)
**References:** 35 files
**Focus:** Code smells (24), refactoring workflows (3), platform engineering (3), security (2)

**Strengths:**
- ✅ Comprehensive smell catalog with detection heuristics
- ✅ Clear operation contracts prevent agent mistakes
- ✅ Progressive disclosure (load only relevant references)
- ✅ Mandatory baseline checks ensure quality

**Weaknesses:**
- ⚠️ Platform references too vendor-specific (GCP, Supabase)
- ⚠️ Some smells too enterprise-focused
- ⚠️ Heavy reference count requires selective loading

**GhostClaw Relevance:** **High** - Universal applicability to all coding tasks

---

### ⭐⭐⭐ Design Skill (Well-Structured, Niche)
**References:** 7 files
**Focus:** Design critique, Tailwind CSS, animation storyboarding, DialKit controls

**Strengths:**
- ✅ Structured critique methodology (lane-based analysis)
- ✅ Animation storyboarding framework is unique
- ✅ Read-only contracts prevent accidental edits

**Weaknesses:**
- ⚠️ DialKit is Marc-specific tooling
- ⚠️ Full Tailwind reference redundant
- ⚠️ Too specialized for personal assistant use case

**GhostClaw Relevance:** **Low** - Skip (users can request design feedback ad-hoc)

---

### ⭐⭐⭐ Housekeeping Skill (Solid, Context-Specific)
**References:** 3 files
**Focus:** AGENTS.md architecture, legacy migration playbook

**Strengths:**
- ✅ Clear migration methodology
- ✅ Progressive disclosure advocacy
- ✅ Contradiction pruning patterns

**Weaknesses:**
- ⚠️ AGENTS.md pattern differs from GhostClaw's architecture
- ⚠️ Not applicable to group-based directories

**GhostClaw Relevance:** **Low** - Skip (GhostClaw has its own architecture)

---

## Top 5 Patterns to Port

### 🥇 #1: Code Smells Detection & Refactoring Framework
**Value:** ⭐⭐⭐⭐⭐ | **Effort:** 8-12 hrs | **ROI:** Highest

**What to Port:**
- Detection signals framework (pattern matching heuristics)
- Top 12 smells (reduced from 24):
  - Duplicate Code, Long Method, Large Class
  - Dead Code, Comments (as smell), Lazy Class
  - Speculative Generality, Primitive Obsession, Data Clumps
  - Feature Envy, Divergent Change
  - AI-Specific: Fallback-First Compatibility Branches

**GhostClaw-Specific Additions:**
- MCP Server Bloat
- Skill Scope Creep
- Group Directory Leakage

**Why #1:**
- Universal applicability (all coding tasks)
- Prevents anti-patterns in agent outputs
- Complements existing qodo-pr-resolver skill
- Proven methodology (Martin Fowler's "Refactoring")

**Implementation:**
1. Port detection signals (3-4 hrs)
2. Port top 12 smells with examples (4-6 hrs)
3. Integrate with coding workflows (1-2 hrs)

---

### 🥈 #2: Progressive Disclosure & Operation Contracts
**Value:** ⭐⭐⭐⭐⭐ | **Effort:** 6-8 hrs | **ROI:** Highest

**What to Port:**
```yaml
operation_contracts:
  implementation:
    required_steps:
      - load_smell_baseline
      - choose_targeted_smell_refs
      - implement_minimal_change
      - validate_changed_behavior
    required_output_fields:
      - summary
      - files_changed
      - validations
      - risks_or_followups
    forbidden_actions:
      - fallback_first_compat_shims
      - unrelated_refactors
```

**Why #2:**
- Multiplier effect (improves ALL skills)
- 20-40% token reduction potential
- Foundation for Fiddy-style evals
- Industry best practice

**Implementation:**
1. Document pattern in skill design guide (2-3 hrs)
2. Refactor `/customize`, `/debug`, `/setup-ghostclaw` (3-4 hrs)
3. Create skill template (1 hr)

---

### 🥉 #3: GH PR Review + CI Fix Workflow
**Value:** ⭐⭐⭐⭐ | **Effort:** 4-6 hrs | **ROI:** High

**What to Port:**
1. Fetch PR review comments + CI status
2. Classify feedback (true positives, false positives, questions, blockers)
3. Create fix plan (organize by priority)
4. Implement fixes iteratively
5. Validate changes (run tests)
6. Update PR (push fixes, respond to comments)

**Why #3:**
- Common workflow (users frequently need PR help)
- Saves 30-60 min per PR
- Natural extension of qodo-pr-resolver skill

**Implementation:**
1. Enhance qodo-pr-resolver with review comment parsing (2-3 hrs)
2. Add CI failure integration (1-2 hrs)
3. Add validation loop (1 hr)

---

### 🏅 #4: Refactoring Work Package Template
**Value:** ⭐⭐⭐⭐ | **Effort:** 4-5 hrs | **ROI:** Medium-High

**What to Port:**
```markdown
# Refactoring Work Package: <Name>

## Objective
[Clear statement of goal]

## Scope
**Included:** Files A, B, C
**Excluded:** Feature X (out of scope)

## Change Catalog
1. **Change 1**
   - What: [Description]
   - Why: [Motivation]
   - How: [Approach]
   - Validation: [Tests]
   - Status: [ ] Not started / [ ] Done

## Risk Assessment
- Medium: Risk 1 + mitigation
- Low: Risk 2

## Rollback Plan
[How to revert if needed]
```

**Why #4:**
- Perfect fit for Ralph overnight execution
- Prevents scope creep
- Systematic validation

**Implementation:**
1. Port template (1-2 hrs)
2. Ralph integration (2 hrs)
3. Create `/plan-refactoring` skill (1 hr)

---

### 🎖️ #5: Secrets & Auth Guardrails
**Value:** ⭐⭐⭐⭐ | **Effort:** 3-4 hrs | **ROI:** High

**What to Port:**
- Never commit secrets to git (.env, API keys, tokens)
- Environment variable patterns
- OAuth credential storage (HOME directory, not group dirs)
- API key management best practices

**GhostClaw-Specific Additions:**
- WhatsApp session credentials (never commit `auth_info_baileys/`)
- Telegram bot tokens (env vars only)
- MCP server credentials (HOME for user creds, group dirs for config)
- OpenAI API keys (env vars with `~/.config/` fallback)

**Why #5:**
- Critical security (prevents accidental leaks)
- Quick implementation
- Universal protection (applies to all code operations)

**Implementation:**
1. Port reference doc + GhostClaw patterns (1-2 hrs)
2. Create validation function (1 hr)
3. Integrate with coding workflows (30 min)

---

## Structural Improvements Summary

### Top 7 Patterns (Priority Order)

| Pattern | Effort | Impact | Priority |
|---------|--------|--------|----------|
| Progressive Disclosure & Operation Contracts | 6-8 hrs | ⭐⭐⭐⭐⭐ | **Week 1** |
| Secrets & Auth Guardrails | 3-4 hrs | ⭐⭐⭐⭐ | **Week 1** |
| Mandatory Baseline Checks | 4-6 hrs | ⭐⭐⭐⭐ | Week 2 |
| Forbidden Actions in Contracts | 3-4 hrs | ⭐⭐⭐⭐ | Week 2 |
| Structured Output Formats | 4-5 hrs | ⭐⭐⭐ | Week 3 |
| Reference Index Files | 3-4 hrs | ⭐⭐⭐ | Week 3 |
| Metadata & Versioning | 2-3 hrs | ⭐⭐ | Week 4 |

**Total Effort:** 25-34 hours over 4 weeks

---

## Skills NOT Recommended

### ❌ Design Skill
**Reason:** Too specialized for personal assistant use case
**Alternative:** Ad-hoc design feedback via base model
**Effort Saved:** 15-20 hours

### ❌ Housekeeping Skill
**Reason:** GhostClaw has different architecture
**Alternative:** Document GhostClaw's group-based pattern
**Effort Saved:** 8-10 hours

### ❌ Platform Engineering References
**Reason:** Vendor-specific (GCP, Supabase)
**Alternative:** Users reference official docs
**Effort Saved:** 4-6 hours

**Total Effort Saved:** 27-36 hours by skipping low-ROI content

---

# Part 3: Action Plan

## Week 1: Security & Foundations (9-12 hrs)

### Priority 1 - Quick Wins

**1. Secrets & Auth Guardrails** (3-4 hrs)
- Port `secrets-and-auth-guardrails.md` to `.claude/references/security/`
- Add GhostClaw-specific patterns (WhatsApp, Telegram, MCP, OpenAI)
- Create validation function in skills-engine
- Integrate with coding workflows

**Deliverable:** `.claude/references/security/secrets-and-auth-guardrails.md`
**Impact:** ✅ Prevents secret leaks immediately

**2. Progressive Disclosure Pattern** (6-8 hrs)
- Document pattern in `.claude/skills/README.md` (skill design guide)
- Create operation contract template
- Refactor `/customize` skill as example
- Add reference routing rules

**Deliverable:** Skill design guide + refactored `/customize` skill
**Impact:** ✅ Foundation for all future skills, immediate token reduction

---

## Week 2-3: Quality Framework (16-23 hrs)

### Priority 2 - Medium-Term

**3. Code Smells Framework** (8-12 hrs)
- Port detection signals and top 12 smells
- Add GhostClaw-specific smells (MCP bloat, skill scope creep, directory leakage)
- Integrate with coding workflows
- Create mandatory baseline

**Deliverable:** Code smells reference library
**Impact:** ✅ Superior code quality in agent outputs

**4. GH PR Review Workflow** (4-6 hrs)
- Enhance qodo-pr-resolver skill
- Add CI failure integration (`gh run view --log` parsing)
- Create fix planning logic
- Add validation loop

**Deliverable:** Enhanced PR review workflow
**Impact:** ✅ Saves 30-60 min per PR review

**5. Refactoring Work Packages** (4-5 hrs)
- Port work package template
- Create `/plan-refactoring` skill
- Integrate with Ralph
- Document workflow

**Deliverable:** Work package template + Ralph integration
**Impact:** ✅ Structured approach to refactoring

---

## Week 4-5: Evaluation System (24-32 hrs)

### Priority 3 - Long-Term

**6. Eval System Foundation** (16-24 hrs)
- Define eval case schema
- Create session isolation
- Add routing instrumentation
- Implement token tracking
- Create file assertions validator
- Build 5-10 test cases

**Deliverable:** Working eval harness + baseline test suite
**Impact:** ✅ Data-driven skill development

**7. Baseline Validation** (8 hrs)
- Run all eval cases with current skills
- Analyze routing accuracy
- Measure token costs
- Document baseline quality

**Deliverable:** Eval baseline report
**Impact:** ✅ Measurable improvements

---

## Summary Timeline

| Week | Focus | Hours | Key Deliverables |
|------|-------|-------|------------------|
| 1 | Security & Foundations | 9-12 | Guardrails, progressive disclosure |
| 2-3 | Quality Framework | 16-23 | Code smells, PR workflow, work packages |
| 4-5 | Eval System | 24-32 | Eval harness, test cases, baseline |
| **Total** | **4-5 weeks** | **49-67** | **Complete skills framework upgrade** |

---

## Expected Outcomes

### Immediate (Week 1)
- ✅ No more secret leaks
- ✅ Clear pattern for building skills
- ✅ 20-40% token cost reduction on complex skills

### Medium-Term (Weeks 2-3)
- ✅ Superior code quality in all agent outputs
- ✅ Faster PR review turnaround
- ✅ Structured refactoring workflow

### Long-Term (Weeks 4-5)
- ✅ Objective skill quality measurement
- ✅ Data-driven optimization
- ✅ Regression prevention
- ✅ Continuous improvement foundation

---

## Conclusion

**Investment:** 50-70 hours over 4-5 weeks
**Expected ROI:** Very High

**Key Insight:** Marc's structural patterns (progressive disclosure, operation contracts) + Fiddy's eval methodology = professional-grade skills framework for GhostClaw.

**Next Step:** Begin Week 1 (Security & Foundations) - secrets guardrails + progressive disclosure pattern.

---

## References

**Detailed Analysis Documents:**
- Fiddy framework: `docs/ghostclaw-evals-plan.md`
- Marc skills catalog: `docs/marc-skills-analysis.md`
- Top 5 skills: `docs/skills-top5-analysis.md`

**Source Repositories:**
- bout3fiddy/agents: `repos/agents-better-evals/`
- marchatton/agent-skills: `repos/agents-better-evals/skills/`

**GhostClaw:**
- Skills: `.claude/skills/`
- Skills engine: `skills-engine/`

---

**Report Status:** ✅ Complete
**Generated:** 2026-03-04 (Ralph Task #6)
**Total Analysis Time:** ~8 hours across 6 Ralph iterations
