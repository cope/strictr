#!/usr/bin/env node
'use strict';

import * as fs from 'fs';

import {find, includes, map, split, trim} from 'lodash';

const missingStrictStatement: (file: string) => boolean = (file: string): boolean => {
	const content: string = fs.readFileSync(file, 'utf-8');

	let lines: string[] = split(content, '\n');
	lines = map(lines, trim);

	return !find(lines, (line: string) => includes(line, 'use strict'));
};
export default missingStrictStatement;
