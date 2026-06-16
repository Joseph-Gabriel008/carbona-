import React from 'react';
import { render, screen } from '@testing-library/react';
import BottomNav from '@/components/navigation/BottomNav';
import { usePathname } from 'next/navigation';

// Mock pathnames dynamically
const mockUsePathname = usePathname as jest.Mock;

describe('BottomNav', () => {
  beforeEach(() => {
    mockUsePathname.mockReset();
  });

  test('renders all mobile nav links', () => {
    mockUsePathname.mockReturnValue('/dashboard');
    render(<BottomNav />);

    const homeLink = screen.getByRole('link', { name: /dashboard navigation/i });
    const calcLink = screen.getByRole('link', { name: /calculator navigation/i });
    const coachLink = screen.getByRole('link', { name: /ai coach navigation/i });
    const playLink = screen.getByRole('link', { name: /challenges navigation/i });

    expect(homeLink).toBeInTheDocument(); // Assertion 1
    expect(calcLink).toBeInTheDocument(); // Assertion 2
    expect(coachLink).toBeInTheDocument(); // Assertion 3
    expect(playLink).toBeInTheDocument(); // Assertion 4
  });

  test('active route gets highlighted and receives aria-current="page"', () => {
    mockUsePathname.mockReturnValue('/calculator');
    render(<BottomNav />);

    const calcLink = screen.getByRole('link', { name: /calculator navigation/i });
    expect(calcLink).toHaveAttribute('aria-current', 'page'); // Assertion 5
  });

  test('checks presence of aria-labels on every link', () => {
    mockUsePathname.mockReturnValue('/challenges');
    render(<BottomNav />);

    const homeLink = screen.getByRole('link', { name: /dashboard navigation/i });
    const calcLink = screen.getByRole('link', { name: /calculator navigation/i });
    const coachLink = screen.getByRole('link', { name: /ai coach navigation/i });
    const playLink = screen.getByRole('link', { name: /challenges navigation/i });

    expect(homeLink).toHaveAttribute('aria-label'); // Assertion 6
    expect(calcLink).toHaveAttribute('aria-label'); // Assertion 7
    expect(coachLink).toHaveAttribute('aria-label'); // Assertion 8
    expect(playLink).toHaveAttribute('aria-label'); // Assertion 9
  });
});
