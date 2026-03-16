# Design System - Project-Agnostic Design Enforcement

Enforce consistent design rules across any project using a simple JSON config file.

## Commands

### /ds-init
Initialize design system for current project. Creates `design-system.json` in project root.

**Usage:**
```
/ds-init
/ds-init --from emergence  (copy from example)
/ds-init --from velocity
```

**Workflow:**
1. Check if `design-system.json` exists in current directory
2. If not, ask user:
   - "Start from scratch?"
   - "Copy from Emergence example?"
   - "Copy from Velocity example?"
3. Create file based on choice
4. Show contents and ask user to review/edit

---

### /ds-rules
Show current project's design system rules.

**Usage:**
```
/ds-rules
```

**Workflow:**
1. Read `design-system.json` from current directory
2. Display formatted rules:
   - Project name
   - Fonts (heading, body, mono)
   - Colors (primary, secondary, etc.)
   - Spacing values
   - Design rules list
3. If no design-system.json found, suggest `/ds-init`

---

### /ds-audit [file]
Audit a file or page against the design system.

**Usage:**
```
/ds-audit src/pages/Home.tsx
/ds-audit src/components/Hero.tsx
/ds-audit  (audits current file in context)
```

**Workflow:**
1. Read `design-system.json`
2. Read target file
3. Check for violations:
   - **Fonts:** Using fonts not in design system
   - **Colors:** Using colors not in design system palette
   - **Spacing:** Non-standard spacing values (not multiples of base)
   - **Rules:** Check against custom rules (borders, corners, gradients)
4. Report findings:
   ```
   Design System Audit: src/pages/Home.tsx

   ❌ Font violations:
   - Line 45: Using 'Arial' instead of 'DM Sans'

   ❌ Color violations:
   - Line 67: Using '#FF0000' (not in palette)
   - Line 89: Using '#00FF00' (not in palette)

   ❌ Spacing violations:
   - Line 102: marginTop: '15px' (should be multiple of 8px)
   - Line 134: padding: '13px' (should be 16px or 8px)

   ❌ Rule violations:
   - Line 156: borderRadius: '8px' (rules say no rounded corners)
   - Line 178: Using gradient (rules say no gradients)

   ✓ 12 elements follow design system
   ```
5. Ask: "Want me to fix these violations with /ds-normalize?"

---

### /ds-compress [file]
Tighten spacing and remove excess whitespace while maintaining design system.

**Usage:**
```
/ds-compress src/pages/Home.tsx
/ds-compress --aggressive  (more compression)
```

**Workflow:**
1. Read `design-system.json` for spacing values
2. Read target file
3. Identify compression opportunities:
   - Large margins/padding that can be reduced
   - Excessive vertical spacing between sections
   - Whitespace that doesn't serve hierarchy
4. Apply compression:
   - Reduce to nearest design system spacing value
   - Maintain hierarchy (section > card > element spacing)
   - Keep critical breathing room
5. Show diff and ask for confirmation
6. Apply changes with Edit tool

**Example transformations:**
```tsx
// Before
<section style={{ marginBottom: '80px' }}>
  <div style={{ padding: '40px' }}>
    <h2 style={{ marginBottom: '32px' }}>Title</h2>
  </div>
</section>

// After (using 24px section, 16px card spacing)
<section style={{ marginBottom: '48px' }}>
  <div style={{ padding: '24px' }}>
    <h2 style={{ marginBottom: '16px' }}>Title</h2>
  </div>
</section>
```

---

### /ds-normalize [file]
Fix design system violations in a file.

**Usage:**
```
/ds-normalize src/pages/Home.tsx
/ds-normalize src/components/Hero.tsx --strict
```

**Workflow:**
1. Run `/ds-audit` first to identify violations
2. Fix each violation type:

   **Fonts:**
   - Replace non-system fonts with correct design system font
   - Match context (heading vs body vs mono)

   **Colors:**
   - Replace non-palette colors with closest palette color
   - Ask user to confirm color mappings if ambiguous

   **Spacing:**
   - Round to nearest design system spacing value
   - Respect hierarchy (larger spacing for sections)

   **Rules:**
   - Remove rounded corners (except circles)
   - Remove gradients
   - Fix border widths
   - Apply other custom rules

3. Show preview of changes
4. Ask for confirmation
5. Apply with Edit tool
6. Run `/ds-audit` again to verify

---

### /ds-apply [component]
Apply design system to a new component from scratch.

**Usage:**
```
/ds-apply Hero
/ds-apply PricingCard
```

**Workflow:**
1. Read `design-system.json`
2. Ask user about component structure:
   - "What elements does this component have?" (heading, text, button, etc.)
3. Generate component with design system applied:
   - Use system fonts
   - Use palette colors
   - Use system spacing
   - Follow design rules
4. Show generated component
5. Write to file with Write tool

**Example:**
```tsx
// User: /ds-apply FeatureCard

// Agent asks: "What elements should FeatureCard have?"
// User: "Icon, heading, description, link"

// Agent generates (using Emergence design system):
export default function FeatureCard({ icon, heading, description, linkText, linkHref }) {
  return (
    <div style={{
      padding: '24px',
      border: '3px solid #251720',
      background: '#FFFFFF'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: '#00D27F',
        marginBottom: '16px'
      }}>
        {icon}
      </div>

      <h3 style={{
        fontFamily: 'Epilogue',
        fontSize: '24px',
        fontWeight: '700',
        color: '#251720',
        marginBottom: '8px'
      }}>
        {heading}
      </h3>

      <p style={{
        fontFamily: 'DM Sans',
        fontSize: '16px',
        color: '#251720',
        marginBottom: '16px',
        lineHeight: '1.6'
      }}>
        {description}
      </p>

      <a href={linkHref} style={{
        fontFamily: 'DM Sans',
        fontSize: '16px',
        color: '#00D27F',
        textDecoration: 'none',
        fontWeight: '600'
      }}>
        {linkText} →
      </a>
    </div>
  );
}
```

---

## Design System Config Format

**Location:** `design-system.json` in project root

**Structure:**
```json
{
  "name": "Project Name",
  "fonts": {
    "heading": "Font Name",
    "body": "Font Name",
    "mono": "Font Name"
  },
  "colors": {
    "primary": "#00D27F",
    "secondary": "#FFD600",
    "ink": "#251720",
    "background": "#FFFFFF",
    "accent": "#FF5733"
  },
  "spacing": {
    "base": "8px",
    "small": "4px",
    "medium": "16px",
    "large": "24px",
    "section": "48px"
  },
  "typography": {
    "h1": "48px",
    "h2": "36px",
    "h3": "24px",
    "body": "16px",
    "small": "14px"
  },
  "rules": [
    "Always use 3px borders",
    "No rounded corners except circles (50%)",
    "No gradients",
    "Network nodes use primary/secondary colors",
    "Buttons have 3px solid borders"
  ]
}
```

---

## Workflow Examples

### Example 1: New project setup
```
User: /ds-init --from emergence
Agent: Created design-system.json based on Emergence design system.
       Review and edit: design-system.json

User: /ds-rules
Agent: [Shows Emergence design system rules]

User: /ds-apply Hero
Agent: What elements should Hero have?
User: Headline, subheadline, CTA button
Agent: [Generates Hero component with design system applied]
```

### Example 2: Audit existing page
```
User: /ds-audit src/pages/Home.tsx
Agent: Found 8 violations:
       - 3 font violations
       - 2 color violations
       - 3 spacing violations

       Want me to fix with /ds-normalize?

User: yes
Agent: [Shows preview of fixes]
       Apply these changes?

User: yes
Agent: Fixed all violations. Re-running audit...
       ✓ All checks pass!
```

### Example 3: Compress spacing
```
User: This page feels too spacious
Agent: /ds-compress src/pages/About.tsx

       Found compression opportunities:
       - Section margins: 80px → 48px (save 32px)
       - Card padding: 40px → 24px (save 16px)
       - Heading margins: 32px → 16px (save 16px)

       Total vertical height reduction: ~128px

       Apply compression?

User: yes
Agent: [Applies changes]
       Compressed while maintaining design system spacing values.
```

---

## Rules

1. **Always read design-system.json first** - Never assume rules
2. **Ask before making changes** - Show preview, get confirmation
3. **Preserve intent** - Compression shouldn't break hierarchy
4. **Use exact values** - Copy colors, spacing, fonts exactly from config
5. **Report clearly** - Show what was found, what will change
6. **Validate after changes** - Run audit to confirm fixes worked

---

## Color Matching Algorithm

When normalizing colors that don't match the palette:

1. **Exact match:** Use if color is in palette
2. **Semantic match:** Map common patterns
   - Red → primary if primary is red-ish
   - Blue → secondary if secondary is blue-ish
3. **Brightness match:** Pick closest by luminance
4. **Ask user:** If ambiguous, show options

Example:
```
Found color #FF0000 (red) on line 45.
Design system doesn't have this color.

Closest matches:
1. primary (#00D27F) - brand color
2. secondary (#FFD600) - accent color
3. ink (#251720) - text color

Which should I use? Or add #FF0000 to design-system.json?
```

---

## Spacing Normalization

Round to nearest design system value:

```javascript
// Example spacing values from config
const spacing = {
  base: 8,
  small: 4,
  medium: 16,
  large: 24,
  section: 48
};

// Input: marginBottom: '15px'
// Nearest: 16px (medium)
// Output: marginBottom: '16px'

// Input: padding: '13px'
// Nearest: 16px (medium) or 8px (base)
// Choose based on context (card = 16px, small element = 8px)
```

---

## Integration with Other Skills

**Works with:**
- `/variant` - Apply design system to variant exports
- `/page-cro` - Ensure CRO changes follow design system
- `/copywriting` - Generated components use design system

**Future integrations:**
- Figma export → auto-create design-system.json
- Tailwind config sync
- Storybook integration
