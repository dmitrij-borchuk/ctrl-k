import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseHotkey, matchesHotkey, bindHotkeys, isInputElement } from '../src/core/hotkey';

describe('hotkey parser & matcher', () => {
  it('parses ctrl+k correctly', () => {
    const parsed = parseHotkey('ctrl+k');
    expect(parsed.ctrl).toBe(true);
    expect(parsed.meta).toBe(false);
    expect(parsed.shift).toBe(false);
    expect(parsed.alt).toBe(false);
    expect(parsed.key).toBe('k');
  });

  it('parses meta+shift+p correctly', () => {
    const parsed = parseHotkey('cmd+shift+p');
    expect(parsed.meta).toBe(true);
    expect(parsed.shift).toBe(true);
    expect(parsed.ctrl).toBe(false);
    expect(parsed.key).toBe('p');
  });

  it('matches keyboard event correctly', () => {
    const parsed = parseHotkey('ctrl+k');
    const matchingEvent = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true });
    const nonMatchingEvent = new KeyboardEvent('keydown', { key: 'k', ctrlKey: false });

    expect(matchesHotkey(matchingEvent, parsed)).toBe(true);
    expect(matchesHotkey(nonMatchingEvent, parsed)).toBe(false);
  });
});

describe('bindHotkeys', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('triggers callback when hotkey is pressed on document', () => {
    const callback = vi.fn();
    const unbind = bindHotkeys('ctrl+k', callback);

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(event);

    expect(callback).toHaveBeenCalledTimes(1);
    unbind();
  });

  it('ignores hotkey when pressed inside an input by default', () => {
    const callback = vi.fn();
    const unbind = bindHotkeys('ctrl+k', callback);

    const input = document.createElement('input');
    container.appendChild(input);

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    input.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();
    unbind();
  });

  it('triggers hotkey inside input when allowInInputs is true', () => {
    const callback = vi.fn();
    const unbind = bindHotkeys('ctrl+k', callback, { allowInInputs: true });

    const input = document.createElement('input');
    container.appendChild(input);

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    input.dispatchEvent(event);

    expect(callback).toHaveBeenCalledTimes(1);
    unbind();
  });

  it('cleans up event listener upon unbind()', () => {
    const callback = vi.fn();
    const unbind = bindHotkeys('ctrl+k', callback);

    unbind();

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();
  });
});
