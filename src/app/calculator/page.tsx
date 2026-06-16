import React from 'react';
import CalculatorClient from './CalculatorClient';

export const metadata = {
  title: "Carbon Calculator | Carbona",
  description: "Calculate your personal carbon footprint across transportation, energy, food, and shopping categories.",
};

export default function Page() {
  return <CalculatorClient />;
}
