'use strict';

import * as fs from 'fs';
import * as path from 'path';
import getFilesListing from '../../src/functions/get.files.listing';

jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

jest.mock('path');
const mockedPath = path as jest.Mocked<typeof path>;

const file = (name: string): fs.Dirent => ({name, isDirectory: () => false}) as fs.Dirent;
const folder = (name: string): fs.Dirent => ({name, isDirectory: () => true}) as fs.Dirent;
const files = (...names: string[]): any => names.map(file);

describe('get.files.listing tests', () => {
	beforeEach(() => {
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
		expect(mockedFs.readdirSync).toHaveBeenCalledWith('/empty/dir', {withFileTypes: true});
	});

	test('should return .js files', () => {
		mockedFs.readdirSync.mockReturnValue(files('file1.js', 'file2.js'));

		const result = getFilesListing('/src');

		expect(result).toEqual(['/src/file1.js', '/src/file2.js']);
		expect(mockedFs.readdirSync).toHaveBeenCalledWith('/src', {withFileTypes: true});
	});

	test('should return .ts files', () => {
		mockedFs.readdirSync.mockReturnValue(files('component.ts', 'utils.ts'));

		const result = getFilesListing('/src');

		expect(result).toEqual(['/src/component.ts', '/src/utils.ts']);
		expect(mockedFs.readdirSync).toHaveBeenCalledWith('/src', {withFileTypes: true});
	});

	test('should ignore non-js/ts files', () => {
		mockedFs.readdirSync.mockReturnValue(files('file.js', 'file.ts', 'file.txt', 'file.json', 'README.md'));

		const result = getFilesListing('/src');

		expect(result).toEqual(['/src/file.js', '/src/file.ts']);
		expect(mockedFs.readdirSync).toHaveBeenCalledWith('/src', {withFileTypes: true});
	});

	test('should handle mixed case extensions', () => {
		mockedFs.readdirSync.mockReturnValue(files('file.JS', 'file.TS', 'file.Js', 'file.tS'));

		const result = getFilesListing('/src');

		expect(result).toEqual(['/src/file.JS', '/src/file.Js', '/src/file.TS', '/src/file.tS']);
		expect(mockedFs.readdirSync).toHaveBeenCalledWith('/src', {withFileTypes: true});
	});

	test('should recursively traverse subdirectories', () => {
		mockedFs.readdirSync.mockReturnValueOnce([file('file1.js'), folder('subdir')] as any);
		mockedFs.readdirSync.mockReturnValueOnce(files('file2.ts'));

		const result = getFilesListing('/src');

		expect(result).toEqual(['/src/file1.js', '/src/subdir/file2.ts']);
		expect(mockedFs.readdirSync).toHaveBeenCalledWith('/src', {withFileTypes: true});
		expect(mockedFs.readdirSync).toHaveBeenCalledWith('/src/subdir', {withFileTypes: true});
	});

	test('should not stat entries individually', () => {
		mockedFs.readdirSync.mockReturnValueOnce([file('file1.js'), folder('subdir')] as any);
		mockedFs.readdirSync.mockReturnValueOnce(files('file2.ts'));

		getFilesListing('/src');

		expect(mockedFs.lstatSync).not.toHaveBeenCalled();
	});

	test('should handle directories with no matching files', () => {
		mockedFs.readdirSync.mockReturnValue(files('file.txt', 'file.json'));

		const result = getFilesListing('/src');

		expect(result).toEqual([]);
		expect(mockedFs.readdirSync).toHaveBeenCalledWith('/src', {withFileTypes: true});
	});
});
