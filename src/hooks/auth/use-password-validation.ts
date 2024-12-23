import { useState } from 'react';

interface PasswordRules {
	minLength: boolean;
	hasUppercase: boolean;
	hasNumber: boolean;
	hasSpecial: boolean;
}

interface PasswordValidationAPI {
	rules: PasswordRules;
	validatePassword: (password: string) => void;
	getStrength: () => number;
}

export function usePasswordValidation(): PasswordValidationAPI {
	const [rules, setRules] = useState<PasswordRules>({
		minLength: false,
		hasUppercase: false,
		hasNumber: false,
		hasSpecial: false
	});

	const validatePassword = (password: string): void => {
		setRules({
			minLength: password.length >= 8,
			hasUppercase: /[A-Z]/.test(password),
			hasNumber: /\d/.test(password),
			hasSpecial: /[!@#$%^&*]/.test(password)
		});
	};

	const getStrength = (): number => {
		const validRules = Object.values(rules).filter(Boolean).length;
		return (validRules / 4) * 100;
	};

	return { rules, validatePassword, getStrength };
} 