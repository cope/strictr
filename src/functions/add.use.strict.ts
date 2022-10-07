#!/usr/bin/env node
'use strict';

import * as fs from 'fs';
import {first, join, split, startsWith, tail, trim} from 'lodash';

const addUseStrict = (path: string): void => {
	if (!fs.existsSync(path)) return console.log(`\nERROR: ${path} does not exist.`);

	const content = fs.readFileSync(path, 'utf-8');
	let lines: string[] = split(trim(content), '\n');

	const one: string = trim(first(lines));
	const hasBang = startsWith(one, '#!/');

	let allButFirst = hasBang //
		? tail(lines)
		: lines;
	allButFirst = split(trim(join(allButFirst, '\n')), '\n');
	lines = ["'use strict';", '', ...allButFirst];

	lines = hasBang //
		? [one, ...lines]
		: lines;

	fs.writeFileSync(path, join(lines, '\n'), 'utf-8');
	console.log(" - Added 'use strict'; to", path, '...');
};

export default addUseStrict;
