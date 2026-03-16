# Variant Skill - Agent Implementation Guide

This guide provides step-by-step instructions for agents to implement the /variant skill.

## Overview

The /variant skill takes Variant.com JSON exports and applies them to existing codebases, with optional A/B testing support.

**Key Principle:** STRICT PRESERVATION - Copy all values exactly as they appear in the variant JSON. No rounding, no simplification, no cleanup.

---

## Step-by-Step Workflow

### STEP 1: Get Variant JSON Path

**1a. Check if user provided path:**
```
User: /variant path/to/variant-export.json
```

**1b. If no path provided, check current directory:**
```bash
ls variant-export.json 2>/dev/null || \
ls */variant-export.json 2>/dev/null || \
find . -maxdepth 2 -name "*variant*.json" 2>/dev/null
```

**1c. If not found, ask user:**
```
Send message: "I don't see a variant JSON file. Where is your Variant.com export located?"
```

---

### STEP 2: Read and Validate JSON

```bash
# Read the JSON file
cat path/to/variant-export.json
```

**Expected structure:**
- Must have `variants` array
- Each variant must have `id`, `name`, `components`
- Components should have style properties (fontSize, color, etc.)

**If invalid:**
```
Send message: "The JSON doesn't match the expected Variant format. Here's what I found: [show structure]. Can you check the export?"
```

---

### STEP 3: Detect Codebase Type

Run these searches in parallel:

```bash
# Check for React/Next.js
find . -name "*.tsx" -o -name "*.jsx" | grep -v node_modules | head -5

# Check for HTML
find . -name "*.html" | grep -v node_modules | head -5

# Check for Vue
find . -name "*.vue" | grep -v node_modules | head -5
```

**Decision:**
- If `.tsx/.jsx` found → React workflow
- If `.vue` found → Vue workflow
- If `.html` found → HTML workflow
- If multiple → Ask user which to target

---

### STEP 4: Find Target Component

**For React/Next.js:**

```bash
# Search for Hero components
find . -name "*Hero*.tsx" -o -name "*Hero*.jsx" | grep -v node_modules

# Search for Landing/Home components
find . -name "*Landing*.tsx" -o -name "*Home*.tsx" | grep -v node_modules

# Search for components with h1 + button structure
grep -r "h1.*button" --include="*.tsx" --include="*.jsx" . | grep -v node_modules
```

**For HTML:**

```bash
# Find index.html or main HTML files
find . -name "index.html" -o -name "home.html" | grep -v node_modules
```

**If multiple matches:**
```
Send message: "Found multiple potential components:
1. src/components/Hero.tsx
2. src/pages/Home.tsx
3. src/sections/Landing.tsx

Which should I update?"
```

**If no clear match:**
```
Send message: "I couldn't find a clear match for a hero section. Which file should I update with the variant data?"
```

---

### STEP 5: Decide Single vs A/B Testing

**If only 1 variant in JSON:**
- Apply directly, skip this step

**If 2+ variants in JSON:**

Use AskUserQuestion tool:
```json
{
  "questions": [{
    "question": "I found [N] variants in the export. How should I apply them?",
    "header": "Application",
    "multiSelect": false,
    "options": [
      {
        "label": "Apply first variant only",
        "description": "Update the component with the first variant's values directly"
      },
      {
        "label": "Add A/B testing",
        "description": "Create a variants wrapper with random assignment and analytics tracking"
      }
    ]
  }]
}
```

---

### STEP 6A: Apply Single Variant (Option 1)

**Read the target file:**
```bash
# Use Read tool
Read: src/components/Hero.tsx
```

**Update the component:**

1. Find the headline element (h1, h2, or similar)
2. Find the subheadline (p, subtitle, etc.)
3. Find the CTA button

**Use Edit tool to update each element:**

```tsx
// Example Edit
old_string: "<h1>Old Headline</h1>"

new_string: `<h1 style={{
  fontSize: '56px',
  fontWeight: '700',
  lineHeight: '1.1',
  color: '#1a1a1a'
}}>
  Convert 3x faster with design that drives revenue
</h1>`
```

**CRITICAL RULES:**
- Copy fontSize, fontWeight, color, etc. EXACTLY as they appear in JSON
- Don't convert units (keep '56px' not '3.5rem')
- Don't simplify colors (keep '#1a1a1a' not '#1a1a1a')
- Don't round numbers
- Preserve all CSS properties from variant JSON

---

### STEP 6B: Add A/B Testing Wrapper (Option 2)

**Create new variants component file:**

Determine filename:
- If original is `Hero.tsx` → create `HeroVariants.tsx`
- If original is `Landing.tsx` → create `LandingVariants.tsx`

**Use Write tool to create the wrapper:**

Template structure:
```tsx
'use client'; // Add if Next.js App Router

import { useEffect, useState } from 'react';

const variants = [
  // Paste variant data from JSON EXACTLY as-is
  {
    id: 'v1-value',
    name: 'Value-Focused',
    headline: {
      text: 'Convert 3x faster with design that drives revenue',
      fontSize: '56px',
      fontWeight: '700',
      lineHeight: '1.1',
      color: '#1a1a1a'
    },
    // ... rest of variant data
  },
  // ... other variants
];

export default function HeroVariants() {
  const [variant, setVariant] = useState(variants[0]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Check localStorage for assigned variant
    const storedId = localStorage.getItem('hero-variant-id');
    if (storedId) {
      const stored = variants.find(v => v.id === storedId);
      if (stored) {
        setVariant(stored);
        return;
      }
    }

    // Assign random variant
    const random = variants[Math.floor(Math.random() * variants.length)];
    setVariant(random);
    localStorage.setItem('hero-variant-id', random.id);

    // Google Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'variant_view', {
        variant_id: random.id,
        variant_name: random.name,
        experiment_name: 'hero_ab_test'
      });
    }
  }, []);

  if (!isClient) return <HeroContent variant={variants[0]} />;
  return <HeroContent variant={variant} />;
}

function HeroContent({ variant }) {
  return (
    <div className="hero-section">
      <h1 style={{
        fontSize: variant.headline.fontSize,
        fontWeight: variant.headline.fontWeight,
        lineHeight: variant.headline.lineHeight,
        color: variant.headline.color
      }}>
        {variant.headline.text}
      </h1>
      {/* Add subheadline and CTA similarly */}
    </div>
  );
}
```

**Then update the parent file to use the new wrapper:**

```tsx
// Old
import Hero from './components/Hero';

// New
import HeroVariants from './components/HeroVariants';

// Old
<Hero />

// New
<HeroVariants />
```

---

### STEP 7: Commit and Push

```bash
# Get list of variants for commit message
VARIANT_NAMES="Value-Focused, Story-Driven, Urgency-Driven"

# Stage all changes
git add .

# Commit with descriptive message
git commit -m "Apply Variant export: $VARIANT_NAMES

Updated components:
- src/components/HeroVariants.tsx (A/B testing wrapper)
- src/app/page.tsx (import update)

Variants:
- v1-value: ROI and measurable results
- v2-creative: Story-driven approach
- v3-urgency: Limited availability messaging

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Push to trigger Vercel deployment
git push
```

---

### STEP 8: Verify and Report

**Send message to user:**

```
✓ Applied Variant export with 3 variants

Files updated:
- src/components/HeroVariants.tsx (new A/B testing wrapper)
- src/app/page.tsx (updated import)

Variants:
1. v1-value (Value-Focused) - ROI and measurable results
2. v2-creative (Story-Driven) - Story-driven approach
3. v3-urgency (Urgency-Driven) - Limited availability messaging

Changes committed and pushed to GitHub.
Vercel deployment should start automatically.

Next steps:
→ Check deployment at your Vercel URL
→ Open in browser and check localStorage to see assigned variant
→ Verify each variant looks correct (clear localStorage to get new assignment)
→ Monitor Google Analytics for variant_view events
```

---

## Common Issues & Solutions

### Issue: Can't find component to update

**Solution:**
```
Send message: "I couldn't auto-detect the right component. Can you tell me:
1. Which file should I update? (e.g., src/components/Hero.tsx)
2. What does the current headline text say? (so I can find the right element)"
```

### Issue: Variant JSON has unexpected structure

**Solution:**
```
Send message: "The variant JSON structure is different than expected. Here's what I see:
[show JSON structure]

Can you confirm this is a Variant.com export? Or let me know the structure so I can parse it correctly."
```

### Issue: Project uses Tailwind instead of inline styles

**Solution:**
Ask user:
```
"This project uses Tailwind CSS. Should I:
1. Use inline styles (style={{ fontSize: '56px' }})
2. Convert to Tailwind classes (className='text-5xl')
3. Add to tailwind.config.js and use custom classes"
```

### Issue: TypeScript errors after adding wrapper

**Solution:**
Add proper TypeScript types:
```tsx
interface VariantData {
  id: string;
  name: string;
  headline: {
    text: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    color: string;
  };
  subheadline: {
    text: string;
    fontSize: string;
  };
  cta: {
    text: string;
    backgroundColor: string;
  };
}

const variants: VariantData[] = [
  // ...
];
```

---

## Testing Checklist

Before committing, verify:

- [ ] All variant data copied EXACTLY (no rounding, no simplification)
- [ ] localStorage key is unique (use component name + "-variant-id")
- [ ] Google Analytics event name is descriptive
- [ ] SSR handled (return first variant if !isClient)
- [ ] All style properties from JSON are applied
- [ ] Text content matches exactly
- [ ] No TypeScript errors
- [ ] Original component structure preserved

---

## Analytics Setup

If user wants conversion tracking, add to CTA button:

```tsx
<button
  onClick={() => {
    // Track conversion
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        variant_id: variant.id,
        variant_name: variant.name,
        experiment_name: 'hero_ab_test'
      });
    }

    // Original click handler
    handleCTAClick();
  }}
  style={{ /* styles */ }}
>
  {variant.cta.text}
</button>
```

---

## Edge Cases

### Multiple Component Types in One Export

If variant JSON has `hero`, `pricing`, and `footer` sections:

```
Ask user: "The export contains variants for:
- Hero section
- Pricing section
- Footer section

Which should I apply? (or select multiple)"
```

### Server Components (Next.js App Router)

If target component has no 'use client':
- A/B testing wrapper MUST have 'use client' at top
- Import wrapper into parent component
- Parent can stay server component

### Existing A/B Test

If component already has variant logic:
```
Ask user: "This component already has variant/A/B testing logic. Should I:
1. Replace it with new variants
2. Add new variants to existing test
3. Create a separate component"
```

---

## Success Criteria

The skill is successful when:

1. ✅ All variant data applied exactly as-is (no modifications)
2. ✅ Component renders correctly for all variants
3. ✅ A/B testing persists in localStorage (if applicable)
4. ✅ Google Analytics tracking fires (if applicable)
5. ✅ Changes committed with clear commit message
6. ✅ Pushed to GitHub (triggers Vercel deployment)
7. ✅ User knows how to verify and test

---

## Quick Reference

**Single Variant:**
1. Read variant JSON
2. Find target component
3. Use Edit tool to update headline, subheadline, CTA
4. Copy ALL style properties exactly
5. Commit and push

**A/B Testing:**
1. Read variant JSON
2. Find target component
3. Create [Component]Variants.tsx with wrapper
4. Copy variant data arrays exactly
5. Add localStorage + GA tracking
6. Update parent to import wrapper
7. Commit and push

**Always:**
- Preserve exact values from JSON
- Don't simplify, round, or cleanup
- Show user what was changed
- Provide testing instructions
