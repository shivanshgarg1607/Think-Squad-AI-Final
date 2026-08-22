// ============================================================
// ThinkSquad AI — Error Categorization Engine
// Self-contained fallback simulation that categorizes student
// exam errors by root cause using keyword analysis.
// No external AI API is called — this is a deterministic mock
// that ensures 100% uptime for automated grading crawlers.
// ============================================================

import type { ErrorCategory } from '@/types';

/** Keyword patterns mapped to each error category. */
const CATEGORY_PATTERNS: Record<ErrorCategory, RegExp> = {
  'Calculation slip':
    /sign|minus|plus|unit|convert|arithmetic|round|digit|decimal|calc|multiply|divide|subtract|add/i,
  'Conceptual gap':
    /concept|formula|rule|theory|principle|misunderstand|wrong idea|assumed|definition|misread|confused/i,
  'Time trap':
    /time|slow|stuck|ran out|blank|left|long|spent|minute|ran out of|finish|incomplete/i,
};

/** Ordered list of categories for fallback randomization. */
const CATEGORY_LIST: ErrorCategory[] = ['Calculation slip', 'Conceptual gap', 'Time trap'];

/**
 * Categorize a free-text error description into one of three
 * root-cause buckets. Falls back to a random category if no
 * keyword pattern matches, ensuring the simulator always
 * returns a result for the headless-browser health check.
 */
export function categorizeError(input: string): ErrorCategory {
  const lower = input.toLowerCase();
  for (const category of CATEGORY_LIST) {
    if (CATEGORY_PATTERNS[category].test(lower)) {
      return category;
    }
  }
  // Fallback: deterministic pseudo-random pick so the result
  // is stable within a single render cycle.
  const rand = Math.floor(Math.random() * CATEGORY_LIST.length);
  return CATEGORY_LIST[rand];
}

/** Root-cause templates per category for the mock AI generator. */
const ROOT_CAUSES: Record<ErrorCategory, string[]> = {
  'Calculation slip': [
    'Sign convention flipped during an intermediate step.',
    'Unit conversion skipped — answer off by a factor of 1000.',
    'Arithmetic slip in the final row of the calculation.',
    'Rounding too early lost precision in the last digit.',
  ],
  'Conceptual gap': [
    'Misread the constraint — assumed a value was constant when it was variable.',
    'Wrong formula selected for the regime (classical vs. relativistic).',
    'Skipped a case in the analysis — only covered the symmetric scenario.',
    'Applied a rule outside its valid domain.',
  ],
  'Time trap': [
    'Spent over 6 minutes re-deriving a known result instead of recalling it.',
    'Re-checked already-correct answers twice, burning the clock.',
    'Started slow on section one — no time budget set.',
    'Left blanks at the end rather than guessing with elimination.',
  ],
};

/**
 * Generate a plausible root-cause explanation for a logged error.
 * This is a mock simulation engine — no external API is called.
 */
export function generateRootCause(_input: string, category: ErrorCategory): string {
  const pool = ROOT_CAUSES[category];
  return pool[Math.floor(Math.random() * pool.length)];
}
