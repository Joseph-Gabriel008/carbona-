import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple Tailwind CSS classes or class arrays, resolving conflicts
 * by using the tailwind-merge library logic.
 * 
 * @param inputs - An array of ClassValue inputs that can be strings, objects, arrays, or conditionals.
 * @returns A single consolidated class name string.
 * @example
 * cn('px-2 py-1', 'p-4') // returns 'p-4'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
