'use strict';

import fixExtension from '../../src/functions/fix.extension';

describe('fix.extension tests', () => {
	test('should add dot prefix if missing', () => {
		expect(fixExtension('ts')).toBe('.ts');
		expect(fixExtension('js')).toBe('.js');
		expect(fixExtension('json')).toBe('.json');
	});

	test('should keep dot prefix if already present', () => {
		expect(fixExtension('.ts')).toBe('.ts');
		expect(fixExtension('.js')).toBe('.js');
		expect(fixExtension('.json')).toBe('.json');
	});

	test('should convert extension to lowercase', () => {
		expect(fixExtension('TS')).toBe('.ts');
		expect(fixExtension('.JS')).toBe('.js');
		expect(fixExtension('JSON')).toBe('.json');
		expect(fixExtension('.HTML')).toBe('.html');
	});

	test('should handle mixed case extensions', () => {
		expect(fixExtension('TsX')).toBe('.tsx');
		expect(fixExtension('.JsX')).toBe('.jsx');
	});

	test('should handle empty string', () => {
		expect(fixExtension('')).toBe('.');
	});
});
