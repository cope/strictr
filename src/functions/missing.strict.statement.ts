#!/usr/bin/env node
'use strict';

import * as fs from 'fs';

import {includes, split} from 'lodash';

const missingStrictStatement = (file: string): boolean => {
	const content = fs.readFileSync(file, 'utf-8');
	const lines = split(content, '\n');
	return !includes(lines, "'use strict';");
};
export default missingStrictStatement;
