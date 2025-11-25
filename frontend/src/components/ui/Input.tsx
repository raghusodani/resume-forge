import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-3">
        {label && (
          <label className="text-base font-semibold text-white ml-1 tracking-wide block">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-14 w-full rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm px-4 py-3 text-base font-medium text-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-white/30 hover:bg-white/[0.15]",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-400 ml-1">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
