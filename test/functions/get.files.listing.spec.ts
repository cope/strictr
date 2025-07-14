'use strict';

import * as fs from 'fs';
import * as path from 'path';
import getFilesListing from '../../src/functions/get.files.listing';

// Mock fs module
jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

// Mock path module
jest.mock('path');
const mockedPath = path as jest.Mocked<typeof path>;

describe('get.files.listing tests', () => {
	beforeEach(() => {
		// Setup default mocks
		mockedPath.join.mockImplementation((...args) => args.join('/'));
		mockedPath.extname.mockImplementation((filepath) => {
			const parts = filepath.split('.');
			return parts.length > 1 ? '.' + parts[parts.length - 1] : '';
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	test('should return empty array for empty directory', () => {
		mockedFs.readdirSync.mockReturnValue([] as any);

		const result = getFilesListing('/empty/dir');

		expect(result).toEqual([]);
		expect(mockedFs.readdirSync).toHaveBeenCalledWith('/empty/dir');
	});

	test('should return .js files', () => {
		mockedFs.readdirSync.mockReturnValue(['file1.js', 'file2.js'] as any);
		mockedFs.lstatSync.mockReturnValue({
			isDirectory: () => false
		} as fs.Stats);

		const result = getFilesListing('/src');

		expect(result).toEqual(['/src/file1.js', '/src/file2.js']);
		expect(mockedFs.readdirSync).toHaveBeenCalledWith('/src');
	});

	test('should return .ts files', () => {
		mockedFs.readdirSync.mockReturnValue(['component.ts', 'utils.ts'] as any);
		mockedFs.lstatSync.mockReturnValue({
			isDirectory: () => false
		} as fs.Stats);

		const result = getFilesListing('/src');

		expect(result).toEqual(['/src/component.ts', '/src/utils.ts']);
		expect(mockedFs.readdirSync).toHaveBeenCalledWith('/src');
	});

	test('should ignore non-js/ts files', () => {
		mockedFs.readdirSync.mockReturnValue(['file.js', 'file.ts', 'file.txt', 'file.json', 'README.md'] as any);
		mockedFs.lstatSync.mockReturnValue({
			isDirectory: () => false
		} as fs.Stats);

		const result = getFilesListing('/src');

		expect(result).toEqual(['/src/file.js', '/src/file.ts']);
		expect(mockedFs.readdirSync).toHaveBeenCalledWith('/src');
	});

	test('should handle mixed case extensions', () => {
		mockedFs.readdirSync.mockReturnValue(['file.JS', 'file.TS', 'file.Js', 'file.tS'] as any);
		mockedFs.lstatSync.mockReturnValue({
			isDirectory: () => false
		} as fs.Stats);

		const result = getFilesListing('/src');

		// The implementation sorts the files, so we expect them sorted alphabetically
		expect(result).toEqual(['/src/file.JS', '/src/file.Js', '/src/file.TS', '/src/file.tS']);
		expect(mockedFs.readdirSync).toHaveBeenCalledWith('/src');
	});

	test('should recursively traverse subdirectories', () => {
		// Mock first call (root directory)
		mockedFs.readdirSync.mockReturnValueOnce(['file1.js', 'subdir'] as any);

		// Mock lstatSync calls for root directory items
		// The function calls lstatSync twice for each item (once for subfiles, once for subfolders)
		mockedFs.lstatSync
			.mockReturnValueOnce({isDirectory: () => false} as fs.Stats) // file1.js (subfiles check)
			.mockReturnValueOnce({isDirectory: () => true} as fs.Stats) // subdir (subfiles check)
			.mockReturnValueOnce({isDirectory: () => false} as fs.Stats) // file1.js (subfolders check)
			.mockReturnValueOnce({isDirectory: () => true} as fs.Stats); // subdir (subfolders check)

		// Mock second call (subdirectory)
		mockedFs.readdirSync.mockReturnValueOnce(['file2.ts'] as any);

		// Mock lstatSync calls for subdirectory items
		mockedFs.lstatSync
			.mockReturnValueOnce({isDirectory: () => false} as fs.Stats) // file2.ts (subfiles check)
			.mockReturnValueOnce({isDirectory: () => false} as fs.Stats); // file2.ts (subfolders check)

		const result = getFilesListing('/src');

		expect(result).toEqual(['/src/file1.js', '/src/subdir/file2.ts']);
		expect(mockedFs.readdirSync).toHaveBeenCalledWith('/src');
		expect(mockedFs.readdirSync).toHaveBeenCalledWith('/src/subdir');
	});

	test('should handle directories with no matching files', () => {
		mockedFs.readdirSync.mockReturnValue(['file.txt', 'file.json'] as any);
		mockedFs.lstatSync.mockReturnValue({
			isDirectory: () => false
		} as fs.Stats);

		const result = getFilesListing('/src');

		expect(result).toEqual([]);
		expect(mockedFs.readdirSync).toHaveBeenCalledWith('/src');
	});
});
