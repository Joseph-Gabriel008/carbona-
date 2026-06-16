'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  TrendingDown,
  Award,
  Sparkles,
  Leaf,
  Globe
} from 'lucide-react';
import { useCarbonaStore } from '@/lib/store';
import { AVATAR_ICONS } from '@/lib/constants';

export default function TwinClient() {
  const { twin, emissions } = useCarbonaStore();
  const IconComponent = AVATAR_ICONS[twin.avatar] || AVATAR_ICONS['compass'];

  // Calculate annual metrics for user footprint and national target comparison
  const userAnnualTons = ((emissions.total * 12) / 1000).toFixed(2);
  const indiaAverage = 1.9;
  const diffPercent = Math.round(((parseFloat(userAnnualTons) - indiaAverage) / indiaAverage) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8 select-none">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-emerald/10 text-brand-emerald"
        >
          <FingerprintIcon className="h-5 w-5" />
        </motion.div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Your Carbon Twin™ Revealed
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          Meet your climate reflection. Your carbon profile highlights both your strengths and opportunities for reduction.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          className="md:col-span-2 glass-panel p-6 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-between min-h-[500px] border border-brand-emerald/20 shadow-lg glow-emerald"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-emerald/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-blue/15 rounded-full blur-2xl pointer-events-none" />

          <div className="flex justify-between items-start border-b border-foreground/10 pb-4">
            <div>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">
                CARBON TWIN Archetype
              </span>
              <h2 className="text-xl font-black bg-gradient-to-r from-brand-emerald to-brand-blue bg-clip-text text-transparent mt-0.5">
                {twin.identity}
              </h2>
            </div>
            <div className="h-10 w-10 bg-gradient-to-br from-brand-emerald to-brand-green text-white flex items-center justify-center rounded-xl shadow-md shadow-brand-emerald/25">
              <IconComponent className="h-5 w-5 animate-float-slow" />
            </div>
          </div>

          <div className="my-5 flex flex-col items-center justify-center py-5 border border-foreground/5 bg-background/30 rounded-3xl relative overflow-hidden backdrop-blur-sm">
            <div className="absolute inset-0 bg-radial-gradient from-brand-emerald/10 to-transparent pointer-events-none" />
            
            <div className="relative">
              <div className="absolute inset-[-10px] rounded-full border border-dashed border-brand-emerald/30 animate-[spin_12s_linear_infinite]" />
              <div className="absolute inset-[-18px] rounded-full border border-dotted border-brand-blue/20 animate-[spin_20s_linear_infinite_reverse]" />
              
              <div className="h-18 w-18 rounded-full bg-brand-emerald/10 text-brand-emerald flex items-center justify-center shadow-inner">
                <IconComponent className="h-9 w-9" />
              </div>
            </div>
            
            <span className="text-[10px] font-semibold text-muted-foreground mt-4 uppercase tracking-wider">
              Score Rank
            </span>
            <span className="text-xl font-black text-foreground mt-0.5">
              {emissions.score} / 100
            </span>
          </div>

          {/* Comparison Stats & Archetype reduction tip */}
          <div className="space-y-3.5 mt-1">
            <div className="border-t border-foreground/10 pt-3 flex justify-between text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              <div>
                <span className="block text-[8px] text-muted-foreground/60 mb-0.5">Footprint</span>
                <span className="text-foreground font-bold">{emissions.total} kg CO₂ / mo</span>
              </div>
              <div className="text-right">
                <span className="block text-[8px] text-muted-foreground/60 mb-0.5">Rating</span>
                <span className="text-brand-emerald font-black text-xs">{emissions.rating} Rank</span>
              </div>
            </div>

            <div className="border-t border-foreground/10 pt-3 flex justify-between text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              <div>
                <span className="block text-[8px] text-muted-foreground/60 mb-0.5">India Avg</span>
                <span className="text-foreground font-bold">1.9t / yr</span>
              </div>
              <div className="text-right">
                <span className="block text-[8px] text-muted-foreground/60 mb-0.5">Global Avg</span>
                <span className="text-foreground font-bold">4.7t / yr</span>
              </div>
            </div>

            <div className="border-t border-foreground/10 pt-3">
              <span className="block text-[8px] text-muted-foreground/60 mb-0.5 uppercase font-semibold">Archetype Tip</span>
              <p className="text-[10px] text-brand-emerald font-semibold leading-tight">
                {twin.identity === 'Climate Hero' && "You're below India's average — inspire others!"}
                {twin.identity === 'Green Warrior' && "You're near India's average — keep pushing for zero-tailpipe travel!"}
                {twin.identity === 'Carbon Heavy Traveler' && "Offset high flight emissions by supporting India's green grid transition!"}
                {twin.identity === 'Conscious Consumer' && "Extend clothing and electronic lifecycles to minimize manufacturing impacts!"}
                {twin.identity === 'Conscious Eater' && "Adopt vegetarian weekdays to reduce agricultural footprint!"}
                {twin.identity === 'Energy Pioneer' && "Unplug phantom standby draws to drop below average grid intensity!"}
                {twin.identity === 'Eco Explorer' && "Walk for trips under 3km and complete simple eco swaps this week!"}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="md:col-span-3 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card/60 border border-border/80 p-5 rounded-3xl"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-brand-emerald" />
              Identity Summary
            </h3>
            <p className="text-sm text-foreground font-medium leading-relaxed">
              {twin.summary}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-brand-emerald/5 border border-brand-emerald/10 p-5 rounded-3xl"
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-emerald mb-3.5 flex items-center gap-1.5">
                <Award className="h-4 w-4" />
                Key Strengths
              </h4>
              <ul className="space-y-2">
                {twin.strengths.map((str, idx) => (
                  <li key={idx} className="text-xs text-foreground font-semibold leading-relaxed flex items-start gap-2">
                    <span className="text-brand-emerald select-none font-bold mt-0.5">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-destructive/5 border border-destructive/10 p-5 rounded-3xl"
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-destructive mb-3.5 flex items-center gap-1.5">
                <TrendingDown className="h-4 w-4" />
                Improvement Targets
              </h4>
              <ul className="space-y-2">
                {twin.improvements.map((imp, idx) => (
                  <li key={idx} className="text-xs text-foreground font-semibold leading-relaxed flex items-start gap-2">
                    <span className="text-destructive select-none font-bold mt-0.5">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-brand-blue/5 border border-brand-blue/10 p-5 rounded-3xl"
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-3 flex items-center gap-1.5">
                <Leaf className="h-4 w-4" />
                Annual Reduction Target
              </h4>
              <p className="text-xs text-foreground font-semibold leading-relaxed">
                {twin.identity === 'Climate Hero' && "You can reduce 0.5t CO₂/year by transitioning to clean solar micro-generation."}
                {twin.identity === 'Green Warrior' && "You can reduce 1.2t CO₂/year by cutting AC usage by 3 hours daily and washing laundry in cold water."}
                {twin.identity === 'Carbon Heavy Traveler' && "You can reduce 3.4t CO₂/year by rail transit substitution and using carbon-offset flight certificates."}
                {twin.identity === 'Conscious Consumer' && "You can reduce 1.8t CO₂/year by extending clothes use for 9 months and consolidating parcel deliveries."}
                {twin.identity === 'Conscious Eater' && "You can reduce 2.1t CO₂/year by adopting vegan weekdays and composting food waste."}
                {twin.identity === 'Energy Pioneer' && "You can reduce 2.8t CO₂/year by unplugging vampire loads and upgrading to energy-star appliances."}
                {twin.identity === 'Eco Explorer' && "You can reduce 1.5t CO₂/year by completing easy challenges and choosing active commuting."}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-card/60 border border-border/80 p-5 rounded-3xl"
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-brand-emerald" />
                Comparison & Context
              </h4>
              <div className="space-y-1">
                <p className="text-xs text-foreground font-semibold leading-relaxed">
                  Your annual footprint: <strong className="text-brand-emerald">{userAnnualTons} tons</strong> CO₂e/year.
                </p>
                <p className="text-[10px] text-muted-foreground leading-normal font-medium">
                  India's national per-capita average is <strong className="text-foreground">1.9 tons</strong> CO₂e/year (global average is <strong className="text-foreground">4.7 tons</strong> CO₂e/year). 
                  You are {diffPercent <= 0 ? `${Math.abs(diffPercent)}% below` : `${diffPercent}% above`} India's average.
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card/60 border border-border/80 p-5 rounded-3xl"
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <Leaf className="h-4 w-4 text-brand-emerald" />
              Plan of Action
            </h4>
            <div className="space-y-2.5">
              {twin.suggestions.map((sug, idx) => (
                <div key={idx} className="text-xs text-foreground font-semibold bg-background/40 p-2.5 rounded-xl border border-border/40">
                  {sug}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 pt-2"
          >
            <Link
              href="/dashboard"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-xs text-white bg-brand-emerald hover:bg-brand-emerald/95 shadow-md shadow-brand-emerald/10 cursor-pointer"
            >
              Explore Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/calculator"
              className="px-6 py-3.5 rounded-2xl font-bold text-xs bg-muted/50 border border-border/80 text-muted-foreground hover:text-foreground text-center cursor-pointer"
            >
              Re-Calculate
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function FingerprintIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22v-3" />
      <path d="M12 14V5a3 3 0 0 0-3-3" />
      <path d="M17 14c-.62-2.94-2.53-5.46-5-6" />
      <path d="M17 22c.62-2.94 1.54-5.46-1-10" />
      <path d="M2 14a10 10 0 0 1 12.2-9.7" />
      <path d="M2 22a18 18 0 0 1 7.2-12" />
      <path d="M22 14a10 10 0 0 0-12.2-9.7" />
      <path d="M22 22a18 18 0 0 0-7.2-12" />
    </svg>
  );
}
