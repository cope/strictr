'use strict';

import * as fs from 'fs';
import * as path from 'path';
import getConfig from '../../src/functions/get.config';

jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

jest.mock('path');
const mockedPath = path as jest.Mocked<typeof path>;

const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('get.config tests', () => {
	beforeEach(() => {
		mockedPath.join.mockImplementation((...args) => args.join('/'));
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		mockConsoleError.mockRestore();
	});

	test('should return default config when config file does not exist', () => {
		mockedFs.existsSync.mockReturnValue(false);

		const result: object = getConfig('/project/root', '.strictr.json');

		expect(result).toEqual({
			directories: ['src', 'test']
		});
		expect(mockedFs.existsSync).toHaveBeenCalledWith('/project/root/.strictr.json');
		expect(mockConsoleError).not.toHaveBeenCalled();
	});

	test('should merge user config with default config when file exists', () => {
		mockedFs.existsSync.mockReturnValue(true);

		const userConfig = {
			directories: ['source', 'tests']
		};

		jest.doMock('/project/root/.strictr.json', () => userConfig, {virtual: true});

		const result = getConfig('/project/root', '.strictr.json');

		expect(result).toEqual({
			directories: ['source', 'tests']
		});
		expect(mockedFs.existsSync).toHaveBeenCalledWith('/project/root/.strictr.json');
		expect(mockConsoleError).not.toHaveBeenCalled();

		jest.dontMock('/project/root/.strictr.json');
	});

	test('should handle different config file names', () => {
		mockedFs.existsSync.mockReturnValue(false);

		const result = getConfig('/project/root', 'custom.config.json');

		expect(result).toEqual({
			directories: ['src', 'test']
		});
		expect(mockedFs.existsSync).toHaveBeenCalledWith('/project/root/custom.config.json');
		expect(mockConsoleError).not.toHaveBeenCalled();
	});

	test('should handle different root paths', () => {
		mockedFs.existsSync.mockReturnValue(false);

		const result = getConfig('/different/path', '.strictr.json');

		expect(result).toEqual({
			directories: ['src', 'test']
		});
		expect(mockedFs.existsSync).toHaveBeenCalledWith('/different/path/.strictr.json');
		expect(mockConsoleError).not.toHaveBeenCalled();
	});

	test('should log error and return default config when config file cannot be loaded', () => {
		const error: Error = new Error('cannot load config');
		mockedFs.existsSync.mockReturnValue(true);

		jest.doMock(
			'/project/root/broken.json',
			() => {
				throw error;
			},
			{virtual: true}
		);

		const result = getConfig('/project/root', 'broken.json');

		expect(result).toEqual({
			directories: ['src', 'test']
		});
		expect(mockConsoleError).toHaveBeenCalledWith(error);

		jest.dontMock('/project/root/broken.json');
	});
});
