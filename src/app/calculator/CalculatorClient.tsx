'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  ArrowLeft, 
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Navigation,
  Check,
  Flame,
  Zap,
  Utensils,
  Smile,
  XCircle,
  Footprints,
  Car,
  Leaf,
  ShoppingBag,
  Smartphone,
  Package,
  Fuel,
  Sun,
  Shield,
  Coffee,
  Egg,
  Beef,
  Milk,
  Globe,
  Wind
} from 'lucide-react';
import { useCarbonaStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateEmissions, CalculatorInputs } from '@/lib/carbon-calculations';

// Options mapping for transportation type cards
const CAR_TYPES = [
  { value: 'none', label: 'Active & Transit', desc: 'Walking, cycling, or transit only', icon: Footprints, color: 'text-sky-500 bg-sky-500/10 border-sky-500/15' },
  { value: 'electric', label: 'Electric (EV)', desc: 'Battery EV, zero direct emissions', icon: Zap, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/15' },
  { value: 'hybrid', label: 'Hybrid', desc: 'Combined petrol & electric drive', icon: Leaf, color: 'text-teal-500 bg-teal-500/10 border-teal-500/15' },
  { value: 'petrol', label: 'Petrol (Gasoline)', desc: 'Standard gasoline combustion engine', icon: Fuel, color: 'text-amber-500 bg-amber-500/10 border-amber-500/15' },
  { value: 'diesel', label: 'Diesel', desc: 'Standard diesel combustion engine', icon: Car, color: 'text-rose-500 bg-rose-500/10 border-rose-500/15' }
] as const;

// Options mapping for heating type cards
const HEATING_SOURCES = [
  { value: 'none', label: 'None or Solar', desc: 'No utility heating needed or zero-carbon solar heating', icon: Sun, color: 'text-amber-500 bg-amber-500/10 border-amber-500/15' },
  { value: 'electric', label: 'Electric', desc: 'Electrical baseboard heating or heat pump systems', icon: Zap, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/15' },
  { value: 'gas', label: 'Natural Gas', desc: 'Central gas boiler or utility furnace systems', icon: Flame, color: 'text-rose-500 bg-rose-500/10 border-rose-500/15' }
] as const;

// Options mapping for diet type cards
const DIET_TYPES = [
  { value: 'vegan', label: 'Vegan', desc: 'Strict plant-based nutrition only', icon: Leaf, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/15' },
  { value: 'vegetarian', label: 'Vegetarian', desc: 'No meat, eats dairy and eggs', icon: Egg, color: 'text-teal-500 bg-teal-500/10 border-teal-500/15' },
  { value: 'low-meat', label: 'Flexitarian', desc: 'Infrequent meat, mostly plant-based', icon: Utensils, color: 'text-blue-500 bg-blue-500/10 border-blue-500/15' },
  { value: 'meat', label: 'Meat Lover', desc: 'Consumes beef, poultry, pork daily', icon: Beef, color: 'text-rose-500 bg-rose-500/10 border-rose-500/15' }
] as const;

// Options mapping for dairy type cards
const DAIRY_FREQUENCIES = [
  { value: 'none', label: 'None', desc: 'Dairy-free or plant milks only', icon: XCircle, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/15' },
  { value: 'low', label: 'Minimal', desc: 'Infrequent milk, cheese, or butter', icon: Smile, color: 'text-teal-500 bg-teal-500/10 border-teal-500/15' },
  { value: 'moderate', label: 'Moderate', desc: 'Dairy with some daily meals', icon: Coffee, color: 'text-blue-500 bg-blue-500/10 border-blue-500/15' },
  { value: 'high', label: 'High / Daily', desc: 'Daily milk, butter, or gourmet cheese', icon: Milk, color: 'text-rose-500 bg-rose-500/10 border-rose-500/15' }
] as const;

export default function CalculatorClient() {
  const router = useRouter();
  const { calculatorInputs, updateCalculator } = useCarbonaStore();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CalculatorInputs>(calculatorInputs);
  const liveEmissions = calculateEmissions(formData);

  // Dynamic Animated metrics counters
  const [animatedScore, setAnimatedScore] = useState(liveEmissions.score);
  const [animatedTotal, setAnimatedTotal] = useState(liveEmissions.total);

  useEffect(() => {
    const duration = 500; // Countup speed in ms
    let startTimestamp: number | null = null;
    const initialScore = animatedScore;
    const targetScore = liveEmissions.score;
    const initialTotal = animatedTotal;
    const targetTotal = liveEmissions.total;

    const stepCounter = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      setAnimatedScore(Math.round(initialScore + (targetScore - initialScore) * progress));
      setAnimatedTotal(Math.round(initialTotal + (targetTotal - initialTotal) * progress));

      if (progress < 1) {
        window.requestAnimationFrame(stepCounter);
      }
    };

    window.requestAnimationFrame(stepCounter);
  }, [liveEmissions.score, liveEmissions.total]);

  const handleChange = (field: keyof CalculatorInputs, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      updateCalculator(formData);
      router.push('/twin');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const steps = [
    { id: 1, name: 'Transportation', icon: Car },
    { id: 2, name: 'Energy', icon: Zap },
    { id: 3, name: 'Food', icon: Utensils },
    { id: 4, name: 'Shopping', icon: ShoppingBag },
  ];

  const stepTitles = [
    'Transportation & Commute',
    'Home Energy Usage',
    'Food & Diet',
    'Shopping & Consumption'
  ];

  // Dynamic assessment calculations
  const percentDiff = Math.round(((liveEmissions.total - 900) / 900) * 100);

  const getStatusBadge = (score: number) => {
    if (score >= 85) return { label: 'CLIMATE HERO', color: 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    if (score >= 70) return { label: 'GREEN WARRIOR', color: 'text-teal-500 dark:text-teal-400 bg-teal-500/10 border-teal-500/20' };
    if (score >= 50) return { label: 'ECO EXPLORER', color: 'text-blue-500 dark:text-blue-400 bg-blue-500/10 border-blue-500/20' };
    if (score >= 30) return { label: 'CARBON LEARNER', color: 'text-amber-500 dark:text-amber-400 bg-amber-500/10 border-amber-500/20' };
    return { label: 'CARBON HEAVY', color: 'text-rose-500 dark:text-rose-400 bg-rose-500/10 border-rose-500/20' };
  };

  const statusInfo = getStatusBadge(liveEmissions.score);

  return (
    <div className="w-full flex-1 flex flex-col lg:flex-row gap-8 items-start relative select-none pb-12">
      {/* Decorative premium ambient glow effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-emerald/10 dark:bg-brand-emerald/5 blur-[120px] rounded-full pointer-events-none animate-drift" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-brand-blue/10 dark:bg-brand-blue/5 blur-[100px] rounded-full pointer-events-none animate-drift" style={{ animationDelay: '-5s' }} />


      {/* Form Container */}
      <div className="flex-1 w-full bg-card/40 backdrop-blur-xl border border-border/40 p-8 sm:p-10 rounded-3xl shadow-lg relative overflow-hidden z-10">
        {/* Progress Connector Flow */}
        <div className="relative mb-10 w-full pt-4 pb-6 px-2">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted dark:bg-muted/10 -translate-y-1/2 rounded-full z-0" />
          <motion.div 
            className="absolute top-1/2 left-0 h-1 bg-brand-emerald -translate-y-1/2 rounded-full z-0"
            initial={{ width: '0%' }}
            animate={{ width: `${((step - 1) / 3) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
          <div className="relative flex justify-between w-full z-10">
            {steps.map(s => {
              const isCompleted = s.id < step;
              const isActive = s.id === step;
              const StepIcon = s.icon;
              return (
                <div key={s.id} className="flex flex-col items-center gap-2.5">
                  <motion.div 
                    animate={{ 
                      scale: isActive ? 1.15 : 1,
                    }}
                    className={`h-11 w-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isActive 
                        ? 'bg-brand-emerald text-white shadow-lg shadow-brand-emerald/20 border-brand-emerald' 
                        : isCompleted 
                        ? 'bg-brand-emerald/10 text-brand-emerald border-brand-emerald' 
                        : 'bg-card text-muted-foreground/60 border-muted-foreground/20'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5 stroke-[3]" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </motion.div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block ${
                    isActive 
                      ? 'text-brand-emerald dark:text-emerald-400 font-extrabold scale-105' 
                      : isCompleted 
                      ? 'text-foreground/85' 
                      : 'text-muted-foreground/50'
                  }`}>
                    {s.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Title and Description */}
        <div className="space-y-3 mb-10">
          <span className="text-[10px] font-extrabold text-brand-emerald bg-brand-emerald/8 dark:bg-brand-emerald/15 px-3 py-1 rounded-full w-fit uppercase tracking-widest">
            Step {step} of 4 • {steps[step - 1].name}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-none pt-1">
            {stepTitles[step - 1]}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground/80 font-medium leading-relaxed max-w-3xl pt-2">
            {step === 1 && "Transportation is typically a person's largest direct source of carbon emissions. Give your monthly commuting details below."}
            {step === 2 && "Household heating, appliances, and air conditioning drive residential energy demand and electrical load."}
            {step === 3 && "Agricultural emissions (especially beef and dairy) hold a major position in greenhouse impact. Tell us your diet profile."}
            {step === 4 && "Indirect carbon represents the energy required to manufacture clothing, hardware, and ship parcels to your doorstep."}
          </p>
        </div>

        <div className="min-h-[380px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="space-y-8"
            >
              {step === 1 && (
                <div className="space-y-8">
                  {/* Select vehicle engine cards - optimised into highly responsive vertical-stack selector cards */}
                  <div className="space-y-4">
                    <Label className="text-sm font-semibold tracking-wide text-foreground/90">
                      Primary Vehicle Engine
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
                      {CAR_TYPES.map(opt => {
                        const Icon = opt.icon;
                        const isSelected = formData.carType === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              handleChange('carType', opt.value);
                              if (opt.value === 'none') {
                                handleChange('carKm', 0);
                              }
                            }}
                            className={`text-left p-5 rounded-2xl border border-border/50 bg-background/20 card-selector-hover ${
                              isSelected ? 'card-selector-active scale-102' : ''
                            } cursor-pointer`}
                          >
                            <div className="flex flex-col gap-4 h-full justify-between">
                              <div className="space-y-4">
                                <div className={`p-2.5 rounded-xl w-fit ${opt.color}`}>
                                  <Icon className="h-5.5 w-5.5" />
                                </div>
                                <div className="space-y-1.5">
                                  <div className="font-bold text-sm text-foreground flex items-center gap-1.5 leading-none">
                                    {opt.label}
                                    {isSelected && <Check className="h-4.5 w-4.5 text-brand-emerald shrink-0" />}
                                  </div>
                                  <p className="text-[11px] text-muted-foreground/85 leading-normal">
                                    {opt.desc}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Commute Inputs Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    {formData.carType !== 'none' && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-3"
                      >
                        <Label htmlFor="carKm" className="text-sm font-semibold tracking-wide text-foreground/90">
                          Car Travel (km/month)
                        </Label>
                        <div className="relative">
                          <Input
                            id="carKm"
                            type="number"
                            min="0"
                            value={formData.carKm || ''}
                            onChange={(e) => handleChange('carKm', Number(e.target.value))}
                            placeholder="e.g. 500"
                            className="h-12 px-4 pr-16 bg-background/25 text-sm font-semibold rounded-xl border border-border/50 input-premium-focus"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground/75">
                            km/mo
                          </span>
                        </div>
                      </motion.div>
                    )}

                    <div className="space-y-3">
                      <Label htmlFor="transitKm" className="text-sm font-semibold tracking-wide text-foreground/90">
                        Bus / Train Travel (km/month)
                      </Label>
                      <div className="relative">
                        <Input
                          id="transitKm"
                          type="number"
                          min="0"
                          value={formData.transitKm || ''}
                          onChange={(e) => handleChange('transitKm', Number(e.target.value))}
                          placeholder="e.g. 150"
                          className="h-12 px-4 pr-16 bg-background/25 text-sm font-semibold rounded-xl border border-border/50 input-premium-focus"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground/75">
                          km/mo
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="flightHours" className="text-sm font-semibold tracking-wide text-foreground/90">
                        Aviation / Flights (hours/year)
                      </Label>
                      <div className="relative">
                        <Input
                          id="flightHours"
                          type="number"
                          min="0"
                          value={formData.flightHours || ''}
                          onChange={(e) => handleChange('flightHours', Number(e.target.value))}
                          placeholder="e.g. 10"
                          className="h-12 px-4 pr-16 bg-background/25 text-sm font-semibold rounded-xl border border-border/50 input-premium-focus"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground/75">
                          hrs/yr
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="activeKm" className="text-sm font-semibold tracking-wide text-foreground/90 flex items-center gap-1.5">
                        <Navigation className="h-4 w-4 text-brand-emerald" />
                        Active Commuting (Walking/Cycling km/month)
                      </Label>
                      <div className="relative">
                        <Input
                          id="activeKm"
                          type="number"
                          min="0"
                          value={formData.activeKm || ''}
                          onChange={(e) => handleChange('activeKm', Number(e.target.value))}
                          placeholder="e.g. 30"
                          className="h-12 px-4 pr-16 bg-background/25 text-sm font-semibold rounded-xl border border-border/50 input-premium-focus"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground/75">
                          km/mo
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  {/* Select heating utility cards */}
                  <div className="space-y-4">
                    <Label className="text-sm font-semibold tracking-wide text-foreground/90">
                      Home Heating Utility Source
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {HEATING_SOURCES.map(opt => {
                        const Icon = opt.icon;
                        const isSelected = formData.heatingSource === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleChange('heatingSource', opt.value)}
                            className={`text-left p-5 rounded-2xl border border-border/50 bg-background/20 card-selector-hover ${
                              isSelected ? 'card-selector-active scale-102' : ''
                            } cursor-pointer`}
                          >
                            <div className="flex flex-col gap-4 h-full justify-between">
                              <div className="space-y-4">
                                <div className={`p-2.5 rounded-xl w-fit ${opt.color}`}>
                                  <Icon className="h-5.5 w-5.5" />
                                </div>
                                <div className="space-y-1.5">
                                  <div className="font-bold text-sm text-foreground flex items-center gap-1.5 leading-none">
                                    {opt.label}
                                    {isSelected && <Check className="h-4.5 w-4.5 text-brand-emerald shrink-0" />}
                                  </div>
                                  <p className="text-[11px] text-muted-foreground/85 leading-normal">
                                    {opt.desc}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Energy Inputs Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-3">
                      <Label htmlFor="electricityKwh" className="text-sm font-semibold tracking-wide text-foreground/90">
                        Electricity Load (kWh/month)
                      </Label>
                      <div className="relative">
                        <Input
                          id="electricityKwh"
                          type="number"
                          min="0"
                          value={formData.electricityKwh || ''}
                          onChange={(e) => handleChange('electricityKwh', Number(e.target.value))}
                          placeholder="e.g. 250"
                          className="h-12 px-4 pr-16 bg-background/25 text-sm font-semibold rounded-xl border border-border/50 input-premium-focus"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground/75">
                          kWh
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="acHours" className="text-sm font-semibold tracking-wide text-foreground/90">
                        Air Conditioning (hours/day)
                      </Label>
                      <div className="relative">
                        <Input
                          id="acHours"
                          type="number"
                          min="0"
                          max="24"
                          value={formData.acHours || ''}
                          onChange={(e) => handleChange('acHours', Number(e.target.value))}
                          placeholder="Daily estimate, e.g. 5"
                          className="h-12 px-4 pr-16 bg-background/25 text-sm font-semibold rounded-xl border border-border/50 input-premium-focus"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground/75">
                          hrs/day
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  {/* Select dietary cards */}
                  <div className="space-y-4">
                    <Label className="text-sm font-semibold tracking-wide text-foreground/90">
                      Dietary Preference
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                      {DIET_TYPES.map(opt => {
                        const Icon = opt.icon;
                        const isSelected = formData.dietType === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleChange('dietType', opt.value)}
                            className={`text-left p-5 rounded-2xl border border-border/50 bg-background/20 card-selector-hover ${
                              isSelected ? 'card-selector-active scale-102' : ''
                            } cursor-pointer`}
                          >
                            <div className="flex flex-col gap-4 h-full justify-between">
                              <div className="space-y-4">
                                <div className={`p-2.5 rounded-xl w-fit ${opt.color}`}>
                                  <Icon className="h-5.5 w-5.5" />
                                </div>
                                <div className="space-y-1.5">
                                  <div className="font-bold text-sm text-foreground flex items-center gap-1.5 leading-none">
                                    {opt.label}
                                    {isSelected && <Check className="h-4.5 w-4.5 text-brand-emerald shrink-0" />}
                                  </div>
                                  <p className="text-[11px] text-muted-foreground/85 leading-normal">
                                    {opt.desc}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Select dairy cards */}
                  <div className="space-y-4 pt-2">
                    <Label className="text-sm font-semibold tracking-wide text-foreground/90">
                      Dairy Consumption
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                      {DAIRY_FREQUENCIES.map(opt => {
                        const Icon = opt.icon;
                        const isSelected = formData.dairyFrequency === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleChange('dairyFrequency', opt.value)}
                            className={`text-left p-5 rounded-2xl border border-border/50 bg-background/20 card-selector-hover ${
                              isSelected ? 'card-selector-active scale-102' : ''
                            } cursor-pointer`}
                          >
                            <div className="flex flex-col gap-4 h-full justify-between">
                              <div className="space-y-4">
                                <div className={`p-2.5 rounded-xl w-fit ${opt.color}`}>
                                  <Icon className="h-5.5 w-5.5" />
                                </div>
                                <div className="space-y-1.5">
                                  <div className="font-bold text-sm text-foreground flex items-center gap-1.5 leading-none">
                                    {opt.label}
                                    {isSelected && <Check className="h-4.5 w-4.5 text-brand-emerald shrink-0" />}
                                  </div>
                                  <p className="text-[11px] text-muted-foreground/85 leading-normal">
                                    {opt.desc}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-8">
                  {/* Shopping Inputs Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                    <div className="space-y-3">
                      <Label htmlFor="clothingCount" className="text-sm font-semibold tracking-wide text-foreground/90 flex items-center gap-1.5">
                        <ShoppingBag className="h-4 w-4 text-brand-emerald" />
                        New Clothes Purchased
                      </Label>
                      <div className="relative">
                        <Input
                          id="clothingCount"
                          type="number"
                          min="0"
                          value={formData.clothingCount || ''}
                          onChange={(e) => handleChange('clothingCount', Number(e.target.value))}
                          placeholder="e.g. 2"
                          className="h-12 px-4 pr-20 bg-background/25 text-sm font-semibold rounded-xl border border-border/50 input-premium-focus"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground/75">
                          items/mo
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="electronicsCount" className="text-sm font-semibold tracking-wide text-foreground/90 flex items-center gap-1.5">
                        <Smartphone className="h-4 w-4 text-brand-emerald" />
                        Electronics Purchased
                      </Label>
                      <div className="relative">
                        <Input
                          id="electronicsCount"
                          type="number"
                          min="0"
                          value={formData.electronicsCount || ''}
                          onChange={(e) => handleChange('electronicsCount', Number(e.target.value))}
                          placeholder="e.g. 1"
                          className="h-12 px-4 pr-20 bg-background/25 text-sm font-semibold rounded-xl border border-border/50 input-premium-focus"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground/75">
                          dev/yr
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="onlineDeliveries" className="text-sm font-semibold tracking-wide text-foreground/90 flex items-center gap-1.5">
                        <Package className="h-4 w-4 text-brand-emerald" />
                        Online Deliveries
                      </Label>
                      <div className="relative">
                        <Input
                          id="onlineDeliveries"
                          type="number"
                          min="0"
                          value={formData.onlineDeliveries || ''}
                          onChange={(e) => handleChange('onlineDeliveries', Number(e.target.value))}
                          placeholder="e.g. 4"
                          className="h-12 px-4 pr-20 bg-background/25 text-sm font-semibold rounded-xl border border-border/50 input-premium-focus"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground/75">
                          pkgs/mo
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-8 border-t border-border/40 mt-10">
            <Button
              variant="outline"
              disabled={step === 1}
              onClick={handleBack}
              className="flex items-center gap-2 rounded-xl text-xs font-bold h-11 border-border/60 hover:bg-muted/50 hover:text-foreground active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
              Back
            </Button>
            
            <Button
              onClick={handleNext}
              className="flex items-center gap-2 rounded-xl text-xs font-bold h-11 bg-brand-emerald hover:bg-brand-emerald/90 text-white shadow-lg shadow-brand-emerald/15 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all cursor-pointer"
            >
              {step === 4 ? (
                <>
                  Generate Twin
                  <Sparkles className="h-4.5 w-4.5" />
                </>
              ) : (
                <>
                  Next Step
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Right Side Assessment Panel */}
      <div className="w-full lg:w-96 bg-gradient-to-br from-brand-emerald/8 via-brand-blue/5 to-transparent border border-brand-emerald/15 p-8 rounded-3xl flex flex-col justify-between min-h-[380px] lg:sticky lg:top-8 shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden z-10">
        {/* Subtle decorative internal background glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-brand-emerald/15 blur-2xl rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold text-brand-emerald bg-brand-emerald/10 border border-brand-emerald/10 mb-6 uppercase tracking-wider">
            <TrendingDown className="h-3.5 w-3.5 animate-pulse" />
            Live Impact Indicator
          </span>
          
          <h3 className="text-lg font-extrabold text-foreground tracking-tight flex items-center gap-2">
            🌱 Environmental Status
          </h3>
          <p className="text-[11px] text-muted-foreground font-semibold mt-1">
            Estimates update dynamically as you complete the assessment.
          </p>

          <div className="my-8 space-y-6">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest block mb-1.5">
                Active Assessment Level
              </span>
              <div className={`text-xs font-black uppercase tracking-wider border px-3 py-1.5 rounded-xl w-fit ${statusInfo.color} shadow-sm transition-all duration-300`}>
                {statusInfo.label}
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest block">
                Estimated Footprint
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-5xl font-black tracking-tight text-foreground bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text">
                  {animatedTotal}
                </span>
                <span className="text-xs font-extrabold text-muted-foreground uppercase">
                  kg CO₂/mo
                </span>
              </div>
            </div>

            {/* Dynamic Comparison to Global Average */}
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-card/50 border border-border/40 backdrop-blur-md shadow-inner transition-all duration-300">
              {percentDiff <= 0 ? (
                <>
                  <div className="h-9 w-9 bg-emerald-500/10 text-emerald-500 flex items-center justify-center rounded-xl shrink-0">
                    <TrendingDown className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-black text-emerald-500">
                      {Math.abs(percentDiff)}% Below Average
                    </div>
                    <p className="text-[9px] text-muted-foreground font-semibold leading-tight">
                      Compared to the global average monthly footprint (900 kg).
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-9 w-9 bg-rose-500/10 text-rose-500 flex items-center justify-center rounded-xl shrink-0">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-black text-rose-500">
                      +{percentDiff}% Above Average
                    </div>
                    <p className="text-[9px] text-muted-foreground font-semibold leading-tight">
                      Compared to the global average monthly footprint (900 kg).
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center text-xs font-bold mb-2">
                <span className="text-muted-foreground">Eco Score</span>
                <span className="text-brand-emerald">{animatedScore}/100</span>
              </div>
              <div className="h-3 w-full bg-muted-foreground/10 dark:bg-muted/20 rounded-full overflow-hidden p-0.5 border border-border/30">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${liveEmissions.score}%` }}
                  transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                  className={`h-full rounded-full shadow-inner ${
                    liveEmissions.score >= 80 
                      ? 'bg-brand-emerald shadow-[0_0_12px_oklch(0.62_0.17_150_/_40%)]' 
                      : liveEmissions.score >= 50 
                      ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]' 
                      : 'bg-destructive shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4.5 rounded-2xl bg-card/75 border border-border/40 text-[10px] font-semibold text-muted-foreground/90 leading-relaxed flex items-start gap-3 relative z-10 shadow-inner mt-4">
          <Sparkles className="h-5.5 w-5.5 text-brand-emerald shrink-0 mt-0.5" />
          <span>
            Global footprint average is ~900kg. Aim to keep yours under 400kg to hold onto the elite <strong>Green Warrior</strong> status!
          </span>
        </div>
      </div>
    </div>
  );
}
