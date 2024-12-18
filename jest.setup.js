/* eslint-disable @typescript-eslint/explicit-function-return-type */
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Response if it's not available (Node.js environment)
if (typeof Response === 'undefined') {
	global.Response = class Response {
		constructor(body, init) {
			this.body = body;
			this.init = init;
			this.status = init?.status || 200;
			this.ok = this.status >= 200 && this.status < 300;
			return this;
		}

		async json() {
			return JSON.parse(this.body);
		}
	};
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: jest.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(),
		removeListener: jest.fn(),
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	})),
});

// Set default timeout
jest.setTimeout(10000);
