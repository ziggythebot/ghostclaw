# Agents Routing Traces Analysis

## Overview

The `bout3fiddy/agents` repository (better_evals branch) contains a sophisticated evaluation system that tracks agent behavior through routing traces. These traces capture how agents discover, route to, and use skills during execution.

## Repository Structure

```
agents-better-evals/
├── skills-evals/
│   ├── pi-eval/              # Eval harness (Pi extension)
│   ├── validate/             # TypeScript port of agentskills validate
│   ├── reports/              # Primary eval reports
│   │   └── routing-traces/   # Per-case routing telemetry (JSON)
│   ├── fixtures/             # Eval cases and test data
│   └── gondolin/             # Custom sandbox image
```

## Routing Traces Schema

Routing traces are stored in `reports/routing-traces/<provider>-<model>/<case-id>.json`.

### Core Metadata

```json
{
  "caseId": "CD-015",
  "mode": "single",
  "status": "pass|fail",
  "runTimestamp": "2026-03-03T17:41:54.830Z",
  "model": "openai-codex/gpt-5.3-codex"
}
```

### Expected vs Actual Routing

Each trace includes what the agent *should* have routed to and what it *actually* did:

```json
{
  "expectedSkills": ["coding"],
  "expectedRefs": [
    "skills/coding/references/code-smells/smells/ai-code-smell.md"
  ]
}
```

### Token Breakdown

Detailed token usage with cache metrics:

```json
{
  "tokens": {
    "input": 21511,
    "output": 4249,
    "cacheRead": 132352,
    "cacheWrite": 0,
    "totalTokens": 158112
  },
  "turnBreakdown": [
    {
      "turn": 1,
      "input": 21511,
      "output": 4249,
      "cacheRead": 132352,
      "cacheWrite": 0,
      "totalTokens": 158112
    }
  ]
}
```

### Tool Usage Telemetry

Tracks allowed tools and their success/failure rates:

```json
{
  "toolUsage": {
    "allowedTools": ["edit", "read", "write"],
    "writeCalls": 1,
    "editCalls": 0,
    "writeFailures": 0,
    "editFailures": 0
  }
}
```

### RPC Diagnostics

Deep instrumentation of the agent runtime protocol:

```json
{
  "rpcDiagnostics": {
    "rawLineCount": 1910,
    "parsedEventCount": 1910,
    "parseErrorCount": 0,
    "eventCounts": {
      "response": 1,
      "agent_start": 1,
      "turn_start": 10,
      "message_start": 25,
      "message_end": 25,
      "message_update": 1809,
      "tool_execution_start": 14,
      "tool_execution_end": 14,
      "turn_end": 10,
      "agent_end": 1
    },
    "autoRetryStartCount": 0,
    "autoRetryEndCount": 0,
    "terminalAgentErrorCount": 0,
    "lastAgentStopReason": "stop",
    "lastAgentErrorMessage": null
  }
}
```

### Tool Call Diagnostics

Per-tool-call streaming metrics:

```json
{
  "toolCalls": [
    {
      "id": "call_8veLT8dLnFVQJ3s3G2s5jydj|fc_01aa5...",
      "toolName": "read",
      "startCount": 0,
      "deltaCount": 2,
      "endCount": 0,
      "executionStartCount": 1,
      "executionEndCount": 1,
      "executionSuccessCount": 1,
      "executionFailureCount": 0,
      "maxPartialJsonLength": 93,
      "seenInAgentEnd": true
    }
  ],
  "anomalies": []
}
```

### Routing Scorecard

The core routing metrics that evaluate agent behavior:

```json
{
  "routing": {
    "readSkills": ["coding"],
    "readSkillFiles": ["coding"],
    "readRefs": [
      "skills/coding/references/code-smells/detection-signals.md",
      "skills/coding/references/code-smells/index.md",
      "skills/coding/references/code-smells/smells/ai-code-smell.md",
      "skills/coding/references/code-smells/smells/speculative-generality.md"
    ],
    "attemptedSkills": ["coding"],
    "successfulSkills": ["coding"],
    "deniedSkills": [],
    "attemptedSkillFiles": ["coding"],
    "successfulSkillFiles": ["coding"],
    "deniedSkillFiles": [],
    "attemptedRefs": [...],
    "successfulRefs": [...],
    "deniedRefs": [],
    "missingSkillFileReads": [],
    "missingRefs": [],
    "unexpectedRefs": [
      "skills/coding/references/code-smells/detection-signals.md",
      "skills/coding/references/code-smells/index.md",
      "skills/coding/references/code-smells/smells/speculative-generality.md"
    ]
  }
}
```

### Bootstrap Profile

Tracks what was loaded into the agent's context:

```json
{
  "bootstrapBreakdown": [
    {
      "path": "/tmp/pi-eval-sandbox/CD-015/.../AGENTS.md",
      "bytes": 12585
    },
    {
      "path": "/tmp/pi-eval-sandbox/CD-015/.../skills.router.min.json",
      "bytes": 3978
    },
    {
      "path": "/tmp/pi-eval-sandbox/CD-015/.../skills",
      "bytes": 187357
    }
  ]
}
```

### Output Preview

A truncated snapshot of the agent's final output:

```json
{
  "outputTextPreview": "Implemented ✅ `skills-evals/generated/codequality/cd015/solution.py`\n\n### What I added\n- A composable middleware pipeline..."
}
```

## Telemetry Capture Architecture

### Extended Pi Agent Architecture

The evaluation system extends the Pi coding agent with custom telemetry hooks:

1. **Worker Registration** (`pi-eval/src/runtime/entry/worker.ts`)
   - Registers custom read/edit/write tools
   - Wraps tools with sandbox boundaries
   - Installs read capture hooks
   - Accumulates RPC events

2. **Read Capture** (`worker-tools.ts`)
   - Intercepts all read tool calls
   - Tracks skill file reads via path pattern matching
   - Extracts skill IDs from paths (e.g., `skills/coding/SKILL.md` → `coding`)
   - Distinguishes between skill files and references

3. **Tool Usage Capture** (`worker-accumulator.ts`)
   - Tracks write/edit call counts
   - Records success/failure per tool
   - Accumulates tool failures in a set

4. **RPC Diagnostics**
   - Parses streaming RPC events
   - Counts event types (agent_start, turn_start, message_update, etc.)
   - Tracks tool call streaming metrics (delta counts, partial JSON lengths)
   - Detects anomalies and terminal errors

5. **Routing Inference**
   - Skills are identified by reading `skills/<name>/SKILL.md`
   - References are matched by path pattern: `skills/<name>/references/**`
   - Routing scorecard compares expected vs actual reads
   - "Unexpected refs" flag over-exploration or incorrect routing

### Sandbox Model

- Each eval case runs in an isolated workspace under `/tmp/pi-eval-sandbox/<batch-id>/<uuid>`
- HOME is isolated to `/tmp/pi-eval-home/<batch-id>/<uuid>`
- Skills are synced via `bin/sync.sh` bootstrap
- Shared sandbox mode batches cases by suite for efficiency

### Worker Contract

Environment variables control worker behavior:
- `PI_EVAL_CASE_ID`: Case identifier
- `PI_EVAL_OUTPUT_PATH`: Where to write the routing trace JSON
- `PI_EVAL_SKILL_PATHS`: Comma-separated skill paths for routing hints
- `PI_EVAL_ALLOWED_TOOLS`: Tools available to the agent (read, edit, write)
- `PI_EVAL_DRY_RUN`: If true, skip actual file writes

## Key Insights

### Skill Routing Pattern

The system validates that agents:
1. Read the correct `SKILL.md` files
2. Access expected references under `skills/<name>/references/`
3. Don't read unexpected or irrelevant references

### No-Skill Mode

Cases with `-NS` suffix (e.g., `CD-015-NS`) run without any skills:
```json
{
  "expectedSkills": [],
  "expectedRefs": [],
  "routing": {
    "readSkills": [],
    "readRefs": []
  }
}
```

This validates that agents can complete tasks without skill scaffolding.

### Probe Mode

Cases with `-NS-PROBE` suffix combine no-skill mode with exploratory probing to validate baseline agent capabilities.

## Router Artifact Validation

The system includes a validator for `skills.router.min.json`:

**Schema Requirements** (`router_artifact_check.ts`):
- Top-level keys: `schema_version`, `generated_at`, `skills`, `by_task_type`, `by_workflow_trigger`
- Each skill must have: `id`, `path`, `task_types`, `priority`, `activation_policy`
- Routing maps (`by_task_type`, `by_workflow_trigger`) must reference known skill IDs
- Every skill must appear in at least one task-type bucket

**Allowed Activation Policies**:
- Defined in `schema.ts` (not visible in excerpts, but validated in `router_artifact_check.ts`)

## Running Evals

```bash
# Run all eval cases for all models in fixtures/models.jsonl
./skills-evals/run.sh

# Run a specific case across all models
./skills-evals/run.sh --case CD-015

# Direct invocation with pi
pi --no-session --no-extensions \
  -e skills-evals/pi-eval/index.ts \
  -p "/eval audit --model openai-codex/gpt-5.3-codex"
```

## Report Artifacts

1. **Primary Reports**: `reports/<provider>-<model>.md`
   - Summary table with pass/fail status
   - Routing columns: Skills Read, Refs Read, Missing Refs, Unexpected Refs

2. **Routing Traces**: `reports/routing-traces/<provider>-<model>/<case-id>.json`
   - Full telemetry as described above

3. **Index**: `reports/index.json`
   - Metadata about all reports

## Telemetry Use Cases

1. **Debugging Agent Behavior**: Understand why an agent chose specific skills or references
2. **Token Optimization**: Identify cache hit rates and turn efficiency
3. **Tool Usage Analysis**: Track which tools succeed/fail and why
4. **Routing Quality**: Measure precision (unexpected refs) and recall (missing refs)
5. **RPC Health**: Detect streaming anomalies and terminal errors

## References

- Router artifact validator: `validate/src/router_artifact_check.ts`
- Worker entry point: `pi-eval/src/runtime/entry/worker.ts`
- Accumulator logic: `pi-eval/src/runtime/worker/worker-accumulator.ts`
- Main README: `skills-evals/README.md`
