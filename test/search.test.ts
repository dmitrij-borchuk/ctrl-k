import { describe, it, expect } from 'vitest';
import { fuzzyScore, searchCommands } from '../src/core/search';
import type { CommandItem } from '../src/types';

describe('fuzzyScore', () => {
  it('returns high score for exact matches', () => {
    const score = fuzzyScore('settings', 'settings');
    expect(score).toBeGreaterThanOrEqual(1000);
  });

  it('scores prefix matches higher than internal matches', () => {
    const prefixScore = fuzzyScore('set', 'settings');
    const internalScore = fuzzyScore('set', 'reset item');
    expect(prefixScore).toBeGreaterThan(internalScore);
  });

  it('returns -1 when query characters do not match in sequence', () => {
    const score = fuzzyScore('xyz', 'settings');
    expect(score).toBe(-1);
  });
});

describe('searchCommands', () => {
  const items: CommandItem[] = [
    { id: '1', label: 'Open Settings', description: 'Configure preferences' },
    { id: '2', label: 'View Documentation', description: 'Read online guides', keywords: ['help', 'manual'] },
    { id: '3', label: 'Create New Project', group: 'Projects' },
    { id: '4', label: 'Disabled Item', disabled: true },
  ];

  it('returns all non-disabled items when query is empty', () => {
    const results = searchCommands('', items);
    expect(results).toHaveLength(4);
  });

  it('filters and ranks items by label', () => {
    const results = searchCommands('sett', items);
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('1');
  });

  it('matches across keywords', () => {
    const results = searchCommands('help', items);
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('2');
  });

  it('matches across description', () => {
    const results = searchCommands('prefer', items);
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('1');
  });

  it('excludes disabled items from search matches', () => {
    const results = searchCommands('Disabled', items);
    expect(results).toHaveLength(0);
  });
});
