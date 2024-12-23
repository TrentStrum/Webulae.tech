import { auth } from '@clerk/nextjs';

import { BaseAPIHandler } from '@/src/lib/api/base-handler';
import { APIError } from '@/src/lib/api/error';
import { rateLimit } from '@/src/lib/api/rate-limit';
import { APIResponse } from '@/src/lib/api/response';

import type { NextRequest } from 'next/server';

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RouteOptions {
  requireAuth?: boolean;
  permissions?: string[];
  cacheControl?: string;
  rateLimit?: {
    requests: number;
    duration: number;
  };
}

export class APIRouteBuilder extends BaseAPIHandler {
  private handlers: Partial<Record<HTTPMethod, (req: NextRequest) => Promise<Response>>> = {};
  private options: RouteOptions;

  constructor(options: RouteOptions = {}) {
    super();
    this.options = {
      rateLimit: {
        requests: 100,
        duration: 60,
      },
      ...options,
    };
  }

  private async applyMiddleware(req: NextRequest): Promise<{ userId: string; orgId: string }> {
    // Rate limiting
    if (this.options.rateLimit) {
      const ip = req.ip ?? '127.0.0.1';
      await rateLimit(`${req.method}_${req.nextUrl.pathname}_${ip}`);
    }

    // Auth check (permissions already handled by main middleware)
    const { userId, orgId } = auth();
    if (!userId || !orgId) {
      throw new APIError('Unauthorized', 401);
    }

    return { userId, orgId };
  }

  public get(handler: (req: NextRequest) => Promise<Response>, options?: RouteOptions): this {
    this.handlers.GET = handler;
    if (options) this.options = { ...this.options, ...options };
    return this;
  }

  public post(handler: (req: NextRequest) => Promise<Response>, options?: RouteOptions): this {
    this.handlers.POST = handler;
    if (options) this.options = { ...this.options, ...options };
    return this;
  }

  public put(handler: (req: NextRequest) => Promise<Response>, options?: RouteOptions): this {
    this.handlers.PUT = handler;
    if (options) this.options = { ...this.options, ...options };
    return this;
  }

  public patch(handler: (req: NextRequest) => Promise<Response>, options?: RouteOptions): this {
    this.handlers.PATCH = handler;
    if (options) this.options = { ...this.options, ...options };
    return this;
  }

  public delete(handler: (req: NextRequest) => Promise<Response>, options?: RouteOptions): this {
    this.handlers.DELETE = handler;
    if (options) this.options = { ...this.options, ...options };
    return this;
  }

  public async handle(req: NextRequest): Promise<Response> {
    return this.handleRequest(req, async () => {
      // Apply middleware
      await this.applyMiddleware(req);

      const handler = this.handlers[req.method as HTTPMethod];
      
      if (!handler) {
        return APIResponse.error(`Method ${req.method} not allowed`, 405);
      }

      const response = await handler(req);

      // Apply cache headers if specified
      if (this.options.cacheControl) {
        response.headers.set('Cache-Control', this.options.cacheControl);
      }

      return response;
    });
  }
} 