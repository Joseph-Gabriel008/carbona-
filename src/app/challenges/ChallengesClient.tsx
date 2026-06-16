'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  CheckCircle2, 
  Leaf, 
  Zap, 
  Utensils, 
  ShoppingBag,
  Award,
  Lock,
  Sparkles
} from 'lucide-react';
import { useCarbonaStore, ALL_CHALLENGES, getXPNeededForNextLevel } from '@/lib/store';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  transportation: Leaf,
  energy: Zap,
  food: Utensils,
  shopping: ShoppingBag,
};

const BADGES = [
  { name: 'Hydration Hero', desc: 'Completed the Hydration Swap challenge', icon: Award, color: 'text-blue-500 bg-blue-500/10' },
  { name: 'Active Commuter', desc: 'Completed the Active Mobility challenge', icon: Award, color: 'text-emerald-500 bg-emerald-500/10' },
  { name: 'Green Rider', desc: 'Completed the Zero Tailpipe Week challenge', icon: Award, color: 'text-teal-500 bg-teal-500/10' },
  { name: 'Zero-Waste Champion', desc: 'Completed the Fast Fashion Pause challenge', icon: Award, color: 'text-purple-500 bg-purple-500/10' },
  { name: 'Planet Guardian', desc: 'Completed the Plant-Based Trial challenge', icon: Award, color: 'text-indigo-500 bg-indigo-500/10' },
];

export default function ChallengesClient() {
  const { xp, level, completedChallenges, unlockedBadges, toggleChallenge } = useCarbonaStore();
  
  const { nextLevelName, xpNeeded, percent } = getXPNeededForNextLevel(xp);

  const getDifficultyColor = (diff: string) => {
    if (diff === 'easy') return 'text-brand-emerald bg-brand-emerald/10 border-brand-emerald/20';
    if (diff === 'medium') return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  };

  const getDifficultyLevelLabel = (diff: string) => {
    return diff.charAt(0).toUpperCase() + diff.slice(1);
  };

  return (
    <div className="space-y-8 select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Eco Challenges
          </h1>
          <p className="text-muted-foreground text-xs font-semibold mt-1">
            Build eco-habits, claim XP rewards, and collect achievement badges.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-brand-emerald text-white font-bold px-3 py-1 text-xs">
            Level: {level}
          </Badge>
          <Badge variant="outline" className="font-bold border-brand-emerald/30 text-brand-emerald px-3 py-1 text-xs bg-brand-emerald/5">
            {xp} Total XP
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-panel border-border/80 rounded-3xl flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-sm font-extrabold flex items-center gap-2">
              <Trophy className="h-4.5 w-4.5 text-brand-emerald" />
              Level Progression
            </CardTitle>
            <CardDescription className="text-[10px] font-semibold">
              Complete challenges to earn XP and unlock the next sustainability rank
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-md font-extrabold text-foreground">{level}</span>
              <span className="text-xs font-bold text-brand-emerald">{xp} XP</span>
            </div>
            
            <div className="space-y-2">
              <Progress value={percent} className="h-3 bg-muted-foreground/10" />
              <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
                <span>{percent}% Complete</span>
                {xpNeeded > 0 ? (
                  <span>{xpNeeded} XP until rank: {nextLevelName}</span>
                ) : (
                  <span className="text-brand-emerald font-bold uppercase">Max rank unlocked!</span>
                )}
              </div>
            </div>

            {xp > 0 && (
              <div className="p-3 rounded-2xl bg-brand-emerald/5 border border-brand-emerald/10 text-[10px] font-medium text-brand-emerald leading-relaxed flex items-center gap-2">
                <Sparkles className="h-4 w-4 shrink-0" />
                <span>
                  You have completed <strong>{completedChallenges.length} challenges</strong>! Keep selecting tasks to boost your score to the next rank.
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 glass-panel border-border/80 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-sm font-extrabold flex items-center gap-2">
              <Award className="h-4.5 w-4.5 text-brand-emerald" />
              Badge Cabinet
            </CardTitle>
            <CardDescription className="text-[10px] font-semibold">
              Eco milestones unlocked
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-3.5">
              {BADGES.map((badge, idx) => {
                const isUnlocked = unlockedBadges.includes(badge.name);
                const BadgeIcon = badge.icon;
                return (
                  <div 
                    key={idx}
                    className="flex flex-col items-center group relative cursor-help"
                  >
                    <div className={`h-11 w-11 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                      isUnlocked 
                        ? `${badge.color} border-brand-emerald/20 shadow-sm shadow-brand-emerald/10 scale-105` 
                        : 'text-muted-foreground/40 bg-muted/40 border-border/50 grayscale'
                    }`}>
                      {isUnlocked ? (
                        <BadgeIcon className="h-5.5 w-5.5" />
                      ) : (
                        <Lock className="h-4 w-4 text-muted-foreground/30" />
                      )}
                    </div>
                    <span className="text-[8px] font-semibold text-muted-foreground mt-1.5 truncate max-w-full text-center">
                      {badge.name.split(' ')[0]}
                    </span>
                    
                    <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-40 p-2.5 rounded-xl border border-border/80 bg-card/95 backdrop-blur-sm shadow-sm text-[9px] font-medium text-muted-foreground text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                      <p className="font-bold text-foreground mb-0.5">{badge.name}</p>
                      <p>{isUnlocked ? badge.desc : 'Complete corresponding challenge to unlock'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Available Tasks
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ALL_CHALLENGES.map((challenge) => {
            const isCompleted = completedChallenges.includes(challenge.id);
            const CategoryIcon = CATEGORY_ICONS[challenge.category] || Leaf;
            
            return (
              <motion.div
                key={challenge.id}
                layout
                className={`p-5 rounded-3xl border transition-all flex justify-between items-start gap-4 ${
                  isCompleted 
                    ? 'bg-brand-emerald/5 border-brand-emerald/20' 
                    : 'bg-card/60 border-border/80 hover:border-border/100 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 ${
                    isCompleted 
                      ? 'bg-brand-emerald/15 text-brand-emerald' 
                      : 'bg-muted border border-border/60 text-muted-foreground'
                  }`}>
                    <CategoryIcon className="h-5.5 w-5.5" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className={`text-xs font-bold ${isCompleted ? 'text-brand-emerald line-through opacity-85' : 'text-foreground'}`}>
                        {challenge.title}
                      </h4>
                      <Badge className={`text-[8px] font-bold px-1.5 py-0.5 border ${getDifficultyColor(challenge.difficulty)}`}>
                        {getDifficultyLevelLabel(challenge.difficulty)}
                      </Badge>
                      <Badge variant="outline" className="text-[8px] font-bold text-brand-emerald border-brand-emerald/30 bg-brand-emerald/5">
                        +{challenge.xpReward} XP
                      </Badge>
                    </div>
                    <p className={`text-[10px] leading-relaxed font-semibold ${isCompleted ? 'text-muted-foreground/60 line-through' : 'text-muted-foreground'}`}>
                      {challenge.description}
                    </p>
                    
                    {challenge.badgeAwarded && !isCompleted && (
                      <span className="text-[8px] font-bold text-brand-emerald flex items-center gap-1">
                        <Award className="h-3.5 w-3.5" />
                        Unlocks badge: {challenge.badgeAwarded}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => toggleChallenge(challenge.id)}
                  className={`h-9 w-9 rounded-xl flex items-center justify-center border transition-all shrink-0 cursor-pointer ${
                    isCompleted 
                      ? 'bg-brand-emerald border-brand-emerald text-white' 
                      : 'border-border/80 bg-background hover:border-brand-emerald hover:text-brand-emerald text-muted-foreground'
                  }`}
                  aria-label="Toggle Complete Challenge"
                  title="Toggle Complete Challenge"
                >
                  <CheckCircle2 className="h-5.5 w-5.5" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
