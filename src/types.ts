export interface CommandItem {
  /** Unique identifier for the command */
  id: string;
  /** Display title/label */
  label: string;
  /** Optional subtitle or description */
  description?: string;
  /** Group/category name (e.g. 'Navigation', 'Actions') */
  group?: string;
  /** Icon representation: emoji, SVG markup string, or HTMLElement */
  icon?: string | HTMLElement;
  /** Visual shortcut keys to display (e.g. ['Ctrl', 'S'] or ['G', 'H']) */
  shortcut?: string[];
  /** Extra keywords to match against during search */
  keywords?: string[];
  /** Callback to execute when selected */
  handler?: (item: CommandItem) => void | Promise<void>;
  /** Optional URL to navigate to when selected */
  href?: string;
  /** Link target if href is provided (e.g. '_blank', '_self') */
  target?: string;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Custom user data attached to the command */
  data?: Record<string, unknown>;
}

export interface GroupConfig {
  /** Display label for the group */
  label: string;
  /** Sorting order (lower numbers appear first) */
  order?: number;
}

export interface VanillaKOptions {
  /** Initial command items */
  items?: CommandItem[];
  /** Configuration for groups (labels and display order) */
  groups?: Record<string, GroupConfig>;
  /** Placeholder text for the search input */
  placeholder?: string;
  /** Text or HTML to display when no results match */
  emptyText?: string;
  /** Shortcut string or array of shortcuts to open the palette (default: ['ctrl+k', 'meta+k']) */
  hotkey?: string | string[];
  /** Whether to trigger the shortcut even when typing inside an input/textarea (default: false) */
  allowInInputs?: boolean;
  /** Color theme ('auto' follows system, 'dark', or 'light') (default: 'auto') */
  theme?: 'auto' | 'dark' | 'light';
  /** Whether to automatically inject the default modern styles into document head (default: true) */
  injectStyles?: boolean;
  /** Whether to close the palette immediately upon selecting an item (default: true) */
  closeOnSelect?: boolean;
  /** Lifecycle hook called when the palette opens */
  onOpen?: () => void;
  /** Lifecycle hook called when the palette closes */
  onClose?: () => void;
  /** Lifecycle hook called when an item is selected */
  onSelect?: (item: CommandItem) => void;
  /** Custom search handler for dynamic or remote results */
  onSearch?: (query: string) => Promise<CommandItem[] | void> | CommandItem[] | void;
}

/** Backwards-compatible alias for VanillaKOptions */
export type CtrlKOptions = VanillaKOptions;

export interface MatchScore {
  score: number;
  indices?: number[];
}
