'use client';

import { useState, useCallback } from 'react';
import { z } from 'zod';

interface ValidationOptions<T> {
  schema: z.ZodSchema<T>;
  onSuccess?: (data: T) => void;
  onError?: (errors: z.ZodError) => void;
}

export function useFormValidation<T>({ schema, onSuccess, onError }: ValidationOptions<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(
    (data: unknown) => {
      try {
        const validData = schema.parse(data);
        setErrors({});
        onSuccess?.(validData);
        return { success: true, data: validData };
      } catch (error) {
        if (error instanceof z.ZodError) {
          const formattedErrors = error.errors.reduce(
            (acc, curr) => ({
              ...acc,
              [curr.path[0]]: curr.message,
            }),
            {}
          );
          setErrors(formattedErrors);
          onError?.(error);
          return { success: false, errors: formattedErrors };
        }
        throw error;
      }
    },
    [schema, onSuccess, onError]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const getFieldError = useCallback(
    (field: string) => errors[field],
    [errors]
  );

  return {
    errors,
    validate,
    clearErrors,
    getFieldError,
  };
}