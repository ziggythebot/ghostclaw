---
name: add-heartbeat
description: Add a heartbeat system that periodically checks a HEARTBEAT.md checklist and only alerts the user when something needs attention. Inspired by OpenClaw's heartbeat pattern.
---

# Add Heartbeat

Adds a periodic heartbeat that wakes the agent on a cron schedule, runs through a checklist of cheap checks, and only messages the user if something needs attention.

## What it does

1. Creates `groups/main/HEARTBEAT.md` with a template checklist
2. Registers a scheduled task that runs the heartbeat on a cron (default: every 30 minutes)
3. The agent reads the checklist, runs each check, and stays silent if everything is fine

## Setup

### 1. Create HEARTBEAT.md (if not exists)

Check if `groups/main/HEARTBEAT.md` exists. If not, create it with this template:

```markdown
# Heartbeat Checks

Run these checks silently. Only message the user if something actually needs their attention.

## Checks

### 1. Error Log

\`\`\`bash
tail -20 ~/nanoclaw/logs/errors.log
\`\`\`

- Each line is JSON with a `"time"` field (Unix ms).
- Calculate cutoff: `Date.now() - (35 * 60 * 1000)`.
- **Ignore** any entry where `time < cutoff`. Don't mention ignored entries at all.
- If the file is empty or all entries are old, this check passes silently.
- If recent errors exist, summarise the actual problem in one line.

### 2. Runaway Processes

\`\`\`bash
ps aux -r | head -5
\`\`\`

- Check if any process is using >90% CPU.
- Chrome/agent-browser processes that have been running for hours are zombies — kill them:
  \`\`\`bash
  pkill -9 -f "agent-browser-chrome"
  \`\`\`
- Alert the user: "Killed zombie Chrome process (was using X% CPU)."
- Also check load average (`uptime`). If load >4, mention it.

### 3. Disk Space

\`\`\`bash
df -h /
\`\`\`

- Alert if usage >80%. State the percentage and partition.

## Rules

- **Silent by default.** If everything is fine: `<internal>All checks passed</internal>` — nothing else.
- **Never explain your reasoning.** Just do the checks and report problems.
- **Never report old/filtered entries.** If an entry is too old, pretend it doesn't exist.
- When alerting, state the problem in plain English, one or two lines max.
- Don't repeat alerts already visible in recent conversation history.
```

### 2. Ask the user

Use AskUserQuestion to ask:
- How often should the heartbeat run? (Every 30 minutes / Every hour / Every 2 hours)
- Any specific checks to add? (URLs to ping, services to monitor, etc.)

Update HEARTBEAT.md with their answers.

### 3. Register the scheduled task

Write an IPC task file to register the heartbeat:

```bash
mkdir -p data/ipc/main/tasks
cat > "data/ipc/main/tasks/heartbeat_$(date +%s).json" << 'EOF'
{
  "type": "schedule_task",
  "prompt": "Read $GHOSTCLAW_GROUP_DIR/HEARTBEAT.md (or ./HEARTBEAT.md in the current directory) and run each check listed. Only message the user if something needs attention. If everything is fine, respond with <internal>All checks passed</internal> and nothing else.",
  "schedule_type": "cron",
  "schedule_value": "*/30 * * * *",
  "context_mode": "isolated"
}
EOF
```

Adjust the cron value based on the user's preference.

### 4. Verify

Wait for the next cron trigger (or manually create a test by adding a failing check to HEARTBEAT.md), then check logs:

```bash
grep -i "heartbeat\|All checks passed" ~/nanoclaw/logs/ghostclaw.log | tail -5
```

## Customisation

Users can edit HEARTBEAT.md at any time to add, remove, or modify checks. The agent reads it fresh each time. No restart needed.

Examples of checks to add:
- `curl -s https://yoursite.com -o /dev/null -w '%{http_code}'` — website uptime
- `gh pr list --state open --repo yourorg/yourrepo` — open PRs
- `cat /path/to/some/log | grep ERROR | tail -5` — application errors
- Check Gmail for emails from specific senders
- Check crypto prices via API
