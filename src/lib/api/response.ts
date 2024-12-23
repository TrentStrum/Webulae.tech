import { NextResponse } from 'next/server';
import { z } from 'zod';

import { APIError } from './error';

export class APIResponse {
  static success<T>(data: T, status = 200): NextResponse {
    return NextResponse.json({ data }, { status });
  }

  static error(message: string, status = 400): NextResponse {
    return NextResponse.json({ error: message }, { status });
  }

  static validate<T extends z.ZodType>(
    schema: T,
    data: unknown
  ): z.infer<T> {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new APIError('Validation failed', 400, {
          errors: error.errors
        });
      }
      throw error;
    }
  }
} 