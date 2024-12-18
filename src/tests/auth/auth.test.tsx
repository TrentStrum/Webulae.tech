'use client';

import { render, screen, fireEvent, renderHook } from '@testing-library/react';

import { PasswordInput } from '@/src/components/auth/PasswordInput';
import { usePasswordValidation } from '@/src/hooks/auth/usePasswordValidation';
import { useRateLimit } from '@/src/hooks/auth/useRateLimit';

jest.mock('@/src/contexts/AuthContext');

describe('Authentication System', () => {
	describe('Password Validation', () => {
		it('validates password requirements correctly', () => {
			const { result } = renderHook(() => usePasswordValidation());

			result.current.validatePassword('short');
			expect(result.current.rules.minLength).toBe(false);

			result.current.validatePassword('LongPassword123!');
			expect(result.current.rules.minLength).toBe(true);
			expect(result.current.rules.hasUppercase).toBe(true);
			expect(result.current.rules.hasNumber).toBe(true);
			expect(result.current.rules.hasSpecial).toBe(true);
		});

		it('calculates password strength accurately', () => {
			const { result } = renderHook(() => usePasswordValidation());

			result.current.validatePassword('password');
			expect(result.current.getStrength()).toBe(25); // 1/4 rules met

			result.current.validatePassword('Password123!');
			expect(result.current.getStrength()).toBe(100); // All rules met
		});
	});

	describe('Rate Limiting', () => {
		it('enforces rate limits', async () => {
			const config = { maxAttempts: 3, timeWindow: 60000 }; // 3 attempts per minute
			const { result } = renderHook(() => useRateLimit(config));

			// First three attempts should be allowed
			for (let i = 0; i < 3; i++) {
				result.current.recordAttempt();
				const check = result.current.checkRateLimit();
				expect(check.allowed).toBe(true);
			}

			// Fourth attempt should be blocked
			result.current.recordAttempt();
			const check = result.current.checkRateLimit();
			expect(check.allowed).toBe(false);
			expect(check.timeUntilReset).toBeGreaterThan(0);
		});
	});

	describe('PasswordInput Component', () => {
		it('toggles password visibility', () => {
			const handleChange = jest.fn();
			render(<PasswordInput value="password123" onChange={handleChange} showValidation={true} />);

			const input = screen.getByRole('textbox');
			expect(input).toHaveAttribute('type', 'password');

			const toggleButton = screen.getByRole('button');
			fireEvent.click(toggleButton);

			expect(input).toHaveAttribute('type', 'text');
		});

		it('shows validation feedback', () => {
			const handleChange = jest.fn();
			render(<PasswordInput value="" onChange={handleChange} showValidation={true} />);

			const input = screen.getByRole('textbox');
			fireEvent.change(input, { target: { value: 'Password123!' } });

			expect(screen.getByText('One uppercase letter')).toHaveClass('text-green-500');
			expect(screen.getByText('One number')).toHaveClass('text-green-500');
			expect(screen.getByText('One special character')).toHaveClass('text-green-500');
		});
	});
});
