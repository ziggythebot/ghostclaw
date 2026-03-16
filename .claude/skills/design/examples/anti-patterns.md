# AI Design Anti-Patterns

Common visual patterns that frequently appear in AI-generated designs and signal low-quality output.

## 1. Bad Contrast Choices

**What it is:** Using gray text on colored backgrounds, gray background labels on colored cards, or absolute black/white with no nuance.

**Why it's bad:** Creates readability issues and looks unprofessional. Real designs use carefully balanced contrast with consideration for accessibility.

**Code example:**
```css
/* WRONG: Gray text on colored background */
.card {
  background: #2563eb; /* Blue */
  color: #555555; /* Dark gray - hard to read */
}

/* WRONG: Gray background label on colored card */
.card-label {
  background: #9ca3af; /* Gray bg */
  color: #4b5563; /* Gray text on gray bg */
}

/* WRONG: Absolute black/white */
.stats {
  background: #000000; /* Absolute black */
  color: #ffffff; /* Pure white - harsh contrast */
}

/* RIGHT: Proper contrast */
.card {
  background: #2563eb;
  color: rgba(255, 255, 255, 0.95); /* Slightly tinted white */
}

.card-label {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}
```

---

## 2. Cardocalypse

**What it is:** Cards within cards within cards - excessive nesting where every element is wrapped in its own container with a background and border.

**Why it's bad:** Creates visual noise and uses space inefficiently. Real interfaces use visual hierarchy without wrapping everything in boxes.

**Code example:**
```html
<!-- WRONG: Excessive card nesting (5+ levels) -->
<div class="page-card">
  <div class="header-card">
    <div class="logo-card">Dashboard</div>
    <div class="nav-card">
      <div class="nav-item-card active">Overview</div>
      <div class="nav-item-card">Analytics</div>
    </div>
  </div>
  <div class="content-card">
    <div class="stats-row-card">
      <div class="stat-card">
        <div class="stat-value-card">2,847</div>
      </div>
    </div>
  </div>
</div>

<!-- RIGHT: Minimal semantic structure -->
<div class="dashboard">
  <header>
    <h1>Dashboard</h1>
    <nav>
      <a href="#" class="active">Overview</a>
      <a href="#">Analytics</a>
    </nav>
  </header>
  <div class="stats">
    <div class="stat">
      <span class="value">2,847</span>
      <span class="label">Users</span>
    </div>
  </div>
</div>
```

---

## 3. Inter Everywhere

**What it is:** Using Inter font for every single text element on the page without any typographic variation.

**Why it's bad:** Creates monotonous, generic designs. Real typography uses hierarchy through font pairing, size, weight, and spacing.

**Code example:**
```css
/* WRONG: Inter for everything */
body {
  font-family: 'Inter', sans-serif;
}

h1, h2, h3, p, button, nav, .badge {
  font-family: 'Inter', sans-serif;
}

/* RIGHT: Thoughtful typography */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

h1 {
  font-family: 'SF Pro Display', -apple-system, sans-serif;
  font-weight: 700;
  letter-spacing: -0.022em;
}

.mono {
  font-family: 'SF Mono', 'Monaco', monospace;
}
```

---

## 4. Layout Templates

**What it is:** Using the exact same layout structure (hero metric, gradient card, etc.) repeatedly with only content changes.

**Why it's bad:** Makes all content look identical regardless of importance. Real designs adapt layout to content hierarchy.

**Code example:**
```html
<!-- WRONG: Same template 5 times -->
<div class="hero-metric">
  <div class="metric-label">Total Revenue</div>
  <div class="metric-value">$2.4M</div>
  <div class="metric-change">↑ +24.5%</div>
</div>

<div class="hero-metric blue">
  <div class="metric-label">Active Users</div>
  <div class="metric-value">48.2K</div>
  <div class="metric-change">↑ +12.3%</div>
</div>

<!-- ...repeated 3 more times with different colors -->

<!-- RIGHT: Hierarchy-driven layout -->
<div class="primary-metric">
  <h2>$2.4M</h2>
  <p>Total Revenue <span class="change">+24.5%</span></p>
</div>

<div class="secondary-metrics">
  <div class="metric-compact">
    <strong>48.2K</strong>
    <span>Users</span>
  </div>
  <!-- ... -->
</div>
```

---

## 5. Lazy "Cool" Design

**What it is:** Overusing glassmorphism, neon glows, monospace fonts, terminal aesthetics, and cyan/magenta color schemes to look "futuristic."

**Why it's bad:** Sacrifices usability for style. Glassmorphism reduces readability, glows are distracting, and the aesthetic feels dated.

**Code example:**
```css
/* WRONG: Excessive "cool" effects */
.nav {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  font-family: 'JetBrains Mono', monospace;
  color: #00ffff;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
}

.btn {
  background: linear-gradient(135deg, #00ffff, #00ccff);
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.4);
}

/* RIGHT: Subtle, purposeful effects */
.nav {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.logo {
  font-weight: 600;
  color: #1a1a1a;
}

.btn {
  background: #0066ff;
}
```

---

## 6. Lazy "Impact" Design

**What it is:** Overusing gradient text, animated sparklines, elastic/bouncing animations, and gradient orbs to create "visual impact."

**Why it's bad:** Overwhelming and distracting. Real impact comes from hierarchy and clarity, not decorative effects.

**Code example:**
```css
/* WRONG: Excessive "impact" effects */
h1 {
  background: linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-shift 5s ease infinite;
}

.metric-change {
  animation: bounce 2s ease-in-out infinite;
}

.btn-primary {
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c026d3 100%);
  box-shadow: 0 0 40px rgba(139, 92, 246, 0.5);
  animation: elastic 2s ease-in-out infinite;
}

/* RIGHT: Intentional, subtle motion */
h1 {
  color: #1a1a1a;
  font-weight: 700;
}

.metric-change.positive {
  color: #10b981;
  transition: transform 0.2s ease;
}

.metric-change.positive:hover {
  transform: translateY(-1px);
}

.btn-primary {
  background: #4f46e5;
  transition: background 0.15s ease;
}
```

---

## 7. Massive Icons in Cards

**What it is:** Oversized left-aligned icons (typically Lucide icons) in colored rounded containers, dominating card layouts.

**Why it's bad:** Icons take up more space than content. Real designs use icons as supporting elements, not primary focus.

**Code example:**
```html
<!-- WRONG: Massive icon containers -->
<div class="feature-card">
  <div class="feature-icon">
    <!-- 80x80px container with 40px icon -->
    <i data-lucide="zap"></i>
  </div>
  <h3>Lightning Fast</h3>
  <p>Built for speed and performance.</p>
</div>

<style>
.feature-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 20px;
  margin-bottom: 20px;
}
</style>

<!-- RIGHT: Appropriately sized icons -->
<div class="feature">
  <svg class="icon" width="20" height="20">
    <!-- Inline SVG or icon -->
  </svg>
  <h3>Lightning Fast</h3>
  <p>Built for speed and performance.</p>
</div>

<style>
.feature .icon {
  width: 20px;
  height: 20px;
  margin-bottom: 8px;
  color: #3b82f6;
}
</style>
```

---

## 8. Modal Abuse

**What it is:** Cramming complex settings, forms, or entire features into modals instead of dedicated pages.

**Why it's bad:** Reduces usability on mobile, limits space for complex interactions, and breaks navigation flow. Real apps use modals sparingly for quick actions.

**Code example:**
```html
<!-- WRONG: Advanced settings in modal (4+ sections, scrollable) -->
<div class="modal">
  <div class="modal-header">
    <h2>Advanced Settings</h2>
  </div>
  <div class="modal-body" style="max-height: 600px; overflow-y: auto;">
    <section>
      <h3>Notifications</h3>
      <!-- 5+ settings -->
    </section>
    <section>
      <h3>Privacy & Security</h3>
      <!-- 5+ settings -->
    </section>
    <section>
      <h3>Data & Export</h3>
      <!-- Settings -->
    </section>
    <section>
      <h3>API Settings</h3>
      <!-- More settings -->
    </section>
  </div>
  <div class="modal-footer">
    <button>Save Changes</button>
  </div>
</div>

<!-- RIGHT: Simple confirmation modal -->
<div class="modal">
  <div class="modal-header">
    <h2>Delete Account?</h2>
  </div>
  <div class="modal-body">
    <p>This action cannot be undone. Your data will be permanently deleted.</p>
  </div>
  <div class="modal-footer">
    <button class="secondary">Cancel</button>
    <button class="danger">Delete</button>
  </div>
</div>
```

**When to use modals:**
- Quick confirmations ("Are you sure?")
- Short forms (3-4 fields max)
- Contextual details that don't need their own page

**When to use a dedicated page:**
- Settings with 3+ sections
- Complex forms (signup, onboarding)
- Anything with tabs or navigation

---

## 9. Purple Gradients Everywhere

**What it is:** Overusing purple/violet gradient backgrounds, text, buttons, and orbs throughout the entire design.

**Why it's bad:** Feels generic and overplayed. Purple gradients became associated with AI/crypto landing pages. Real designs use restrained color palettes.

**Code example:**
```css
/* WRONG: Purple gradients everywhere */
body {
  background: linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #1a0a2e 100%);
}

.logo {
  background: linear-gradient(135deg, #a855f7, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

h1 {
  background: linear-gradient(135deg, #ffffff 0%, #c4b5fd 50%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.btn {
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c026d3 100%);
  box-shadow: 0 0 40px rgba(139, 92, 246, 0.5);
}

.orb {
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  filter: blur(80px);
}

/* RIGHT: Restrained, purposeful color */
body {
  background: #ffffff;
}

.logo {
  color: #1a1a1a;
  font-weight: 600;
}

h1 {
  color: #1a1a1a;
}

.btn-primary {
  background: #4f46e5; /* Single color, not gradient */
}

.accent {
  color: #6366f1; /* Used sparingly */
}
```

---

## 10. Redundant UX Writing

**What it is:** Excessive labels, descriptions, and helper text that repeat the same information in different words.

**Why it's bad:** Increases cognitive load and makes interfaces harder to scan. Real UX writing is concise and adds value.

**Code example:**
```html
<!-- WRONG: Triple redundancy -->
<div class="page-header">
  <h1>Create Your Account</h1>
  <p>Sign up to get started with our platform</p>
</div>

<div class="section">
  <div class="section-header">
    <h2>Create Your Account</h2>
    <p>Fill out the form below to create your new account</p>
  </div>

  <div class="form-group">
    <label>Email Address</label>
    <span class="form-sublabel">Provide a valid email address</span>
    <input type="email" placeholder="example@email.com">
    <span class="form-hint">Your email will be used to send you important notifications via email</span>
  </div>

  <button>Create Account</button>
  <p class="btn-helper">Click the button above to create your account and complete registration</p>
</div>

<!-- RIGHT: Concise, single-source information -->
<div class="page-header">
  <h1>Create Your Account</h1>
</div>

<form>
  <div class="form-group">
    <label>Email</label>
    <input type="email" placeholder="you@example.com">
    <span class="hint">We'll send your confirmation here</span>
  </div>

  <button>Create Account</button>
</form>
```

---

## 11. Thick Border Cards

**What it is:** Adding 3-4px left borders to rounded cards as "accent" colors, creating visual conflict between the sharp border and rounded corners.

**Why it's bad:** The left border doesn't match the card's rounded aesthetic and looks tacked-on. Real designs integrate color meaningfully.

**Code example:**
```css
/* WRONG: Left border accent on rounded card */
.card {
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border-left: 4px solid #3b82f6; /* Doesn't match rounded corners */
}

.card-blue { border-left-color: #3b82f6; }
.card-purple { border-left-color: #a855f7; }
.card-green { border-left-color: #22c55e; }

/* RIGHT: Integrated color accent */
.card {
  border-radius: 16px;
  padding: 28px;
  background: white;
  border: 1px solid #e5e7eb;
}

.card-blue {
  border-top: 3px solid #3b82f6;
}

/* OR: Use color meaningfully in content */
.card .icon {
  color: #3b82f6;
}

.card .badge {
  background: #dbeafe;
  color: #1e40af;
}
```

---

## How to Avoid These Anti-Patterns

1. **Study real products:** Look at Apple, Linear, Stripe, Figma - they don't use these patterns.
2. **Question every effect:** Does this gradient/glow/animation serve the user, or is it just decoration?
3. **Prioritize hierarchy:** Use size, weight, and spacing before reaching for color and effects.
4. **Test readability:** Check contrast ratios and read content in context.
5. **Use restraint:** One accent color, minimal animation, purposeful typography.

Remember: AI tools generate patterns based on training data. These anti-patterns exist because they're common in amateur designs that made it into training sets. Real design requires intentionality.
