'use strict';

import bail from '../../src/functions/bail';

// Mock the node:process module
jest.mock('node:process', () => ({
	exit: jest.fn(() => {
		throw new Error('process.exit called');
	})
}));

// Mock console.error
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('bail tests', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		mockConsoleError.mockRestore();
	});

	test('should log message and exit with code 2', () => {
		const message = 'Test error message';

		expect(() => {
			bail(message);
		}).toThrow('process.exit called');

		expect(mockConsoleError).toHaveBeenCalledWith(message);

		// Check that the mocked exit was called with code 2
		const mockExit = require('node:process').exit;
		expect(mockExit).toHaveBeenCalledWith(2);
	});

	test('should handle undefined message', () => {
		expect(() => {
			bail();
		}).toThrow('process.exit called');

		expect(mockConsoleError).toHaveBeenCalledWith(undefined);

		// Check that the mocked exit was called with code 2
		const mockExit = require('node:process').exit;
		expect(mockExit).toHaveBeenCalledWith(2);
	});
});
