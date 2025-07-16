'use strict';

import * as fs from 'fs';
import addUseStrict from '../../src/functions/add.use.strict';

// Mock fs module
jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

// Mock console.log
let consoleLogSpy: jest.SpyInstance;

describe('add.use.strict tests', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
	});

	afterEach(() => {
		consoleLogSpy.mockRestore();
	});

	test('should log error and return early when file does not exist', () => {
		mockedFs.existsSync.mockReturnValue(false);

		addUseStrict('/nonexistent/file.js');

		expect(mockedFs.existsSync).toHaveBeenCalledWith('/nonexistent/file.js');
		expect(consoleLogSpy).toHaveBeenCalled();
		expect(mockedFs.readFileSync).not.toHaveBeenCalled();
		expect(mockedFs.writeFileSync).not.toHaveBeenCalled();
	});

	test('should add use strict to file without shebang', () => {
		const filePath: string = '/test/file.js';
		const originalContent: string = 'console.log("hello world");';
		const expectedContent: string = '\'use strict\';\n\nconsole.log("hello world");';

		mockedFs.existsSync.mockReturnValue(true);
		mockedFs.readFileSync.mockReturnValue(originalContent);
		mockedFs.writeFileSync.mockImplementation(() => {});

		addUseStrict(filePath);

		expect(mockedFs.existsSync).toHaveBeenCalledWith(filePath);
		expect(mockedFs.readFileSync).toHaveBeenCalledWith(filePath, 'utf-8');
		expect(mockedFs.writeFileSync).toHaveBeenCalledWith(filePath, expectedContent, 'utf-8');
		expect(consoleLogSpy).toHaveBeenCalled();
	});

	test('should add use strict to file with shebang', () => {
		const filePath: string = '/test/file.js';
		const originalContent: string = '#!/usr/bin/env node\nconsole.log("hello world");';
		const expectedContent: string = '#!/usr/bin/env node\n\'use strict\';\n\nconsole.log("hello world");';

		mockedFs.existsSync.mockReturnValue(true);
		mockedFs.readFileSync.mockReturnValue(originalContent);
		mockedFs.writeFileSync.mockImplementation(() => {});

		addUseStrict(filePath);

		expect(mockedFs.existsSync).toHaveBeenCalledWith(filePath);
		expect(mockedFs.readFileSync).toHaveBeenCalledWith(filePath, 'utf-8');
		expect(mockedFs.writeFileSync).toHaveBeenCalledWith(filePath, expectedContent, 'utf-8');
		expect(consoleLogSpy).toHaveBeenCalled();
	});
});
