import React from 'react';
import DashboardClient from './DashboardClient';

export const metadata = {
  title: "Dashboard | Carbona",
  description: "View your carbon footprint breakdown, sustainability score, and track your environmental progress.",
};

export default function Page() {
  return <DashboardClient />;
}
