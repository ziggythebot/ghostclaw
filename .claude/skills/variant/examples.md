# Variant Skill - Implementation Examples

## Example 1: Simple Single Variant Application

### Input: variant-export.json
```json
{
  "projectName": "Marketing Site Refresh",
  "exportDate": "2026-03-16",
  "variants": [
    {
      "id": "v1-value-focused",
      "name": "Value-Focused Hero",
      "components": {
        "headline": {
          "text": "Convert 3x faster with design that drives revenue",
          "fontSize": "56px",
          "fontWeight": "700",
          "lineHeight": "1.1",
          "color": "#1a1a1a"
        },
        "subheadline": {
          "text": "Beautiful websites that convert visitors into customers",
          "fontSize": "24px",
          "fontWeight": "400",
          "lineHeight": "1.5",
          "color": "#666666"
        },
        "cta": {
          "text": "See our case studies",
          "backgroundColor": "#667eea",
          "color": "#ffffff",
          "fontSize": "18px",
          "fontWeight": "600",
          "padding": "16px 32px",
          "borderRadius": "8px"
        }
      },
      "metadata": {
        "focus": "ROI and measurable results",
        "tone": "professional and data-driven",
        "targetAudience": "B2B decision makers"
      }
    }
  ]
}
```

### Existing Component: src/components/Hero.tsx
```tsx
export default function Hero() {
  return (
    <div className="hero-section">
      <h1>Beautiful Design</h1>
      <p>We create stunning websites</p>
      <button>Get Started</button>
    </div>
  );
}
```

### Updated Component: src/components/Hero.tsx
```tsx
export default function Hero() {
  return (
    <div className="hero-section">
      <h1 style={{
        fontSize: '56px',
        fontWeight: '700',
        lineHeight: '1.1',
        color: '#1a1a1a'
      }}>
        Convert 3x faster with design that drives revenue
      </h1>
      <p style={{
        fontSize: '24px',
        fontWeight: '400',
        lineHeight: '1.5',
        color: '#666666'
      }}>
        Beautiful websites that convert visitors into customers
      </p>
      <button style={{
        backgroundColor: '#667eea',
        color: '#ffffff',
        fontSize: '18px',
        fontWeight: '600',
        padding: '16px 32px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer'
      }}>
        See our case studies
      </button>
    </div>
  );
}
```

---

## Example 2: Multi-Variant with A/B Testing

### Input: variant-export.json (3 variants)
```json
{
  "projectName": "Hero A/B Test",
  "exportDate": "2026-03-16",
  "variants": [
    {
      "id": "v1-value",
      "name": "Value-Focused",
      "components": {
        "headline": {
          "text": "Convert 3x faster with design that drives revenue",
          "fontSize": "56px",
          "fontWeight": "700"
        },
        "subheadline": {
          "text": "Beautiful websites that convert visitors into customers",
          "fontSize": "24px"
        },
        "cta": {
          "text": "See our case studies",
          "backgroundColor": "#667eea"
        }
      }
    },
    {
      "id": "v2-creative",
      "name": "Story-Driven",
      "components": {
        "headline": {
          "text": "Your brand deserves better than templates",
          "fontSize": "52px",
          "fontWeight": "600"
        },
        "subheadline": {
          "text": "We craft custom experiences that tell your unique story",
          "fontSize": "22px"
        },
        "cta": {
          "text": "Explore our portfolio",
          "backgroundColor": "#f56565"
        }
      }
    },
    {
      "id": "v3-urgency",
      "name": "Urgency-Driven",
      "components": {
        "headline": {
          "text": "Join 500+ companies growing faster with better design",
          "fontSize": "54px",
          "fontWeight": "700"
        },
        "subheadline": {
          "text": "Limited slots available for Q2 projects",
          "fontSize": "24px"
        },
        "cta": {
          "text": "Book a strategy call",
          "backgroundColor": "#48bb78"
        }
      }
    }
  ]
}
```

### Created Component: src/components/HeroVariants.tsx
```tsx
'use client';

import { useEffect, useState } from 'react';

const variants = [
  {
    id: 'v1-value',
    name: 'Value-Focused',
    headline: {
      text: 'Convert 3x faster with design that drives revenue',
      fontSize: '56px',
      fontWeight: '700'
    },
    subheadline: {
      text: 'Beautiful websites that convert visitors into customers',
      fontSize: '24px'
    },
    cta: {
      text: 'See our case studies',
      backgroundColor: '#667eea'
    }
  },
  {
    id: 'v2-creative',
    name: 'Story-Driven',
    headline: {
      text: 'Your brand deserves better than templates',
      fontSize: '52px',
      fontWeight: '600'
    },
    subheadline: {
      text: 'We craft custom experiences that tell your unique story',
      fontSize: '22px'
    },
    cta: {
      text: 'Explore our portfolio',
      backgroundColor: '#f56565'
    }
  },
  {
    id: 'v3-urgency',
    name: 'Urgency-Driven',
    headline: {
      text: 'Join 500+ companies growing faster with better design',
      fontSize: '54px',
      fontWeight: '700'
    },
    subheadline: {
      text: 'Limited slots available for Q2 projects',
      fontSize: '24px'
    },
    cta: {
      text: 'Book a strategy call',
      backgroundColor: '#48bb78'
    }
  }
];

export default function HeroVariants() {
  const [variant, setVariant] = useState(variants[0]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Check if user already has an assigned variant
    const storedVariantId = localStorage.getItem('hero-variant-id');

    if (storedVariantId) {
      const stored = variants.find(v => v.id === storedVariantId);
      if (stored) {
        setVariant(stored);
        return;
      }
    }

    // Assign random variant
    const randomVariant = variants[Math.floor(Math.random() * variants.length)];
    setVariant(randomVariant);
    localStorage.setItem('hero-variant-id', randomVariant.id);

    // Track variant view in Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'variant_view', {
        variant_id: randomVariant.id,
        variant_name: randomVariant.name,
        experiment_name: 'hero_ab_test'
      });
    }
  }, []);

  if (!isClient) {
    // Return first variant for SSR
    return <HeroContent variant={variants[0]} />;
  }

  return <HeroContent variant={variant} />;
}

function HeroContent({ variant }: { variant: typeof variants[0] }) {
  return (
    <div className="hero-section">
      <h1 style={{
        fontSize: variant.headline.fontSize,
        fontWeight: variant.headline.fontWeight
      }}>
        {variant.headline.text}
      </h1>
      <p style={{
        fontSize: variant.subheadline.fontSize
      }}>
        {variant.subheadline.text}
      </p>
      <button style={{
        backgroundColor: variant.cta.backgroundColor,
        color: '#ffffff',
        padding: '16px 32px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        {variant.cta.text}
      </button>
    </div>
  );
}
```

---

## Example 3: HTML Site (Non-React)

### Input: variant-export.json
```json
{
  "variants": [
    {
      "id": "v1",
      "name": "Default",
      "components": {
        "headline": {
          "text": "Transform your business with AI",
          "fontSize": "48px",
          "color": "#000000"
        },
        "cta": {
          "text": "Get started free",
          "backgroundColor": "#0066ff"
        }
      }
    }
  ]
}
```

### Existing: index.html
```html
<!DOCTYPE html>
<html>
<body>
  <div class="hero">
    <h1 id="hero-headline">Welcome to our site</h1>
    <button id="hero-cta">Sign up</button>
  </div>
</body>
</html>
```

### Updated: index.html
```html
<!DOCTYPE html>
<html>
<body>
  <div class="hero">
    <h1 id="hero-headline" style="font-size: 48px; color: #000000;">
      Transform your business with AI
    </h1>
    <button id="hero-cta" style="background-color: #0066ff; color: #ffffff; padding: 16px 32px; border: none; border-radius: 8px; cursor: pointer; font-size: 18px;">
      Get started free
    </button>
  </div>
</body>
</html>
```

---

## Workflow Implementation Steps

### Step 1: Parse JSON and Detect Codebase Type

```typescript
// Read variant JSON
const variantData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// Detect codebase type
const hasReact = glob.sync('**/*.{tsx,jsx}', { ignore: 'node_modules/**' }).length > 0;
const hasHTML = glob.sync('**/*.html', { ignore: 'node_modules/**' }).length > 0;

if (hasReact) {
  applyToReact(variantData);
} else if (hasHTML) {
  applyToHTML(variantData);
}
```

### Step 2: Find Matching Components

```typescript
// For React
const heroFiles = glob.sync('**/Hero*.{tsx,jsx}', { ignore: 'node_modules/**' });

// Or search by content
const filesWithHeadline = await searchFiles('h1', '*.tsx');
```

### Step 3: Ask User for Confirmation

```typescript
if (variantData.variants.length > 1) {
  const answer = await askUser(
    "Found 3 variants. How should I apply them?",
    [
      { label: "Apply first variant only", value: "single" },
      { label: "Add A/B testing with all variants", value: "ab-test" }
    ]
  );
}
```

### Step 4: Apply Changes

Single variant:
- Use Edit tool to update component inline styles
- Preserve existing structure
- Only change text and styles from variant

A/B testing:
- Create new `*Variants.tsx` component
- Import variants data directly
- Add localStorage persistence
- Add GA tracking
- Update original component to import new wrapper

### Step 5: Commit and Deploy

```bash
git add .
git commit -m "Apply Variant export: [variant names]"
git push
```

---

## Component Matching Heuristics

### Priority Order:
1. **Exact filename match**: `Hero.tsx`, `HeroSection.tsx`
2. **Structure match**: Component with h1 + p + button structure
3. **Content match**: Text similarity with existing headline
4. **Ask user**: Show list of candidates if multiple matches

### Common Patterns:
- Hero sections: `Hero.tsx`, `HeroSection.tsx`, `Landing.tsx`, `Home.tsx`
- CTAs: `<button>`, `<a className="btn">`, `<Link>`
- Headlines: `<h1>`, `<h2>`, `.headline`, `.title`

---

## Analytics Integration

### Google Analytics 4 Event:
```javascript
gtag('event', 'variant_view', {
  variant_id: 'v1-value',
  variant_name: 'Value-Focused',
  experiment_name: 'hero_ab_test'
});
```

### Conversion Tracking:
```javascript
// On CTA click
gtag('event', 'conversion', {
  variant_id: localStorage.getItem('hero-variant-id'),
  experiment_name: 'hero_ab_test'
});
```

---

## Edge Cases

### Multiple Component Types in One Export
If variant JSON contains both `hero` and `pricing` components:
- Ask user which component to apply
- Or apply all at once if structure is clear

### Tailwind CSS Projects
Convert inline styles to Tailwind classes:
```tsx
// Instead of inline styles
style={{ fontSize: '56px', fontWeight: '700' }}

// Convert to Tailwind (if user confirms)
className="text-5xl font-bold"
```

### TypeScript Strict Mode
Add proper types to variants:
```tsx
interface VariantData {
  id: string;
  name: string;
  headline: {
    text: string;
    fontSize: string;
    fontWeight: string;
  };
  // ...
}
```
