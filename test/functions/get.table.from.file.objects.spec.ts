'use strict';

import getTableFromFileObjects from '../../src/functions/get.table.from.file.objects';
import {FileObject} from '../../src/types';

describe('get.table.from.file.objects tests', () => {
	test('should create table with basic file objects', () => {
		const fileObjects: FileObject[] = [
			{name: 'file1.js', path: '/src', full: '/src/file1.js'},
			{name: 'file2.ts', path: '/src', full: '/src/file2.ts'}
		];

		const table = getTableFromFileObjects(fileObjects);

		expect(table).toBeDefined();
		expect(table.toString()).toContain('file1.js');
		expect(table.toString()).toContain('file2.ts');
		expect(table.toString()).toContain('/src');
	});

	test('should create table with includeNewPath option', () => {
		const fileObjects: FileObject[] = [
			{name: 'file1.js', path: '/src', full: '/src/file1.js'},
			{name: 'file2.ts', path: '/src', full: '/src/file2.ts'}
		];

		const table = getTableFromFileObjects(fileObjects, true);

		expect(table).toBeDefined();
		expect(table.toString()).toContain('New Path');
		expect(table.toString()).toContain('file1.js');
		expect(table.toString()).toContain('file2.ts');
	});

	test('should create table without includeNewPath option', () => {
		const fileObjects: FileObject[] = [{name: 'file1.js', path: '/src', full: '/src/file1.js'}];

		const table = getTableFromFileObjects(fileObjects, false);

		expect(table).toBeDefined();
		expect(table.toString()).not.toContain('New Path');
		expect(table.toString()).toContain('file1.js');
	});

	test('should handle empty file objects array', () => {
		const fileObjects: FileObject[] = [];

		const table = getTableFromFileObjects(fileObjects);

		expect(table).toBeDefined();
		expect(table.toString()).toContain('#');
		expect(table.toString()).toContain('File');
		expect(table.toString()).toContain('Path');
	});

	test('should handle single file object', () => {
		const fileObjects: FileObject[] = [{name: 'single.js', path: '/test', full: '/test/single.js'}];

		const table = getTableFromFileObjects(fileObjects);

		expect(table).toBeDefined();
		expect(table.toString()).toContain('1');
		expect(table.toString()).toContain('single.js');
		expect(table.toString()).toContain('/test');
	});

	test('should number rows correctly with multiple files', () => {
		const fileObjects: FileObject[] = [
			{name: 'file1.js', path: '/src', full: '/src/file1.js'},
			{name: 'file2.js', path: '/src', full: '/src/file2.js'},
			{name: 'file3.js', path: '/test', full: '/test/file3.js'}
		];

		const table = getTableFromFileObjects(fileObjects);

		expect(table).toBeDefined();
		const tableString: string = table.toString();
		expect(tableString).toContain('1');
		expect(tableString).toContain('2');
		expect(tableString).toContain('3');
		expect(tableString).toContain('file1.js');
		expect(tableString).toContain('file2.js');
		expect(tableString).toContain('file3.js');
	});

	test('should handle files with different paths', () => {
		const fileObjects: FileObject[] = [
			{name: 'app.js', path: '/src/controllers', full: '/src/controllers/app.js'},
			{name: 'test.spec.js', path: '/test/unit', full: '/test/unit/test.spec.js'}
		];

		const table = getTableFromFileObjects(fileObjects);

		expect(table).toBeDefined();
		expect(table.toString()).toContain('app.js');
		expect(table.toString()).toContain('test.spec.js');
		expect(table.toString()).toContain('/src/controllers');
		expect(table.toString()).toContain('/test/unit');
	});
});
