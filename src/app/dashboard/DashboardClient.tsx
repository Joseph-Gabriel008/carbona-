'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip
} from 'recharts';
import { 
  TrendingDown, 
  Sparkles, 
  Leaf, 
  Bot, 
  Trophy, 
  ShieldAlert, 
  ArrowRight,
  Gauge,
  Award
} from 'lucide-react';
import { useCarbonaStore, ALL_CHALLENGES } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      name: string;
    };
  }>;
}

const CustomAreaTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/90 backdrop-blur-sm border border-border/80 p-3.5 rounded-xl shadow-sm text-xs">
        <p className="font-bold text-foreground mb-1">{payload[0].payload.name}</p>
        <p className="font-semibold text-brand-emerald">
          {payload[0].value} kg CO₂/mo
        </p>
      </div>
    );
  }
  return null;
};

export default function DashboardClient() {
  const { emissions, twin, unlockedBadges, completedChallenges, calculatorInputs } = useCarbonaStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const pieData = [
    { name: 'Transportation', value: emissions.transportation, color: 'oklch(0.62 0.17 150)' },
    { name: 'Home Energy', value: emissions.energy, color: 'oklch(0.65 0.15 210)' },
    { name: 'Food & Diet', value: emissions.food, color: 'oklch(0.82 0.14 140)' },
    { name: 'Shopping', value: emissions.shopping, color: 'oklch(0.55 0.16 280)' },
  ].filter(d => d.value > 0);

  const areaData = [
    { name: 'Jan', Footprint: Math.round(emissions.total * 1.25) },
    { name: 'Feb', Footprint: Math.round(emissions.total * 1.15) },
    { name: 'Mar', Footprint: Math.round(emissions.total * 1.08) },
    { name: 'Apr', Footprint: Math.round(emissions.total * 1.03) },
    { name: 'May', Footprint: emissions.total },
    { name: 'Target', Footprint: Math.max(80, Math.round(emissions.total * 0.8)) }
  ];

  const largestContributor = [...pieData].sort((a, b) => b.value - a.value)[0]?.name || 'None';
  const totalChallengesCount = ALL_CHALLENGES.length;

  return (
    <div className="space-y-6 select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Sustainability Overview
          </h1>
          <p className="text-muted-foreground text-xs font-semibold mt-1">
            Track your progress, explore carbon twin metrics, and consult your coach.
          </p>
        </div>
        
        <Link href="/twin" className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/20 hover:bg-brand-emerald/15 transition-all text-xs font-bold text-brand-emerald">
          <Sparkles className="h-4 w-4" />
          Twin Archetype: {twin.identity}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-panel border-border/80 rounded-2xl">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-wider">
              Carbon Score
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold flex items-baseline gap-2">
              {emissions.score}
              <span className="text-xs font-bold text-muted-foreground">/ 100</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-semibold text-muted-foreground">Rating Rank</span>
              <Badge className="bg-brand-emerald hover:bg-brand-emerald/90 text-white font-bold text-[10px]">
                {emissions.rating} Rating
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-border/80 rounded-2xl">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-wider">
              Monthly Footprint
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold flex items-baseline gap-1">
              {emissions.total}
              <span className="text-xs font-bold text-muted-foreground">kg CO₂</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-1.5 mt-2">
              <TrendingDown className="h-4 w-4 text-brand-emerald" />
              <span className="text-xs text-muted-foreground font-semibold">
                {emissions.total < 900 ? 'Better than 900kg average' : 'Above average footprint'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-border/80 rounded-2xl">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-wider">
              Eco Challenges
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold flex items-baseline gap-1.5">
              {completedChallenges.length}
              <span className="text-xs font-semibold text-muted-foreground">/ {totalChallengesCount}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground font-semibold">
              <Trophy className="h-4 w-4 text-brand-emerald" />
              <span>Participating actively</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-border/80 rounded-2xl">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-wider">
              Badges Earned
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold">
              {unlockedBadges.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground font-semibold">
              <Award className="h-4 w-4 text-brand-emerald" />
              <span>Sustainability achievements</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 glass-card border-border/80 rounded-3xl flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-extrabold flex items-center gap-2">
              <Gauge className="h-4.5 w-4.5 text-brand-emerald" />
              Category Breakdown
            </CardTitle>
            <CardDescription className="text-[10px] font-semibold">
              Primary carbon contributors in kg CO₂
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            {mounted ? (
              pieData.length > 0 ? (
                <div className="w-full h-48 flex items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none">
                    <span className="text-xs font-bold text-muted-foreground uppercase">Total</span>
                    <span className="text-xl font-black text-foreground">{emissions.total}</span>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">kg CO₂</span>
                  </div>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-xs text-muted-foreground font-semibold">
                  No data to display. Complete calculation.
                </div>
              )
            ) : (
              <div className="h-48" />
            )}

            <div className="w-full grid grid-cols-2 gap-3.5 mt-4">
              {pieData.map((d, index) => (
                <div key={index} className="flex items-center gap-2 text-xs font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-muted-foreground truncate">{d.name}:</span>
                  <span className="text-foreground font-bold">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 glass-card border-border/80 rounded-3xl flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-extrabold flex items-center gap-2">
              <TrendingDown className="h-4.5 w-4.5 text-brand-emerald" />
              Reduction Trajectory & Target
            </CardTitle>
            <CardDescription className="text-[10px] font-semibold">
              Simulated progression timeline comparing historical carbon with target reductions
            </CardDescription>
          </CardHeader>
          <CardContent className="py-6 flex-1 flex flex-col justify-center">
            {mounted ? (
              <div className="w-full h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorFootprint" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.62 0.17 150)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="oklch(0.62 0.17 150)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="name" 
                      stroke="currentColor" 
                      className="text-muted-foreground/60 text-[10px] font-bold" 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="currentColor" 
                      className="text-muted-foreground/60 text-[10px] font-bold" 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <Tooltip content={<CustomAreaTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="Footprint" 
                      stroke="oklch(0.62 0.17 150)" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorFootprint)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-56" />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 glass-panel border-border/80 rounded-3xl">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-md font-extrabold flex items-center gap-2">
              <ShieldAlert className="h-4.5 w-4.5 text-brand-emerald" />
              Weekly Sustainability Report
            </CardTitle>
            <CardDescription className="text-[10px] font-semibold">
              Localized summary diagnostic checkup based on activities
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Major Contributor
                </span>
                <p className="text-sm font-bold text-foreground mt-1">
                  {largestContributor}
                </p>
                <p className="text-[10px] text-muted-foreground font-semibold mt-1">
                  Represents the highest carbon footprint component.
                </p>
              </div>
              
              <div className="p-4 rounded-2xl bg-brand-emerald/5 border border-brand-emerald/10">
                <span className="text-[10px] font-bold text-brand-emerald uppercase tracking-wider">
                  Sustainability Progress
                </span>
                <p className="text-sm font-bold text-foreground mt-1">
                  {calculatorInputs.activeKm > 0 ? 'Active commuting offsets active' : 'Awaiting offsets'}
                </p>
                <p className="text-[10px] text-muted-foreground font-semibold mt-1">
                  {calculatorInputs.activeKm > 0 
                    ? `Your walking/biking offsets ~${Math.min(5, Math.round(calculatorInputs.activeKm * 0.05))}kg CO₂ monthly.` 
                    : 'Add walking/cycling in the calculator to earn carbon offsets.'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                AI Sustainability Coach Action Recommendation
              </h4>
              <div className="p-4 rounded-2xl bg-card border border-border/80 flex items-start gap-3">
                <Bot className="h-5 w-5 text-brand-emerald shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-foreground">
                    &quot;Transitioning travel to public transit twice weekly could reduce approximately 15kg CO₂ monthly.&quot;
                  </p>
                  <Link href="/coach" className="text-[10px] text-brand-emerald font-bold hover:underline inline-flex items-center gap-1">
                    Ask Coach Eco
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1 glass-panel border-border/80 rounded-3xl flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-md font-extrabold flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-brand-emerald" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-[10px] font-semibold">
              Explore your profile features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <Link href="/coach" className="flex items-center justify-between p-3.5 rounded-2xl bg-background border border-border/80 hover:border-brand-emerald/40 hover:shadow-sm transition-all group">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-brand-emerald/10 text-brand-emerald flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">AI Coach Dialog</h4>
                  <p className="text-[9px] text-muted-foreground font-semibold">Consult Eco on habits</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-brand-emerald transition-colors" />
            </Link>

            <Link href="/challenges" className="flex items-center justify-between p-3.5 rounded-2xl bg-background border border-border/80 hover:border-brand-emerald/40 hover:shadow-sm transition-all group">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-brand-emerald/10 text-brand-emerald flex items-center justify-center">
                  <Trophy className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Weekly Challenges</h4>
                  <p className="text-[9px] text-muted-foreground font-semibold">Complete challenges & earn XP</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-brand-emerald transition-colors" />
            </Link>

            <Link href="/learn" className="flex items-center justify-between p-3.5 rounded-2xl bg-background border border-border/80 hover:border-brand-emerald/40 hover:shadow-sm transition-all group">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-brand-emerald/10 text-brand-emerald flex items-center justify-center">
                  <Leaf className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Learning Hub</h4>
                  <p className="text-[9px] text-muted-foreground font-semibold">Explore educational guides</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-brand-emerald transition-colors" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
