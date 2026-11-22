import React from 'react';

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  trend,
  className = '',
}) {
  const variantStyles = {
    default: 'border-mutedGrey/20 hover:border-terracotta/40',
    sage: 'border-sage/30 bg-sage/5 dark:bg-sage/10',
    terracotta: 'border-terracotta/30 bg-terracotta/5 dark:bg-terracotta/10',
    sand: 'border-sand/40 bg-sand/10 dark:bg-sand/10',
  };

  const iconBg = {
    default: 'bg-ivory dark:bg-charcoal text-charcoal dark:text-ivory',
    sage: 'bg-sage/20 text-sage dark:text-sage-light',
    terracotta: 'bg-terracotta/20 text-terracotta dark:text-terracotta-light',
    sand: 'bg-sand/30 text-charcoal dark:text-sand-light',
  };

  return (
    <div
      className={`bg-white dark:bg-charcoal-light rounded-xl p-5 border shadow-sm transition-all duration-200 hover:shadow-md ${variantStyles[variant]} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-mutedGrey">
            {title}
          </span>
          <div className="mt-2 text-2xl font-bold tracking-tight text-charcoal dark:text-ivory">
            {value}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-mutedGrey dark:text-ivory/60">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${iconBg[variant]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-mutedGrey/10 flex items-center gap-1.5 text-xs font-medium text-sage dark:text-sage-light">
          {trend}
        </div>
      )}
    </div>
  );
}

