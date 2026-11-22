import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="bg-terracotta/10 border border-terracotta/30 text-charcoal dark:text-ivory rounded-xl p-6 text-center max-w-lg mx-auto my-8">
      <div className="w-12 h-12 bg-terracotta/20 text-terracotta rounded-full flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-charcoal dark:text-ivory mb-1">
        Request Error
      </h3>
      <p className="text-sm text-charcoal/80 dark:text-ivory/80 mb-5">
        {message || 'Failed to fetch data from the server.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta hover:bg-terracotta-hover text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}

