# Domain Check

Check domain availability across 600+ TLDs instantly using Namecheap. No API keys needed — uses zero-setup hosted backend.

## What This Does

Automatically installs and configures the Namecheap MCP server so you can check domain availability conversationally without leaving Claude.

**Before:**
- Tab to Namecheap.com
- Type each domain manually
- Check availability one by one
- Back to Claude
- Repeat 20 times

**After:**
- "Check if myapp.com, myapp.io, and myapp.ai are available"
- Instant results with purchase links
- Keep brainstorming

## How It Works

This skill:
1. Installs the `namecheap-mcp` npm package globally
2. Adds the MCP server to your Claude Code settings
3. Configures it with the hosted backend (no API keys needed)
4. Restarts your Claude Code session

After installation, just ask Claude to check domains naturally:
- "Check if example.com is available"
- "Find me 10 available .io domains for a SaaS startup"
- "Check these domains: [list]"

## Installation

Run this skill once to set everything up:

```
/domain-check
```

Follow the prompts, and you're done!

## Features

- **600+ TLDs** — .com, .io, .ai, .xyz, .tech, .dev, .app, and 595 more
- **Batch checking** — Check 100 domains in one request
- **Zero setup** — No API keys, no configuration
- **Purchase links** — One-click affiliate-tracked links to Namecheap
- **Premium pricing** — See costs for premium domains upfront

## Examples

**Startup naming:**
```
You: "I'm building a restaurant menu SaaS. Help me find a domain."

Claude: Let me check some options...
✅ menusaas.com ($12.98/year) — Buy on Namecheap →
✅ restaurantmenu.io ($34.98/year) — Buy on Namecheap →
❌ menu.app (taken)
```

**Finding alternatives:**
```
You: "example.com is taken. Find similar domains."

Claude: Checking variations...
✅ getexample.com — Buy on Namecheap →
✅ tryexample.com — Buy on Namecheap →
✅ example.io — Buy on Namecheap →
```

**Domain research:**
```
You: "Check if any single-word tech domains are available in .ai"

Claude: Checking...
✅ compiler.ai ($89.98/year) — Buy on Namecheap →
❌ code.ai (premium domain - $15,000)
✅ deploy.ai ($89.98/year) — Buy on Namecheap →
```

## Uninstalling

To remove the MCP server:
1. Open `~/.claude/settings.json`
2. Remove the `"namecheap"` entry from `mcpServers`
3. Optionally: `npm uninstall -g namecheap-mcp`

## Privacy & Security

- Domain searches are not logged
- The hosted backend only checks availability — it cannot access your Namecheap account
- Purchases happen directly on Namecheap.com
- Purchase links include affiliate tracking (supports the project)

## More Info

- GitHub: https://github.com/ziggythebot/namecheap-mcp
- npm: https://www.npmjs.com/package/namecheap-mcp
- Issues: https://github.com/ziggythebot/namecheap-mcp/issues
