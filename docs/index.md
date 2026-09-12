# vanilla-k Documentation

Welcome to the comprehensive documentation for `vanilla-k`.

## Overview

`vanilla-k` is an accessible, zero-dependency, framework-agnostic Command Palette library built in TypeScript. It is designed to provide modern web applications with a fast, spotlight-style command search interface activated via `Ctrl + K` (Windows/Linux) or `Cmd + K` (macOS).

## Table of Contents

- [Architecture & Design](#architecture--design)
- [Installation](#installation)
- [Usage & Lifecycle](#usage--lifecycle)
- [Command Structure](#command-structure)
- [Fuzzy Search Engine](#fuzzy-search-engine)
- [Theming & CSS Variables](#theming--css-variables)
- [Accessibility (a11y)](#accessibility-a11y)
- [Framework Integration (React, Vue, Svelte)](#framework-integration)

---

## Architecture & Design

`vanilla-k` has been built according to the following design principles:

1. **Zero Runtime Dependencies**: The core package relies on standard Web APIs (DOM, CSS Custom Properties, Keyboard Events, WAI-ARIA) and contains no external dependencies.
2. **Platform-Aware Hotkey Handling**: Normalizes modifiers across platforms. On macOS, `mod` maps to `metaKey` (⌘), while on Windows and Linux it maps to `ctrlKey`. It automatically avoids triggering inside input fields (`<input>`, `<textarea>`, `[contenteditable]`) unless explicitly instructed.
3. **Multi-Attribute Fuzzy Matching**: Queries are evaluated sequentially with weighted scoring bonuses for word boundaries, camelCase transitions, exact prefix matches, and keywords.
4. **Accessible Combobox Pattern**: Built in accordance with W3C WAI-ARIA combobox patterns with `role="dialog"`, `aria-modal="true"`, focus trapping, and `aria-activedescendant` cursor tracking.

---

## Installation

```bash
npm install vanilla-k
```

Or via CDN:

```html
<script src="https://unpkg.com/vanilla-k/dist/vanilla-k.min.js"></script>
```

---

## Usage & Lifecycle

### Instantiation

```typescript
import { VanillaK } from 'vanilla-k';

const palette = new VanillaK({
  placeholder: 'Type a command or search...',
  hotkey: ['ctrl+k', 'meta+k'],
  theme: 'auto',
  items: [
    {
      id: 'reload',
      label: 'Reload Application',
      handler: () => window.location.reload(),
    },
  ],
});
```

### Lifecycle Methods

- `open()`: Displays the palette, focuses the search input, locks background scrolling, and sets up focus trapping.
- `close()`: Hides the palette, releases the focus trap, unlocks background scrolling, and returns focus to the previously active element.
- `toggle()`: Flips the open/closed state.
- `destroy()`: Removes DOM nodes, detaches hotkey event listeners, and clears registered commands.

---

## Command Structure

Each command conforms to the `CommandItem` interface:

```typescript
interface CommandItem {
  id: string;
  label: string;
  description?: string;
  group?: string;
  icon?: string | HTMLElement;
  shortcut?: string[];
  keywords?: string[];
  handler?: (item: CommandItem) => void | Promise<void>;
  href?: string;
  target?: string;
  disabled?: boolean;
  data?: Record<string, unknown>;
}
```

---

## Fuzzy Search Engine

The built-in search engine searches across multiple item attributes:
- **`label`**: Weight 3.0x
- **`keywords`**: Weight 2.5x
- **`description`**: Weight 1.5x
- **`group`**: Weight 1.0x

When an item is matched, bonuses are granted for:
- Exact string equality (+1000 points)
- Starting at index 0 (+800 points)
- Word boundaries / separators (+50 points per match)
- Consecutive matching characters (+15 points per sequential character)

### Async / Remote Search

To connect to a backend API or database, provide an `onSearch` handler:

```typescript
const palette = new VanillaK({
  onSearch: async (query) => {
    if (!query) return [];
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.items.map((i: any) => ({
      id: i.id,
      label: i.title,
      description: i.subtitle,
      handler: () => navigateTo(i.url),
    }));
  },
});
```

---

## Theming & CSS Variables

`vanilla-k` provides standard CSS custom properties for effortless theme integration:

| Variable | Default (Light) | Default (Dark) | Description |
| :--- | :--- | :--- | :--- |
| `--ctrlk-font` | system font stack | system font stack | Font family for all dialog elements. |
| `--ctrlk-bg` | `#ffffff` | `#1e293b` | Palette dialog card background. |
| `--ctrlk-text` | `#0f172a` | `#f8fafc` | Primary text color. |
| `--ctrlk-text-muted` | `#64748b` | `#94a3b8` | Subtitle / description / icon color. |
| `--ctrlk-accent` | `#3b82f6` | `#60a5fa` | Active icon / highlight color. |
| `--ctrlk-item-hover` | `#f1f5f9` | `#334155` | Background color for hovered / selected item. |
| `--ctrlk-card-border`| `rgba(226, 232, 240, 0.8)` | `rgba(51, 65, 85, 0.8)` | Card and separator border color. |
| `--ctrlk-radius` | `14px` | `14px` | Border radius for main dialog. |
| `--ctrlk-kbd-bg` | `#f8fafc` | `#0f172a` | Background for shortcut key badges. |

To toggle themes dynamically:
```javascript
palette.setTheme('dark');  // 'dark', 'light', or 'auto'
```
