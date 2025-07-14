'use strict';

import * as fs from 'fs';
import checkFolder from '../../src/functions/check.folder';
import bail from '../../src/functions/bail';

// Mock fs module
jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

// Mock bail function
jest.mock('../../src/functions/bail', () =>
	jest.fn(() => {
		throw new Error('bail called');
	})
);
const mockedBail = bail as jest.MockedFunction<any>;

// Mock cli-color
jest.mock('cli-color', () => ({
	red: jest.fn((text: string) => text),
	bold: jest.fn((text: string) => text)
}));

describe('check.folder tests', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('should call bail when folder does not exist', () => {
		mockedFs.existsSync.mockReturnValue(false);

		expect(() => {
			checkFolder('/nonexistent/path', 'Source');
		}).toThrow('bail called');

		expect(mockedFs.existsSync).toHaveBeenCalledWith('/nonexistent/path');
		expect(mockedBail).toHaveBeenCalledWith(expect.stringContaining('ERROR: Source folder /nonexistent/path does not exist.'));
	});

	test('should call bail when folder exists but is not a directory', () => {
		mockedFs.existsSync.mockReturnValue(true);
		mockedFs.lstatSync.mockReturnValue({
			isDirectory: () => false
		} as fs.Stats);

		expect(() => {
			checkFolder('/path/to/file.txt', 'Test');
		}).toThrow('bail called');

		expect(mockedFs.existsSync).toHaveBeenCalledWith('/path/to/file.txt');
		expect(mockedFs.lstatSync).toHaveBeenCalledWith('/path/to/file.txt');
		expect(mockedBail).toHaveBeenCalledWith(expect.stringContaining('ERROR: Test folder /path/to/file.txt is not a directory.'));
	});

	test('should not call bail when folder exists and is a directory', () => {
		mockedFs.existsSync.mockReturnValue(true);
		mockedFs.lstatSync.mockReturnValue({
			isDirectory: () => true
		} as fs.Stats);

		checkFolder('/valid/directory', 'Source');

		expect(mockedFs.existsSync).toHaveBeenCalledWith('/valid/directory');
		expect(mockedFs.lstatSync).toHaveBeenCalledWith('/valid/directory');
		expect(mockedBail).not.toHaveBeenCalled();
	});
});
