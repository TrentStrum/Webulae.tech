'use client';

import { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { usePasswordValidation } from '@/src/hooks/auth/usePasswordValidation';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  showValidation?: boolean;
}

export function PasswordInput({ value, onChange, showValidation = true }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { rules, validatePassword, getStrength } = usePasswordValidation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    if (showValidation) {
      validatePassword(newValue);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={handleChange}
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>

      {showValidation && (
        <div className="space-y-2">
          <Progress value={getStrength()} className="h-2" />
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <ValidationRule passed={rules.minLength}>
              At least 8 characters
            </ValidationRule>
            <ValidationRule passed={rules.hasUppercase}>
              One uppercase letter
            </ValidationRule>
            <ValidationRule passed={rules.hasNumber}>
              One number
            </ValidationRule>
            <ValidationRule passed={rules.hasSpecial}>
              One special character
            </ValidationRule>
          </div>
        </div>
      )}
    </div>
  );
}

function ValidationRule({ passed, children }: { passed: boolean; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      {passed ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-red-500" />
      )}
      <span className={passed ? 'text-green-500' : 'text-red-500'}>
        {children}
      </span>
    </div>
  );
}