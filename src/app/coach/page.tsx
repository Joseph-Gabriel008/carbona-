import React from 'react';
import CoachClient from './CoachClient';

export const metadata = {
  title: "AI Coach Eco | Carbona",
  description: "Chat with Eco, your AI sustainability coach powered by Gemini, for personalized carbon reduction advice.",
};

export default function Page() {
  return <CoachClient />;
}
