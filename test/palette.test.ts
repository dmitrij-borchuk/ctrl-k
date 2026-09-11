import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CtrlK } from '../src/core/palette';
import type { CommandItem } from '../src/types';

describe('CtrlK palette integration', () => {
  let ctrlk: CtrlK;

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    if (ctrlk) {
      ctrlk.destroy();
    }
  });

  it('initializes and mounts overlay in closed state', () => {
    ctrlk = new CtrlK();
    const overlay = document.querySelector('.ctrlk-overlay');
    expect(overlay).not.toBeNull();
    expect(overlay?.getAttribute('data-state')).toBe('closed');
    expect(ctrlk.isOpen()).toBe(false);
  });

  it('opens and closes via programmatic API', () => {
    const onOpen = vi.fn();
    const onClose = vi.fn();

    ctrlk = new CtrlK({ onOpen, onClose });
    ctrlk.open();

    const overlay = document.querySelector('.ctrlk-overlay');
    expect(overlay?.getAttribute('data-state')).toBe('open');
    expect(ctrlk.isOpen()).toBe(true);
    expect(onOpen).toHaveBeenCalledTimes(1);

    ctrlk.close();
    expect(overlay?.getAttribute('data-state')).toBe('closed');
    expect(ctrlk.isOpen()).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('opens on hotkey press', () => {
    ctrlk = new CtrlK();

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(event);

    expect(ctrlk.isOpen()).toBe(true);
  });

  it('renders command items and handles item selection', () => {
    const handler = vi.fn();
    const onSelect = vi.fn();
    const items: CommandItem[] = [
      { id: '1', label: 'Item 1', handler },
      { id: '2', label: 'Item 2', shortcut: ['Ctrl', 'S'] },
    ];

    ctrlk = new CtrlK({ items, onSelect });
    ctrlk.open();

    const itemEls = document.querySelectorAll('.ctrlk-item');
    expect(itemEls).toHaveLength(2);

    const firstItem = itemEls[0] as HTMLElement;
    firstItem.click();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(ctrlk.isOpen()).toBe(false); // closes on select by default
  });

  it('navigates with keyboard and executes with Enter', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    const items: CommandItem[] = [
      { id: '1', label: 'First', handler: handler1 },
      { id: '2', label: 'Second', handler: handler2 },
    ];

    ctrlk = new CtrlK({ items });
    ctrlk.open();

    const dialog = document.querySelector('.ctrlk-dialog') as HTMLElement;

    // Arrow down to move selection to item 2
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

    const selectedItem = document.querySelector('.ctrlk-item[data-selected="true"]');
    expect(selectedItem?.id).toBe('ctrlk-item-2');

    // Press Enter to execute
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape key', () => {
    ctrlk = new CtrlK();
    ctrlk.open();
    expect(ctrlk.isOpen()).toBe(true);

    const dialog = document.querySelector('.ctrlk-dialog') as HTMLElement;
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(ctrlk.isOpen()).toBe(false);
  });

  it('filters items when typing in search input', () => {
    const items: CommandItem[] = [
      { id: 'save', label: 'Save File' },
      { id: 'open', label: 'Open File' },
    ];

    ctrlk = new CtrlK({ items });
    ctrlk.open();

    const input = document.querySelector('.ctrlk-input') as HTMLInputElement;
    input.value = 'save';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    const visibleItems = document.querySelectorAll('.ctrlk-item');
    expect(visibleItems).toHaveLength(1);
    expect(visibleItems[0].textContent).toContain('Save File');
  });

  it('supports dynamic registration while open', () => {
    ctrlk = new CtrlK({ items: [] });
    ctrlk.open();

    expect(document.querySelectorAll('.ctrlk-item')).toHaveLength(0);

    ctrlk.register({ id: 'dynamic', label: 'Dynamic Action' });
    expect(document.querySelectorAll('.ctrlk-item')).toHaveLength(1);

    ctrlk.unregister('dynamic');
    expect(document.querySelectorAll('.ctrlk-item')).toHaveLength(0);
  });

  it('destroys and cleans up DOM elements', () => {
    ctrlk = new CtrlK();
    expect(document.querySelector('.ctrlk-overlay')).not.toBeNull();

    ctrlk.destroy();
    expect(document.querySelector('.ctrlk-overlay')).toBeNull();
  });
});
