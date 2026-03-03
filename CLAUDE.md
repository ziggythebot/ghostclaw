# GhostClaw

Personal AI assistant. Fork of [NanoClaw](https://github.com/qwibitai/nanoclaw) with containers removed. See [README.md](README.md) for setup. See [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) for architecture decisions.

## Quick Context

Single Node.js process that connects to Telegram and WhatsApp, routes messages to Claude Agent SDK running as **direct Node.js child processes** (no containers). Each group has isolated filesystem and memory.

**No containers.** Agents run directly on the host machine. `container-runner.ts` spawns `node` processes, passing paths via environment variables (`NANOCLAW_GROUP_DIR`, `NANOCLAW_IPC_DIR`, `NANOCLAW_GLOBAL_DIR`). These env var names are kept for NanoClaw ecosystem compatibility.

## Key Files

| File | Purpose |
|------|---------|
| `src/index.ts` | Orchestrator: state, message loop, agent invocation |
| `src/channels/telegram.ts` | Telegram bot via Grammy |
| `src/channels/whatsapp.ts` | WhatsApp connection, auth, send/receive |
| `src/container-runner.ts` | Spawns agent as direct Node.js processes |
| `src/transcription.ts` | Voice message transcription via OpenAI Whisper |
| `src/task-scheduler.ts` | Cron and one-shot scheduled tasks |
| `src/ralph.ts` | Ralph loop pure functions (task parsing, prompts) |
| `src/ralph-runner.ts` | Ralph loop orchestration (start, iterate, stop) |
| `src/ipc.ts` | IPC watcher and task processing |
| `src/db.ts` | SQLite operations |
| `src/config.ts` | Trigger pattern, paths, intervals |
| `groups/{name}/CLAUDE.md` | Per-group memory and personality (isolated) |
| `container/agent-runner/src/index.ts` | Agent runtime (Claude SDK, MCP tools) |
| `skills-engine/` | Skill apply/merge/state engine (NanoClaw compatible) |

## Skills

| Skill | When to Use |
|-------|-------------|
| `/setup` | First-time installation, authentication, service configuration |
| `/customize` | Adding channels, integrations, changing behavior |
| `/update-nanoclaw` | Bring upstream NanoClaw updates into a customized install |

## Development

Run commands directly — don't tell the user to run them.

```bash
npm run dev          # Run with hot reload
npm run build        # Compile TypeScript
npm run test         # Run tests
```

Service management:
```bash
# macOS (launchd)
launchctl load ~/Library/LaunchAgents/com.ghostclaw.plist
launchctl unload ~/Library/LaunchAgents/com.ghostclaw.plist
launchctl kickstart -k gui/$(id -u)/com.ghostclaw  # restart

# Linux (systemd)
systemctl --user start ghostclaw
systemctl --user stop ghostclaw
systemctl --user restart ghostclaw
```

## Agent Environment Model

Agents run as child processes with the **real HOME**. Session isolation uses `CLAUDE_CONFIG_DIR` — **never override HOME**.

- `container-runner.ts` sets `CLAUDE_CONFIG_DIR=data/sessions/{group}/.claude` for per-group session isolation. The Claude Agent SDK reads this natively.
- `HOME` is inherited from the host process. Tools like `gh`, Gmail OAuth, and any MCP server find their credentials at `~/` as expected.
- The MCP SDK automatically passes `HOME`, `PATH`, `USER`, `SHELL`, `TERM`, `LOGNAME` to MCP server processes (safe allowlist). Custom vars must be passed explicitly.

### Adding MCP servers

Use the **standard Claude Code pattern**: add to `data/sessions/{group}/.claude/settings.json`:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "npx",
      "args": ["my-mcp-package"]
    }
  }
}
```

The agent-runner reads `mcpServers` from settings.json at startup and merges them with the built-in `nanoclaw` IPC server. `allowedTools` is built dynamically (`mcp__{name}__*` for each server). No code changes needed.

For globally-enabled servers (available to all groups), add to `buildGlobalMcpServers()` in `container-runner.ts` — these get synced into every group's settings.json automatically. Only the `nanoclaw` server stays programmatic (needs runtime vars like `NANOCLAW_CHAT_JID`).

## Security

Skills are scanned before application (`skills-engine/security-scan.ts`). Critical findings block apply. Run `npx tsx scripts/scan-skill.ts --all` to scan all skills.

## NanoClaw Compatibility

This is a fork. We keep NanoClaw's internal conventions where possible:
- `.nanoclaw/` state directory (skills engine)
- `NANOCLAW_*` environment variables (agent runner interface)
- Skills from the NanoClaw ecosystem apply cleanly

When pulling upstream updates, watch for conflicts in:
- `src/container-runner.ts` (rewritten to spawn node directly)
- `src/index.ts` (Telegram channel additions)
- `container/agent-runner/src/` (Gmail MCP integration)
