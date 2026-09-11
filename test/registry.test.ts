import { describe, it, expect } from 'vitest';
import { CommandRegistry } from '../src/core/registry';
import type { CommandItem } from '../src/types';

describe('CommandRegistry', () => {
  it('registers and retrieves items', () => {
    const registry = new CommandRegistry();
    const item: CommandItem = { id: 'save', label: 'Save File' };

    registry.register(item);
    expect(registry.getItem('save')).toEqual(item);
    expect(registry.getAll()).toHaveLength(1);
  });

  it('unregisters items by id', () => {
    const registry = new CommandRegistry();
    registry.register({ id: 'save', label: 'Save File' });

    expect(registry.unregister('save')).toBe(true);
    expect(registry.getItem('save')).toBeUndefined();
    expect(registry.getAll()).toHaveLength(0);
  });

  it('replaces all items with setItems', () => {
    const registry = new CommandRegistry([{ id: 'a', label: 'A' }]);
    registry.setItems([{ id: 'b', label: 'B' }, { id: 'c', label: 'C' }]);

    expect(registry.getAll()).toHaveLength(2);
    expect(registry.getItem('a')).toBeUndefined();
    expect(registry.getItem('b')).toBeDefined();
  });

  it('groups items and respects configured group order', () => {
    const registry = new CommandRegistry([], {
      actions: { label: 'Quick Actions', order: 1 },
      nav: { label: 'Navigation', order: 0 },
    });

    registry.register([
      { id: '1', label: 'Action 1', group: 'actions' },
      { id: '2', label: 'Home', group: 'nav' },
      { id: '3', label: 'General' },
    ]);

    const grouped = registry.groupItems(registry.getAll());
    expect(grouped).toHaveLength(3);
    // order 0 (nav) first, then order 1 (actions), then order 9999 (default)
    expect(grouped[0].key).toBe('nav');
    expect(grouped[1].key).toBe('actions');
    expect(grouped[2].key).toBe('__default__');
  });
});
