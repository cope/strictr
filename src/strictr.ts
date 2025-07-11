#!/usr/bin/env node
'use strict';

/**
 * @author: Predrag Stojadinovic <predrag@stojadinovic.net>
 *
 * Check for missing strict statement in files.
 * Usage:
 * -f, --fix            Fix missing strict statements (default: false)
 * -c, --config         Alternative config file (must be .json)
 *
 * <no params>          Lists files with missing 'use strict'; statement
 */

import {Command} from 'commander';
import check from './check';
import {PackageJson, CommanderOptions} from './types';

const commander: Command = new Command();
const packageJson: PackageJson = require('../package.json');

commander
	.version(packageJson.version)
	.description('Check for missing strict statement in files.\nUse .strictr.json config file to override default settings.')
	.option('-f, --fix', 'Fix missing strict statements', false)
	.option('-c, --config <config>', 'Alternative config file (must be .json)', '.strictr.json')
	.parse(process.argv);

const options: CommanderOptions = commander.opts();
check.run(options);
