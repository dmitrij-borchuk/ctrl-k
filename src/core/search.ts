import type { CommandItem } from '../types';

/**
 * Computes a fuzzy match score between a search query and a target string.
 * Returns -1 if no match is found, or a positive number representing match quality.
 */
export function fuzzyScore(query: string, target: string): number {
  if (!query) return 1;
  if (!target) return -1;

  const q = query.toLowerCase();
  const t = target.toLowerCase();

  // Exact match gets highest score
  if (t === q) return 1000;
  // Prefix match gets very high score
  if (t.startsWith(q)) return 800 - (t.length - q.length);
  // Substring match gets strong score
  const substringIndex = t.indexOf(q);
  if (substringIndex !== -1) {
    const wordBoundary = substringIndex === 0 || /\s|[._\-/]/.test(t[substringIndex - 1]);
    return 600 - substringIndex * 5 + (wordBoundary ? 100 : 0);
  }

  let score = 0;
  let qIdx = 0;
  let prevMatchIdx = -2;
  let consecutive = 0;

  for (let tIdx = 0; tIdx < t.length; tIdx++) {
    if (t[tIdx] === q[qIdx]) {
      // Base match points
      score += 10;

      // Consecutive match bonus
      if (tIdx === prevMatchIdx + 1) {
        consecutive++;
        score += consecutive * 15;
      } else {
        consecutive = 0;
      }

      // Word boundary or camelCase bonus
      const isStartOfWord = tIdx === 0 || /\s|[._\-/]/.test(t[tIdx - 1]);
      const isCamelCase = target[tIdx] !== target[tIdx].toLowerCase() && (tIdx > 0 && target[tIdx - 1] === target[tIdx - 1].toLowerCase());
      if (isStartOfWord) {
        score += 50;
      } else if (isCamelCase) {
        score += 35;
      }

      prevMatchIdx = tIdx;
      qIdx++;

      if (qIdx === q.length) {
        // Matched all query characters!
        // Minor penalty for long target strings so more concise matches rank higher
        score -= (t.length - q.length) * 2;
        return Math.max(score, 1);
      }
    }
  }

  return -1; // Not all characters matched in sequence
}

export interface ScoredCommandItem {
  item: CommandItem;
  score: number;
}

/**
 * Filters and ranks command items against a query string.
 */
export function searchCommands(query: string, items: CommandItem[]): CommandItem[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return items;
  }

  const scored: ScoredCommandItem[] = [];

  for (const item of items) {
    if (item.disabled) {
      continue;
    }

    let maxScore = -1;

    // 1. Check label (highest weight: 3x)
    const labelScore = fuzzyScore(trimmed, item.label);
    if (labelScore > 0) {
      maxScore = Math.max(maxScore, labelScore * 3);
    }

    // 2. Check keywords (weight: 2.5x)
    if (item.keywords && item.keywords.length > 0) {
      for (const kw of item.keywords) {
        const kwScore = fuzzyScore(trimmed, kw);
        if (kwScore > 0) {
          maxScore = Math.max(maxScore, kwScore * 2.5);
        }
      }
    }

    // 3. Check description (weight: 1.5x)
    if (item.description) {
      const descScore = fuzzyScore(trimmed, item.description);
      if (descScore > 0) {
        maxScore = Math.max(maxScore, descScore * 1.5);
      }
    }

    // 4. Check group name (weight: 1x)
    if (item.group) {
      const groupScore = fuzzyScore(trimmed, item.group);
      if (groupScore > 0) {
        maxScore = Math.max(maxScore, groupScore);
      }
    }

    if (maxScore > 0) {
      scored.push({ item, score: maxScore });
    }
  }

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  return scored.map((s) => s.item);
}
