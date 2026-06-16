'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Trash2, 
  Leaf, 
  Award, 
  ShieldCheck, 
  Calendar,
  Fingerprint
} from 'lucide-react';
import { useCarbonaStore, ALL_CHALLENGES, getXPNeededForNextLevel } from '@/lib/store';
import { AVATAR_ICONS } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

export default function ProfileClient() {
  const router = useRouter();
  const { 
    xp, 
    level, 
    unlockedBadges, 
    completedChallenges, 
    emissions, 
    twin, 
    resetState 
  } = useCarbonaStore();

  const { percent, xpNeeded } = getXPNeededForNextLevel(xp);
  const IconComponent = AVATAR_ICONS[twin.avatar] || AVATAR_ICONS['compass'];

  const handleReset = () => {
    if (confirm('Are you sure you want to delete your profile data? This will reset all calculator entries and challenge achievements.')) {
      resetState();
      router.push('/');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-brand-emerald/10 text-brand-emerald flex items-center justify-center shrink-0">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              My Profile
            </h1>
            <p className="text-muted-foreground text-xs font-semibold mt-1">
              Manage your environmental identity, tracking, and completed milestones.
            </p>
          </div>
        </div>
        
        <Button
          onClick={handleReset}
          variant="outline"
          className="self-start sm:self-center flex items-center gap-2 border-destructive/20 hover:border-destructive/30 hover:bg-destructive/5 text-destructive font-bold text-xs h-10 rounded-xl cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
          Reset Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card className="glass-panel border-border/80 rounded-3xl overflow-hidden relative text-center py-6 px-4">
            <div className="absolute top-0 right-0 w-20 h-20 bg-brand-emerald/10 rounded-full blur-xl pointer-events-none" />
            
            <div className="h-16 w-16 mx-auto rounded-full bg-brand-emerald/10 text-brand-emerald flex items-center justify-center mb-4">
              <IconComponent className="h-8 w-8" />
            </div>
            
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">
              Archetype Twin
            </span>
            <CardTitle className="text-md font-extrabold text-foreground mt-1">
              {twin.identity}
            </CardTitle>
            
            <p className="text-[10px] text-muted-foreground font-semibold px-2 mt-2 leading-relaxed">
              Score Rank: <strong className="text-foreground">{emissions.score}/100</strong>
            </p>

            <Link 
              href="/twin" 
              className="text-[10px] text-brand-emerald font-bold hover:underline inline-flex items-center gap-1.5 mt-4"
            >
              <Fingerprint className="h-3.5 w-3.5" />
              View Twin Details
            </Link>
          </Card>

          <Card className="glass-panel border-border/80 rounded-3xl p-5 space-y-4">
            <div>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
                Rank Level
              </span>
              <h3 className="text-sm font-extrabold text-foreground mt-0.5">
                {level}
              </h3>
            </div>

            <div className="space-y-1.5">
              <Progress value={percent} className="h-2.5 bg-muted-foreground/10" />
              <div className="flex justify-between text-[9px] font-semibold text-muted-foreground">
                <span>{percent}%</span>
                {xpNeeded > 0 ? (
                  <span>{xpNeeded} XP to next rank</span>
                ) : (
                  <span className="text-brand-emerald uppercase">Max rank</span>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="glass-card border-border/80 rounded-3xl">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-sm font-extrabold flex items-center gap-2">
                <Award className="h-4.5 w-4.5 text-brand-emerald" />
                Badge Achievement Cabinet
              </CardTitle>
              <CardDescription className="text-[10px] font-semibold">
                Milestones unlocked by completing hard challenges
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5">
              {unlockedBadges.length === 0 ? (
                <p className="text-xs text-muted-foreground font-medium py-2">
                  No achievement badges unlocked yet. Complete challenges that offer badge awards to populate this cabinet.
                </p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {unlockedBadges.map((badge, idx) => (
                    <Badge 
                      key={idx} 
                      className="px-3.5 py-2 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald font-bold text-xs flex items-center gap-1.5 hover:bg-brand-emerald/15 transition-all"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card border-border/80 rounded-3xl">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-sm font-extrabold flex items-center gap-2">
                <Calendar className="h-4.5 w-4.5 text-brand-emerald" />
                Completed Tasks Log
              </CardTitle>
              <CardDescription className="text-[10px] font-semibold">
                Timeline of eco achievements
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5">
              {completedChallenges.length === 0 ? (
                <p className="text-xs text-muted-foreground font-medium py-2">
                  No completed tasks yet. Browse and complete challenges in the <strong>Eco Challenges</strong> panel to grow your logs.
                </p>
              ) : (
                <div className="space-y-3.5">
                  {completedChallenges.map((challengeId) => {
                    const c = ALL_CHALLENGES.find(item => item.id === challengeId);
                    if (!c) return null;
                    return (
                      <div 
                        key={challengeId}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-xs font-semibold"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-xl bg-brand-emerald/15 text-brand-emerald flex items-center justify-center shrink-0">
                            <Leaf className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-foreground">{c.title}</h4>
                            <p className="text-[9px] text-muted-foreground font-semibold mt-0.5">{c.description}</p>
                          </div>
                        </div>
                        <Badge className="bg-brand-emerald text-white font-bold text-[9px] px-2 py-0.5 shrink-0 ml-4">
                          +{c.xpReward} XP
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
