#!/usr/bin/env node
'use strict';

import {readFile} from 'fs/promises';

const missingStrictStatement: (file: string) => Promise<boolean> = async (file: string): Promise<boolean> => {
	const content: string = await readFile(file, 'utf-8');

	return !content.includes('use strict');
};
export default missingStrictStatement;
