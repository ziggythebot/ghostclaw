# Eval Cases Methodology

## Overview

The eval cases in `bout3fiddy/agents` (better_evals branch) use a **skill vs no-skill comparison methodology** to measure the quality impact of skills. Each case runs the same coding task with and without access to skills, measuring differences in code quality, token usage, and skill routing behavior.

## Core Concept: Variant-Based Testing

Each eval case defines **variants** that run the same task under different conditions:

1. **`skill` variant**: Agent has full access to skills and references
   - `bootstrapProfile: "full_payload"`
   - `expectedSkills: ["coding"]`
   - `skillSet: ["coding"]`
   - `requireSkillFileRead: true`

2. **`noskill` variant**: Agent operates without skills
   - `bootstrapProfile: "no_payload"`
   - `disallowedSkills: ["coding", "design", "housekeeping"]`
   - No skill files or references available

3. **`noskill-probe` variant** (optional): Lightweight check that skills are truly unavailable
   - Same as `noskill` but validates the restriction is working

## What Gets Measured

### Code Quality Metrics

**File Assertions** define success criteria. The `skill` variant typically has **stricter requirements**:

```jsonl
{
  "fileAssertions": [
    {
      "path": "{{artifactPath}}",
      "mustContain": ["Request", "Response", "Context", "Middleware"],
      "mustNotContain": ["PLACEHOLDER_DO_NOT_KEEP", "NotImplementedError"],
      "maxNonEmptyLines": 300
    }
  ]
}
```

For the `skill` variant, assertions add **anti-patterns to detect**:

```jsonl
{
  "mustNotContain": [
    "LEGACY_AUTH_SCHEME_ENABLED",
    "ALLOW_BEARER_AND_BASIC_FALLTHROUGH",
    "COMPAT_RATE_LIMIT_HEADER",
    "DEBUG_TRACE",
    "_trace(",
    "_safe_get_header"
  ],
  "maxNonEmptyLines": 200  // Tighter constraint than base case
}
```

### Routing Telemetry

Tracks **which skills and references** the agent accessed:

- **Skills Read**: Which skill SKILL.md files were read
- **Skill Files Read**: Which skills had any file accessed
- **Refs Read**: Which reference docs were consulted
- **Missing Refs**: Expected refs that weren't read
- **Unexpected Refs**: Additional refs that were read

Example from CD-015 with `skill` variant:

```json
{
  "readSkills": ["coding"],
  "readRefs": [
    "skills/coding/references/code-smells/detection-signals.md",
    "skills/coding/references/code-smells/index.md",
    "skills/coding/references/code-smells/smells/ai-code-smell.md",
    "skills/coding/references/code-smells/smells/speculative-generality.md"
  ],
  "missingRefs": [],
  "unexpectedRefs": [
    "skills/coding/references/code-smells/detection-signals.md",
    "skills/coding/references/code-smells/index.md",
    "skills/coding/references/code-smells/smells/speculative-generality.md"
  ]
}
```

### Performance Metrics

- **Token usage**: Total tokens (input + output + cache)
- **Turns**: Number of agent turns to complete
- **Duration**: Wall-clock time

## The "Poisoned Seed" Pattern

Eval cases use **fixture files with intentional anti-patterns** to test whether the agent will:

1. **Copy bad patterns** (no-skill baseline behavior)
2. **Recognize and avoid them** (skill-enhanced behavior)

### Example: CD-015

The fixture file `http_types.py` contains a working but problematic implementation:

**Anti-patterns planted:**
- `LEGACY_AUTH_SCHEME_ENABLED = True` (compatibility flag)
- `ALLOW_BEARER_AND_BASIC_FALLTHROUGH = True` (overly permissive)
- `COMPAT_RATE_LIMIT_HEADER` (non-standard header name)
- `DEBUG_TRACE` (mutable global state)
- `_trace()`, `_safe_get_header()` (overengineered helpers)
- Monolithic 150-line `handle_request()` function

**Inline warnings in the code:**
```python
"""
The handler function below is a working implementation kept for
backward compatibility — new code should NOT copy its structure.
"""

def handle_request(...):
    """
    This function exists for backward compatibility. New code should build
    pipelines from composable middleware instead of extending this function.
    """
```

**The test:**
- Prompt: "Build a composable middleware pipeline using those types"
- Without skills: Agent likely copies the monolithic pattern
- With skills: Agent reads code smell references and builds clean, composable middleware

**Assertions verify the difference:**
- `noskill` variant: Must work, can be up to 300 lines
- `skill` variant: Must work, avoid all anti-pattern strings, max 200 lines

## What Makes a Good Eval Case

Based on the CD-015 example:

### 1. Clear Task Definition

```jsonl
{
  "prompt": [
    "I have an HTTP types module at lib/http_types.py.",
    "Build a composable middleware pipeline in {{artifactPath}} that uses those types.",
    "Chain handlers for auth, validation, rate limiting, and error formatting.",
    "Handlers should be able to short-circuit and pass context between stages.",
    "Wire up at least 3 middleware handlers in a sample usage block at the bottom."
  ]
}
```

- **Specific requirements** (not vague)
- **Concrete deliverables** (middleware pipeline with 3+ handlers)
- **Success criteria embedded** (short-circuit, context propagation)

### 2. Fixture Mapping

```jsonl
{
  "fixtureMapping": {
    "lib/http_types.py": "skills-evals/fixtures/codequality/cd015/http_types.py"
  }
}
```

Maps logical paths to actual fixture files in the eval sandbox.

### 3. Measurable Quality Delta

The case should produce **observable differences** between variants:

| Metric | noskill | skill | Delta |
|--------|---------|-------|-------|
| Token usage | 24,942 | 158,112 | +533% (read references) |
| Lines of code | ~250 | ~150 | -40% (more concise) |
| Anti-patterns | Present | Absent | Quality improvement |
| Refs read | 0 | 4 | Skill engagement |

### 4. Skill Routing Expectations

```jsonl
{
  "expectedSkills": ["coding"],
  "expectedRefs": ["skills/coding/references/code-smells/smells/ai-code-smell.md"],
  "requireSkillFileRead": true
}
```

Ensures the agent actually engages with the skill system.

### 5. Notes for Reviewers

```jsonl
{
  "notes": [
    "Architectural eval: build composable middleware from poisoned monolithic seed.",
    "Skill agent should avoid mimicking legacy patterns."
  ]
}
```

Documents **what the case is testing** and **expected skill behavior**.

## Patterns for Creating New Eval Cases

### Template Structure

```jsonl
{
  "id": "XX-NNN",
  "suite": "codequality|security|performance",
  "prompt": ["Clear", "Step-by-step", "Instructions"],
  "fixtureMapping": {
    "logical/path.ext": "skills-evals/fixtures/suite/case/actual.ext"
  },
  "tools": ["read", "edit", "write"],
  "sandbox": true,
  "fileAssertions": [
    {
      "path": "{{artifactPath}}",
      "mustContain": ["RequiredPattern"],
      "mustNotContain": ["AntiPattern"],
      "maxNonEmptyLines": 200
    }
  ],
  "variants": [
    {
      "tag": "skill",
      "bootstrapProfile": "full_payload",
      "expectedSkills": ["skillname"],
      "skillSet": ["skillname"],
      "requireSkillFileRead": true,
      "fileAssertions": [
        {
          "mustNotContain": ["AntiPattern1", "AntiPattern2"],
          "maxNonEmptyLines": 150
        }
      ]
    },
    {
      "tag": "noskill",
      "bootstrapProfile": "no_payload",
      "disallowedSkills": ["skillname"]
    }
  ],
  "notes": [
    "What this case tests",
    "Expected skill behavior"
  ]
}
```

### Anti-Pattern Identification

Good eval fixtures should:

1. **Work correctly** (baseline functionality)
2. **Contain obvious smells** that skills should prevent:
   - Overly complex code (God functions, deep nesting)
   - Security anti-patterns (hardcoded secrets, SQL injection vectors)
   - Performance issues (N+1 queries, missing indexes)
   - Deprecated patterns with inline warnings

3. **Include hints** that agents should recognize:
   ```python
   # Legacy implementation - do not extend
   # New code should use Pattern X instead
   ```

### Assertion Design

**Base assertions** (all variants must pass):
- Core functionality requirements
- Basic quality standards
- Loose line limits

**Skill variant assertions** (stricter):
- Anti-pattern detection (via `mustNotContain`)
- Tighter line limits (conciseness)
- Specific pattern requirements

## Running Evals

From the repo root:

```bash
# Run all cases for all models
./skills-evals/run.sh

# Run specific case
pi --no-session --no-extensions \
  -e skills-evals/pi-eval/index.ts \
  -p "/eval run --filter CD-015 --limit 1 --model openai-codex/gpt-5.3-codex"
```

## Reports

Primary outputs:

- **`skills-evals/reports/{model}.md`**: Summary table with pass/fail status
- **`skills-evals/reports/routing-traces/{model}/{case-id}.json`**: Detailed telemetry per case

Report columns:
- **Case**: ID with variant suffix (base, -NS, -NS-PROBE)
- **Status**: PASS/FAIL
- **Tokens**: Total token usage
- **Turns**: Number of agent turns
- **Skills Read**: Count of skills accessed
- **Refs Read**: Count of references consulted
- **Missing Refs**: Expected refs not read
- **Unexpected Refs**: Extra refs accessed

## Key Insights

1. **Skills increase token usage** (reading references) but **improve code quality**
2. **Routing telemetry** validates that agents actually use skills when available
3. **Poisoned fixtures** test whether agents blindly copy vs. critically evaluate
4. **Variant comparison** isolates skill impact from baseline agent capability
5. **Stricter assertions for skilled agents** encode quality expectations

## Next Steps

To create GhostClaw eval cases:

1. Identify common quality issues in our domain (chat bot code, scheduling, IPC)
2. Create fixtures with intentional anti-patterns
3. Write clear prompts that should trigger skill usage
4. Define assertions that differentiate skilled vs unskilled output
5. Run against multiple models to validate skill effectiveness
