module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>/src', '<rootDir>/test'],
	testMatch: ['**/test/**/*.spec.ts'],
	transform: {
		'^.+\\.ts$': [
			'ts-jest',
			{
				tsconfig: '<rootDir>/tsconfig.jest.json'
			}
		]
	},
	moduleFileExtensions: ['ts', 'js', 'json'],
	setupFilesAfterEnv: [],
	collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/**/*.spec.ts', '!src/**/*.test.ts'],
	coverageDirectory: 'coverage',
	coverageReporters: ['lcov', 'html', 'text', 'text-summary'],
	coverageThreshold: {
		global: {
			branches: 100,
			functions: 100,
			lines: 100,
			statements: 100
		}
	},
	clearMocks: true,
	testTimeout: 30000
};
