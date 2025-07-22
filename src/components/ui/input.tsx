'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className, id, ...props }, ref) => {
        const inputId = id || React.useId();

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={inputId} className="block text-sm font-semibold text-gray-700 mb-1">
                        {label}
                    </label>
                )}
                <input
                    id={inputId}
                    ref={ref}
                    aria-invalid={!!error}
                    className={cn(
                        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 bg-background border-input flex h-10 w-full min-w-0 rounded-md border bg-white px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mt-2",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                        error && "border-red-500 ring-red-200",
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };