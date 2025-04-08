#!/usr/bin/env node
'use strict';

import * as fs from 'fs';
import {first, join, split, startsWith, tail, trim} from 'lodash';

const clc = require('cli-color');

const addUseStrict = (path: string): void => {
	if (!fs.existsSync(path)) return console.log(clc.red('\nStrictr ERROR: ' + clc.bold(`${path}`) + ' does not exist.'));

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
	console.log(clc.blue(' - Strictr Added ' + clc.italic("'use strict';") + ' to ' + clc.bold(path) + '...'));
};
export default addUseStrict;
