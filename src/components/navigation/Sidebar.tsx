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
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/calculator', label: 'Calculator', icon: Calculator },
  { href: '/twin', label: 'Carbon Twin™', icon: Fingerprint },
  { href: '/coach', label: 'AI Coach', icon: Bot },
  { href: '/challenges', label: 'Challenges', icon: Trophy },
  { href: '/learn', label: 'Learning Hub', icon: BookOpen },
  { href: '/profile', label: 'My Profile', icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { xp, level } = useCarbonaStore();
  const [darkMode, setDarkMode] = useState(false);
  const { nextLevelName, xpNeeded, percent } = getXPNeededForNextLevel(xp);

  // Sync theme state on mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    const timer = setTimeout(() => {
      setDarkMode(isDark);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('carbona-dark-mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('carbona-dark-mode', 'false');
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-border/80 bg-card/60 backdrop-blur-md px-4 py-6 z-20 transition-all select-none">
      {/* Brand Header */}
      <Link href="/" className="flex items-center gap-2 px-3 mb-8 hover:opacity-90 transition-opacity">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-emerald text-white shadow-lg shadow-brand-emerald/25">
          <Leaf className="h-5.5 w-5.5" />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-xl leading-none bg-gradient-to-r from-brand-emerald to-brand-blue bg-clip-text text-transparent">
            Carbona
          </span>
          <span className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase mt-0.5">
            Small Actions. Big Impact.
          </span>
        </div>
      </Link>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="relative block">
              <span className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 ${
                isActive 
                  ? 'text-brand-emerald dark:text-white' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}>
                {isActive && (
                  <motion.span
                    layoutId="activeSidebarIndicator"
                    className="absolute inset-0 bg-brand-emerald/10 dark:bg-brand-emerald/20 border-l-3 border-brand-emerald rounded-xl z-[-1]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`h-5 w-5 ${isActive ? 'text-brand-emerald' : 'text-muted-foreground group-hover:text-foreground'}`} />
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Gamification Progress Widget */}
      <div className="mb-6 p-4 rounded-2xl bg-muted/30 border border-border/50">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {level}
          </span>
          <span className="text-[11px] font-semibold text-brand-emerald">
            {xp} XP
          </span>
        </div>
        <Progress value={percent} className="h-2 bg-muted-foreground/10" />
        {xpNeeded > 0 ? (
          <p className="text-[10px] text-muted-foreground mt-2 font-medium">
            {xpNeeded} XP to {nextLevelName}
          </p>
        ) : (
          <p className="text-[10px] text-brand-emerald mt-2 font-bold uppercase tracking-wide">
            Maximum Level Reached!
          </p>
        )}
      </div>

      {/* Footer / Theme Toggle */}
      <div className="border-t border-border/80 pt-4 flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">
          Theme
        </span>
        <button 
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted/60 border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          aria-label="Toggle Theme"
        >
          {darkMode ? (
            <Sun className="h-4.5 w-4.5 text-amber-500" />
          ) : (
            <Moon className="h-4.5 w-4.5 text-blue-600" />
          )}
        </button>
      </div>
    </aside>
  );
}
