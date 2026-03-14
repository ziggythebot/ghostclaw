---
name: setup-shared-folder
description: Set up a private GitHub repo for syncing files between GhostClaw (Mac mini) and user's main machine (MacBook Air, etc). Use when user wants to share files across machines without Dropbox/iCloud.
---

# Setup Shared Folder

Creates a private GitHub repo for syncing files between the machine running GhostClaw and the user's primary machine.

**Use when:**
- User wants files from GhostClaw accessible on another machine
- User wants to avoid Dropbox/Google Drive/iCloud
- User mentions "shared folder", "sync files", "access files on my laptop"

## What it does

1. Creates `~/ghostclaw-shared/` directory structure:
   - `variant/` - Variant HTML/React exports
   - `projects/` - Project files
   - `scratch/` - Temp workspace

2. Initializes git repo
3. Creates private GitHub repo (under GhostClaw's GitHub account)
4. Pushes initial commit
5. Gives user clone instructions

## Usage

```bash
# On GhostClaw's machine (already done by skill):
cd ~/ghostclaw-shared
# Repo created and pushed

# On user's machine (tell them to run):
git clone https://github.com/ziggythebot/ghostclaw-shared.git
cd ghostclaw-shared
```

## Workflow after setup

**When GhostClaw saves files:**
```bash
# GhostClaw does this automatically:
cd ~/ghostclaw-shared
cp /path/to/file variant/
git add .
git commit -m "Add variant export"
git push
```

**User gets files:**
```bash
# User runs on their machine:
cd ~/ghostclaw-shared
git pull
# Files now available locally
```

## Auto-sync option (optional)

For automatic pulling on user's machine:
```bash
# Add to crontab on user's machine:
*/5 * * * * cd ~/ghostclaw-shared && git pull -q
```

## Implementation

```bash
#!/bin/bash

# Create directory structure
mkdir -p ~/ghostclaw-shared/{variant,projects,scratch}
cd ~/ghostclaw-shared

# Initialize git
git init
echo "# GhostClaw Shared Files

Synced workspace between GhostClaw and your main machine.

- \`variant/\` - Variant HTML/React exports
- \`projects/\` - Project files
- \`scratch/\` - Temp workspace

## Usage

Pull latest files:
\`\`\`
git pull
\`\`\`
" > README.md

git add .
git commit -m "Initial commit"

# Create private GitHub repo
gh repo create ghostclaw-shared --private --source=. --push

echo "✓ Shared folder created at ~/ghostclaw-shared"
echo "✓ GitHub repo: https://github.com/$(gh api user -q .login)/ghostclaw-shared"
echo ""
echo "On your main machine, run:"
echo "  git clone https://github.com/$(gh api user -q .login)/ghostclaw-shared.git"
```

## Update PROJECTS.md

After running, update the user's PROJECTS.md:

```markdown
## Shared Files

**GitHub Repo**: `~/ghostclaw-shared/`
- Syncs to https://github.com/ziggythebot/ghostclaw-shared
- Clone on your MacBook Air: `git clone <url>`
- Pull updates: `cd ~/ghostclaw-shared && git pull`
- Subfolders:
  - `variant/` - Variant HTML/React exports
  - `projects/` - Project files
  - `scratch/` - Temp workspace
```

## Helper function for GhostClaw

Add to memory: when saving files to share with user, use this pattern:

```bash
# Save file to shared folder
cp /path/to/file ~/ghostclaw-shared/variant/filename.html

# Auto-commit and push
cd ~/ghostclaw-shared
git add .
git commit -m "Add: filename.html"
git push
```

## Security

- Repo is private by default
- Only accessible to GhostClaw's GitHub account and collaborators
- User can add their own GitHub account as collaborator if needed
- Isolated from user's personal cloud storage (Dropbox, iCloud, etc.)

## Notes

- Requires `gh` CLI authenticated
- User needs git on their main machine
- Alternative: use Desktop folder via screen sharing (simpler but manual)
