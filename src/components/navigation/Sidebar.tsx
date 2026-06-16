'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calculator, 
  Bot, 
  Trophy, 
  BookOpen, 
  User, 
  Fingerprint,
  Sun, 
  Moon, 
  Leaf 
} from 'lucide-react';
import { useCarbonaStore, getXPNeededForNextLevel } from '@/lib/store';
import { Progress } from '@/components/ui/progress';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', ariaLabel: 'Dashboard navigation', icon: LayoutDashboard },
  { href: '/calculator', label: 'Calculator', ariaLabel: 'Calculator navigation', icon: Calculator },
  { href: '/twin', label: 'Carbon Twin™', ariaLabel: 'Carbon Twin navigation', icon: Fingerprint },
  { href: '/coach', label: 'AI Coach', ariaLabel: 'AI Coach navigation', icon: Bot },
  { href: '/challenges', label: 'Challenges', ariaLabel: 'Challenges navigation', icon: Trophy },
  { href: '/learn', label: 'Learning Hub', ariaLabel: 'Learning Hub navigation', icon: BookOpen },
  { href: '/profile', label: 'My Profile', ariaLabel: 'My Profile navigation', icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { xp, level } = useCarbonaStore();
  const { nextLevelName, xpNeeded, percent } = getXPNeededForNextLevel(xp);
  const [isDark, setIsDark] = useState(false);

  // Read stored theme preference on mount
  useEffect(() => {
    const stored = localStorage.getItem('carbona-dark-mode');
    setIsDark(stored === 'true');
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('carbona-dark-mode', String(next));
  };

  return (
    <aside 
      role="navigation" 
      aria-label="Desktop navigation" 
      className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-border/40 bg-card/40 backdrop-blur-xl px-4 py-8 z-20 transition-all select-none"
    >
      {/* Brand Header */}
      <Link href="/" className="flex items-center gap-3 px-3 mb-10 hover:opacity-95 transition-all group">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-emerald text-white shadow-lg shadow-brand-emerald/30 group-hover:scale-105 active:scale-95 transition-transform duration-200">
          <Leaf className="h-6 w-6 animate-float-slow" />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-2xl leading-none bg-gradient-to-r from-brand-emerald to-brand-blue bg-clip-text text-transparent tracking-tight">
            Carbona
          </span>
          <span className="text-[10px] font-bold text-muted-foreground/80 tracking-widest uppercase mt-1">
            Small Actions. Big Impact.
          </span>
        </div>
      </Link>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              aria-label={item.ariaLabel}
              aria-current={isActive ? 'page' : undefined}
              className="relative block"
            >
              <span className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:translate-x-1 ${
                isActive 
                  ? 'text-brand-emerald dark:text-emerald-400 font-bold' 
                  : 'text-muted-foreground/80 hover:text-foreground hover:bg-muted/30'
              }`}>
                {isActive && (
                  <motion.span
                    layoutId="activeSidebarIndicator"
                    className="absolute inset-0 bg-brand-emerald/8 dark:bg-brand-emerald/15 border-l-4 border-brand-emerald rounded-xl z-[-1] sidebar-active-glow"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`h-5 w-5 transition-transform duration-300 ${
                  isActive 
                    ? 'text-brand-emerald dark:text-emerald-400 scale-110' 
                    : 'text-muted-foreground/60 group-hover:text-foreground group-hover:scale-105'
                }`} />
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Gamification Progress Widget */}
      <div className="mb-4 p-5 rounded-2xl bg-gradient-to-br from-brand-emerald/5 via-brand-emerald/8 to-transparent border border-brand-emerald/10 dark:border-brand-emerald/15 shadow-sm shadow-brand-emerald/5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-xs font-extrabold text-foreground tracking-wider">
            {level}
          </span>
          <span className="text-[11px] font-bold text-brand-emerald dark:text-emerald-400 bg-brand-emerald/10 dark:bg-brand-emerald/20 px-2 py-0.5 rounded-full">
            {xp} XP
          </span>
        </div>
        <Progress value={percent} className="h-2 bg-muted-foreground/15 dark:bg-muted/20" />
        {xpNeeded > 0 ? (
          <p className="text-[10px] text-muted-foreground/80 mt-3 font-semibold">
            {xpNeeded} XP to {nextLevelName}
          </p>
        ) : (
          <p className="text-[10px] text-brand-emerald dark:text-emerald-400 mt-3 font-bold uppercase tracking-wide">
            Maximum Level Reached!
          </p>
        )}
      </div>

      {/* Theme Toggle */}
      <div className="mb-4 flex items-center justify-center">
        <button
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-border/60 bg-background/50 hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all cursor-pointer text-xs font-semibold w-full justify-center"
        >
          {isDark ? (
            <>
              <Sun className="h-4 w-4 text-amber-400" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="h-4 w-4 text-brand-blue" />
              Dark Mode
            </>
          )}
        </button>
      </div>

      {/* Footer / Copyright */}
      <div className="border-t border-border/40 pt-5 flex items-center justify-center">
        <span className="text-[10px] font-bold text-muted-foreground/60 tracking-wider uppercase">
          © 2026 Carbona Platform
        </span>
      </div>
    </aside>
  );
}
