'use strict';

import * as path from 'path';
import check from '../src/check';
import {CommanderOptions} from '../src/types';

// Mock all dependencies
jest.mock('fs');
jest.mock('path');
jest.mock('../src/functions/bail');
jest.mock('../src/functions/get.config');
jest.mock('../src/functions/check.folder');
jest.mock('../src/functions/add.use.strict');
jest.mock('../src/functions/get.files.listing');
jest.mock('../src/functions/convert.files.to.objects');
jest.mock('../src/functions/missing.strict.statement');
jest.mock('../src/functions/get.table.from.file.objects');

// Import mocked functions
import bail from '../src/functions/bail';
import getConfig from '../src/functions/get.config';
import checkFolder from '../src/functions/check.folder';
import addUseStrict from '../src/functions/add.use.strict';
import getFilesListing from '../src/functions/get.files.listing';
import convertFilesToObjects from '../src/functions/convert.files.to.objects';
import missingStrictStatement from '../src/functions/missing.strict.statement';
import getTableFromFileObjects from '../src/functions/get.table.from.file.objects';

const mockedBail = bail as any;
const mockedGetConfig = getConfig as any;
const mockedCheckFolder = checkFolder as any;
const mockedAddUseStrict = addUseStrict as any;
const mockedGetFilesListing = getFilesListing as any;
const mockedConvertFilesToObjects = convertFilesToObjects as any;
const mockedMissingStrictStatement = missingStrictStatement as any;
const mockedGetTableFromFileObjects = getTableFromFileObjects as any;

// Mock console.log
let consoleLogSpy: jest.SpyInstance;

describe('check tests', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

		// Mock process.cwd()
		jest.spyOn(process, 'cwd').mockReturnValue('/test/root');

		// Mock path.join
		(path.join as jest.Mock).mockImplementation((...args) => args.join('/'));

		// Default mocks
		mockedGetConfig.mockReturnValue({directories: ['src', 'test']});
		mockedCheckFolder.mockImplementation(() => {});
		mockedGetFilesListing.mockReturnValue([]);
		mockedConvertFilesToObjects.mockReturnValue([]);
		mockedGetTableFromFileObjects.mockReturnValue({toString: () => 'table'});
	});

	afterEach(() => {
		consoleLogSpy.mockRestore();
		jest.restoreAllMocks();
	});

	test('should run successfully with no missing strict statements', () => {
		const options: CommanderOptions = {config: '.strictr.json', fix: false};

		mockedGetFilesListing.mockReturnValue(['/test/root/src/file1.js', '/test/root/src/file2.js']);
		mockedMissingStrictStatement.mockReturnValue(false);

		check.run(options);

		expect(mockedGetConfig).toHaveBeenCalledWith('/test/root', '.strictr.json');
		expect(mockedCheckFolder).toHaveBeenCalledWith('/test/root/src', 'src');
		expect(mockedCheckFolder).toHaveBeenCalledWith('/test/root/test', 'test');
		expect(mockedGetFilesListing).toHaveBeenCalledWith('/test/root/src');
		expect(mockedGetFilesListing).toHaveBeenCalledWith('/test/root/test');
		expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('*** STRICTR ***'));
		expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('✅'));
		expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('No files are missing'));
		expect(mockedBail).not.toHaveBeenCalled();
	});

	test('should report missing strict statements when fix is false', () => {
		const options: CommanderOptions = {config: '.strictr.json', fix: false};

		mockedGetFilesListing.mockReturnValue(['/test/root/src/file1.js']);
		mockedMissingStrictStatement.mockReturnValue(true);
		mockedConvertFilesToObjects.mockReturnValue([{name: 'file1.js', path: '/test/root/src', full: '/test/root/src/file1.js'}]);

		check.run(options);

		expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Files missing'));
		expect(mockedBail).toHaveBeenCalledWith(expect.stringContaining('There are files missing'));
		expect(mockedAddUseStrict).not.toHaveBeenCalled();
	});

	test('should fix missing strict statements when fix is true', () => {
		const options: CommanderOptions = {config: '.strictr.json', fix: true};

		mockedGetFilesListing.mockReturnValue(['/test/root/src/file1.js']);
		mockedMissingStrictStatement.mockReturnValue(true);
		mockedConvertFilesToObjects.mockReturnValue([{name: 'file1.js', path: '/test/root/src', full: '/test/root/src/file1.js'}]);

		check.run(options);

		expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Files missing'));
		expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Fix is set to true'));
		expect(mockedAddUseStrict).toHaveBeenCalledWith('/test/root/src/file1.js');
		expect(mockedBail).not.toHaveBeenCalled();
	});

	test('should handle fix mode with no missing strict statements', () => {
		const options: CommanderOptions = {config: '.strictr.json', fix: true};

		mockedGetFilesListing.mockReturnValue(['/test/root/src/file1.js']);
		mockedMissingStrictStatement.mockReturnValue(false);

		check.run(options);

		expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Everything is awesome!'));
		expect(mockedAddUseStrict).not.toHaveBeenCalled();
		expect(mockedBail).not.toHaveBeenCalled();
	});

	test('should handle multiple directories', () => {
		const options: CommanderOptions = {config: '.strictr.json', fix: false};

		mockedGetConfig.mockReturnValue({directories: ['src', 'test', 'lib']});
		mockedGetFilesListing.mockReturnValue([]);
		mockedMissingStrictStatement.mockReturnValue(false);

		check.run(options);

		expect(mockedCheckFolder).toHaveBeenCalledWith('/test/root/src', 'src');
		expect(mockedCheckFolder).toHaveBeenCalledWith('/test/root/test', 'test');
		expect(mockedCheckFolder).toHaveBeenCalledWith('/test/root/lib', 'lib');
		expect(mockedGetFilesListing).toHaveBeenCalledWith('/test/root/src');
		expect(mockedGetFilesListing).toHaveBeenCalledWith('/test/root/test');
		expect(mockedGetFilesListing).toHaveBeenCalledWith('/test/root/lib');
	});

	test('should handle multiple files needing fixes', () => {
		const options: CommanderOptions = {config: '.strictr.json', fix: true};

		mockedGetFilesListing.mockReturnValue(['/test/root/src/file1.js', '/test/root/src/file2.js']);
		mockedMissingStrictStatement.mockReturnValue(true);
		mockedConvertFilesToObjects.mockReturnValue([
			{name: 'file1.js', path: '/test/root/src', full: '/test/root/src/file1.js'},
			{name: 'file2.js', path: '/test/root/src', full: '/test/root/src/file2.js'}
		]);

		check.run(options);

		expect(mockedAddUseStrict).toHaveBeenCalledWith('/test/root/src/file1.js');
		expect(mockedAddUseStrict).toHaveBeenCalledWith('/test/root/src/file2.js');
		expect(mockedAddUseStrict).toHaveBeenCalled();
	});

	test('should use custom config file', () => {
		const options: CommanderOptions = {config: 'custom.json', fix: false};

		mockedGetFilesListing.mockReturnValue([]);
		mockedMissingStrictStatement.mockReturnValue(false);

		check.run(options);

		expect(mockedGetConfig).toHaveBeenCalledWith('/test/root', 'custom.json');
	});

	test('should handle mixed files with and without strict statements', () => {
		const options: CommanderOptions = {config: '.strictr.json', fix: true};

		mockedGetFilesListing.mockReturnValue(['/test/root/src/file1.js', '/test/root/src/file2.js']);
		mockedMissingStrictStatement
			.mockReturnValueOnce(true) // file1.js needs strict
			.mockReturnValueOnce(false); // file2.js has strict
		mockedConvertFilesToObjects.mockReturnValue([{name: 'file1.js', path: '/test/root/src', full: '/test/root/src/file1.js'}]);

		check.run(options);

		expect(mockedAddUseStrict).toHaveBeenCalledWith('/test/root/src/file1.js');
		expect(mockedAddUseStrict).toHaveBeenCalledTimes(1);
	});
});
