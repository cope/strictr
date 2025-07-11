'use strict';

import * as fs from 'fs';
import missingStrictStatement from '../../src/functions/missing.strict.statement';

// Mock fs module
jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('missing.strict.statement tests', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('should return true when use strict is missing', () => {
		const fileContent = `console.log('hello world');
function test() {
	return 'no strict mode';
}`;
		mockedFs.readFileSync.mockReturnValue(fileContent);

		const result = missingStrictStatement('test.js');
		expect(result).toBe(true);
		expect(mockedFs.readFileSync).toHaveBeenCalledWith('test.js', 'utf-8');
	});

	test('should return false when use strict is present', () => {
		const fileContent = `'use strict';
console.log('hello world');
function test() {
	return 'strict mode enabled';
}`;
		mockedFs.readFileSync.mockReturnValue(fileContent);

		const result = missingStrictStatement('test.js');
		expect(result).toBe(false);
	});

	test('should return false when use strict is in any line', () => {
		const fileContent = `#!/usr/bin/env node
'use strict';

console.log('hello world');`;
		mockedFs.readFileSync.mockReturnValue(fileContent);

		const result = missingStrictStatement('test.js');
		expect(result).toBe(false);
	});

	test('should return false when use strict has extra whitespace', () => {
		const fileContent = `  'use strict';  
console.log('hello world');`;
		mockedFs.readFileSync.mockReturnValue(fileContent);

		const result = missingStrictStatement('test.js');
		expect(result).toBe(false);
	});

	test('should handle empty file', () => {
		mockedFs.readFileSync.mockReturnValue('');

		const result = missingStrictStatement('empty.js');
		expect(result).toBe(true);
	});
});
