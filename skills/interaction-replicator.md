---
name: interaction-replicator
description: "Interaction Replicator — reproduces website interactions, animations, transitions, and client-side behaviors with pixel-perfect fidelity. Use this skill whenever you need to: replicate click behaviors from a website, recreate CSS animations and transitions, clone hover effects and micro-interactions, reproduce scroll-based animations, implement form validation behaviors, recreate navigation transitions, or match the exact interactive feel of an existing website. Also trigger when the user mentions 'clone the interactions', 'copy the animations', 'replicate the behavior', 'match the transitions', 'same hover effects', 'identical animations', or any task where functional parity with an existing website's interactions is the goal. IMPORTANT: When used alongside the website-design-extractor and frontend-designer skills for website cloning, this skill handles the behavioral layer — making the clone feel alive and identical to the original."
---

# Interaction Replicator

You are a frontend interaction engineer. Your job is to analyze a website's interactive behaviors and produce code that replicates them exactly — every hover effect, transition, animation, scroll behavior, and user interaction should feel identical to the original.

## Why this matters

Design extraction captures how a site *looks*. This skill captures how a site *feels*. A pixel-perfect clone that doesn't animate, transition, or respond to user input the same way as the original immediately feels wrong. The interactive layer is what makes a clone convincing.

## Step-by-Step Process

### 1. Catalog All Interactions

Visit the target site and systematically document every interactive behavior. Work through the page top-to-bottom, interacting with everything:

**Navigation Interactions:**
- Menu open/close animations (hamburger menus, dropdowns)
- Page transition effects (fade, slide, none)
- Active link indicators (how they animate in)
- Sticky/fixed header behavior on scroll
- Scroll-to-section smooth scrolling

**Hover & Focus States:**
- Button hover effects (color change, shadow, scale, underline)
- Card hover effects (lift, shadow, border change, image zoom)
- Link hover effects (underline animation, color transition)
- Input focus effects (border, shadow, label animation)
- Image hover effects (zoom, overlay, caption reveal)

**Click & Tap Behaviors:**
- Button click feedback (ripple, scale-down, color flash)
- Accordion/collapse open-close animations
- Tab switching transitions
- Modal open/close animations (fade, slide-up, scale)
- Dropdown open/close
- Toggle switches
- Tooltip show/hide

**Scroll-Based Behaviors:**
- Elements fading/sliding in on scroll (intersection observer patterns)
- Parallax effects
- Progress indicators (reading progress, scroll progress)
- Lazy loading images (fade-in on load)
- Infinite scroll or load-more patterns
- Back-to-top button appearance

**Form Behaviors:**
- Real-time validation (when does it trigger — on blur, on change, on submit?)
- Error message appearance animation
- Success state transitions
- Loading/submitting states
- Auto-complete dropdown behavior

**Page-Level Behaviors:**
- Loading screen/skeleton screens
- Dark mode toggle transition
- Notification/toast animations
- Cookie banner behavior

### 2. Extract Timing & Easing Values

For each interaction, extract the precise CSS transition/animation properties using the browser's DevTools:

```javascript
// Run this on interactive elements to capture transition properties
const interactiveElements = document.querySelectorAll(
  'button, a, .card, [class*="hover"], [class*="animate"], [class*="transition"]'
);

interactiveElements.forEach(el => {
  const s = window.getComputedStyle(el);
  if (s.transition !== 'all 0s ease 0s') {
    console.log({
      element: el.tagName + '.' + el.className.split(' ').slice(0, 2).join('.'),
      transition: s.transition,
      transitionDuration: s.transitionDuration,
      transitionTimingFunction: s.transitionTimingFunction,
      transitionProperty: s.transitionProperty,
      animation: s.animation,
      animationName: s.animationName,
      animationDuration: s.animationDuration,
      animationTimingFunction: s.animationTimingFunction,
      transform: s.transform,
      willChange: s.willChange,
    });
  }
});
```

Also check for `@keyframes` definitions:

```javascript
// Extract all keyframe animations
Array.from(document.styleSheets).forEach(sheet => {
  try {
    Array.from(sheet.cssRules).forEach(rule => {
      if (rule instanceof CSSKeyframesRule) {
        console.log(`@keyframes ${rule.name}:`, rule.cssText);
      }
    });
  } catch(e) { /* cross-origin sheets */ }
});
```

### 3. Identify JavaScript-Driven Interactions

Some interactions are CSS-only, others need JavaScript. Determine which:

**CSS-only patterns** (prefer these when possible):
- Hover color/shadow changes → `transition` property
- Accordion with checkbox/details → `max-height` transition
- Smooth scroll → `scroll-behavior: smooth`
- Fade-in on hover → `opacity` transition

**JavaScript-required patterns:**
- Scroll-triggered animations → Intersection Observer API
- Staggered list animations → JS delay calculation
- Complex state machines (multi-step forms, wizards)
- Drag and drop
- Parallax effects
- Animated counters/numbers

### 4. Generate Implementation Code

Produce the interaction code organized by type. Use these modern patterns:

#### CSS Transitions & Animations

```typescript
// styles/animations.ts — Reusable animation constants
export const transitions = {
  // Match the exact values extracted from the target site
  default: 'all 0.2s ease',
  slow: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  spring: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
} as const;

export const keyframes = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,
  slideInRight: `
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(30px); }
      to { opacity: 1; transform: translateX(0); }
    }
  `,
  // Add all keyframes found on the target site
};
```

#### Scroll-Triggered Animations (React Hook)

```typescript
// hooks/useScrollAnimation.ts
'use client';
import { useEffect, useRef, useState } from 'react';

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollAnimation({
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  triggerOnce = true,
}: ScrollAnimationOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) observer.unobserve(element);
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}
```

#### Staggered List Animation

```typescript
// components/AnimatedList.tsx
'use client';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Box } from '@mui/material';

interface AnimatedListProps {
  children: React.ReactNode[];
  staggerDelay?: number; // ms between each item
  animation?: 'fadeUp' | 'fadeIn' | 'slideRight';
}

export function AnimatedList({
  children,
  staggerDelay = 100,
  animation = 'fadeUp',
}: AnimatedListProps) {
  const { ref, isVisible } = useScrollAnimation();

  const getAnimationStyle = (index: number) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'none' : getInitialTransform(animation),
    transition: `opacity 0.5s ease ${index * staggerDelay}ms, transform 0.5s ease ${index * staggerDelay}ms`,
  });

  return (
    <Box ref={ref}>
      {children.map((child, index) => (
        <Box key={index} sx={getAnimationStyle(index)}>
          {child}
        </Box>
      ))}
    </Box>
  );
}

function getInitialTransform(animation: string): string {
  switch (animation) {
    case 'fadeUp': return 'translateY(30px)';
    case 'slideRight': return 'translateX(-30px)';
    default: return 'none';
  }
}
```

#### MUI Theme Transition Overrides

When working with the frontend-designer skill's MUI setup, inject transitions into the theme:

```typescript
// Add to lib/theme/theme.ts
components: {
  MuiButton: {
    styleOverrides: {
      root: {
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        transition: 'box-shadow 0.2s ease',
      },
    },
  },
}
```

## Output Format

Produce an **Interaction Report** with this structure:

```
# [Site Name] — Interaction Specification

## 1. Global Transitions
- Default transition: [e.g., "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"]
- Page transitions: [description]
- Easing curve used: [name or cubic-bezier values]

## 2. Component Interactions
### Buttons
- Hover: [exact effect with timing]
- Click: [exact effect]
- Disabled: [behavior]

### Cards
- Hover: [exact effect with timing]

### Navigation
- Mobile menu: [open/close animation]
- Dropdown: [animation]

### [Other components...]

## 3. Scroll Animations
- Pattern: [Intersection Observer / scroll event / library]
- Elements that animate in: [list]
- Animation: [fadeUp / slideIn / etc. with exact timing]
- Stagger: [delay between items]

## 4. Form Interactions
- Validation timing: [on blur / on change / on submit]
- Error animation: [shake / fade-in / etc.]
- Success feedback: [description]

## 5. Implementation Files
[List of all files generated with descriptions]
```

## Integration with Other Skills

This skill works in a pipeline with the other website cloning skills:

1. **website-design-extractor** → extracts colors, fonts, spacing, component styles
2. **interaction-replicator** (this skill) → extracts animations, transitions, behaviors
3. **frontend-designer** → builds the Next.js app using both reports
4. **backend-developer** → builds the API layer

When generating code, produce files that slot directly into the frontend-designer's project structure: hooks go in `src/hooks/`, animation utilities go in `src/lib/animations/`, and MUI theme overrides merge into `src/lib/theme/theme.ts`.

## Key Principles

- **Exact values, not approximations.** Extract the actual `transition-duration`, `transition-timing-function`, and `@keyframes` from the target site. "A smooth hover effect" is useless. "transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)" is useful.

- **CSS first, JS second.** If an interaction can be done with pure CSS transitions/animations, do it that way. It's more performant and simpler. Only reach for JavaScript (Intersection Observer, event listeners) when CSS can't handle it.

- **Performance matters.** Only animate `transform` and `opacity` when possible — these are GPU-accelerated. Avoid animating `width`, `height`, `top`, `left`, `margin`, or `padding` as these trigger layout recalculation.

- **Respect reduced-motion preferences.** Always include a `prefers-reduced-motion` media query that disables or simplifies animations for users who have this accessibility setting enabled.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
