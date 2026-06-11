'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  ArrowLeft, 
  ArrowRight,
  TrendingDown,
  Sparkles,
  Navigation
} from 'lucide-react';
import { useCarbonaStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateEmissions, CalculatorInputs } from '@/lib/carbon-calculations';

export default function CalculatorClient() {
  const router = useRouter();
  const { calculatorInputs, updateCalculator } = useCarbonaStore();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CalculatorInputs>(calculatorInputs);
  const liveEmissions = calculateEmissions(formData);

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

  const stepTitles = [
    'Transportation & Commute',
    'Home Energy Usage',
    'Food & Diet',
    'Shopping & Consumption'
  ];

  return (
    <div className="w-full flex-1 flex flex-col md:flex-row gap-6 items-start relative select-none">
      <div className="flex-1 w-full bg-card/60 backdrop-blur-md border border-border/80 p-6 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-border/80 pb-5 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 bg-brand-emerald/10 dark:bg-brand-emerald/20 text-brand-emerald flex items-center justify-center rounded-xl">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                Step {step} of 4
              </span>
              <h2 className="text-lg font-extrabold text-foreground">
                {stepTitles[step - 1]}
              </h2>
            </div>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map(idx => (
              <span 
                key={idx} 
                className={`h-2 rounded-full transition-all duration-300 ${
                  step === idx ? 'w-6 bg-brand-emerald' : 'w-2 bg-muted-foreground/20'
                }`} 
              />
            ))}
          </div>
        </div>

        <div className="min-h-[360px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {step === 1 && (
                <div className="space-y-5">
                  <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                    Transportation is typically a person&apos;s largest direct source of carbon emissions. Give your monthly commuting details below.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="carType" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Primary Vehicle Engine
                      </Label>
                      <select
                        id="carType"
                        value={formData.carType}
                        onChange={(e) => handleChange('carType', e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-border/80 bg-background/50 outline-none text-sm font-semibold focus:border-brand-emerald cursor-pointer"
                      >
                        <option value="none">No Private Car / Walk only</option>
                        <option value="petrol">Petrol (Gasoline)</option>
                        <option value="diesel">Diesel</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="electric">Electric (EV)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="carKm" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Car Travel (km/month)
                      </Label>
                      <Input
                        id="carKm"
                        type="number"
                        min="0"
                        disabled={formData.carType === 'none'}
                        value={formData.carKm || ''}
                        onChange={(e) => handleChange('carKm', Number(e.target.value))}
                        placeholder={formData.carType === 'none' ? 'Disabled (No car)' : 'e.g. 500'}
                        className="h-11 bg-background/50 text-sm font-semibold focus-visible:ring-brand-emerald"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transitKm" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Bus / Train Travel (km/month)
                      </Label>
                      <Input
                        id="transitKm"
                        type="number"
                        min="0"
                        value={formData.transitKm || ''}
                        onChange={(e) => handleChange('transitKm', Number(e.target.value))}
                        placeholder="e.g. 150"
                        className="h-11 bg-background/50 text-sm font-semibold focus-visible:ring-brand-emerald"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="flightHours" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Aviation / Flights (hours/year)
                      </Label>
                      <Input
                        id="flightHours"
                        type="number"
                        min="0"
                        value={formData.flightHours || ''}
                        onChange={(e) => handleChange('flightHours', Number(e.target.value))}
                        placeholder="e.g. 10"
                        className="h-11 bg-background/50 text-sm font-semibold focus-visible:ring-brand-emerald"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Label htmlFor="activeKm" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Navigation className="h-4 w-4 text-brand-emerald" />
                      Active Commuting (Walking/Cycling km/month)
                    </Label>
                    <Input
                      id="activeKm"
                      type="number"
                      min="0"
                      value={formData.activeKm || ''}
                      onChange={(e) => handleChange('activeKm', Number(e.target.value))}
                      placeholder="Earn a carbon credit bonus! e.g. 30"
                      className="h-11 bg-background/50 text-sm font-semibold focus-visible:ring-brand-emerald"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                    Household heating, appliances, and air conditioning drive residential energy demand and electrical load.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="electricityKwh" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Electricity Load (kWh/month)
                      </Label>
                      <Input
                        id="electricityKwh"
                        type="number"
                        min="0"
                        value={formData.electricityKwh || ''}
                        onChange={(e) => handleChange('electricityKwh', Number(e.target.value))}
                        placeholder="Check your electric bill, e.g. 250"
                        className="h-11 bg-background/50 text-sm font-semibold focus-visible:ring-brand-emerald"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="acHours" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Air Conditioning (hours/day)
                      </Label>
                      <Input
                        id="acHours"
                        type="number"
                        min="0"
                        max="24"
                        value={formData.acHours || ''}
                        onChange={(e) => handleChange('acHours', Number(e.target.value))}
                        placeholder="Daily estimate, e.g. 5"
                        className="h-11 bg-background/50 text-sm font-semibold focus-visible:ring-brand-emerald"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 max-w-sm">
                    <Label htmlFor="heatingSource" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Home Heating Utility Source
                    </Label>
                    <select
                      id="heatingSource"
                      value={formData.heatingSource}
                      onChange={(e) => handleChange('heatingSource', e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-border/80 bg-background/50 outline-none text-sm font-semibold focus:border-brand-emerald cursor-pointer"
                    >
                      <option value="none">No heating needed / Solar</option>
                      <option value="gas">Natural Gas</option>
                      <option value="electric">Electrical Heating</option>
                    </select>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                    Agricultural emissions (especially beef and dairy) hold a major position in greenhouse impact. Tell us your diet profile.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="dietType" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Dietary Preference
                      </Label>
                      <select
                        id="dietType"
                        value={formData.dietType}
                        onChange={(e) => handleChange('dietType', e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-border/80 bg-background/50 outline-none text-sm font-semibold focus:border-brand-emerald cursor-pointer"
                      >
                        <option value="meat">Meat Enthusiast (beef, poultry, pork)</option>
                        <option value="low-meat">Low Meat / Flexitarian</option>
                        <option value="vegetarian">Vegetarian (no meat, consumes eggs/dairy)</option>
                        <option value="vegan">Vegan (strictly plant-based)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dairyFrequency" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Dairy Consumption
                      </Label>
                      <select
                        id="dairyFrequency"
                        value={formData.dairyFrequency}
                        onChange={(e) => handleChange('dairyFrequency', e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-border/80 bg-background/50 outline-none text-sm font-semibold focus:border-brand-emerald cursor-pointer"
                      >
                        <option value="high">Daily / High (milk, butter, cheese)</option>
                        <option value="moderate">Moderate / Some meals</option>
                        <option value="low">Infrequent / Minimal</option>
                        <option value="none">None / Plant alternative milk</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-5">
                  <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                    Indirect carbon represents the energy required to manufacture clothing, hardware, and ship parcels to your doorstep.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="clothingCount" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        New Clothes Purchased (items/month)
                      </Label>
                      <Input
                        id="clothingCount"
                        type="number"
                        min="0"
                        value={formData.clothingCount || ''}
                        onChange={(e) => handleChange('clothingCount', Number(e.target.value))}
                        placeholder="e.g. 2"
                        className="h-11 bg-background/50 text-sm font-semibold focus-visible:ring-brand-emerald"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="electronicsCount" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Electronics Purchased (devices/year)
                      </Label>
                      <Input
                        id="electronicsCount"
                        type="number"
                        min="0"
                        value={formData.electronicsCount || ''}
                        onChange={(e) => handleChange('electronicsCount', Number(e.target.value))}
                        placeholder="Phones, laptops, etc. e.g. 1"
                        className="h-11 bg-background/50 text-sm font-semibold focus-visible:ring-brand-emerald"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 max-w-sm">
                    <Label htmlFor="onlineDeliveries" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Online Deliveries / Packages (orders/month)
                    </Label>
                    <Input
                      id="onlineDeliveries"
                      type="number"
                      min="0"
                      value={formData.onlineDeliveries || ''}
                      onChange={(e) => handleChange('onlineDeliveries', Number(e.target.value))}
                      placeholder="Online shopping packages, e.g. 4"
                      className="h-11 bg-background/50 text-sm font-semibold focus-visible:ring-brand-emerald"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between items-center pt-8 border-t border-border/80 mt-8">
            <Button
              variant="outline"
              disabled={step === 1}
              onClick={handleBack}
              className="flex items-center gap-2 rounded-xl text-xs font-bold h-11 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            
            <Button
              onClick={handleNext}
              className="flex items-center gap-2 rounded-xl text-xs font-bold h-11 bg-brand-emerald hover:bg-brand-emerald/95 text-white shadow-md shadow-brand-emerald/10 cursor-pointer"
            >
              {step === 4 ? (
                <>
                  Generate Twin
                  <Sparkles className="h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full md:w-80 bg-gradient-to-br from-brand-emerald/10 to-brand-blue/5 border border-brand-emerald/20 p-6 rounded-3xl flex flex-col justify-between min-h-[320px] md:sticky md:top-8">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold text-brand-emerald bg-brand-emerald/10 border border-brand-emerald/10 mb-4">
            <TrendingDown className="h-3.5 w-3.5" />
            Live Impact Indicator
          </span>
          <h3 className="text-md font-extrabold text-foreground">
            Current Assessment
          </h3>
          <p className="text-[11px] text-muted-foreground font-semibold mt-1">
            Observe the estimates shift dynamically as you input your data.
          </p>

          <div className="my-8">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
              Estimated Footprint
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-4xl font-extrabold tracking-tight text-foreground">
                {liveEmissions.total}
              </span>
              <span className="text-xs font-bold text-muted-foreground uppercase">
                kg CO₂/mo
              </span>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center text-xs font-bold mb-2">
                <span className="text-muted-foreground">Environmental Score</span>
                <span className="text-brand-emerald">{liveEmissions.score}/100</span>
              </div>
              <div className="h-2.5 w-full bg-muted-foreground/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${liveEmissions.score}%` }}
                  transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                  className={`h-full rounded-full ${
                    liveEmissions.score >= 80 
                      ? 'bg-brand-emerald' 
                      : liveEmissions.score >= 50 
                      ? 'bg-amber-500' 
                      : 'bg-destructive'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-card border border-border/80 text-[10px] font-medium text-muted-foreground leading-relaxed flex items-start gap-2.5">
          <Sparkles className="h-4.5 w-4.5 text-brand-emerald shrink-0 mt-0.5" />
          <span>
            The average global monthly footprint is ~900kg CO₂. Aim to keep your footprint under 400kg to unlock the <strong>Green Warrior</strong> status!
          </span>
        </div>
      </div>
    </div>
  );
}
