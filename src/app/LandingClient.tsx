'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  Fingerprint, 
  Bot, 
  BarChart3, 
  Trophy, 
  Sparkles,
  ArrowRight,
  Leaf,
  ShieldAlert
} from 'lucide-react';
import { useCarbonaStore } from '@/lib/store';

export default function LandingClient() {
  const router = useRouter();
  const { loadDemoProfile, hasData } = useCarbonaStore();

  const handleTryDemo = () => {
    loadDemoProfile();
    router.push('/dashboard');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 }
    },
  } as const;

  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-x-hidden bg-background">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-emerald/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-brand-blue/10 blur-[120px] pointer-events-none" />


      {/* Landing Navbar */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between px-6 py-6 z-10">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-emerald text-white shadow-md shadow-brand-emerald/25">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-lg bg-gradient-to-r from-brand-emerald to-brand-blue bg-clip-text text-transparent">
            Carbona
          </span>
        </div>
        <div>
          {hasData ? (
            <Link 
              href="/dashboard" 
              className="flex items-center gap-1 px-4.5 py-2 rounded-xl text-xs font-bold text-white bg-brand-emerald hover:bg-brand-emerald/95 shadow-md shadow-brand-emerald/10 hover:shadow-brand-emerald/20 transition-all"
            >
              Go to Dashboard
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <button
              onClick={handleTryDemo}
              className="px-4.5 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border/80 transition-all cursor-pointer"
            >
              Try Demo Profile
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 w-full max-w-5xl mx-auto flex flex-col items-center justify-center px-6 py-12 md:py-24 text-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-brand-emerald bg-brand-emerald/10 dark:bg-brand-emerald/20 border border-brand-emerald/20 mb-6"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Smarter Sustainability Tracking
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.15]"
        >
          Small Actions. <br />
          <span className="bg-gradient-to-r from-brand-emerald via-brand-emerald to-brand-blue bg-clip-text text-transparent">
            Big Impact.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-2xl text-lg md:text-xl text-muted-foreground mt-6 leading-relaxed"
        >
          Track, understand, and reduce your carbon footprint through intelligent sustainability insights, localized analytics, and personalized AI coaching.
        </motion.p>

        {/* CTA Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto"
        >
          <Link
            href="/calculator"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-brand-emerald to-brand-green hover:brightness-105 shadow-lg shadow-brand-emerald/20 transition-all cursor-pointer"
          >
            <Calculator className="h-4 w-4" />
            Calculate My Footprint
          </Link>
          <button
            onClick={handleTryDemo}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm bg-card hover:bg-muted border border-border/80 shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-brand-emerald" />
            Try Demo Profile
          </button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl w-full mt-20 border-t border-border/80 pt-10"
        >
          <div className="text-center">
            <h3 className="text-2xl md:text-4xl font-extrabold text-foreground">
              4.7t
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 font-semibold">
              Avg. Global CO₂/Person/Year
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl md:text-4xl font-extrabold text-foreground">
              29%
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 font-semibold">
              From Transportation Alone
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl md:text-4xl font-extrabold text-foreground">
              2t
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 font-semibold">
              Target Per Person by 2050
            </p>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid Section */}
      <section className="w-full bg-muted/30 border-y border-border/60 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold">
              Engineered for Climate Action
            </h2>
            <p className="text-muted-foreground text-sm mt-3 font-medium">
              Everything you need to map your daily carbon impact, optimize household energy, and cultivate sustainable habits.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Feature 1 */}
            <motion.div variants={itemVariants} className="glass-panel p-6 rounded-3xl">
              <div className="h-12 w-12 rounded-2xl bg-brand-emerald/10 dark:bg-brand-emerald/20 text-brand-emerald flex items-center justify-center mb-6">
                <Calculator className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Multi-Step Calculator</h3>
              <p className="text-muted-foreground text-sm mt-2.5 leading-relaxed font-medium">
                Answer modular questions across transport, energy, food, and shopping to produce a accurate emissions breakdown.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={itemVariants} className="glass-panel p-6 rounded-3xl">
              <div className="h-12 w-12 rounded-2xl bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue flex items-center justify-center mb-6">
                <Fingerprint className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Carbon Twin™</h3>
              <p className="text-muted-foreground text-sm mt-2.5 leading-relaxed font-medium">
                Generate your climate profile archetype. Map your strengths, improvement targets, and localized reduction guidelines.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={itemVariants} className="glass-panel p-6 rounded-3xl">
              <div className="h-12 w-12 rounded-2xl bg-brand-emerald/10 dark:bg-brand-emerald/20 text-brand-emerald flex items-center justify-center mb-6">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">AI Sustainability Coach</h3>
              <p className="text-muted-foreground text-sm mt-2.5 leading-relaxed font-medium">
                Discuss reduction ideas with &quot;Eco&quot;, your intelligent coach powered by Gemini, trained directly on your footprint logs.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div variants={itemVariants} className="glass-panel p-6 rounded-3xl">
              <div className="h-12 w-12 rounded-2xl bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Analytics Dashboard</h3>
              <p className="text-muted-foreground text-sm mt-2.5 leading-relaxed font-medium">
                Visualize daily, weekly, and monthly emissions using responsive charts. Pinpoint key emission contributors immediately.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div variants={itemVariants} className="glass-panel p-6 rounded-3xl">
              <div className="h-12 w-12 rounded-2xl bg-brand-emerald/10 dark:bg-brand-emerald/20 text-brand-emerald flex items-center justify-center mb-6">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Weekly Challenges</h3>
              <p className="text-muted-foreground text-sm mt-2.5 leading-relaxed font-medium">
                Tackle interactive carbon challenges, earn XP rewards, unlock sustainability badges, and level up your footprint status.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div variants={itemVariants} className="glass-panel p-6 rounded-3xl">
              <div className="h-12 w-12 rounded-2xl bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue flex items-center justify-center mb-6">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Weekly Reports</h3>
              <p className="text-muted-foreground text-sm mt-2.5 leading-relaxed font-medium">
                Receive comprehensive weekly checkups showing progress metrics, category breakdowns, and AI habits recommendations.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between text-muted-foreground text-xs font-semibold z-10">
        <p>© 2026 Carbona. All rights reserved.</p>
        <p className="mt-2 sm:mt-0 flex gap-4">
          <span>Glassmorphic Design</span>
          <span>•</span>
          <span>Gemini AI Powered</span>
          <span>•</span>
          <span>Open Source</span>
        </p>
      </footer>
    </div>
  );
}
