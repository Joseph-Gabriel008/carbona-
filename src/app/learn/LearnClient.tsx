'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Globe, 
  Footprints, 
  Zap, 
  Home, 
  Navigation
} from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  details: string[];
  impact: string;
  action: string;
}

const TOPICS: Topic[] = [
  {
    id: 'climate-change',
    title: 'Climate Change Dynamics',
    category: 'Environmental Science',
    description: 'Understand the fundamental greenhouse effect and how anthropogenic carbon emissions accelerate global temperature rises.',
    icon: Globe,
    details: [
      'The Greenhouse Effect is natural, but human combustion of fossil fuels has added billions of tons of CO₂ to the atmosphere, trapping excess solar heat.',
      'Average global temperatures have risen by ~1.1°C since the pre-industrial era, contributing to severe weather, rising sea levels, and ecosystem stresses.',
      'Limiting warming to 1.5°C under the Paris Agreement requires global net-zero emissions by 2050.'
    ],
    impact: 'Industrial activity and combustion represent over 70% of total global greenhouse emissions.',
    action: 'Reduce direct carbon outputs and support local clean-energy transitioning projects.'
  },
  {
    id: 'footprint-basics',
    title: 'Carbon Footprint Basics',
    category: 'Sustainability 101',
    description: 'Learn how direct (Scope 1) and indirect (Scope 2 & 3) activities shape your personal carbon contribution.',
    icon: Footprints,
    details: [
      'Scope 1 represents direct emissions, such as burning gasoline in your car or natural gas in your household furnace.',
      'Scope 2 represents indirect energy emissions, primarily the electricity purchased to light and cool your home.',
      'Scope 3 represents all other indirect emissions, including the lifecycle impact of clothes, electronics, services, and online deliveries.'
    ],
    impact: 'The average household footprint globally is ~9.5 tons CO₂ annually, which must shrink to ~2 tons to stabilize warming.',
    action: 'Calculate your inputs regularly and optimize high-impact travel and shipping activities.'
  },
  {
    id: 'renewable-energy',
    title: 'Renewable Energy Systems',
    category: 'Energy Systems',
    description: 'Explore solar, wind, and storage solutions transitioning the grid from fossil fuels to carbon-free utilities.',
    icon: Zap,
    details: [
      'Solar panels capture photovoltaic energy, generating electricity without burning fuel or producing carbon outputs.',
      'Wind power utilizes clean kinetic energy, representing one of the fastest-growing utility-scale renewable sources.',
      'Battery energy storage projects stabilize renewable output by saving excess power for peak demand hours.'
    ],
    impact: 'Transitioning home electricity to solar can reduce a typical house footprint by up to 2.8 tons of CO₂ annually.',
    action: 'Unplug idle electronics to stop phantom power and opt for green electrical utilities where available.'
  },
  {
    id: 'sustainable-living',
    title: 'Sustainable Daily Living',
    category: 'Lifestyle Habits',
    description: 'Adopt circular economy habits like zero-waste cooking, smart consumption, and material reuse.',
    icon: Home,
    details: [
      'Circular economy focuses on minimizing virgin manufacturing by recycling, upcycling, and extending the lifecycle of materials.',
      'Food waste represents a massive methane emitter when buried in landfills; composting returns vital nutrients to soil without carbon gaseous outputs.',
      'Fast-fashion cycles exploit high energy production. Extending clothing use by just 9 months reduces its footprint by 30%.'
    ],
    impact: 'Adopting sustainable food management and buying durable goods reduces consumer footprint by up to 1.5 tons CO₂ annually.',
    action: 'Commit to reusable bottles/containers and purchase seasonal, local produce.'
  },
  {
    id: 'green-transit',
    title: 'Green Transportation',
    category: 'Mobility Solutions',
    description: 'Discover active travel, rail transit, and hybrid/electric vehicle alternatives to lower tailpipe emissions.',
    icon: Navigation,
    details: [
      'Active travel (walking and cycling) produces zero emissions and improves cardiovascular health.',
      'Rail transit is highly efficient, emitting up to 80% less carbon per passenger-km compared to private internal combustion cars.',
      'Electric vehicles charge from the local grid. While grid mix varies, EVs produce significantly lower lifetime footprints than petrol/diesel cars.'
    ],
    impact: 'Replacing 3,000km of private gasoline driving with rail transit prevents approximately 400kg of CO₂ from entering the atmosphere.',
    action: 'Optimize trips by walking for distances under 3km and scheduling rail/bus travel for commutes.'
  }
];

export default function LearnClient() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 select-none">
      <div className="border-b border-border/60 pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Learning Hub
        </h1>
        <p className="text-muted-foreground text-xs font-semibold mt-1">
          Explore structured guides to understand climate science and adopt practical carbon reduction strategies.
        </p>
      </div>

      <div className="space-y-4 max-w-4xl">
        {TOPICS.map((topic) => {
          const isExpanded = expandedId === topic.id;
          const TopicIcon = topic.icon;

          return (
            <div 
              key={topic.id}
              className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                isExpanded 
                  ? 'bg-card/70 border-brand-emerald/30 shadow-md shadow-brand-emerald/5' 
                  : 'bg-card/50 border-border/80 hover:border-border/100 hover:shadow-sm'
              }`}
            >
              <button
                onClick={() => toggleExpand(topic.id)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 ${
                    isExpanded 
                      ? 'bg-brand-emerald/15 text-brand-emerald' 
                      : 'bg-muted border border-border/60 text-muted-foreground'
                  }`}>
                    <TopicIcon className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-brand-emerald uppercase tracking-wider block">
                      {topic.category}
                    </span>
                    <h3 className="text-xs font-extrabold text-foreground mt-0.5">
                      {topic.title}
                    </h3>
                  </div>
                </div>

                <div className="text-muted-foreground shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className="px-5 pb-5 pt-1.5 border-t border-border/40 space-y-5">
                      <p className="text-[11px] font-semibold text-muted-foreground leading-relaxed">
                        {topic.description}
                      </p>

                      <div className="space-y-3 pl-1">
                        <h4 className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                          Key Insights
                        </h4>
                        <ul className="space-y-2.5">
                          {topic.details.map((detail, idx) => (
                            <li key={idx} className="text-xs text-foreground font-semibold leading-relaxed flex items-start gap-2.5">
                              <BookOpen className="h-4 w-4 text-brand-emerald shrink-0 mt-0.5" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/10">
                          <h5 className="text-[9px] font-bold text-destructive uppercase tracking-wider">
                            Global Impact
                          </h5>
                          <p className="text-xs font-semibold text-foreground mt-1 leading-relaxed">
                            {topic.impact}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-brand-emerald/5 border border-brand-emerald/10">
                          <h5 className="text-[9px] font-bold text-brand-emerald uppercase tracking-wider">
                            Personal Action
                          </h5>
                          <p className="text-xs font-semibold text-foreground mt-1 leading-relaxed">
                            {topic.action}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
