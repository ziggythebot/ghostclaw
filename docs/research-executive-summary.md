# Executive Summary: bout3fiddy/agents & marchatton/agent-skills Research

**Date:** 2026-03-04
**Author:** Ralph (Autonomous Task Agent)
**Status:** Complete

---

## Overview

This research evaluated two agent development repositories to identify valuable patterns and tools for GhostClaw:
- **bout3fiddy/agents** (`better_evals` branch) - Comprehensive evaluation framework (~6,100 LOC)
- **marchatton/agent-skills** - Professional development skill library (3 skills, 50 references)

---

## 1. Fiddy's Evaluation Framework: What It Does and Why It Matters

### Core Value Proposition

Fiddy's `better_evals` is a **production-grade testing system** for AI agents that answers critical questions:
- "Did the agent use the right skills for this task?"
- "Did it read the necessary reference documentation?"
- "How much did this cost in tokens?"
- "Is the agent improving or regressing between versions?"

### How It Works

The system runs agents through standardized test cases while capturing detailed telemetry:

**Test Case Format:**
```json
{
  "id": "SK-001",
  "prompt": "Install and configure the application",
  "expectedSkills": ["setup"],
  "expectedRefs": ["skills/setup/references/dependencies.md"],
  "fileAssertions": [
    {"path": "package.json", "mustContain": ["dependencies"]}
  ],
  "tokenBudget": 30000
}
```

**Telemetry Captured:**
- Which skill files the agent read (`SKILL.md`, reference docs)
- Token consumption (input, output, cache hits) per turn
- Tool usage patterns (read, write, edit calls and failures)
- RPC stream lifecycle (retries, errors, incomplete tool calls)
- File outputs and validation results

**Outputs:**
- Markdown reports with pass/fail scorecards
- Per-case routing traces (JSON telemetry dumps)
- Cost analysis and token budget enforcement
- Missing/unexpected reference detection

### Why It Matters for GhostClaw

**Current Gap:** GhostClaw has 22 skills but no systematic way to detect regressions. Changes to the core router, skill instructions, or agent-runner could silently break existing workflows.

**What Evals Enable:**
1. **Regression Detection** - Know immediately if a code change breaks skill routing
2. **Quality Assurance** - Validate that skills actually work as documented
3. **Cost Tracking** - Identify which tasks are expensive and optimize them
4. **Skill Quality Scoring** - Measure if agents are reading the right references (not over/under-reading)

**Example Impact:**
- User reports `/setup-ghostclaw` didn't work
- With evals: Run `SK-001-setup` case, see exactly where routing failed
- Without evals: Manual debugging, inconsistent testing, wasted user time

### Key Architectural Components

#### Production-Grade (Valuable for GhostClaw)
1. **JSONL Case Format** - Standardized test definitions with variants for A/B testing
2. **Skill Router Tracking** - Infers skill activation from file read patterns
3. **File Assertion Engine** - Validates outputs contain required patterns
4. **Token Budget Enforcement** - Fails cases that exceed cost limits
5. **Routing Scorecards** - Reports expected vs actual skill/reference reads

#### Enterprise-Scale (Skip for GhostClaw)
1. **Gondolin Sandboxing** - QEMU ARM64 VMs (~2,000 LOC) - GhostClaw already has group isolation
2. **Parallel Execution** - Worker pools (~800 LOC) - 22 skills = 10-15 min serial execution is fine
3. **Multi-Model Matrix** - Test across Sonnet/Opus/Haiku - GhostClaw uses single model
4. **Shared Sandbox Batching** - Complex contamination detection - not needed with ephemeral groups

### Recommended GhostClaw Implementation

**Cherry-pick the core concepts, skip the infrastructure:**

```
✅ Adopt (20 hours MVP):
- JSONL case format with GhostClaw-specific fields (channel, groupType)
- Agent-runner instrumentation to track Read tool calls
- File assertion judge (simple string matching)
- Serial case runner using ephemeral eval groups
- Markdown report generation with routing scorecards

❌ Skip (saves 20+ hours):
- Gondolin VMs (use existing group isolation)
- Parallel workers (not needed for 22 skills)
- Multi-model testing (single-model use case)
```

**Expected Effort:** 20 hours MVP (5 cases), 26 hours full (15 cases)
**ROI:** High - prevents regressions, systematizes quality, minimal infrastructure

---

## 2. Marc Hatton's Skills Repo: What It Offers GhostClaw

### Repository Overview

Marc's repo is **not a skill collection** - it's a **skill design methodology** demonstrated through 3 professional development skills:
- `coding` - Code quality, smells detection, refactoring workflows
- `design` - UI/UX patterns for Tailwind + animations
- `housekeeping` - Enterprise repo organization patterns

**Total:** 3 skills, 50 reference files, ~15,000 LOC of documentation

### Key Finding: Methodology Over Content

**Skills themselves:** Too specialized for GhostClaw's personal assistant use case (enterprise UI/UX, monorepo housekeeping)

**Structural patterns:** Highly valuable and immediately applicable

### Top 5 Patterns to Port (Ranked by ROI)

#### 🥇 #1: Progressive Disclosure Pattern (5/5 value, 6-8 hrs)
**What:** Load reference materials on-demand, not all at once
**Why:** Reduces token costs (exactly what Fiddy's evals measure)
**How:** Operation contracts define triggers → agent loads specific refs

**Impact:** Foundation for all skills, immediate cost savings

**Example:**
```markdown
# /customize SKILL.md

## Operation Contract
When user mentions "telegram":
  → Load: skills/customize/references/telegram-setup.md
When user mentions "slack":
  → Load: skills/customize/references/slack-setup.md

Never load all channel references upfront.
```

#### 🥈 #2: Code Smells Detection Framework (5/5 value, 8-12 hrs)
**What:** Catalog of 24 code smells with detection signals + refactoring guidance
**Why:** Prevents agents from introducing anti-patterns
**How:** Integrate with code review workflows (qodo-pr-resolver skill)

**Impact:** Transforms code quality in agent-assisted development

**GhostClaw Adaptation:**
- Port 12 most relevant smells (duplicate code, long method, dead code, etc.)
- Add GhostClaw-specific smell: "Fallback-First Compatibility Branches"
- Auto-trigger on code changes via existing workflows

#### 🥉 #3: GH PR Review Workflow (4/5 value, 4-6 hrs)
**What:** Structured process for gathering PR feedback + CI failures → fix plan
**Why:** Automates tedious review comment triage
**How:** Enhance existing `qodo-pr-resolver` skill

**Impact:** Major productivity boost for users working on PRs

#### 🏅 #4: Refactoring Work Package Template (4/5 value, 4-5 hrs)
**What:** Standardized planning template for complex refactors
**Why:** Prevents scope creep, reduces rework
**How:** Integrate as Ralph task file format

**Impact:** Better planning for large refactoring projects

#### 🎖️ #5: Secrets & Auth Guardrails (4/5 value, 3-4 hrs)
**What:** Rules for credential handling (never commit secrets, env var patterns)
**Why:** Prevents security mistakes
**How:** Add to coding skill's mandatory baseline checks

**GhostClaw-specific additions:**
- WhatsApp session credentials (never commit `auth_info_baileys/`)
- Telegram bot tokens (environment variables only)
- MCP server OAuth tokens (HOME directory, not group directories)

**Impact:** Prevents embarrassing and dangerous credential leaks

### Skills NOT Recommended

❌ **Design Skill (UI/Animation)** - Too specialized, low ROI for personal assistant
❌ **Housekeeping Skill (AGENTS.md)** - GhostClaw already has its own architecture
❌ **Platform Engineering References (GCP, Supabase)** - Vendor-specific, limited audience

### Implementation Timeline

**Priority 1 (This Week):** 9-12 hours
- Secrets & Auth Guardrails (3-4 hrs) - Immediate security value
- Progressive Disclosure Pattern (6-8 hrs) - Foundation for all other work

**Priority 2 (Next 1-2 Weeks):** 8-11 hours
- GH PR Review Workflow (4-6 hrs) - High user demand
- Refactoring Work Packages (4-5 hrs) - Enhances Ralph

**Priority 3 (2-4 Weeks):** 8-12 hours
- Code Smells Framework (8-12 hrs) - Largest effort, highest long-term value

**Total:** 25-35 hours over 3-4 weeks

---

## 3. Overall Recommendation: What to Prioritize

### Strategic Insight

Both repositories solve the **same fundamental problem** from different angles:
- **Fiddy:** "How do we know if agents are working correctly?" (testing/validation)
- **Marc:** "How do we make agents work correctly?" (skill design methodology)

**They're complementary, not competing.**

### Recommended Priority Order

#### Phase 1: Quick Security & Pattern Wins (1 week, 9-12 hrs)
1. **Secrets & Auth Guardrails** (Marc #5) - 3-4 hours
   - Immediate security value
   - Easy to implement
   - Prevents credential leaks in all code operations

2. **Progressive Disclosure Pattern** (Marc #2) - 6-8 hours
   - Foundation for all future skills
   - Reduces costs immediately
   - Enables better skill testing (sets up for evals)

#### Phase 2: Evaluation Framework (2 weeks, 20 hrs)
3. **Fiddy Evals MVP** - 20 hours
   - 5 test cases covering core skills (setup, customize, add-telegram, debug, run-ralph)
   - Routing scorecard validation
   - Token budget enforcement
   - Serial execution using ephemeral groups

**Why after Phase 1:** Progressive disclosure pattern lets you write better eval cases (test that agents load refs correctly, not just that they load them all)

#### Phase 3: Skill Enhancements (2-3 weeks, 16-23 hrs)
4. **GH PR Review Workflow** (Marc #3) - 4-6 hours
5. **Refactoring Work Packages** (Marc #4) - 4-5 hours
6. **Code Smells Framework** (Marc #1) - 8-12 hours

**Why last:** These are incremental skill improvements. Do them after you have evals to validate they work.

### Expected Outcomes by Phase

**After Phase 1:**
- ✅ No more secret leaks in git commits
- ✅ Skills load refs on-demand (lower token costs)
- ✅ Clear pattern for building new skills

**After Phase 2:**
- ✅ Automated regression detection
- ✅ Quality metrics for all 22 skills
- ✅ Cost tracking per skill
- ✅ Confidence in releases

**After Phase 3:**
- ✅ Superior code quality in agent outputs
- ✅ Better PR review automation
- ✅ Structured refactoring workflows
- ✅ Complete skill development methodology

### Total Investment

**Time:** 45-55 hours (5-7 weeks part-time)
**Cost:** $0 (all open source, no new infrastructure)
**ROI:** Very High

- Prevents production failures (eval regression detection)
- Reduces operational costs (progressive disclosure)
- Improves output quality (code smells, guardrails)
- Scales skill development (patterns + templates)

---

## Critical Success Factors

### For Fiddy Evals
1. ✅ **Keep it simple** - Serial execution, no VMs, ephemeral groups
2. ✅ **Start small** - 5 cases MVP, expand to 15 over time
3. ✅ **Agent instrumentation** - Clean Read tool interception via `PI_EVAL_WORKER=1`
4. ⚠️ **Acceptance criteria** - Define pass/fail thresholds (allow some reference variance)

### For Marc's Patterns
1. ✅ **Document the methodology** - Create skill design guide in `.claude/skills/README.md`
2. ✅ **Refactor existing skills** - Apply progressive disclosure to 2-3 high-use skills
3. ✅ **Template creation** - Operation contracts section in SKILL.md template
4. ⚠️ **Balance specificity** - Adapt enterprise patterns to personal use cases

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Eval behavior non-deterministic | Medium | Accept variance, focus on critical assertions |
| Token costs during eval runs | Low | Conservative budgets, run serially |
| Over-engineering skills | Medium | Keep patterns simple, skip enterprise complexity |
| Time investment | Medium | Phase incrementally, validate ROI per phase |

---

## Next Steps

### Immediate (This Week)
1. [ ] Review this summary with user for prioritization approval
2. [ ] Start Phase 1: Secrets & Auth Guardrails (3-4 hrs)
3. [ ] Document Progressive Disclosure Pattern while implementing (6-8 hrs)

### Short-Term (Weeks 2-3)
4. [ ] Build Fiddy Evals MVP (20 hrs)
5. [ ] Write 5 core test cases
6. [ ] Validate end-to-end eval flow

### Medium-Term (Weeks 4-7)
7. [ ] Enhance PR review workflow (4-6 hrs)
8. [ ] Add refactoring work packages (4-5 hrs)
9. [ ] Port code smells framework (8-12 hrs)

---

## Conclusion

**Fiddy's eval framework** provides the **testing infrastructure** to validate GhostClaw's skills systematically, catch regressions, and track costs.

**Marc's skills repo** provides the **design methodology** to build better skills through progressive disclosure, operation contracts, and quality guardrails.

**Together, they form a complete quality system:**
- Build skills using Marc's patterns
- Validate skills using Fiddy's evals
- Iterate based on routing scorecards and cost metrics

**Recommended action:** Proceed with **Phase 1** (security + patterns) this week, then evaluate ROI before committing to Phases 2-3.

---

**Total Research Time:** ~8 hours (4 tasks × 2 hours average)
**Documentation:** 4 files committed
**Recommendation Confidence:** High
