#!/usr/bin/env node
'use strict';

import * as os from 'node:os';

import _ from 'lodash';

import {FileObject} from '../types';

const convertFilesToObjects: Function = (files: string[]): FileObject[] => {
	const platform: string = os.platform();
	const separator: string = 'win32' === platform ? '\\' : '/';

	return _.map(files, (f: string): FileObject => {
		const parts: string[] = _.split(f, separator);
		const name: string = parts.pop() || '';
		const path: string = _.join(parts, separator);
		const full: string = path + separator + name;
		return {name, path, full};
	});
};

export default convertFilesToObjects;
