import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
    return (
        <div
            className={cn('rounded-3xl bg-surface-2/80 p-5', className)}
            {...props}
        />
    );
}

