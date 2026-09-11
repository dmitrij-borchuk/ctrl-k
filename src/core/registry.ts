import type { CommandItem, GroupConfig } from '../types';
import { searchCommands } from './search';

export interface GroupedCommands {
  key: string;
  label: string;
  order: number;
  items: CommandItem[];
}

export class CommandRegistry {
  private items: Map<string, CommandItem> = new Map();
  private groupConfigs: Map<string, GroupConfig> = new Map();

  constructor(items?: CommandItem[], groups?: Record<string, GroupConfig>) {
    if (groups) {
      this.setGroupConfigs(groups);
    }
    if (items) {
      this.register(items);
    }
  }

  public setGroupConfigs(groups: Record<string, GroupConfig>): void {
    for (const [key, config] of Object.entries(groups)) {
      this.groupConfigs.set(key, config);
    }
  }

  public register(itemOrItems: CommandItem | CommandItem[]): void {
    const items = Array.isArray(itemOrItems) ? itemOrItems : [itemOrItems];
    for (const item of items) {
      this.items.set(item.id, item);
    }
  }

  public unregister(id: string): boolean {
    return this.items.delete(id);
  }

  public clear(): void {
    this.items.clear();
  }

  public setItems(items: CommandItem[]): void {
    this.clear();
    this.register(items);
  }

  public getItem(id: string): CommandItem | undefined {
    return this.items.get(id);
  }

  public getAll(): CommandItem[] {
    return Array.from(this.items.values());
  }

  public search(query: string): CommandItem[] {
    return searchCommands(query, this.getAll());
  }

  /**
   * Groups command items according to their group field and group configuration ordering.
   */
  public groupItems(items: CommandItem[]): GroupedCommands[] {
    const groupMap = new Map<string, CommandItem[]>();
    const ungroupedKey = '__default__';

    for (const item of items) {
      const groupKey = item.group || ungroupedKey;
      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, []);
      }
      groupMap.get(groupKey)!.push(item);
    }

    const result: GroupedCommands[] = [];

    for (const [key, groupItemList] of groupMap.entries()) {
      if (key === ungroupedKey) {
        result.push({
          key,
          label: '',
          order: 9999, // default to end unless specified
          items: groupItemList,
        });
      } else {
        const config = this.groupConfigs.get(key);
        result.push({
          key,
          label: config?.label || key,
          order: config?.order ?? 0,
          items: groupItemList,
        });
      }
    }

    // Sort groups by configured order, then alphabetically by label
    result.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return a.label.localeCompare(b.label);
    });

    return result;
  }
}
