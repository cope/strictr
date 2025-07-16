#!/usr/bin/env node
'use strict';

import * as path from 'path';

import _ from 'lodash';

import {CommanderOptions, Config} from './types';

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
	run: (commander: CommanderOptions): void => {
		console.log(clc.blue.bgGreen.bold('\n*** STRICTR ***'));

		const options: Partial<CommanderOptions> = _.pick(commander, ['config', 'fix']);
		const {fix = false} = options;

		const root: string = process.cwd();
		const config: Config = getConfig(root, options?.config || '.strictr.json');

		const {directories} = config;

		// Check all directories exist and are valid
		_.each(directories, (dir: string): void => {
			const dirPath: string = path.join(root, dir);
			checkFolder(dirPath, dir);
		});

		// Collect all files from all directories
		let allFiles: string[] = [];
		_.each(directories, (dir: string): void => {
			const dirPath: string = path.join(root, dir);
			const files: string[] = getFilesListing(dirPath);
			allFiles = allFiles.concat(files);
		});

		// Filter files missing strict statement
		const filesWithoutStrict: string[] = allFiles.filter(missingStrictStatement);

		if (!_.isEmpty(filesWithoutStrict)) {
			console.log(clc.red('\nStrictr: Files missing the ' + clc.italic("'use strict';") + ' statement:'));
			console.log(clc.red(getTableFromFileObjects(convertFilesToObjects(filesWithoutStrict)).toString()));
		} else {
			console.log(clc.green('\n✅  Strictr: No files are missing the ' + clc.italic("'use strict';") + ' statement.'));
		}

		if (fix) {
			if (_.isEmpty(filesWithoutStrict)) {
				return console.log(clc.green('\n✅  ' + clc.bold('Strictr') + ': Everything is awesome!\n'));
			}

			console.log(clc.blue('\n🔍  Strictr: Fix is set to true. Adding ' + clc.italic("'use strict';") + ' where I can...\n'));

			_.each(filesWithoutStrict, (file: string): void => {
				addUseStrict(file);
			});

			console.log('\n');
		} else {
			if (_.isEmpty(filesWithoutStrict)) {
				return console.log(clc.green('\n✅  ' + clc.bold('Strictr') + ': Everything is awesome!\n'));
			}

			const message: string = '\n' + clc.bold('Strictr ERROR:') + ' There are files missing the ' + clc.italic("'use strict';") + ' statement!\n';

			bail(clc.red(message));
		}
	}
};
