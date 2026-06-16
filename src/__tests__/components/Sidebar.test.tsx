import React from 'react';
import { render, screen } from '@testing-library/react';
import Sidebar from '@/components/navigation/Sidebar';
import { usePathname } from 'next/navigation';

const mockUsePathname = usePathname as jest.Mock;

describe('Sidebar', () => {
  beforeEach(() => {
    mockUsePathname.mockReset();
  });

  test('renders all nav links and verifies aria-label presence', () => {
    mockUsePathname.mockReturnValue('/dashboard');
    render(<Sidebar />);

    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    const calculatorLink = screen.getByRole('link', { name: /calculator/i });
    const twinLink = screen.getByRole('link', { name: /carbon twin/i });
    const coachLink = screen.getByRole('link', { name: /ai coach/i });
    const challengesLink = screen.getByRole('link', { name: /challenges/i });
    const learnLink = screen.getByRole('link', { name: /learning hub/i });
    const profileLink = screen.getByRole('link', { name: /my profile/i });

    expect(dashboardLink).toBeInTheDocument(); // Assertion 1
    expect(calculatorLink).toBeInTheDocument(); // Assertion 2
    expect(twinLink).toBeInTheDocument(); // Assertion 3
    expect(coachLink).toBeInTheDocument(); // Assertion 4
    expect(learnLink).toBeInTheDocument(); // Assertion 5
    expect(profileLink).toBeInTheDocument(); // Assertion 6

    expect(dashboardLink).toHaveAttribute('aria-label'); // Assertion 7
    expect(calculatorLink).toHaveAttribute('aria-label'); // Assertion 8
    expect(twinLink).toHaveAttribute('aria-label'); // Assertion 9
    expect(coachLink).toHaveAttribute('aria-label'); // Assertion 10
  });

  test('sets aria-current="page" on the active route', () => {
    mockUsePathname.mockReturnValue('/twin');
    render(<Sidebar />);

    const twinLink = screen.getByRole('link', { name: /carbon twin/i });
    expect(twinLink).toHaveAttribute('aria-current', 'page'); // Assertion 11
  });
});
