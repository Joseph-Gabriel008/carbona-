'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { useCarbonaStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

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
    return <main className="flex-1 w-full flex flex-col">{children}</main>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background md:flex-row w-full overflow-x-hidden">
      {/* Desktop Navigation */}
      <Sidebar />
      
      {/* Mobile Navigation */}
      <BottomNav />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full md:pl-64 pb-16 md:pb-0 min-h-screen bg-background text-foreground transition-all duration-300">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 w-full max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
