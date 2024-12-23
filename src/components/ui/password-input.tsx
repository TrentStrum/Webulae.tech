'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { cn } from '@/src/lib/utils';

interface PasswordInputProps {
	value: string;
	onChange: (value: string) => void;
	showValidation?: boolean;
}

export function PasswordInput({ value, onChange }: PasswordInputProps): JSX.Element {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="relative">
			<Input
				type={showPassword ? 'text' : 'password'}
				className={cn('pr-10')}
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
			<Button
				type="button"
				variant="ghost"
				size="sm"
				className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
				onClick={() => setShowPassword(!showPassword)}
				tabIndex={-1}
			>
				{showPassword ? (
					<EyeOff className="h-4 w-4 text-muted-foreground" />
				) : (
					<Eye className="h-4 w-4 text-muted-foreground" />
				)}
				<span className="sr-only">
					{showPassword ? 'Hide password' : 'Show password'}
				</span>
			</Button>
		</div>
	);
} 