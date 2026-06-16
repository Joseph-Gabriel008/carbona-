'use client';

import React from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 min-h-[60vh]">
      <div className="h-16 w-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-6">
        <span className="text-3xl font-black">!</span>
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">
        Something Went Wrong
      </h1>
      <p className="text-muted-foreground text-sm font-medium max-w-md mb-2">
        An unexpected error occurred. This has been logged and we&apos;ll look into it.
      </p>
      {error.digest && (
        <p className="text-[10px] text-muted-foreground/60 font-mono mb-6">
          Error ID: {error.digest}
        </p>
      )}
      <button
        onClick={() => reset()}
        className="px-6 py-3 rounded-2xl font-bold text-sm text-white bg-brand-emerald hover:bg-brand-emerald/95 shadow-md shadow-brand-emerald/10 transition-all cursor-pointer mt-2"
      >
        Try Again
      </button>
    </div>
  );
}
