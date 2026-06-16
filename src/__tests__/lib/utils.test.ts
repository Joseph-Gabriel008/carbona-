import { cn } from '@/lib/utils';

describe('utils/cn', () => {
  test('handles single class input', () => {
    expect(cn('flex')).toBe('flex'); // Assertion 1
  });

  test('handles multiple classes and merges them', () => {
    expect(cn('flex', 'items-center', 'justify-between')).toBe('flex items-center justify-between'); // Assertion 2
  });

  test('handles conditional classes properly', () => {
    expect(cn('flex', true && 'items-center', false && 'justify-between')).toBe('flex items-center'); // Assertion 3
    expect(cn('block', null, undefined, 'text-red-500')).toBe('block text-red-500'); // Assertion 4
  });

  test('resolves conflicting tailwind classes by using the latest', () => {
    expect(cn('px-2 py-1', 'p-4')).toBe('p-4'); // Assertion 5
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500'); // Assertion 6
  });

  test('handles empty and structural array inputs', () => {
    expect(cn('')).toBe(''); // Assertion 7
    expect(cn([])).toBe(''); // Assertion 8
    expect(cn({})).toBe(''); // Assertion 9
  });
});
