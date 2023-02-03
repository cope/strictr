#!/usr/bin/env node
'use strict';

import * as path from 'path';

import * as _ from 'lodash';

import bail from './functions/bail';
import getConfig from './functions/get.config';
import checkFolder from './functions/check.folder';
import addUseStrict from './functions/add.use.strict';
import getFilesListing from './functions/get.files.listing';
import convertFilesToObjects from './functions/convert.files.to.objects';
import missingStrictStatement from './functions/missing.strict.statement';
import getTableFromFileObjects from './functions/get.table.from.file.objects';

const clc = require('cli-color');

export default {
	run(commander: any) {
		console.clear();

		const options: any = _.pick(commander, ['config', 'add']);
		const {add = false} = options;

		const root = process.cwd();
		const config = getConfig(root, options?.config);

		const {srcFolderName, testFolderName} = config;
		let {filesExtension} = config;

		const srcFolder = path.join(root, srcFolderName);
		checkFolder(srcFolder, 'Source');

		const testFolder = path.join(root, testFolderName);
		checkFolder(testFolder, 'Test');

		let srcFiles = getFilesListing(srcFolder, filesExtension);
		let testFiles = getFilesListing(testFolder, filesExtension);

		srcFiles = _.filter(srcFiles, missingStrictStatement);
		if (!_.isEmpty(srcFiles)) {
			console.log(clc.red('\nSource files missing the ' + clc.italic("'use strict';") + ' statement:'));
			console.log(clc.red(getTableFromFileObjects(convertFilesToObjects(srcFiles)).toString()));
		} else console.log(clc.green('\n✅ No source files are missing the ' + clc.italic("'use strict';") + ' statement.'));

		testFiles = _.filter(testFiles, missingStrictStatement);
		if (!_.isEmpty(testFiles)) {
			console.log(clc.red('\nTest files missing the ' + clc.italic("'use strict';") + ' statement:'));
			console.log(clc.red(getTableFromFileObjects(convertFilesToObjects(testFiles)).toString()));
		} else console.log(clc.green('\n✅ No test files are missing the ' + clc.italic("'use strict';") + ' statement.'));

		if (add) {
			if (_.isEmpty(srcFiles) && _.isEmpty(testFiles)) {
				console.log(clc.magenta('\nAdd is set to true, but there is nothing to add.'));
			} else {
				console.log(clc.blue("\nAdd is set to true. Adding 'use strict'; where I can...\n"));

				_.each(srcFiles, (file) => {
					addUseStrict(file);
				});
				console.log('');
				_.each(testFiles, (file) => {
					addUseStrict(file);
				});
			}

			console.log('\n');
		} else {
			if (!_.isEmpty(srcFiles) || !_.isEmpty(testFiles)) {
				let message = '\n';
				if (!_.isEmpty(srcFiles)) message += 'There are source files missing the ' + clc.italic("'use strict';") + ' statement!\n';
				if (!_.isEmpty(testFiles)) message += 'There are test files missing the ' + clc.italic("'use strict';") + ' statement!\n';

				bail(clc.red(message));
			} else {
				console.log(clc.green('\n✅ Everything is awesome!\n'));
			}
		}
	}
};
