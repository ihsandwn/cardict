import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'default' | 'outline';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
    default: 'btn-primary',
    outline:
        'rounded-full border border-primary/30 px-5 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/10',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', ...props }, ref) => (
        <button
            ref={ref}
            className={cn(variants[variant], 'disabled:cursor-not-allowed disabled:opacity-70', className)}
            {...props}
        />
    ),
);

Button.displayName = 'Button';

