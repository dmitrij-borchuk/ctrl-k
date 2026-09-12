import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { VanillaK, CtrlK, createVanillaK, createCtrlK } from '../src/index';
import type { CommandItem } from '../src/types';

describe('VanillaK palette integration', () => {
  let vk: VanillaK;

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    if (vk) {
      vk.destroy();
    }
  });

  it('exposes CtrlK and createCtrlK as backwards-compatible aliases', () => {
    expect(CtrlK).toBe(VanillaK);
    expect(createCtrlK).toBe(createVanillaK);
    const instance = createCtrlK();
    expect(instance).toBeInstanceOf(VanillaK);
    instance.destroy();
  });

  it('initializes and mounts overlay in closed state', () => {
    vk = new VanillaK();
    const overlay = document.querySelector('.ctrlk-overlay');
    expect(overlay).not.toBeNull();
    expect(overlay?.getAttribute('data-state')).toBe('closed');
    expect(vk.isOpen()).toBe(false);
  });

  it('opens and closes via programmatic API', () => {
    const onOpen = vi.fn();
    const onClose = vi.fn();

    vk = new VanillaK({ onOpen, onClose });
    vk.open();

    const overlay = document.querySelector('.ctrlk-overlay');
    expect(overlay?.getAttribute('data-state')).toBe('open');
    expect(vk.isOpen()).toBe(true);
    expect(onOpen).toHaveBeenCalledTimes(1);

    vk.close();
    expect(overlay?.getAttribute('data-state')).toBe('closed');
    expect(vk.isOpen()).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('opens on hotkey press', () => {
    vk = new VanillaK();

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(event);

    expect(vk.isOpen()).toBe(true);
  });

  it('renders command items and handles item selection', () => {
    const handler = vi.fn();
    const onSelect = vi.fn();
    const items: CommandItem[] = [
      { id: '1', label: 'Item 1', handler },
      { id: '2', label: 'Item 2', shortcut: ['Ctrl', 'S'] },
    ];

    vk = new VanillaK({ items, onSelect });
    vk.open();

    const itemEls = document.querySelectorAll('.ctrlk-item');
    expect(itemEls).toHaveLength(2);

    const firstItem = itemEls[0] as HTMLElement;
    firstItem.click();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(vk.isOpen()).toBe(false); // closes on select by default
  });

  it('navigates with keyboard and executes with Enter', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    const items: CommandItem[] = [
      { id: '1', label: 'First', handler: handler1 },
      { id: '2', label: 'Second', handler: handler2 },
    ];

    vk = new VanillaK({ items });
    vk.open();

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
    vk = new VanillaK();
    vk.open();
    expect(vk.isOpen()).toBe(true);

    const dialog = document.querySelector('.ctrlk-dialog') as HTMLElement;
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(vk.isOpen()).toBe(false);
  });

  it('filters items when typing in search input', () => {
    const items: CommandItem[] = [
      { id: 'save', label: 'Save File' },
      { id: 'open', label: 'Open File' },
    ];

    vk = new VanillaK({ items });
    vk.open();

    const input = document.querySelector('.ctrlk-input') as HTMLInputElement;
    input.value = 'save';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    const visibleItems = document.querySelectorAll('.ctrlk-item');
    expect(visibleItems).toHaveLength(1);
    expect(visibleItems[0].textContent).toContain('Save File');
  });

  it('supports dynamic registration while open', () => {
    vk = new VanillaK({ items: [] });
    vk.open();

    expect(document.querySelectorAll('.ctrlk-item')).toHaveLength(0);

    vk.register({ id: 'dynamic', label: 'Dynamic Action' });
    expect(document.querySelectorAll('.ctrlk-item')).toHaveLength(1);

    vk.unregister('dynamic');
    expect(document.querySelectorAll('.ctrlk-item')).toHaveLength(0);
  });

  it('destroys and cleans up DOM elements', () => {
    vk = new VanillaK();
    expect(document.querySelector('.ctrlk-overlay')).not.toBeNull();

    vk.destroy();
    expect(document.querySelector('.ctrlk-overlay')).toBeNull();
  });
});
