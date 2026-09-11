export interface HotkeyOptions {
  allowInInputs?: boolean;
}

export interface ParsedHotkey {
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
  alt: boolean;
  key: string;
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

/**
 * Normalizes a hotkey string like "ctrl+k", "cmd+k", or "meta+k" into a parsed structure.
 */
export function parseHotkey(str: string): ParsedHotkey {
  const parts = str.toLowerCase().split('+').map((p) => p.trim());
  let ctrl = false;
  let meta = false;
  let shift = false;
  let alt = false;
  let key = '';

  for (const part of parts) {
    if (part === 'ctrl' || part === 'control') {
      ctrl = true;
    } else if (part === 'meta' || part === 'cmd' || part === 'command') {
      meta = true;
    } else if (part === 'mod') {
      // 'mod' means Meta (Cmd) on Mac, Ctrl on Windows/Linux
      if (isMac) {
        meta = true;
      } else {
        ctrl = true;
      }
    } else if (part === 'shift') {
      shift = true;
    } else if (part === 'alt' || part === 'opt' || part === 'option') {
      alt = true;
    } else {
      key = part;
    }
  }

  return { ctrl, meta, shift, alt, key };
}

/**
 * Checks whether an event matches a parsed hotkey.
 */
export function matchesHotkey(event: KeyboardEvent, hotkey: ParsedHotkey): boolean {
  // If hotkey requires ctrl, check event.ctrlKey
  // For cross-platform ease, if hotkey is 'ctrl+k' on Mac without explicit 'meta', we check ctrlKey.
  if (hotkey.ctrl !== event.ctrlKey) return false;
  if (hotkey.meta !== event.metaKey) return false;
  if (hotkey.shift !== event.shiftKey) return false;
  if (hotkey.alt !== event.altKey) return false;

  const eventKey = event.key.toLowerCase();
  return eventKey === hotkey.key;
}

/**
 * Determines whether the active target element is an input, textarea, or editable element.
 */
export function isInputElement(element: EventTarget | null): boolean {
  if (!element || !(element instanceof HTMLElement)) return false;
  const tagName = element.tagName;
  return (
    tagName === 'INPUT' ||
    tagName === 'TEXTAREA' ||
    tagName === 'SELECT' ||
    element.isContentEditable
  );
}

/**
 * Binds hotkey listeners to the window/document.
 */
export function bindHotkeys(
  hotkeys: string | string[],
  callback: (event: KeyboardEvent) => void,
  options: HotkeyOptions = {}
): () => void {
  const list = Array.isArray(hotkeys) ? hotkeys : [hotkeys];
  const parsedList = list.map(parseHotkey);

  const handler = (event: KeyboardEvent) => {
    if (!options.allowInInputs && isInputElement(event.target)) {
      return;
    }

    // Also support default Ctrl+K / Cmd+K behavior intuitively:
    // If either parsed match hits, trigger callback.
    const isMatch = parsedList.some((parsed) => matchesHotkey(event, parsed));

    if (isMatch) {
      event.preventDefault();
      callback(event);
    }
  };

  window.addEventListener('keydown', handler, true);

  return () => {
    window.removeEventListener('keydown', handler, true);
  };
}
