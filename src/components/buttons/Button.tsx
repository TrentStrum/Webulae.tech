import { cn } from '@/src/utils/utils';

import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'outline';
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
	return (
		<button
			className={cn(
				'px-4 py-2 rounded',
				{
					'bg-primary text-white': variant === 'primary',
					'bg-secondary text-white': variant === 'secondary',
					'border border-gray-300': variant === 'outline',
				},
				className
			)}
			{...props}
		/>
	);
}
