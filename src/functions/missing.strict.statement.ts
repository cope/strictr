#!/usr/bin/env node
'use strict';

import * as fs from 'fs';

import {find, includes, map, split, trim} from 'lodash';

const missingStrictStatement = (file: string): boolean => {
	const content = fs.readFileSync(file, 'utf-8');

	let lines = split(content, '\n');
	lines = map(lines, trim);

	return !find(lines, (line: string) => includes(line, 'use strict'));
};
export default missingStrictStatement;
