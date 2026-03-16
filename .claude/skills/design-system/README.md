# Design System Skill

Project-agnostic design system enforcement for consistent design across any project.

## Overview

The Design System skill lets you define design rules once in a JSON config and then audit, normalize, compress, and apply those rules across your entire codebase.

**Key Features:**
- 🎨 **Project-agnostic** - Works with any project (Emergence, Velocity, client work)
- 🔍 **Audit** - Check files for design system violations
- ✨ **Normalize** - Auto-fix violations to match design system
- 🗜️ **Compress** - Tighten spacing while maintaining consistency
- 🏗️ **Apply** - Generate new components following design system
- 📋 **Rules** - View current project's design rules

## Quick Start

### 1. Initialize Design System

```bash
/ds-init
```

Choose to start from scratch or copy from an example (Emergence, Velocity).

This creates `design-system.json` in your project root.

### 2. View Current Rules

```bash
/ds-rules
```

Shows your project's fonts, colors, spacing, and design rules.

### 3. Audit a File

```bash
/ds-audit src/pages/Home.tsx
```

Checks for violations:
- Wrong fonts
- Colors not in palette
- Non-standard spacing
- Breaking design rules

### 4. Fix Violations

```bash
/ds-normalize src/pages/Home.tsx
```

Automatically fixes design system violations.

### 5. Compress Spacing

```bash
/ds-compress src/pages/About.tsx
```

Tightens spacing while maintaining design system values.

### 6. Generate New Components

```bash
/ds-apply FeatureCard
```

Creates a new component following your design system.

## Commands Reference

| Command | Purpose | Example |
|---------|---------|---------|
| `/ds-init` | Initialize design system config | `/ds-init --from emergence` |
| `/ds-rules` | Show current design rules | `/ds-rules` |
| `/ds-audit [file]` | Check file for violations | `/ds-audit src/pages/Home.tsx` |
| `/ds-normalize [file]` | Fix violations | `/ds-normalize src/pages/Home.tsx` |
| `/ds-compress [file]` | Tighten spacing | `/ds-compress src/pages/About.tsx` |
| `/ds-apply [component]` | Generate component | `/ds-apply Hero` |

## Design System Config

The `design-system.json` file defines your project's design rules:

```json
{
  "name": "Project Name",
  "fonts": {
    "heading": "Epilogue",
    "body": "DM Sans",
    "mono": "JetBrains Mono"
  },
  "colors": {
    "primary": "#00D27F",
    "secondary": "#FFD600",
    "ink": "#251720"
  },
  "spacing": {
    "base": "8px",
    "medium": "16px",
    "large": "24px"
  },
  "rules": [
    "Always use 3px borders",
    "No rounded corners except circles",
    "No gradients"
  ]
}
```

## Examples

### Emergence Design System
Brutalist aesthetic with sharp edges and bold colors:
- 3px borders everywhere
- No rounded corners (except circles)
- Network node colors: #00D27F, #FFD600, #FF5733
- Fonts: Epilogue (headings), DM Sans (body), JetBrains Mono (code)

See: `examples/emergence.json`

### Velocity Design System
Clean, modern, professional:
- Subtle shadows for depth
- Rounded corners allowed (4px, 8px, 12px)
- Gradients for CTAs only
- Font: Inter for everything
- Primary gradient: #667eea → #764ba2

See: `examples/velocity.json`

## Workflow Examples

### Example 1: Setup new project

```bash
# Initialize with Velocity design system
/ds-init --from velocity

# Verify rules
/ds-rules

# Generate hero component
/ds-apply Hero
# Agent: "What elements should Hero have?"
# User: "Headline, subheadline, CTA button"
# → Creates Hero.tsx with Velocity design system
```

### Example 2: Audit existing page

```bash
# Check homepage for violations
/ds-audit src/pages/Home.tsx

# Output:
# ❌ Font violations: 3
# ❌ Color violations: 2
# ❌ Spacing violations: 5
# Want me to fix with /ds-normalize?

# Fix all violations
/ds-normalize src/pages/Home.tsx

# Output:
# Fixed 10 violations
# ✓ All checks pass!
```

### Example 3: Compress spacing

```bash
# Page feels too spacious
/ds-compress src/pages/About.tsx

# Output:
# Section margins: 80px → 48px (save 32px)
# Card padding: 40px → 24px (save 16px)
# Total reduction: ~128px
# Apply compression? [yes/no]

# yes
# → Applies compression using design system spacing values
```

## Integration

Works seamlessly with other skills:

- **`/variant`** - Apply design system to variant exports
- **`/page-cro`** - Ensure CRO changes follow design system
- **`/copywriting`** - Generated components use design system

## Rules Philosophy

The skill follows these principles:

1. **Consistency over creativity** - Design system rules are enforced strictly
2. **Audit before fix** - Always show what will change
3. **Preserve intent** - Compression shouldn't break visual hierarchy
4. **Project-agnostic** - Same commands work across all projects
5. **Config-driven** - All rules come from `design-system.json`

## Creating Your Own Design System

1. Run `/ds-init` to create config
2. Define your rules in `design-system.json`:
   - Fonts (heading, body, mono)
   - Colors (primary, secondary, etc.)
   - Spacing values (base, medium, large)
   - Typography sizes (h1, h2, body)
   - Custom rules (borders, corners, gradients)
3. Run `/ds-rules` to verify
4. Start using `/ds-audit`, `/ds-normalize`, `/ds-compress`

## Tips

- **Start with audit** - Run `/ds-audit` on key pages to see violations
- **Normalize incrementally** - Fix one page at a time, not all at once
- **Compress carefully** - Review preview before applying compression
- **Update config as needed** - Add colors/spacing as your design evolves
- **Use examples** - Copy from Emergence or Velocity and modify

## Contributing

To add a new example design system:

1. Create `examples/[project-name].json`
2. Follow the config structure
3. Add clear rules and examples
4. Document in README

## Support

Questions? Issues?
- Check `prompt.md` for detailed command documentation
- See `examples/` for real-world configs
- Run `/ds-rules` to debug current config
