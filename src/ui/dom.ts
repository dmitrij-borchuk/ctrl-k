import type { CommandItem, CtrlKOptions } from '../types';
import type { GroupedCommands } from '../core/registry';

export interface DOMElements {
  overlay: HTMLDivElement;
  dialog: HTMLDivElement;
  input: HTMLInputElement;
  clearBtn: HTMLButtonElement;
  listContainer: HTMLDivElement;
}

const SEARCH_ICON_SVG = `
<svg class="ctrlk-search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="11" cy="11" r="8"></circle>
  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
</svg>
`;

const CLEAR_ICON_SVG = `
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="18" y1="6" x2="6" y2="18"></line>
  <line x1="6" y1="6" x2="18" y2="18"></line>
</svg>
`;

export function createPaletteDOM(options: CtrlKOptions): DOMElements {
  const overlay = document.createElement('div');
  overlay.className = 'ctrlk-overlay';
  overlay.setAttribute('data-state', 'closed');
  if (options.theme && options.theme !== 'auto') {
    overlay.setAttribute('data-ctrlk-theme', options.theme);
  }

  const dialog = document.createElement('div');
  dialog.className = 'ctrlk-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-label', 'Command Palette');

  // Header
  const header = document.createElement('div');
  header.className = 'ctrlk-header';
  header.innerHTML = SEARCH_ICON_SVG;

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'ctrlk-input';
  input.placeholder = options.placeholder || 'Type a command or search...';
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-expanded', 'true');
  input.setAttribute('aria-controls', 'ctrlk-listbox');
  input.setAttribute('aria-haspopup', 'listbox');
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('autocorrect', 'off');
  input.setAttribute('spellcheck', 'false');

  const clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.className = 'ctrlk-clear-btn';
  clearBtn.setAttribute('aria-label', 'Clear search query');
  clearBtn.innerHTML = CLEAR_ICON_SVG;

  header.appendChild(input);
  header.appendChild(clearBtn);

  // List container
  const listContainer = document.createElement('div');
  listContainer.className = 'ctrlk-list-container';
  listContainer.id = 'ctrlk-listbox';
  listContainer.setAttribute('role', 'listbox');

  // Footer
  const footer = document.createElement('div');
  footer.className = 'ctrlk-footer';
  footer.innerHTML = `
    <div class="ctrlk-footer-hints">
      <span class="ctrlk-hint"><kbd class="ctrlk-kbd">↑</kbd><kbd class="ctrlk-kbd">↓</kbd> navigate</span>
      <span class="ctrlk-hint"><kbd class="ctrlk-kbd">↵</kbd> select</span>
      <span class="ctrlk-hint"><kbd class="ctrlk-kbd">esc</kbd> close</span>
    </div>
    <span>Ctrl+K</span>
  `;

  dialog.appendChild(header);
  dialog.appendChild(listContainer);
  dialog.appendChild(footer);
  overlay.appendChild(dialog);

  return {
    overlay,
    dialog,
    input,
    clearBtn,
    listContainer,
  };
}

export function renderPaletteList(
  container: HTMLElement,
  groups: GroupedCommands[],
  selectedIndex: number,
  emptyText: string,
  onItemClick: (item: CommandItem) => void
): CommandItem[] {
  container.innerHTML = '';
  const selectableItems: CommandItem[] = [];

  let currentIndex = 0;

  for (const group of groups) {
    if (group.items.length === 0) continue;

    const groupEl = document.createElement('div');
    groupEl.className = 'ctrlk-group';

    if (group.label) {
      const labelEl = document.createElement('div');
      labelEl.className = 'ctrlk-group-label';
      labelEl.textContent = group.label;
      groupEl.appendChild(labelEl);
    }

    for (const item of group.items) {
      selectableItems.push(item);
      const isSelected = currentIndex === selectedIndex;
      const itemIndex = currentIndex;

      const itemEl = document.createElement('div');
      itemEl.className = 'ctrlk-item';
      itemEl.id = `ctrlk-item-${item.id}`;
      itemEl.setAttribute('role', 'option');
      itemEl.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      itemEl.setAttribute('data-selected', isSelected ? 'true' : 'false');
      itemEl.setAttribute('data-disabled', item.disabled ? 'true' : 'false');
      itemEl.setAttribute('data-index', String(itemIndex));

      // Icon
      if (item.icon) {
        const iconEl = document.createElement('div');
        iconEl.className = 'ctrlk-item-icon';
        if (typeof item.icon === 'string') {
          if (item.icon.trim().startsWith('<svg')) {
            iconEl.innerHTML = item.icon;
          } else {
            iconEl.textContent = item.icon;
          }
        } else if (item.icon instanceof HTMLElement) {
          iconEl.appendChild(item.icon.cloneNode(true));
        }
        itemEl.appendChild(iconEl);
      }

      // Content
      const contentEl = document.createElement('div');
      contentEl.className = 'ctrlk-item-content';

      const titleEl = document.createElement('div');
      titleEl.className = 'ctrlk-item-title';
      titleEl.textContent = item.label;
      contentEl.appendChild(titleEl);

      if (item.description) {
        const descEl = document.createElement('div');
        descEl.className = 'ctrlk-item-desc';
        descEl.textContent = item.description;
        contentEl.appendChild(descEl);
      }
      itemEl.appendChild(contentEl);

      // Shortcut
      if (item.shortcut && item.shortcut.length > 0) {
        const shortcutEl = document.createElement('div');
        shortcutEl.className = 'ctrlk-item-shortcut';
        for (const key of item.shortcut) {
          const kbdEl = document.createElement('kbd');
          kbdEl.className = 'ctrlk-kbd';
          kbdEl.textContent = key;
          shortcutEl.appendChild(kbdEl);
        }
        itemEl.appendChild(shortcutEl);
      }

      // Event listener
      itemEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!item.disabled) {
          onItemClick(item);
        }
      });

      groupEl.appendChild(itemEl);
      currentIndex++;
    }

    container.appendChild(groupEl);
  }

  if (selectableItems.length === 0) {
    const emptyEl = document.createElement('div');
    emptyEl.className = 'ctrlk-empty';
    emptyEl.textContent = emptyText || 'No results found.';
    container.appendChild(emptyEl);
  } else {
    // Ensure the selected element is scrolled into view smoothly
    const selectedEl = container.querySelector<HTMLElement>('[data-selected="true"]');
    if (selectedEl && typeof selectedEl.scrollIntoView === 'function') {
      selectedEl.scrollIntoView({ block: 'nearest' });
    }
  }

  return selectableItems;
}
