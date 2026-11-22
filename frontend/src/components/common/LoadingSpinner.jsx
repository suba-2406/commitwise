import React from 'react';

export function LoadingSpinner({ text = 'Analyzing GitHub activity...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-sand/40"></div>
        <div className="absolute inset-0 rounded-full border-4 border-terracotta border-t-transparent animate-spin"></div>
      </div>
      <p className="text-charcoal/70 dark:text-ivory/70 text-sm font-medium tracking-wide">
        {text}
      </p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-charcoal-light rounded-xl p-5 border border-mutedGrey/20 shadow-sm animate-pulse">
      <div className="h-4 bg-mutedGrey/20 rounded w-1/3 mb-4"></div>
      <div className="h-8 bg-mutedGrey/30 rounded w-2/3 mb-2"></div>
      <div className="h-3 bg-mutedGrey/20 rounded w-1/2"></div>
    </div>
  );
}

