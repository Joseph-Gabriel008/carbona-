import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: "Page Not Found | Carbona",
};

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 min-h-[60vh]">
      <div className="h-16 w-16 rounded-full bg-brand-emerald/10 text-brand-emerald flex items-center justify-center mb-6">
        <span className="text-3xl font-black">?</span>
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">
        Page Not Found
      </h1>
      <p className="text-muted-foreground text-sm font-medium max-w-md mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-6 py-3 rounded-2xl font-bold text-sm text-white bg-brand-emerald hover:bg-brand-emerald/95 shadow-md shadow-brand-emerald/10 transition-all"
        >
          Go Home
        </Link>
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-2xl font-bold text-sm bg-muted/50 border border-border/80 text-muted-foreground hover:text-foreground transition-all"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
