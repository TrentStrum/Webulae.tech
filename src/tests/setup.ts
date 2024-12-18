import { TextEncoder, TextDecoder } from 'util';

import fetch, { Request, Response } from 'node-fetch';

global.TextEncoder = TextEncoder as unknown as typeof global.TextEncoder;
global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder;
global.fetch = fetch as unknown as typeof global.fetch;
global.Request = Request as unknown as typeof global.Request;
global.Response = Response as unknown as typeof global.Response;

jest.mock('@/src/lib/supabase/server', () => ({
	createServerClient: jest.fn(),
}));
