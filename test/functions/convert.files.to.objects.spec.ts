'use strict';

import * as os from 'node:os';
import convertFilesToObjects from '../../src/functions/convert.files.to.objects';

// Mock os module
jest.mock('node:os');
const mockedOs = os as jest.Mocked<typeof os>;

describe('convert.files.to.objects tests', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('should convert Windows file paths to objects', () => {
		mockedOs.platform.mockReturnValue('win32');

		const files = ['C:\\Users\\test\\file.ts', 'D:\\projects\\src\\index.js'];
		const result = convertFilesToObjects(files);

		expect(result).toEqual([
			{name: 'file.ts', path: 'C:\\Users\\test', full: 'C:\\Users\\test\\file.ts'},
			{name: 'index.js', path: 'D:\\projects\\src', full: 'D:\\projects\\src\\index.js'}
		]);
	});

	test('should convert Unix file paths to objects', () => {
		mockedOs.platform.mockReturnValue('linux');

		const files = ['/home/user/file.ts', '/var/www/src/index.js'];
		const result = convertFilesToObjects(files);

		expect(result).toEqual([
			{name: 'file.ts', path: '/home/user', full: '/home/user/file.ts'},
			{name: 'index.js', path: '/var/www/src', full: '/var/www/src/index.js'}
		]);
	});

	test('should handle empty file list', () => {
		const result = convertFilesToObjects([]);
		expect(result).toEqual([]);
	});

	test('should handle files in root directory', () => {
		mockedOs.platform.mockReturnValue('linux');

		const files = ['/file.ts'];
		const result = convertFilesToObjects(files);

		expect(result).toEqual([{name: 'file.ts', path: '', full: '/file.ts'}]);
	});

	test('should handle macOS file paths', () => {
		mockedOs.platform.mockReturnValue('darwin');

		const files = ['/Applications/test.app', '/Users/john/Documents/file.txt'];
		const result = convertFilesToObjects(files);

		expect(result).toEqual([
			{name: 'test.app', path: '/Applications', full: '/Applications/test.app'},
			{name: 'file.txt', path: '/Users/john/Documents', full: '/Users/john/Documents/file.txt'}
		]);
	});
});
