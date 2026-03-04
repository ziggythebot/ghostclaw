# Top 5 Skills to Port from Marc Hatton's Agent Skills Repository

## Executive Summary

Marc Hatton's [agent-skills](https://github.com/marchatton/agent-skills) repo contains 3 main skills with 50 reference files focused on **professional software development workflows**. The skills are designed for full-stack teams working on production applications, with deep reference materials for code quality, UI design, and repository organization.

**Key Finding:** While the skills themselves are too specialized for GhostClaw's personal assistant use case, the **methodology and structure** are highly valuable. The progressive disclosure pattern, reference file organization, and operation contracts provide a superior framework for skill design.

---

## Skill Rankings for GhostClaw

### 🥇 #1: Code Smells Detection & Refactoring Framework

**Value:** ⭐⭐⭐⭐⭐ (5/5)
**Complexity:** ⭐⭐⭐ (3/5 - Medium)
**ROI:** Highest - transforms code quality across all agent-assisted development

#### What It Is
A comprehensive catalog of 24 code smells with:
- Detection signals (pattern matching heuristics)
- Concrete refactoring guidance for each smell
- Mandatory baseline checks for all code changes
- Progressive disclosure (load only relevant smells)

#### Why GhostClaw Needs This
- **Universal applicability:** Users ask for code help constantly (bug fixes, features, refactors)
- **Quality improvement:** Prevents agents from introducing common anti-patterns
- **Educational value:** Teaches users better coding practices through agent outputs
- **Already requested:** Users want code review and quality analysis features

#### Adaptation Requirements
1. **Simplify for personal projects:** Remove enterprise-specific smells (parallel inheritance hierarchies)
2. **Add GhostClaw-specific patterns:** Message handling, skill architecture, MCP integration patterns
3. **Create detection workflow:** Auto-trigger smell checks on code changes
4. **Reduce reference count:** Consolidate 24 smells into ~12 most relevant for personal projects

#### Implementation Plan
1. Port core smell detection framework (detection-signals.md)
2. Select top 12 smells most relevant to GhostClaw users:
   - Duplicate Code
   - Long Method
   - Speculative Generality (over-engineering)
   - Dead Code
   - Comments (as smell indicator)
   - Feature Envy
   - Large Class
   - Primitive Obsession
   - Data Clumps
   - Switch Statements
   - Temporary Field
   - Lazy Class
3. Create GhostClaw-specific smell: "Fallback-First Compatibility Branches" (ai-code-smell.md)
4. Add to coding workflows (already exists via qodo-pr-resolver skill)

**Effort Estimate:** 8-12 hours
**Expected Impact:** Dramatically improves code quality in agent-assisted development

---

### 🥈 #2: Progressive Disclosure & Operation Contracts Pattern

**Value:** ⭐⭐⭐⭐⭐ (5/5)
**Complexity:** ⭐⭐ (2/5 - Low to Medium)
**ROI:** Highest - improves all skills, reduces token costs

#### What It Is
A skill design methodology that:
- Loads reference materials progressively (not all at once)
- Uses operation contracts to define required steps, outputs, and forbidden actions
- Implements trigger-based reference routing
- Provides structured output formats

#### Why GhostClaw Needs This
- **Token cost reduction:** Only load relevant context (same approach Fiddy's evals measure)
- **Better skill organization:** Clear structure for skill development
- **Improved reliability:** Operation contracts prevent common mistakes
- **Scalability:** Supports growing skill library without context explosion

#### Adaptation Requirements
1. **Extract pattern documentation:** Create design guide for GhostClaw skills
2. **Update skill template:** Add operation_contracts section to SKILL.md template
3. **Refactor existing skills:** Apply pattern to high-use skills (customize, debug, setup-ghostclaw)
4. **Add reference loading helpers:** Utility functions for progressive disclosure

#### Implementation Plan
1. Document the pattern in `.claude/skills/README.md` (new file)
2. Create skill template with operation contracts
3. Refactor 2-3 existing skills as examples:
   - `/customize` → Add progressive disclosure for channel/integration selection
   - `/debug` → Add operation contracts for troubleshooting workflow
   - `/setup-ghostclaw` → Structure setup steps with contracts
4. Create skill development guide

**Effort Estimate:** 6-8 hours
**Expected Impact:** Foundation for all future skills, immediate cost savings

---

### 🥉 #3: GH PR Review + CI Fix Workflow

**Value:** ⭐⭐⭐⭐ (4/5)
**Complexity:** ⭐⭐ (2/5 - Low)
**ROI:** High - automates tedious PR feedback loops

#### What It Is
A structured workflow for:
- Fetching PR review comments and CI failures
- Organizing feedback into fix plan
- Implementing fixes iteratively
- Validating changes and updating PR

#### Why GhostClaw Needs This
- **Common workflow:** Users frequently need help with PR reviews
- **Time saver:** Automates gathering scattered feedback
- **Quality improvement:** Ensures all review comments are addressed
- **Already has foundation:** `qodo-pr-resolver` skill exists but needs expansion

#### Adaptation Requirements
1. **Integrate with qodo-pr-resolver:** Merge workflows (Qodo for AI review, this for human reviews)
2. **Add multi-platform support:** GitHub, GitLab, Bitbucket (qodo already does this)
3. **Simplify for personal use:** Remove enterprise CI complexity
4. **Add smart defaults:** Auto-detect repo/PR context

#### Implementation Plan
1. Enhance `qodo-pr-resolver` with PR review comment parsing
2. Add CI failure integration (gh run view --log parsing)
3. Create fix planning logic (organize by priority)
4. Add validation loop (run tests after each fix)
5. Document workflow in skill references

**Effort Estimate:** 4-6 hours
**Expected Impact:** Major productivity boost for users working on PRs

---

### 🏅 #4: Refactoring Work Package Template

**Value:** ⭐⭐⭐⭐ (4/5)
**Complexity:** ⭐ (1/5 - Very Low)
**ROI:** Medium-High - organizes complex refactoring work

#### What It Is
A standardized template for planning and executing refactorings:
- Status tracking (not started, in progress, done, blocked)
- Accountability sections (owner, reviewers, timeline)
- Change catalog with validation steps
- Risk assessment and rollback plan

#### Why GhostClaw Needs This
- **Complex tasks:** Users often request large refactoring projects
- **Prevents scope creep:** Forces clear definition before starting
- **Better Ralph integration:** Perfect fit for Ralph's task loop
- **Reduces rework:** Plan → validate → execute cycle

#### Adaptation Requirements
1. **Integrate with Ralph:** Use as task file format for refactoring loops
2. **Simplify for personal projects:** Remove team accountability sections
3. **Add GhostClaw-specific sections:** Skill impact analysis, MCP changes
4. **Create templates:** Pre-fill common refactoring patterns

#### Implementation Plan
1. Port work package template to `groups/main/templates/refactoring-workpackage.md`
2. Add Ralph integration (parse work packages as task lists)
3. Create skill: `/plan-refactoring` that generates work packages
4. Add validation hooks (check progress, update status)
5. Document workflow in CLAUDE.md

**Effort Estimate:** 4-5 hours
**Expected Impact:** Better planning reduces wasted work on large refactors

---

### 🎖️ #5: Secrets & Auth Guardrails

**Value:** ⭐⭐⭐⭐ (4/5)
**Complexity:** ⭐ (1/5 - Very Low)
**ROI:** High - prevents security mistakes

#### What It Is
A reference document with rules for:
- Never committing secrets to git
- Proper environment variable handling
- OAuth credential storage patterns
- API key management best practices

#### Why GhostClaw Needs This
- **Security critical:** Agents can accidentally commit secrets
- **Common mistake:** Users often mishandle credentials
- **Easy to implement:** Just a reference doc + validation rules
- **Immediate value:** Protects all code operations

#### Adaptation Requirements
1. **Add GhostClaw patterns:** MCP server credentials, channel tokens, API keys
2. **Create pre-commit checks:** Scan for secrets before commits
3. **Add to skill guardrails:** Load automatically for OAuth/credential tasks
4. **Document storage locations:** Where each type of credential should live

#### Implementation Plan
1. Port secrets-and-auth-guardrails.md to `.claude/references/security/`
2. Add GhostClaw-specific patterns:
   - WhatsApp session credentials (never commit auth_info_baileys/)
   - Telegram bot tokens (environment variables only)
   - MCP server credentials (HOME directory, not group directories)
   - OpenAI API keys (env vars, with fallback to ~/.config/)
3. Create validation function in skills-engine
4. Add to coding skill's mandatory baseline checks
5. Document in security section of CLAUDE.md

**Effort Estimate:** 3-4 hours
**Expected Impact:** Prevents embarrassing and dangerous credential leaks

---

## Skills NOT Recommended for Porting

### ❌ Design Skill (UI/Animation/DialKit)
- **Too specialized:** GhostClaw users rarely need Tailwind CSS tuning or animation storyboards
- **High maintenance:** 7 reference files for niche use cases
- **Low ROI:** Users can ask for design help without a formal skill
- **Alternative:** Generic "visual design feedback" via base model is sufficient

### ❌ Housekeeping Skill (AGENTS/CLAUDE Architecture)
- **Already solved:** GhostClaw has its own CLAUDE.md pattern
- **Different architecture:** Group-based isolation vs. monorepo structure
- **Not applicable:** Migration playbook targets enterprise repos
- **Alternative:** Document GhostClaw's architecture pattern instead

### ❌ Platform Engineering References (GCP, Supabase)
- **Vendor lock-in:** Too specific to Marc's tech stack
- **Limited audience:** Most GhostClaw users don't run GCP infrastructure
- **Alternative:** Users can reference official docs when needed

---

## Summary Comparison Table

| Rank | Skill/Pattern | Value | Complexity | Effort (hrs) | Impact | Status |
|------|--------------|-------|------------|--------------|--------|--------|
| 1 | Code Smells Framework | 5/5 | 3/5 | 8-12 | ⭐⭐⭐⭐⭐ | **Recommend** |
| 2 | Progressive Disclosure Pattern | 5/5 | 2/5 | 6-8 | ⭐⭐⭐⭐⭐ | **Recommend** |
| 3 | GH PR Review Workflow | 4/5 | 2/5 | 4-6 | ⭐⭐⭐⭐ | **Recommend** |
| 4 | Refactoring Work Packages | 4/5 | 1/5 | 4-5 | ⭐⭐⭐⭐ | **Recommend** |
| 5 | Secrets & Auth Guardrails | 4/5 | 1/5 | 3-4 | ⭐⭐⭐⭐ | **Recommend** |
| - | Design Skill | 2/5 | 4/5 | 15-20 | ⭐⭐ | Skip |
| - | Housekeeping Skill | 2/5 | 3/5 | 8-10 | ⭐⭐ | Skip |
| - | Platform Engineering | 1/5 | 2/5 | 4-6 | ⭐ | Skip |

**Total Implementation Effort:** 25-35 hours
**Expected ROI:** Very High (all top 5 are high-value, low-to-medium effort)

---

## Dependencies & Prerequisites

### Required Before Implementation
1. ✅ Skills engine (already exists)
2. ✅ Reference file loading (already supported)
3. ✅ Git operations (already working)
4. ✅ GitHub CLI integration (already available)
5. ⚠️ Skill metadata parsing (needs enhancement for operation contracts)

### Optional Enhancements
- Token usage tracking (for measuring progressive disclosure savings)
- Skill performance metrics (align with Fiddy's eval framework)
- Automated skill testing (validate operation contracts)

---

## Implementation Priority

### Priority 1: This Week (Quick Wins)
1. **Secrets & Auth Guardrails** (3-4 hrs) - Immediate security value
2. **Progressive Disclosure Pattern** (6-8 hrs) - Foundation for all other work

### Priority 2: Next 1-2 Weeks
3. **GH PR Review Workflow** (4-6 hrs) - High user demand
4. **Refactoring Work Packages** (4-5 hrs) - Enhances Ralph

### Priority 3: 2-4 Weeks
5. **Code Smells Framework** (8-12 hrs) - Largest effort, highest long-term value

**Total Timeline:** 3-4 weeks for complete implementation

---

## Next Steps

1. ✅ Complete this analysis document
2. [ ] Review with user for prioritization approval
3. [ ] Start with Secrets & Auth Guardrails (lowest hanging fruit)
4. [ ] Document progressive disclosure pattern while implementing it
5. [ ] Schedule remaining skills based on user feedback

---

## References

- Marc Hatton's agent-skills repo: `repos/agents-better-evals/skills/`
- GhostClaw skills: `.claude/skills/`
- Skills engine: `skills-engine/`
- Fiddy's eval framework analysis: `docs/ghostclaw-eval-implementation-plan.md`

---

**Document Status:** ✅ Complete
**Last Updated:** 2024-03-04
**Author:** Ralph (Autonomous Task Agent)
**Task:** Identify top 5 skills to port/adapt
