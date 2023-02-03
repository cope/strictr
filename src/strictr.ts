#!/usr/bin/env node
'use strict';

/**
 * @author: Predrag Stojadinovic <predrag@stojadinovic.net>
 *
 * Check for missing strict statement in files.
 * Usage:
 * -a, --add            Add missing strict statements (default: false)
 * -c, --config         Alternative config file (must be .json)
 *
 * <no params>          Lists files with missing 'use strict'; statement
 */

import {Command} from 'commander';
import check from './check';

const clc = require('cli-color');

const commander: any = new Command();
const packageJson = require('../package.json');

commander
	.version(packageJson.version)
	.description('Check for missing strict statement in files.\nUse .strictr.json config file to override default settings.')
	.option('-a, --add', 'Add missing strict statements', false)
	.option('-c, --config <config>', 'Alternative config file (must be .json)', '.strictr.json')
	.parse(process.argv);

const options = commander.opts();
if (!options?.help) console.log('NOTE: ' + clc.italic('\nUse .strictr.json config file to override default Strictr settings.\n'));

check.run(options);
