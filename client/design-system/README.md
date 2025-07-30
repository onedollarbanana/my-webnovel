# Design System Overview

This folder defines global design tokens and base components used across the project.

## Tokens
Tokens are stored in `../src/tokens.css` as CSS custom properties. They cover colors, spacing, typography, radii, and transition durations.

Use tokens instead of hard-coded values in stylesheets and components.

### Example
```css
.button {
  background: var(--color-primary);
  color: var(--color-on-primary);
  border-radius: var(--radius-sm);
  padding: var(--spacing-2) var(--spacing-3);
  transition: background-color var(--transition-base);
}
```

Light and dark themes are handled with `prefers-color-scheme`. Motion is disabled when users prefer reduced motion.

## Component States
Components should provide styles for:

- `:hover`
- `:focus-visible`
- `:active`/pressed
- `:disabled`

Focus rings must remain visible and meet contrast requirements. Transitions should use `var(--transition-fast)` or `var(--transition-base)`.

## Usage
Import `tokens.css` once in your application entry before other styles:
```js
import './tokens.css';
import './style.css';
```

Primitive components such as `Button` and `ProgressBar` reside in `src/components/ui` and consume these tokens.
