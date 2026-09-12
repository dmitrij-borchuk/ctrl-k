import type { CommandItem, VanillaKOptions } from '../types';
import { CommandRegistry } from './registry';
import { bindHotkeys } from './hotkey';
import { injectDefaultStyles } from '../ui/styles';
import { FocusTrap } from '../ui/focus-trap';
import { createPaletteDOM, renderPaletteList, type DOMElements } from '../ui/dom';

export class VanillaK {
  private options: Required<Omit<VanillaKOptions, 'onOpen' | 'onClose' | 'onSelect' | 'onSearch' | 'groups'>> & {
    onOpen?: () => void;
    onClose?: () => void;
    onSelect?: (item: CommandItem) => void;
    onSearch?: (query: string) => Promise<CommandItem[] | void> | CommandItem[] | void;
  };

  private registry: CommandRegistry;
  private dom: DOMElements | null = null;
  private focusTrap: FocusTrap | null = null;
  private unbindHotkeys: (() => void) | null = null;

  private _isOpen: boolean = false;
  private selectedIndex: number = 0;
  private currentSelectableItems: CommandItem[] = [];
  private searchCounter: number = 0;

  constructor(options: VanillaKOptions = {}) {
    this.options = {
      items: options.items || [],
      placeholder: options.placeholder || 'Type a command or search...',
      emptyText: options.emptyText || 'No results found.',
      hotkey: options.hotkey || ['ctrl+k', 'meta+k'],
      allowInInputs: options.allowInInputs ?? false,
      theme: options.theme || 'auto',
      injectStyles: options.injectStyles ?? true,
      closeOnSelect: options.closeOnSelect ?? true,
      onOpen: options.onOpen,
      onClose: options.onClose,
      onSelect: options.onSelect,
      onSearch: options.onSearch,
    };

    this.registry = new CommandRegistry(this.options.items, options.groups);

    this.init();
  }

  private init(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    if (this.options.injectStyles) {
      injectDefaultStyles();
    }

    this.setupDOM();
    this.setupListeners();
  }

  private setupDOM(): void {
    this.dom = createPaletteDOM({
      placeholder: this.options.placeholder,
      theme: this.options.theme,
    });

    document.body.appendChild(this.dom.overlay);
    this.focusTrap = new FocusTrap(this.dom.overlay);
  }

  private setupListeners(): void {
    if (!this.dom) return;

    // Hotkey listener
    this.unbindHotkeys = bindHotkeys(
      this.options.hotkey,
      () => {
        this.toggle();
      },
      { allowInInputs: this.options.allowInInputs }
    );

    // Backdrop click
    this.dom.overlay.addEventListener('click', (e) => {
      if (e.target === this.dom?.overlay) {
        this.close();
      }
    });

    // Clear button
    this.dom.clearBtn.addEventListener('click', () => {
      if (this.dom) {
        this.dom.input.value = '';
        this.dom.input.focus();
        this.handleSearch('');
      }
    });

    // Search input
    this.dom.input.addEventListener('input', () => {
      const query = this.dom ? this.dom.input.value : '';
      this.handleSearch(query);
    });

    // Keyboard navigation inside input / dialog
    this.dom.dialog.addEventListener('keydown', (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          this.navigate(1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.navigate(-1);
          break;
        case 'Enter':
          e.preventDefault();
          this.executeSelected();
          break;
        case 'Escape':
          e.preventDefault();
          this.close();
          break;
      }
    });
  }

  public open(): void {
    if (this._isOpen || !this.dom) return;

    this._isOpen = true;
    this.dom.overlay.setAttribute('data-state', 'open');
    this.dom.input.value = '';
    this.dom.clearBtn.setAttribute('data-visible', 'false');

    this.updateList(this.registry.getAll());
    this.selectedIndex = 0;
    this.updateSelection();

    this.focusTrap?.activate(this.dom.input);
    this.options.onOpen?.();
  }

  public close(): void {
    if (!this._isOpen || !this.dom) return;

    this._isOpen = false;
    this.dom.overlay.setAttribute('data-state', 'closed');
    this.focusTrap?.deactivate();
    this.options.onClose?.();
  }

  public toggle(): void {
    if (this._isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  public isOpen(): boolean {
    return this._isOpen;
  }

  public register(itemOrItems: CommandItem | CommandItem[]): void {
    this.registry.register(itemOrItems);
    if (this._isOpen && this.dom) {
      this.handleSearch(this.dom.input.value);
    }
  }

  public unregister(id: string): boolean {
    const deleted = this.registry.unregister(id);
    if (deleted && this._isOpen && this.dom) {
      this.handleSearch(this.dom.input.value);
    }
    return deleted;
  }

  public setItems(items: CommandItem[]): void {
    this.registry.setItems(items);
    if (this._isOpen && this.dom) {
      this.handleSearch(this.dom.input.value);
    }
  }

  public getItems(): CommandItem[] {
    return this.registry.getAll();
  }

  public setTheme(theme: 'auto' | 'dark' | 'light'): void {
    this.options.theme = theme;
    if (this.dom) {
      if (theme === 'auto') {
        this.dom.overlay.removeAttribute('data-ctrlk-theme');
      } else {
        this.dom.overlay.setAttribute('data-ctrlk-theme', theme);
      }
    }
  }

  public select(item: CommandItem): void {
    if (item.disabled) return;

    if (this.options.closeOnSelect) {
      this.close();
    }

    this.options.onSelect?.(item);

    if (item.handler) {
      item.handler(item);
    }

    if (item.href) {
      if (item.target === '_blank') {
        window.open(item.href, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = item.href;
      }
    }
  }

  private handleSearch(query: string): void {
    if (!this.dom) return;

    this.dom.clearBtn.setAttribute('data-visible', query.length > 0 ? 'true' : 'false');

    if (this.options.onSearch) {
      const searchId = ++this.searchCounter;
      const result = this.options.onSearch(query);

      if (result instanceof Promise) {
        result.then((asyncItems) => {
          if (searchId === this.searchCounter && Array.isArray(asyncItems)) {
            this.updateList(asyncItems);
          }
        });
        return;
      } else if (Array.isArray(result)) {
        this.updateList(result);
        return;
      }
    }

    const matched = this.registry.search(query);
    this.updateList(matched);
  }

  private updateList(items: CommandItem[]): void {
    if (!this.dom) return;

    const grouped = this.registry.groupItems(items);
    this.currentSelectableItems = renderPaletteList(
      this.dom.listContainer,
      grouped,
      this.selectedIndex,
      this.options.emptyText,
      (item) => this.select(item)
    );

    if (this.selectedIndex >= this.currentSelectableItems.length) {
      this.selectedIndex = Math.max(0, this.currentSelectableItems.length - 1);
    }

    this.updateSelection();
  }

  private navigate(delta: number): void {
    if (this.currentSelectableItems.length === 0) return;

    const count = this.currentSelectableItems.length;
    let nextIndex = this.selectedIndex;

    // Loop until we find a non-disabled item or wrap around completely
    for (let i = 0; i < count; i++) {
      nextIndex = (nextIndex + delta + count) % count;
      if (!this.currentSelectableItems[nextIndex]?.disabled) {
        this.selectedIndex = nextIndex;
        this.updateSelection();
        break;
      }
    }
  }

  private updateSelection(): void {
    if (!this.dom) return;

    const items = this.dom.listContainer.querySelectorAll<HTMLElement>('.ctrlk-item');
    items.forEach((itemEl, idx) => {
      const isSelected = idx === this.selectedIndex;
      itemEl.setAttribute('data-selected', isSelected ? 'true' : 'false');
      itemEl.setAttribute('aria-selected', isSelected ? 'true' : 'false');

      if (isSelected) {
        this.dom?.input.setAttribute('aria-activedescendant', itemEl.id);
        if (typeof itemEl.scrollIntoView === 'function') {
          itemEl.scrollIntoView({ block: 'nearest' });
        }
      }
    });

    if (this.currentSelectableItems.length === 0) {
      this.dom.input.removeAttribute('aria-activedescendant');
    }
  }

  private executeSelected(): void {
    const selectedItem = this.currentSelectableItems[this.selectedIndex];
    if (selectedItem && !selectedItem.disabled) {
      this.select(selectedItem);
    }
  }

  public destroy(): void {
    this.close();

    if (this.unbindHotkeys) {
      this.unbindHotkeys();
      this.unbindHotkeys = null;
    }

    if (this.dom) {
      this.dom.overlay.remove();
      this.dom = null;
    }

    this.registry.clear();
  }
}

export { VanillaK as CtrlK };
