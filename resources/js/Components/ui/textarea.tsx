import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => (
        <textarea
            ref={ref}
            className={cn(
                'w-full rounded-2xl border-0 bg-surface-2 px-4 py-3 text-sm text-on-surface placeholder:text-on-surface/40 focus:ring-2 focus:ring-primary',
                className,
            )}
            {...props}
        />
    ),
);

Textarea.displayName = 'Textarea';

