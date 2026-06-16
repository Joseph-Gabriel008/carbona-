'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4 select-none">
      <div className="relative">
        {/* Pulsing glow ring */}
        <div className="absolute inset-[-12px] rounded-full border border-dashed border-brand-emerald/30 animate-[spin_8s_linear_infinite]" />
        <div className="absolute inset-[-20px] rounded-full border border-dotted border-brand-blue/20 animate-[spin_12s_linear_infinite_reverse]" />
        
        {/* Center circle */}
        <div className="h-16 w-16 rounded-2xl bg-brand-emerald/15 text-brand-emerald flex items-center justify-center shadow-lg shadow-brand-emerald/5 border border-brand-emerald/20">
          <Leaf className="h-8 w-8 animate-pulse text-brand-emerald" />
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground/80 uppercase animate-pulse">
          Loading Carbona...
        </p>
      </div>
    </div>
  );
}
