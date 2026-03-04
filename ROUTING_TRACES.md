# Routing Traces & Telemetry Documentation

## Overview

The `bout3fiddy/agents` repository (better_evals branch) implements a comprehensive telemetry and evaluation system for π agents. Routing traces capture detailed metrics about how agents interact with skills, references, and tools during evaluation runs.

## Location

Routing traces are stored in:
```
skills-evals/reports/routing-traces/<provider-model>/<case-id>.json
```

Example: `skills-evals/reports/routing-traces/openai-codex-gpt-5-3-codex/CD-015.json`

## Trace Naming Convention

Three trace variants per case:
- `<CASE-ID>.json` - Full payload with skills available
- `<CASE-ID>-NS.json` - No-skill baseline (no skills available)
- `<CASE-ID>-NS-PROBE.json` - Probe mode (read-only, tests skill discovery behavior)

## JSON Schema Structure

### Top-Level Fields

```typescript
{
  caseId: string;              // Test case identifier (e.g., "CD-015")
  mode: "single";              // Execution mode
  status: "pass" | "fail";     // Overall evaluation result
  runTimestamp: string;        // ISO 8601 timestamp
  model: string;               // Model identifier (e.g., "openai-codex/gpt-5.3-codex")
  expectedSkills: string[];    // Skills that should be used
  expectedRefs: string[];      // Reference docs that should be read
  tokens: TokenUsage;          // Token consumption metrics
  turnBreakdown: TurnTokenUsage[];  // Per-turn token breakdown
  toolUsage: ToolUsageSummary;      // Tool call statistics
  rpcDiagnostics: RpcDiagnostics;   // RPC stream telemetry
  outputTextPreview: string;        // Preview of agent output
  resultErrors: string[];           // Errors encountered
  routing: RoutingScorecard;        // Routing behavior analysis
  reasons: string[];                // Pass/fail reasons
  failureReasons: FailureReason[];  // Categorized failures
  readBreakdown: ReadBreakdownEntry[];      // What was read
  bootstrapBreakdown: BootstrapBreakdownEntry[];  // Bootstrap content
  judgeVerdict: JudgeBundleVerdict | null;  // Optional judge evaluation
}
```

### TokenUsage

```typescript
{
  input: number;        // Input tokens
  output: number;       // Output tokens
  cacheRead: number;    // Cache read tokens
  cacheWrite: number;   // Cache write tokens
  totalTokens: number;  // Sum of all tokens
}
```

### TurnTokenUsage

```typescript
{
  turn: number;         // Turn number (1-indexed)
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
  totalTokens: number;
}
```

### ToolUsageSummary

Tracks file manipulation tool usage:

```typescript
{
  allowedTools: string[];   // Tools available (e.g., ["edit", "read", "write"])
  writeCalls: number;       // Count of write tool calls
  editCalls: number;        // Count of edit tool calls
  writeFailures: number;    // Failed write calls
  editFailures: number;     // Failed edit calls
}
```

### RpcDiagnostics

**Extended π agent architecture telemetry** - captures the full RPC stream lifecycle:

```typescript
{
  rawLineCount: number;           // Total RPC lines received
  parsedEventCount: number;       // Successfully parsed events
  parseErrorCount: number;        // Parse failures
  eventCounts: Record<string, number>;  // Event type histogram
  autoRetryStartCount: number;    // Retry attempts initiated
  autoRetryEndCount: number;      // Retry attempts completed
  terminalAgentErrorCount: number;  // Fatal errors
  lastAgentStopReason: string | null;   // Final stop reason
  lastAgentErrorMessage: string | null; // Final error message
  toolCalls: RpcToolCallDiagnostics[];  // Per-tool-call telemetry
  anomalies: string[];            // Detected issues
}
```

### RpcToolCallDiagnostics

Granular tool call lifecycle tracking:

```typescript
{
  id: string;                    // Unique tool call ID
  toolName: string;              // Tool name (e.g., "read", "write")
  startCount: number;            // toolcall_start events
  deltaCount: number;            // toolcall_delta events (streaming updates)
  endCount: number;              // toolcall_end events
  executionStartCount: number;   // tool_execution_start events
  executionEndCount: number;     // tool_execution_end events
  executionSuccessCount: number; // Successful executions
  executionFailureCount: number; // Failed executions
  maxPartialJsonLength: number;  // Largest partial JSON seen
  seenInAgentEnd: boolean;       // Present in final agent_end message
}
```

**Anomaly Detection:**
- Incomplete tool calls: `deltaCount > 0 && endCount === 0 && executionStartCount === 0`
- Hung executions: `executionStartCount > executionEndCount`

### RoutingScorecard

Tracks skill/reference discovery and usage:

```typescript
{
  // Discovery phase
  readSkills: string[];          // Skills discovered
  readSkillFiles: string[];      // Skill files read
  readRefs: string[];            // References read

  // Execution phase
  attemptedSkills: string[];     // Skills attempted to use
  successfulSkills: string[];    // Skills successfully used
  deniedSkills: string[];        // Skills denied/blocked

  attemptedSkillFiles: string[]; // Skill files attempted
  successfulSkillFiles: string[];
  deniedSkillFiles: string[];

  attemptedRefs: string[];       // References attempted
  successfulRefs: string[];
  deniedRefs: string[];

  // Analysis
  missingSkillFileReads: string[];  // Expected but not read
  missingRefs: string[];            // Expected but not read
  unexpectedRefs: string[];         // Read but not expected
}
```

## Event Type Histogram

The `eventCounts` field in `RpcDiagnostics` tracks all RPC event types:

Common events:
- `response` - Command responses
- `agent_start` - Agent initialization
- `agent_end` - Agent completion
- `turn_start` - Turn beginning
- `turn_end` - Turn completion
- `message_start` - Message streaming start
- `message_end` - Message streaming end
- `message_update` - Message streaming updates
- `tool_execution_start` - Tool execution initiated
- `tool_execution_end` - Tool execution completed
- `toolcall_start` - Tool call parsing start
- `toolcall_delta` - Tool call streaming update
- `toolcall_end` - Tool call parsing complete
- `auto_retry_start` - Automatic retry initiated
- `auto_retry_end` - Automatic retry completed

## How Telemetry is Captured

### Architecture

The evaluation system uses **extended π agent architecture** with:

1. **RPC State Machine** (`rpc-state.ts`)
   - Manages agent lifecycle (agent_start → agent_end)
   - Handles retry settle windows (1.5s for case-level, 3s for prompt-level)
   - Tracks prompt errors and terminal conditions

2. **RPC Diagnostics Tracker** (`rpc-diagnostics.ts`)
   - Pure streaming parser
   - Records every RPC line received
   - Builds tool call lifecycle states
   - Detects anomalies (incomplete calls, hung executions)

3. **Case Process Runner** (`case-process.ts`)
   - Spawns π agent worker processes
   - Pipes RPC stream through diagnostics tracker
   - Collects output and telemetry
   - Enforces timeouts (default: 300s for completion, 30s for shutdown)

### Data Flow

```
π Agent Worker Process
  ↓ (stdout: JSONL RPC stream)
RPC State Machine (onLine)
  ↓
RPC Diagnostics Tracker
  ↓ (recordRawLine, recordEvent)
Tool Call State Tracking
  ↓ (on agent_end)
RpcDiagnostics Summary
  ↓
Case Evaluation Report
  ↓
Routing Trace JSON File
```

### Bootstrap Tracking

The `bootstrapBreakdown` field tracks what content was loaded during agent initialization:

```typescript
{
  path: string;  // File path
  bytes: number; // Size in bytes
}
```

Typical bootstrap files:
- `AGENTS.md` - Global instructions
- `skills.router.min.json` - Routing metadata
- `skills/` - Skill packages

### Read Tracking

The `readBreakdown` field tracks what the agent read during execution:

```typescript
{
  path: string;              // File path
  category: "skill" | "ref" | "task";  // Content type
  bytes: number;             // Size in bytes
  estTokens: number;         // Estimated tokens
}
```

## Trace Persistence

Traces are written by `report-persistence.ts`:

```typescript
// Per-case routing trace
await writeRoutingTrace(
  model,
  caseId,
  {
    caseId,
    mode,
    status,
    runTimestamp,
    model: model.key,
    expectedSkills,
    expectedRefs,
    tokens,
    turnBreakdown,
    toolUsage,
    rpcDiagnostics,
    outputTextPreview,
    resultErrors,
    routing,
    reasons,
    failureReasons,
    readBreakdown,
    bootstrapBreakdown,
    judgeVerdict,
  }
);
```

Traces are model-specific and written to:
`skills-evals/reports/routing-traces/<provider-model>/<case-id>.json`

## RPC Trace Raw Logs

When `PI_EVAL_RPC_TRACE_DIR` is set, raw RPC streams are also persisted:

- `<case-id>.jsonl` - Raw RPC event stream (one JSON object per line)
- `<case-id>.diagnostics.json` - Lifecycle summary

This enables post-mortem analysis of timeout failures and streaming behavior.

## Key Metrics Tracked

### Routing Quality
- Expected vs actual skill reads
- Expected vs actual reference reads
- Unexpected reference reads (over-reading)
- Missing reads (under-reading)

### Performance
- Total tokens consumed
- Per-turn token breakdown
- Cache hit rates (cacheRead vs input)
- Duration in milliseconds

### Reliability
- RPC parse errors
- Auto-retry attempts
- Tool execution failures
- Anomalous tool call patterns

### Tool Usage
- Write/edit call counts
- Write/edit failure rates
- Allowed tools vs tools used

## Example Analysis

From `CD-015.json`:

**Routing Quality:**
- Expected: `["skills/coding/references/code-smells/smells/ai-code-smell.md"]`
- Actual: 4 references read (3 unexpected)
- Indicates over-reading but still passed

**Performance:**
- Total tokens: 158,112
- Input: 21,511, Output: 4,249
- Cache read: 132,352 (83.7% cache hit rate)
- 1 turn

**Tool Usage:**
- 14 tool calls total
- 13 reads, 1 write
- 0 failures
- All tools seen in final agent_end (no incomplete calls)

**RPC Health:**
- 1,910 raw lines
- 1,910 parsed events (0 parse errors)
- 0 auto-retries
- 0 terminal errors
- Stop reason: "stop" (clean completion)

## No-Skill Baseline Comparison

`CD-015-NS.json` shows the no-skill control:
- 0 skills/references expected
- 0 skills/references read
- Still passes (tests pure coding ability)
- Fewer tokens (no skill bootstrap overhead)
- Shorter RPC stream (fewer events)

## Probe Mode

`CD-015-NS-PROBE.json` tests skill discovery behavior:
- Read-only tools
- Expected: discover `coding` skill
- Actual: attempted read of `skills/coding/SKILL.md` (forbidden)
- Records "forbidden read" in `resultErrors`
- Still passed routing scorecard (discovered the skill)

## Implementation Notes

1. **Pure streaming** - diagnostics tracker has no runtime dependencies, processes line-by-line
2. **Tool call identity** - uses compound ID: `<call_id>|<fc_id>` for deduplication
3. **Lazy tool name resolution** - starts as "unknown", resolved on first delta/execution
4. **Agent end deferral** - 1.5s settle window for retryable errors to allow auto-retry
5. **Anomaly detection** - post-processing detects incomplete/hung calls
6. **Timeout diagnostics** - compact summary included in timeout errors for debugging

## Related Files

- `skills-evals/pi-eval/src/data/types.ts` - Type definitions
- `skills-evals/pi-eval/src/runtime/rpc/rpc-diagnostics.ts` - Telemetry tracker
- `skills-evals/pi-eval/src/runtime/rpc/rpc-state.ts` - RPC state machine
- `skills-evals/pi-eval/src/reporting/report-persistence.ts` - Trace persistence
- `skills-evals/pi-eval/src/reporting/report.ts` - Report generation
- `skills-evals/pi-eval/src/runtime/case/case-process.ts` - Case execution

## Future Enhancements

The telemetry system is designed to support:
- Bundle evaluations (A/B testing variants)
- Judge-based quality scoring
- Cross-model comparison
- Longitudinal tracking (run-over-run analysis)
- Cost optimization (cache efficiency)
