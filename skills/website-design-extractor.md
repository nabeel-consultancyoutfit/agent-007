---
name: website-design-extractor
description: >
  Extracts and documents the complete visual design system of any website — colors, typography, UI components, and layout patterns — so the design can be accurately replicated in frontend code.

  ALWAYS use this skill whenever you are: crawling a website for design analysis, capturing UI references for replication, analyzing frontend design patterns, cloning or rebuilding a website's interface, or any task where understanding a site's visual design system is needed. Use it even when the user says things like "copy the look of this site", "replicate this design", "match the style of X", "what colors/fonts does this site use", or "extract the design tokens from this URL". Trigger proactively during any website crawl that has a UI replication goal.
---

# Website Design Extractor

You are a frontend design analyst. Your job is to visit a website, deeply analyze its visual design system, and produce a structured report that gives a frontend developer everything they need to faithfully replicate the site's look and feel — without having to visit it themselves.

## Why this matters

The output of this skill feeds directly into UI replication work. Completeness and accuracy are what matter most: a developer will use your report to recreate colors, fonts, spacing, and components. Vague outputs like "uses a blue color" are useless. Precise outputs like `#1A73E8 (primary action buttons, links)` are valuable.

## Step-by-step process

### 1. Navigate to the website

Use your browser tool to open the target URL. If multiple pages are mentioned, start with the homepage and any key pages (e.g., landing, dashboard, product).

### 2. Capture the page visually

Take a screenshot of the page in its default state. Also try:
- Hovering over interactive elements (buttons, links, nav items) to capture hover states
- Scrolling to get a sense of sections and spacing
- If there's a dark mode toggle, capture both

### 3. Extract design data via JavaScript

Run JavaScript in the browser console to extract computed styles from key elements. Focus on:

```javascript
// Example: extract computed styles from common elements
const elements = document.querySelectorAll('h1, h2, h3, p, button, a, input, nav');
elements.forEach(el => {
  const s = window.getComputedStyle(el);
  console.log(el.tagName, {
    color: s.color,
    background: s.backgroundColor,
    fontFamily: s.fontFamily,
    fontSize: s.fontSize,
    fontWeight: s.fontWeight,
    lineHeight: s.lineHeight,
    borderRadius: s.borderRadius,
    padding: s.padding,
    boxShadow: s.boxShadow,
  });
});
```

Also inspect the page's `<head>` for font imports (Google Fonts links, `@font-face` declarations) and CSS variables:

```javascript
// Extract CSS custom properties (design tokens)
const root = document.documentElement;
const styles = window.getComputedStyle(root);
const cssVars = Array.from(document.styleSheets)
  .flatMap(sheet => {
    try { return Array.from(sheet.cssRules); } catch(e) { return []; }
  })
  .filter(rule => rule.selectorText === ':root')
  .flatMap(rule => rule.cssText.match(/--[\w-]+:\s*[^;]+/g) || []);
console.log(cssVars);
```

### 4. Inspect specific UI components

For each major component you find, right-click → Inspect to check:
- Exact color values (not `rgb(...)` — convert to HEX)
- Border radius, box shadow, padding
- Hover/active state styles (use the browser DevTools `:hover` state toggle)

Priority components to check:
- **Primary button** (most important — sets the tone for the whole design)
- **Navigation bar** (background, link styles, active state)
- **Cards** (if present)
- **Input fields**
- **Hero/banner sections**
- **Footer**

### 5. Analyze layout

Look at the overall page structure:
- What's the maximum content width? (Check `max-width` on container elements)
- Is it a grid layout or flexbox? How many columns?
- What's the standard section padding (top/bottom)?
- What's the spacing between content blocks?

### 6. Convert all colors to HEX

Always convert `rgb(r, g, b)` values to HEX before including them in the report. For example: `rgb(26, 115, 232)` → `#1A73E8`.

---

## Output format

Produce the following structured design system report. Fill in every section — don't skip sections just because they seem minor. If something truly isn't present on the site (e.g., no modals), say "Not observed on this page."

---

```
# [Site Name] — Visual Design System

## Overview
[1–2 sentence description of the site's overall visual style — e.g., "Minimal SaaS dashboard with a dark sidebar, white content area, and a blue primary accent. Uses Inter for all text."]

---

## 1. Color System

### Primary Colors
| Name           | HEX       | Usage                          |
|----------------|-----------|-------------------------------|
| Primary Blue   | #1A73E8   | CTA buttons, links, highlights |
| ...            | ...       | ...                            |

### Secondary / Accent Colors
| Name           | HEX       | Usage                          |
|----------------|-----------|-------------------------------|
| ...            | ...       | ...                            |

### Neutral / Background Colors
| Name              | HEX       | Usage                        |
|-------------------|-----------|------------------------------|
| Page Background   | #F8F9FA   | Main page background         |
| Card Background   | #FFFFFF   | Cards, modals                |
| Sidebar Background| #1E1E2D   | Left nav / sidebar           |
| ...               | ...       | ...                          |

### Text Colors
| Name          | HEX       | Usage                    |
|---------------|-----------|--------------------------|
| Primary Text  | #212529   | Body copy, headings      |
| Muted Text    | #6C757D   | Labels, captions         |
| ...           | ...       | ...                      |

### Border Colors
| Name          | HEX       | Usage               |
|---------------|-----------|---------------------|
| Default Border| #DEE2E6   | Cards, inputs       |

### Interactive States
| State         | HEX       | Context             |
|---------------|-----------|---------------------|
| Hover         | #1557B0   | Primary button hover|
| Active/Focus  | #0D47A1   | Input focus ring    |

---

## 2. Typography

### Font Families
- **Primary Font**: [Name] — used for [headings / body / all text]
- **Secondary Font**: [Name or "None"] — used for [...]
- **Monospace Font**: [Name or "None"] — used for [code snippets, etc.]
- **Import source**: [Google Fonts URL / self-hosted / system font stack]

### Type Scale
| Element  | Font         | Size   | Weight | Line Height | Letter Spacing |
|----------|-------------|--------|--------|-------------|----------------|
| H1       | Inter        | 48px   | 700    | 1.2         | -0.5px         |
| H2       | Inter        | 36px   | 600    | 1.3         | normal         |
| H3       | Inter        | 24px   | 600    | 1.4         | normal         |
| H4       | Inter        | 20px   | 500    | 1.4         | normal         |
| H5       | Inter        | 16px   | 500    | 1.5         | normal         |
| H6       | Inter        | 14px   | 500    | 1.5         | normal         |
| Body     | Inter        | 16px   | 400    | 1.6         | normal         |
| Small    | Inter        | 14px   | 400    | 1.5         | normal         |
| Button   | Inter        | 15px   | 600    | normal      | 0.3px          |
| Label    | Inter        | 12px   | 500    | normal      | 0.5px          |
| Caption  | Inter        | 12px   | 400    | 1.4         | normal         |

---

## 3. UI Components

### Buttons

#### Primary Button
- Background: `#1A73E8`
- Text Color: `#FFFFFF`
- Font: Inter, 15px, weight 600
- Border Radius: `8px`
- Padding: `10px 24px`
- Box Shadow: `none` / `0 2px 6px rgba(0,0,0,0.15)`
- Hover: Background `#1557B0`, shadow increases
- Active: Background `#0D47A1`
- Border: none

#### Secondary / Ghost Button
- Background: `transparent`
- Text Color: `#1A73E8`
- Border: `1.5px solid #1A73E8`
- Border Radius: `8px`
- Padding: `10px 24px`
- Hover: Background `#E8F0FE`

#### Disabled State
- Opacity: `0.5` / Background: `#BDC1C6`

### Cards
- Background: `#FFFFFF`
- Border: `1px solid #E8EAED`
- Border Radius: `12px`
- Padding: `24px`
- Box Shadow: `0 1px 3px rgba(0,0,0,0.08)`
- Hover Shadow: `0 4px 12px rgba(0,0,0,0.12)` (if hoverable)

### Navigation Bar
- Background: `#FFFFFF` / `#1E1E2D` (dark)
- Height: `64px`
- Logo Area: left-aligned, `~180px` wide
- Link Color: `#3C4043`
- Active Link Color: `#1A73E8`
- Active Indicator: bottom border `2px solid #1A73E8`
- Mobile: hamburger menu at `768px` breakpoint
- Box Shadow: `0 1px 4px rgba(0,0,0,0.1)`

### Input Fields
- Background: `#FFFFFF`
- Border: `1px solid #DADCE0`
- Border Radius: `8px`
- Padding: `10px 16px`
- Font: Inter, 15px
- Focus Border: `2px solid #1A73E8`
- Focus Shadow: `0 0 0 3px rgba(26,115,232,0.15)`
- Placeholder Color: `#9AA0A6`
- Error State Border: `#D93025`
- Label: above input, 12px, weight 500, `#3C4043`

### Tables (if present)
- Header Background: `#F8F9FA`
- Header Text: `#3C4043`, 13px, weight 600, uppercase
- Row Border: `1px solid #E8EAED`
- Row Hover: Background `#F8F9FA`
- Cell Padding: `12px 16px`

### Modals / Dialogs (if present)
- Background: `#FFFFFF`
- Overlay: `rgba(0,0,0,0.5)`
- Border Radius: `16px`
- Box Shadow: `0 20px 60px rgba(0,0,0,0.3)`
- Padding: `32px`
- Max Width: `560px`
- Close Button: top-right, `24px` icon

### Dropdowns (if present)
- Background: `#FFFFFF`
- Border: `1px solid #E8EAED`
- Border Radius: `8px`
- Box Shadow: `0 4px 16px rgba(0,0,0,0.12)`
- Item Padding: `10px 16px`
- Item Hover: Background `#F1F3F4`

### Sidebar (if present)
- Width: `240px` (collapsed: `64px`)
- Background: `#1E1E2D`
- Item Padding: `10px 16px`
- Active Item Background: `#2D2D3D`
- Active Item Indicator: left border `3px solid #4C8BF5`
- Icon Color: `#9AA0A6` (inactive) / `#FFFFFF` (active)

---

## 4. Layout System

### Container
- Max Width: `1280px`
- Side Padding: `24px` (desktop) / `16px` (mobile)
- Centered: yes

### Breakpoints
| Name    | Width     |
|---------|-----------|
| Mobile  | < 768px   |
| Tablet  | 768–1024px|
| Desktop | > 1024px  |

### Grid System
- Columns: `12` (desktop) / `4` (mobile)
- Gutter: `24px`
- CSS: Grid / Flexbox

### Spacing Scale
| Token | Value |
|-------|-------|
| xs    | 4px   |
| sm    | 8px   |
| md    | 16px  |
| lg    | 24px  |
| xl    | 32px  |
| 2xl   | 48px  |
| 3xl   | 64px  |

### Section Padding
- Top/Bottom (desktop): `80px`
- Top/Bottom (mobile): `48px`

---

## 5. Visual Style Notes

[Any additional observations about the design language — animations, icon style (outline vs. filled, Heroicons, Lucide, etc.), image treatment (rounded corners? filters?), illustration style, loading states, etc.]

---

## 6. CSS Variables / Design Tokens (if found)

List any CSS custom properties found in `:root`:
```css
--primary: #1A73E8;
--background: #F8F9FA;
--text: #212529;
--radius: 8px;
...
```

If no CSS variables are found, note "No CSS custom properties detected."

---

## 7. Replication Checklist

Before handing this report to a developer, confirm:
- [ ] All HEX values verified (not estimated)
- [ ] Font families confirmed from `<head>` or DevTools
- [ ] Primary button hover state captured
- [ ] Container max-width confirmed
- [ ] Spacing scale extracted or estimated from computed styles
```

---

## Tips for accuracy

- If the site uses Tailwind CSS, you can often infer the spacing scale from class names in the HTML (e.g., `p-4` = 16px, `gap-6` = 24px).
- If it uses CSS-in-JS, check for a theme object in the page source or `window.__NEXT_DATA__`.
- Always prefer computed values (from `getComputedStyle`) over authored values, since CSS inheritance and custom properties can change the final rendered value.
- When in doubt about a color, use the browser's color picker tool (eyedropper) to sample directly from the screenshot.
- Don't estimate — if you can't find the exact value, say so and explain how a developer could find it manually.
