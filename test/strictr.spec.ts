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

	describe('thread pool size', () => {
		const original: string | undefined = process.env.UV_THREADPOOL_SIZE;

		afterEach(() => {
			if (original === undefined) delete process.env.UV_THREADPOOL_SIZE;
			else process.env.UV_THREADPOOL_SIZE = original;
		});

		test('should default to 64 when not set', () => {
			delete process.env.UV_THREADPOOL_SIZE;

			jest.isolateModules(() => require('../src/strictr'));

			expect(process.env.UV_THREADPOOL_SIZE).toBe('64');
		});

		test('should keep an existing value', () => {
			process.env.UV_THREADPOOL_SIZE = '8';

			jest.isolateModules(() => require('../src/strictr'));

			expect(process.env.UV_THREADPOOL_SIZE).toBe('8');
		});
	});
});
