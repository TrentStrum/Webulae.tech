import type { NextRequest } from 'next/server';

export interface RouteContext<T = Record<string, string>> {
	params: T;
}

export interface RouteConfig {
	request: NextRequest;
	params: Record<string, string>;
}
