'use strict';

jest.mock('../src/check');
jest.mock('commander', () => {
	const command: any = {};
	['version', 'description', 'option', 'parse'].forEach((method: string) => (command[method] = jest.fn(() => command)));
	command.opts = jest.fn(() => ({fix: false}));
	return {Command: jest.fn(() => command)};
});
import check from '../src/check';

describe('strictr tests', () => {
	test('should import check module', () => {
		expect(check).toBeDefined();
		expect(check.run).toBeDefined();
	});

	test('should call check.run when module is imported', () => {
		const mockRun = jest.fn();
		check.run = mockRun;

		delete require.cache[require.resolve('../src/strictr')];
		require('../src/strictr');

		expect(mockRun).toHaveBeenCalledWith({fix: false});
	});
});
