import nextJest from 'next/jest';

import type { Config } from 'jest';

const createJestConfig = nextJest({
	dir: './',
});

const customJestConfig: Config = {
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js', '<rootDir>/src/tests/setup.ts'],
	testEnvironment: 'jest-environment-jsdom',
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/$1',
	},
	testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
	collectCoverageFrom: [
		'src/**/*.{js,jsx,ts,tsx}',
		'!src/**/*.d.ts',
		'!src/types/**/*',
		'!src/lib/supabase.ts',
		'!src/**/*.stories.{js,jsx,ts,tsx}',
	],
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 80,
		},
	},
	testTimeout: 10000,
};

export default createJestConfig(customJestConfig);
