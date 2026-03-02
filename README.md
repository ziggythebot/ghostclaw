# GhostClaw

An AI agent that lives on its own computer, has its own accounts, and works as your always-on co-worker.

You interact with it like a person — voice notes on Telegram, mentions in WhatsApp groups, or just texting. It knows how you like to communicate, reads your email, monitors your services, and runs tasks on a schedule. And you customise everything through Claude Code, exactly the way you already work.

## Why this exists

**OpenClaw** is beautiful. Watching your agent talk to other agents, self-iterate, install things, and work stuff out for itself is genuinely mind-bending. But it's 500,000 lines of code, the setup is an approximation of the Claude Code terminal that doesn't quite work, and making changes that don't break everything is non-trivial. It's like driving a classic car — charming when it works, but you're fixing it more than driving it.

**NanoClaw** is elegant. 400 lines of core code, completely customisable, works out of the box. But it runs in containers, which is great for security on a shared machine — less great if you want your agent to actually *do things* across your system.

**GhostClaw** is the middle ground. NanoClaw's simplicity and skill system, with the freedom and functionality of OpenClaw. No containers — your agent runs bare metal on a dedicated machine with full access to everything. Add skills the same way you add capabilities in Claude Code. Compatible with both NanoClaw and OpenClaw skill ecosystems.

If you're already an advanced Claude Code user and want an agent that runs wild on its own hardware, this is for you.

## What it does

- **Its own Telegram identity** — message it like a person. No slash commands, no trigger needed in DMs.
- **WhatsApp group chats** — add it to any group. Responds when mentioned, stays quiet otherwise.
- **Voice notes** — send voice messages, it transcribes and responds. Both channels.
- **Scheduled tasks** — "check Hacker News every morning" or "remind me to review PRs every Friday at 3pm". Natural language, cron, or intervals.
- **Per-group personality** — each chat gets its own tone, memory, and rules. Direct in your DM, casual in the group chat.
- **Email** — reads and sends email. Picks up verification codes, flags urgent messages, sends summaries. Gmail, Outlook, or any IMAP.
- **Health monitoring** — heartbeat checks on disk space, services, logs. Daily briefings. Silent unless something needs attention.
- **Fully modifiable from Claude Code** — every behaviour, every skill, every personality file. If you can do it in Claude Code, you can teach your bot to do it.

## Quick start

Buy a Mac Mini (or use any dedicated Mac/Linux machine). Set up fresh accounts — iCloud, Gmail, GitHub, whatever you want the agent to have access to.

```bash
git clone https://github.com/ziggythebot/ghostclaw.git
cd ghostclaw
npm install
```

Open [Claude Code](https://claude.ai/download) and run:

```
/setup-ghostclaw
```

It walks you through everything: authentication, Telegram bot setup, personality building, and getting the service running. You'll need a couple of API keys (Claude, optionally OpenAI for voice) and to create a Telegram bot via @BotFather. About 10 minutes.

## Adding skills

Skills work exactly like Claude Code customisations. Run a command, it gets wired in:

| Command | What it adds |
|---------|-------------|
| `/add-heartbeat` | Periodic health checks (disk, logs, services) |
| `/add-morning-briefing` | Daily or weekly briefings |
| `/add-gmail-agent` | Email read/send (Gmail, Outlook, or IMAP) |
| `/add-update-check` | Weekly check for GhostClaw updates |
| `/add-voice` | Voice note transcription |
| `/add-slack` | Slack as an additional channel |
| `/add-telegram-swarm` | Multi-bot agent teams |

Skills are security-scanned before installation. Build your own using the same `CLAUDE.md` + manifest pattern. Because GhostClaw inherits NanoClaw's skill layer, it's compatible with the broader Claw ecosystem.

## The soul system

Each chat has a `CLAUDE.md` that defines the bot's personality for that context. Your main channel might say:

> Be direct. No emoji. Have opinions. Don't say "there are several approaches" — say "this is the move, here's why."

A group chat with friends might say:

> Be casual and funny. Only respond when mentioned. Keep it short.

Edit the file, the personality changes instantly. The setup wizard builds your initial soul automatically — it asks how you like to communicate and what annoys you about AI responses.

## How it works

```
You (Telegram/WhatsApp) --> GhostClaw --> Claude (Agent SDK) --> Response
```

One Node.js process. SQLite for state. Claude runs as a child process. No containers, no orchestration, no cloud infrastructure. Your bot runs directly on the host with full system access — that's the point.

## Configuration

All config lives in `.env`. The setup wizard creates this for you.

| Variable | Required | Description |
|----------|----------|-------------|
| `CLAUDE_CODE_OAUTH_TOKEN` | Yes* | Claude Max subscription token |
| `ANTHROPIC_API_KEY` | Yes* | Or use an API key instead |
| `ASSISTANT_NAME` | Yes | Bot name (trigger word in groups) |
| `TELEGRAM_BOT_TOKEN` | Yes | From @BotFather |
| `GHOSTCLAW_MODEL` | No | Default: `claude-sonnet-4-6`. Also: `claude-opus-4-6`, `claude-haiku-4-5-20251001` |
| `OPENAI_API_KEY` | No | For voice transcription |
| `TELEGRAM_ONLY` | No | Set `true` to skip WhatsApp |
| `GMAIL_MCP_ENABLED` | No | Set `1` for email integration |

*One of `CLAUDE_CODE_OAUTH_TOKEN` or `ANTHROPIC_API_KEY` is required.

## Running as a service

The setup wizard configures this automatically. For manual control:

**macOS:**
```bash
launchctl load ~/Library/LaunchAgents/com.ghostclaw.plist
launchctl unload ~/Library/LaunchAgents/com.ghostclaw.plist
launchctl kickstart -k gui/$(id -u)/com.ghostclaw  # restart
```

**Linux:**
```bash
systemctl --user start ghostclaw
systemctl --user restart ghostclaw
```

## Updating

```bash
git pull
npm run build
launchctl kickstart -k gui/$(id -u)/com.ghostclaw  # macOS
# systemctl --user restart ghostclaw                # Linux
```

## FAQ

**What does it cost?**

Your Claude subscription (Max or API) and optionally OpenAI for voice (~$0.006/minute). No platform fees.

**Is this secure?**

The bot has full access to its machine. That's the point — don't run this on a machine with data it shouldn't see. Run it on dedicated hardware with fresh accounts. Skills are security-scanned before installation.

**What's the relationship to NanoClaw and OpenClaw?**

GhostClaw is a fork of [NanoClaw](https://github.com/qwibitai/nanoclaw) with containers removed and OpenClaw-inspired features added (heartbeat, briefings, email, monitoring). NanoClaw skills work without modification. Think of it as NanoClaw's simplicity with OpenClaw's ambition.

## Credits

Fork of [NanoClaw](https://github.com/qwibitai/nanoclaw) by [qwibitai](https://github.com/qwibitai). Core architecture, skills engine, and agent runner are their work.

## Licence

MIT
