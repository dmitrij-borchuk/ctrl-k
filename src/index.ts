import { VanillaK, CtrlK } from './core/palette';
import type { VanillaKOptions, CtrlKOptions, CommandItem, GroupConfig } from './types';

/**
 * Factory helper function to instantiate a new VanillaK command palette.
 */
export function createVanillaK(options: VanillaKOptions = {}): VanillaK {
  return new VanillaK(options);
}

/**
 * Backwards compatibility alias for createVanillaK.
 */
export const createCtrlK = createVanillaK;

export { VanillaK, CtrlK };
export default VanillaK;

export type { VanillaKOptions, CtrlKOptions, CommandItem, GroupConfig };
export { fuzzyScore, searchCommands } from './core/search';
export { bindHotkeys, parseHotkey, matchesHotkey } from './core/hotkey';
export { DEFAULT_STYLES, injectDefaultStyles, removeDefaultStyles } from './ui/styles';
