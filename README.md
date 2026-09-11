# ctrl-k ⚡

[![npm version](https://img.shields.io/npm/v/ctrl-k.svg)](https://www.npmjs.com/package/ctrl-k)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)]()

> A modern, zero-dependency, framework-agnostic **Command Palette** library for web applications. Add an accessible, fast, and beautiful `Ctrl + K` / `Cmd + K` interface to your website in seconds.

---

## ✨ Features

- ⚡ **Zero Runtime Dependencies**: Ultra-lightweight and blazingly fast.
- 🎹 **Cross-Platform Shortcut Listener**: Automatic `Ctrl + K` (Windows/Linux) and `⌘ + K` (macOS), with smart input field detection.
- 🔍 **Instant Fuzzy Search**: Multi-attribute ranking matching labels, descriptions, group names, and keywords.
- 🎨 **Sleek Modern Theme**: Built-in glassmorphic dark and light themes with customizable CSS custom properties.
- ♿ **Accessible by Design**: WAI-ARIA compliant dialog/combobox pattern, focus trapping, scroll locking, and screen-reader friendly.
- 🔄 **Dynamic Registry & Async Search**: Add/remove actions at runtime, or connect to remote server APIs.
- 🌐 **Framework Agnostic**: Works anywhere — Vanilla JS, React, Vue, Svelte, Solid, Astro, Next.js, or plain HTML.

---

## 📦 Installation

Install via npm, pnpm, or yarn:

```bash
npm install ctrl-k
```

Or include directly in HTML via CDN:

```html
<script src="https://unpkg.com/ctrl-k/dist/ctrl-k.min.js"></script>
```

---

## 🚀 Quick Start

### Vanilla JavaScript / TypeScript

```javascript
import { CtrlK } from 'ctrl-k';

const palette = new CtrlK({
  groups: {
    nav: { label: 'Navigation', order: 0 },
    actions: { label: 'Quick Actions', order: 1 },
  },
  items: [
    {
      id: 'home',
      label: 'Home',
      description: 'Go to dashboard',
      group: 'nav',
      icon: '🏠',
      shortcut: ['G', 'H'],
      handler: () => {
        window.location.href = '/';
      },
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'User preferences and profile',
      group: 'nav',
      icon: '⚙️',
      shortcut: ['G', 'S'],
      handler: () => {
        window.location.href = '/settings';
      },
    },
    {
      id: 'new-doc',
      label: 'Create New Document',
      group: 'actions',
      icon: '📄',
      shortcut: ['Ctrl', 'N'],
      handler: () => {
        console.log('Creating new document...');
      },
    },
  ],
});
```

Now press `Ctrl + K` (or `Cmd + K` on macOS) anywhere on the page to launch the palette!

---

### React Example

```tsx
import { useEffect } from 'react';
import { CtrlK } from 'ctrl-k';

export function App() {
  useEffect(() => {
    const palette = new CtrlK({
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          handler: () => alert('Dashboard clicked!'),
        },
      ],
    });

    return () => {
      palette.destroy();
    };
  }, []);

  return <div>Your App Content</div>;
}
```

---

### Vue 3 Example

```vue
<script setup>
import { onMounted, onUnmounted } from 'vue';
import { CtrlK } from 'ctrl-k';

let palette;

onMounted(() => {
  palette = new CtrlK({
    items: [
      {
        id: 'docs',
        label: 'View Docs',
        handler: () => window.open('https://docs.example.com', '_blank'),
      },
    ],
  });
});

onUnmounted(() => {
  palette?.destroy();
});
</script>
```

---

## 📖 API Reference

### `new CtrlK(options?: CtrlKOptions)`

#### Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `items` | `CommandItem[]` | `[]` | Initial command items array. |
| `groups` | `Record<string, GroupConfig>` | `{}` | Group display labels and ordering. |
| `placeholder` | `string` | `'Type a command or search...'` | Input placeholder text. |
| `emptyText` | `string` | `'No results found.'` | Text shown when no items match search query. |
| `hotkey` | `string \| string[]` | `['ctrl+k', 'meta+k']` | Shortcut(s) to toggle the palette. |
| `allowInInputs`| `boolean` | `false` | Whether to trigger shortcut while typing in input elements. |
| `theme` | `'auto' \| 'dark' \| 'light'` | `'auto'` | Palette theme. |
| `injectStyles` | `boolean` | `true` | Injects default modern CSS styles into `<head>`. |
| `closeOnSelect`| `boolean` | `true` | Closes palette upon selecting an item. |
| `onOpen` | `() => void` | `undefined` | Callback fired when palette opens. |
| `onClose` | `() => void` | `undefined` | Callback fired when palette closes. |
| `onSelect` | `(item) => void` | `undefined` | Callback fired when an item is selected. |
| `onSearch` | `(query) => Promise<items> \| items` | `undefined` | Custom or asynchronous remote search handler. |

---

### `CommandItem`

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | **Required**. Unique identifier for the command. |
| `label` | `string` | **Required**. Command display title. |
| `description` | `string` | Optional subtitle / helper description. |
| `group` | `string` | Group ID (e.g. `'nav'`, `'actions'`). |
| `icon` | `string \| HTMLElement` | Emoji string (`'🏠'`), SVG markup string (`'<svg>...'`), or DOM element. |
| `shortcut` | `string[]` | Keyboard shortcut badges displayed in item (e.g. `['Ctrl', 'P']`). |
| `keywords` | `string[]` | Additional keywords to match during fuzzy search. |
| `handler` | `(item) => void \| Promise<void>` | Callback executed when item is selected. |
| `href` | `string` | Link URL to navigate to when item is selected. |
| `target` | `string` | Anchor target (`'_blank'`, `'_self'`). |
| `disabled` | `boolean` | Whether item is disabled (non-selectable). |
| `data` | `Record<string, unknown>` | Custom user metadata attached to item. |

---

### Instance Methods

```typescript
const palette = new CtrlK();

// Open the palette
palette.open();

// Close the palette
palette.close();

// Toggle open/closed state
palette.toggle();

// Check if currently open
palette.isOpen(); // boolean

// Register a single command or an array of commands dynamically
palette.register({
  id: 'export-csv',
  label: 'Export to CSV',
  handler: () => exportData(),
});

// Remove a registered command by ID
palette.unregister('export-csv');

// Replace all registered commands
palette.setItems([...newItems]);

// Switch theme dynamically ('auto' | 'dark' | 'light')
palette.setTheme('dark');

// Clean up DOM elements and event listeners
palette.destroy();
```

---

## 🎨 Customizing Styles

`ctrl-k` automatically injects clean, modern styles with full dark/light theme support. You can customize colors, spacing, and typography by overriding CSS variables:

```css
:root {
  --ctrlk-bg: #1e1e2e;
  --ctrlk-text: #cdd6f4;
  --ctrlk-text-muted: #a6adc8;
  --ctrlk-accent: #cba6f7;
  --ctrlk-item-hover: rgba(255, 255, 255, 0.08);
  --ctrlk-card-border: rgba(255, 255, 255, 0.12);
  --ctrlk-radius: 12px;
  --ctrlk-font: 'Inter', sans-serif;
}
```

If you prefer to supply 100% custom styling from scratch, pass `injectStyles: false`:

```javascript
const palette = new CtrlK({
  injectStyles: false,
});
```

---

## 💻 Development

```bash
# Clone the repository
git clone https://github.com/dmitrij-borchuk/ctrl-k.git
cd ctrl-k

# Install dependencies
npm install

# Start the interactive playground demo
npm run dev

# Run unit and integration tests
npm test

# Build production bundles (ESM, CJS, UMD, and .d.ts types)
npm run build
```

## TODO

- [ ] Check if it is possible to use it on mobile devices
- [ ] Add possibility to override styles
- [ ] Add publish to npm
- [ ] Check focus trap
- [ ] Check silent returns (`return;`), might be we need to add `console.warn()` for debugging purposes

---

## 📄 License

[MIT](LICENSE) © [Dmytro Borchuk](https://github.com/dmitrij-borchuk)
