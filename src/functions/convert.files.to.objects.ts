#!/usr/bin/env node
'use strict';

import * as os from 'node:os';

import {FileObject} from '../types';

const convertFilesToObjects: Function = (files: string[]): FileObject[] => {
	const platform: string = os.platform();
	const separator: string = 'win32' === platform ? '\\' : '/';

	return files.map((f: string): FileObject => {
		const parts: string[] = f.split(separator);
		const name: string = parts.pop() ?? '';
		const path: string = parts.join(separator);
		const full: string = path + separator + name;
		return {name, path, full};
	});
};

export default convertFilesToObjects;
