/**
 * @file writeups.ts
 * @description Shared helpers for the Writeups collection.
 * Used by the Home section, the archive page and the individual post template (EN & ES).
 */

import { getCollection } from 'astro:content';

/**
 * Fetches all writeups sorted by date (newest first).
 */
export async function getSortedWriteups() {
  const writeups = await getCollection('writeups');
  return writeups.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/**
 * Formats a date as "YYYY-MM-DD".
 */
export function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

/**
 * Returns the Tailwind color class mapped to each CTF difficulty.
 */
export function getDifficultyColor(diff: string) {
  switch (diff) {
    case 'Easy': return 'text-green-500';
    case 'Medium': return 'text-yellow-500';
    case 'Hard': return 'text-red-500';
    case 'Insane': return 'text-purple-500';
    default: return 'text-gray-500';
  }
}
