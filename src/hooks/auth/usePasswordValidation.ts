import { useState, useCallback } from 'react';

interface ValidationRules {
  minLength: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

interface UsePasswordValidationReturn {
  rules: ValidationRules;
  isValid: boolean;
  validatePassword: (password: string) => void;
  getStrength: () => number;
}

export function usePasswordValidation(): UsePasswordValidationReturn {
  const [rules, setRules] = useState<ValidationRules>({
    minLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecial: false
  });

  const validatePassword = useCallback((password: string) => {
    setRules({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  }, []);

  const getStrength = useCallback((): number => {
    const validRules = Object.values(rules).filter(Boolean).length;
    return (validRules / 4) * 100;
  }, [rules]);

  const isValid = Object.values(rules).every(Boolean);

  return {
    rules,
    isValid,
    validatePassword,
    getStrength
  };
}