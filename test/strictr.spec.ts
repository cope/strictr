'use strict';

// Mock the check module
jest.mock('../src/check');
import check from '../src/check';

describe('strictr tests', () => {
	test('should import check module', () => {
		expect(check).toBeDefined();
		expect(check.run).toBeDefined();
	});

	test('should call check.run when module is imported', () => {
		const mockRun = jest.fn();
		check.run = mockRun;

		// Clear the module cache and re-import
		delete require.cache[require.resolve('../src/strictr')];
		require('../src/strictr');

		expect(mockRun).toHaveBeenCalled();
	});
});
