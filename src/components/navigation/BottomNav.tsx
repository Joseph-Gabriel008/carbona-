'use client';

/**
 * @module BottomNav
 * @description Provides a mobile-responsive bottom navigation bar that appears on sub-landing pages.
 * Handles responsive layout updates, micro-animations, and theme toggling options.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calculator, 
  Bot, 
  Trophy, 
  MoreHorizontal,
  Fingerprint,
  BookOpen,
  User,
  X,
  Sun,
  Moon
} from 'lucide-react';

const MOBILE_ITEMS = [
  { href: '/dashboard', label: 'Home', ariaLabel: 'Dashboard navigation', icon: LayoutDashboard },
  { href: '/calculator', label: 'Calc', ariaLabel: 'Calculator navigation', icon: Calculator },
  { href: '/coach', label: 'Coach', ariaLabel: 'AI Coach navigation', icon: Bot },
  { href: '/challenges', label: 'Play', ariaLabel: 'Challenges navigation', icon: Trophy },
];

const MORE_ITEMS = [
  { href: '/twin', label: 'Carbon Twin™', ariaLabel: 'Carbon Twin navigation', icon: Fingerprint },
  { href: '/learn', label: 'Learning Hub', ariaLabel: 'Learning Hub navigation', icon: BookOpen },
  { href: '/profile', label: 'My Profile', ariaLabel: 'My Profile navigation', icon: User },
];

export interface BottomNavProps {
  // Currently parameterless, interface provided for type safety and scalability.
}

export default function BottomNav(_props: BottomNavProps) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  // Don't show bottom nav on landing page
  if (pathname === '/') return null;

  const isMoreActive = MORE_ITEMS.some(item => item.href === pathname);

  const toggleTheme = (): void => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('carbona-dark-mode', 'false');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('carbona-dark-mode', 'true');
    }
    setMoreOpen(false);
  };

  return (
    <>
      {/* More Menu Overlay */}
      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
              onClick={() => setMoreOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="md:hidden fixed bottom-16 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border/60 rounded-t-3xl z-40 p-5 pb-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  More Options
                </h3>
                <button
                  onClick={() => setMoreOpen(false)}
                  aria-label="Close menu"
                  className="h-8 w-8 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-1.5" role="menu">
                {MORE_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      aria-label={item.ariaLabel}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-brand-emerald/10 text-brand-emerald font-bold'
                          : 'text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-semibold">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-border/40">
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-muted/50 transition-all cursor-pointer w-full"
                >
                  <Sun className="h-5 w-5 dark:hidden" />
                  <Moon className="h-5 w-5 hidden dark:block" />
                  <span className="text-sm font-semibold">
                    <span className="dark:hidden">Dark Mode</span>
                    <span className="hidden dark:inline">Light Mode</span>
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <nav aria-label="Main navigation" className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-border/80 bg-card/80 backdrop-blur-md px-2 pb-safe z-20 flex items-center justify-around select-none">
        {MOBILE_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              aria-label={item.ariaLabel}
              aria-current={isActive ? 'page' : undefined}
              className="relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center"
            >
              <div className={`relative flex items-center justify-center p-1 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'text-brand-emerald scale-110' 
                  : 'text-muted-foreground'
              }`}>
                {isActive && (
                  <motion.span
                    layoutId="activeMobileIndicator"
                    className="absolute inset-0 bg-brand-emerald/10 dark:bg-brand-emerald/20 rounded-xl z-[-1]"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
                <Icon className="h-5.5 w-5.5" />
              </div>
              <span className={`text-[10px] mt-1 font-semibold tracking-wide ${isActive ? 'text-brand-emerald' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* More Button */}
        <button
          onClick={() => setMoreOpen(!moreOpen)}
          aria-label="More options"
          aria-expanded={moreOpen}
          className="relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center cursor-pointer"
        >
          <div className={`relative flex items-center justify-center p-1 rounded-xl transition-all duration-300 ${
            isMoreActive || moreOpen
              ? 'text-brand-emerald scale-110' 
              : 'text-muted-foreground'
          }`}>
            {(isMoreActive || moreOpen) && (
              <motion.span
                layoutId="activeMobileMoreIndicator"
                className="absolute inset-0 bg-brand-emerald/10 dark:bg-brand-emerald/20 rounded-xl z-[-1]"
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              />
            )}
            <MoreHorizontal className="h-5.5 w-5.5" />
          </div>
          <span className={`text-[10px] mt-1 font-semibold tracking-wide ${isMoreActive || moreOpen ? 'text-brand-emerald' : 'text-muted-foreground'}`}>
            More
          </span>
        </button>
      </nav>
    </>
  );
}
