import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple Tailwind CSS classes or class arrays, resolving styles
 * dynamically to avoid tailwind conflicts (e.g. padding overlaps) by merging
 * them through tailwind-merge logic.
 * 
 * WHY COMBINED:
 * - clsx: Handles conditional class names, objects, arrays, and undefined values cleanly.
 * - tailwind-merge: Resolves class conflicts (like `px-4 px-2` -> `px-2`) which clsx alone cannot do because it does not understand Tailwind CSS semantics.
 * 
 * @param inputs - An array of ClassValue inputs that can be strings, objects, arrays, or conditionals.
 * @returns A single consolidated class name string.
 * @example
 * cn('px-2 py-1', 'p-4') // returns 'p-4'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
