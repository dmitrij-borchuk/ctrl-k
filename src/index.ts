import { CtrlK } from './core/palette';
import type { CtrlKOptions, CommandItem, GroupConfig } from './types';

/**
 * Factory helper function to instantiate a new CtrlK command palette.
 */
export function createCtrlK(options: CtrlKOptions = {}): CtrlK {
  return new CtrlK(options);
}

export { CtrlK };
export default CtrlK;

export type { CtrlKOptions, CommandItem, GroupConfig };
export { fuzzyScore, searchCommands } from './core/search';
export { bindHotkeys, parseHotkey, matchesHotkey } from './core/hotkey';
export { DEFAULT_STYLES, injectDefaultStyles, removeDefaultStyles } from './ui/styles';
