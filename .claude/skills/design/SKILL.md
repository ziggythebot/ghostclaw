# Design Skill

Expert design feedback and UI/UX review based on Impeccable principles. Provides actionable critiques on typography, color, spatial design, motion, interaction patterns, responsive design, and UX writing.

## Two-Layer Approach

This skill uses a two-layer architecture for efficient, high-quality design feedback:

### Layer 1: Anti-Pattern Detection (Fast)
- **Speed:** Seconds, not minutes
- **Cost:** Minimal tokens (~500-1K)
- **Model:** Haiku or fast model
- **Purpose:** Quickly identify common AI design mistakes

The first pass scans for 11 common anti-patterns that frequently appear in AI-generated designs:
1. Bad contrast choices (gray text on colored backgrounds)
2. Cardocalypse (excessive card nesting)
3. Inter everywhere (no typographic variation)
4. Layout templates (repetitive hero metrics)
5. Lazy "cool" design (glassmorphism, neon glows, cyan/magenta)
6. Lazy "impact" design (gradient text, bouncing animations)
7. Massive icons in cards (oversized Lucide icons)
8. Modal abuse (complex features in modals)
9. Purple gradients everywhere
10. Redundant UX writing (triple redundancy)
11. Thick border cards (left border accents on rounded cards)

If anti-patterns are found, the feedback includes:
- What the anti-pattern is
- Why it's problematic
- How to fix it with code examples
- Reference to the full anti-patterns guide

### Layer 2: Deep Design Review (Thorough)
- **Speed:** 30-90 seconds
- **Cost:** Higher tokens (2-5K)
- **Model:** Sonnet or high-capability model
- **Purpose:** Comprehensive design critique across all principles

If no anti-patterns are found (or the user requests it), the skill loads the full reference library and provides detailed feedback on:

1. **Typography:** Font pairing, hierarchy, readability, line height, letter spacing
2. **Color & Contrast:** Palette choices, accessibility, semantic color, gradients
3. **Spatial Design:** Layout, spacing, alignment, white space, density
4. **Motion Design:** Animation purpose, easing, duration, reduced motion
5. **Interaction Design:** Affordances, feedback, error states, progressive disclosure
6. **Responsive Design:** Breakpoints, touch targets, mobile-first thinking
7. **UX Writing:** Clarity, tone, microcopy, error messages

**When to use each layer:**
- Layer 1 only: Quick smoke test, AI-generated designs, early drafts
- Both layers: Production reviews, pre-launch checks, detailed audits
- Layer 2 only: High-quality work that needs expert polish

## Commands

This skill provides 12 commands for different review contexts:

### 1. `/design-page` - Full Page Review
Review an entire page (landing page, dashboard, settings page, etc.) with both layers.

**Usage:**
```
/design-page [url or path]
```

**What it reviews:**
- Overall layout and hierarchy
- Page-level typography and color choices
- Spatial organization and flow
- Responsive behavior
- All anti-patterns

---

### 2. `/design-component` - Component Review
Review a specific component (button, modal, card, form, etc.) with both layers.

**Usage:**
```
/design-component [component name or path]
```

**What it reviews:**
- Component-level design patterns
- Internal hierarchy and spacing
- Interaction states (hover, active, disabled)
- Accessibility
- Component-specific anti-patterns

---

### 3. `/design-quick` - Anti-Pattern Scan Only
Fast check for common AI design mistakes (Layer 1 only).

**Usage:**
```
/design-quick [url or path]
```

**What it does:**
- Scans for all 11 anti-patterns
- Returns concise fixes
- Skips deep design review
- Useful for early drafts or quick validation

---

### 4. `/design-deep` - Expert Review Only
Comprehensive design critique without anti-pattern check (Layer 2 only).

**Usage:**
```
/design-deep [url or path]
```

**What it does:**
- Loads full reference library
- Provides detailed feedback across all 7 principles
- Assumes no anti-patterns (or they've been fixed)
- Best for high-quality work needing expert polish

---

### 5. `/design-typography` - Typography Review
Focus on typographic choices, hierarchy, and readability.

**Usage:**
```
/design-typography [url or path]
```

**What it reviews:**
- Font pairing and variation
- Type scale and hierarchy
- Line height and letter spacing
- Readability and contrast
- Anti-pattern: "Inter everywhere"

---

### 6. `/design-color` - Color & Contrast Review
Focus on color palette, contrast ratios, and accessibility.

**Usage:**
```
/design-color [url or path]
```

**What it reviews:**
- Color palette cohesion
- Contrast ratios (WCAG AA/AAA)
- Semantic color usage
- Gradient quality
- Anti-patterns: bad contrast, purple gradients

---

### 7. `/design-spatial` - Spatial Design Review
Focus on layout, spacing, alignment, and visual hierarchy.

**Usage:**
```
/design-spatial [url or path]
```

**What it reviews:**
- Layout structure and grid usage
- Spacing consistency and rhythm
- White space and density
- Visual hierarchy
- Anti-patterns: cardocalypse, layout templates

---

### 8. `/design-motion` - Motion & Animation Review
Focus on animations, transitions, and micro-interactions.

**Usage:**
```
/design-motion [url or path]
```

**What it reviews:**
- Animation purpose and necessity
- Easing and timing functions
- Duration appropriateness
- Reduced motion support
- Anti-pattern: lazy "impact" design (bouncing animations)

---

### 9. `/design-interaction` - Interaction Design Review
Focus on user interactions, affordances, and feedback.

**Usage:**
```
/design-interaction [url or path]
```

**What it reviews:**
- Interactive affordances (buttons, links, inputs)
- Hover/active/disabled states
- Error states and validation
- Progressive disclosure
- Anti-patterns: modal abuse, massive icons

---

### 10. `/design-responsive` - Responsive Design Review
Focus on mobile/tablet behavior, breakpoints, and touch targets.

**Usage:**
```
/design-responsive [url or path]
```

**What it reviews:**
- Breakpoint strategy
- Touch target sizes (min 44x44px)
- Mobile-first thinking
- Content reflow and hierarchy changes
- Responsive anti-patterns

---

### 11. `/design-ux-writing` - UX Writing Review
Focus on microcopy, tone, labels, and error messages.

**Usage:**
```
/design-ux-writing [url or path]
```

**What it reviews:**
- Clarity and conciseness
- Tone and voice consistency
- Label effectiveness
- Error message quality
- Anti-pattern: redundant UX writing

---

### 12. `/design-anti-patterns` - Anti-Pattern Reference
Show the full anti-pattern guide with code examples.

**Usage:**
```
/design-anti-patterns
```

**What it does:**
- Returns the complete anti-patterns reference
- Shows all 11 patterns with code examples
- Useful for learning what to avoid
- No analysis, just reference

---

## How It Works

### For Full Reviews (`/design-page`, `/design-component`)

1. **Layer 1:** Quick anti-pattern scan (Haiku, <1K tokens)
   - If found: Return anti-pattern feedback with fixes
   - If clean: Proceed to Layer 2

2. **Layer 2:** Deep design review (Sonnet, 2-5K tokens)
   - Load relevant reference docs
   - Analyze against all 7 principles
   - Provide actionable recommendations

### For Focused Reviews (`/design-typography`, `/design-color`, etc.)

1. **Layer 1:** Check relevant anti-patterns only
2. **Layer 2:** Load specific reference doc(s)
3. Return focused feedback on that domain

### For Quick/Deep Commands

- `/design-quick`: Layer 1 only
- `/design-deep`: Layer 2 only

## Output Format

All commands return structured feedback:

### Anti-Pattern Feedback (Layer 1)
```
🚨 Anti-Patterns Detected

## 1. [Anti-Pattern Name]

**Issue:** [What's wrong]
**Impact:** [Why it matters]
**Fix:** [How to fix it]

[Code example before/after]

---

[Additional anti-patterns...]

📚 See full guide: /design-anti-patterns
```

### Design Review (Layer 2)
```
## Typography
[Detailed feedback on font choices, hierarchy, spacing...]

## Color & Contrast
[Detailed feedback on palette, contrast, accessibility...]

## Spatial Design
[Detailed feedback on layout, spacing, alignment...]

[Additional sections based on command...]

## Recommendations
1. [Specific action]
2. [Specific action]
3. [Specific action]
```

## Reference Files

The skill uses these reference documents for Layer 2 reviews:

- `reference/typography.md` - Font pairing, hierarchy, readability
- `reference/color-and-contrast.md` - Color theory, accessibility, gradients
- `reference/spatial-design.md` - Layout, spacing, alignment
- `reference/motion-design.md` - Animation principles, easing, timing
- `reference/interaction-design.md` - Affordances, states, feedback
- `reference/responsive-design.md` - Breakpoints, touch targets, mobile-first
- `reference/ux-writing.md` - Clarity, tone, microcopy

## Anti-Pattern Reference

The skill uses this reference for Layer 1 scans:

- `examples/anti-patterns.md` - 11 common AI design mistakes with code examples

## When to Use This Skill

**Auto-triggers on these phrases:**
- "design feedback"
- "design review"
- "ui review"
- "ux review"
- "design audit"
- "design critique"
- "improve design"
- "design help"
- "ui/ux"
- "design anti-patterns"

**Manual invocation:**
- Use `/design-page` for full page reviews
- Use `/design-quick` for fast validation
- Use `/design-deep` for expert polish
- Use specific commands (`/design-typography`, etc.) for focused feedback
- Use `/design-anti-patterns` to see the full anti-pattern guide

## Best Practices

1. **Start with quick scan:** Use `/design-quick` on early drafts to catch obvious issues
2. **Fix anti-patterns first:** Before requesting deep review, address anti-patterns
3. **Use focused reviews:** If you know the area needs work (e.g., color), use `/design-color`
4. **Iterate:** Design is iterative - run multiple passes as you refine
5. **Combine with browser:** Use `agent-browser` skill to capture screenshots for review

## Examples

**Quick validation:**
```
/design-quick src/pages/landing.tsx
```

**Full page review:**
```
/design-page https://myapp.com/dashboard
```

**Typography-focused:**
```
/design-typography src/components/Hero.tsx
```

**Anti-pattern reference:**
```
/design-anti-patterns
```

**Deep expert review (after fixing anti-patterns):**
```
/design-deep src/pages/pricing.tsx
```

---

## Credits

Based on **Impeccable** by [Paul Bakaus](https://paulbakaus.com/) - a comprehensive design system and principles guide.

Anti-pattern collection curated from real-world AI-generated design analysis.
