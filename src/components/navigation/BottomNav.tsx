'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calculator, 
  Bot, 
  Trophy, 
  User 
} from 'lucide-react';

const MOBILE_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/calculator', label: 'Calc', icon: Calculator },
  { href: '/coach', label: 'Coach', icon: Bot },
  { href: '/challenges', label: 'Play', icon: Trophy },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Don't show bottom nav on landing page
  if (pathname === '/') return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-border/80 bg-card/80 backdrop-blur-md px-2 pb-safe z-20 flex items-center justify-around select-none">
      {MOBILE_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link key={item.href} href={item.href} className="relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center">
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
    </nav>
  );
}
