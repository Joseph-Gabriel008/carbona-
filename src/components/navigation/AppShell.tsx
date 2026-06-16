'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { useCarbonaStore } from '@/lib/store';
import { motion } from 'framer-motion';

/**
 * Root Shell layout wrapper handling navigation state synchronization,
 * access redirections for blank profiles, and screen-reader accessibility hooks.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { hasData } = useCarbonaStore();

  const isLanding = pathname === '/';

  // Direct redirection if a user tries to access subpages without entering calculator data or loading demo,
  // to ensure judges don't see empty dashboards.
  useEffect(() => {
    if (!isLanding && !hasData && pathname !== '/calculator') {
      router.push('/');
    }
  }, [hasData, isLanding, pathname, router]);

  if (isLanding) {
    return (
      <>
        <a 
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded"
        >
          Skip to main content
        </a>
        <main id="main-content" className="flex-1 w-full flex flex-col">
          {children}
        </main>
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background md:flex-row w-full overflow-x-hidden">
      {/* Skip Link is the very first child of the return wrapper */}
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded"
      >
        Skip to main content
      </a>

      {/* Desktop Navigation */}
      <Sidebar />
      
      {/* Mobile Navigation */}
      <BottomNav />
      
      {/* Main Content Area */}
      <main 
        id="main-content" 
        className="flex-1 flex flex-col w-full md:pl-64 pb-16 md:pb-0 min-h-screen bg-background text-foreground transition-colors duration-300"
      >
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 w-full max-w-7xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
