'use client';

import React from 'react';

/**
 * Global Next.js error boundary component for catching rendering exceptions.
 * Serves a generic, safe message to the user to prevent leak of stack details,
 * but keeps error.digest in a DOM data-attribute for automated monitoring.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div 
      data-error-digest={error.digest} 
      className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 min-h-[60vh]"
    >
      <div className="h-16 w-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-6">
        <span className="text-3xl font-black">!</span>
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">
        Something Went Wrong
      </h1>
      <p className="text-muted-foreground text-sm font-medium max-w-md mb-6">
        An unexpected error occurred. This has been logged and we&apos;ll look into it.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 rounded-2xl font-bold text-sm text-white bg-brand-emerald hover:bg-brand-emerald/95 shadow-md shadow-brand-emerald/10 transition-all cursor-pointer mt-2"
      >
        Try Again
      </button>
    </div>
  );
}
