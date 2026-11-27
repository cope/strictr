'use strict';

import {readFile} from 'fs/promises';
import missingStrictStatement from '../../src/functions/missing.strict.statement';

jest.mock('fs/promises');
const mockedReadFile = readFile as jest.Mock;

describe('missing.strict.statement tests', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('should return true when use strict is missing', async () => {
		const fileContent: string = `console.log('hello world');
function test() {
	return 'no strict mode';
}`;
		mockedReadFile.mockResolvedValue(fileContent);

		const result: boolean = await missingStrictStatement('test.js');
		expect(result).toBe(true);
		expect(mockedReadFile).toHaveBeenCalledWith('test.js', 'utf-8');
	});

	test('should return false when use strict is present', async () => {
		const fileContent: string = `'use strict';
console.log('hello world');
function test() {
	return 'strict mode enabled';
}`;
		mockedReadFile.mockResolvedValue(fileContent);

		const result: boolean = await missingStrictStatement('test.js');
		expect(result).toBe(false);
	});

	test('should return false when use strict is in any line', async () => {
		const fileContent = `#!/usr/bin/env node
'use strict';

console.log('hello world');`;
		mockedReadFile.mockResolvedValue(fileContent);

		const result = await missingStrictStatement('test.js');
		expect(result).toBe(false);
	});

	test('should return false when use strict has extra whitespace', async () => {
		const fileContent = `  'use strict';  
console.log('hello world');`;
		mockedReadFile.mockResolvedValue(fileContent);

		const result = await missingStrictStatement('test.js');
		expect(result).toBe(false);
	});

	test('should handle empty file', async () => {
		mockedReadFile.mockResolvedValue('');

		const result = await missingStrictStatement('empty.js');
		expect(result).toBe(true);
	});
});
