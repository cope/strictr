#!/usr/bin/env node
'use strict';

import * as fs from 'fs';
import path from 'path';

import {cloneDeep} from 'lodash';
import {Config} from '../types';

const getDefaultConfig: Function = (): Config => {
	return {
		directories: ['src', 'test']
	};
};

const getConfig: Function = (root: string, configFile: string): Config => {
	const defaultConfig: Config = getDefaultConfig();
	const configPath: string = path.join(root, configFile);

	// Check if config file exists before attempting to require it
	if (!fs.existsSync(configPath)) {
		// Silently return default config if file doesn't exist
		return defaultConfig;
	}

	try {
		const userConfig: Partial<Config> = require(configPath);

		return {...defaultConfig, ...userConfig};
	} catch (error) {
		// Only log error if file exists but can't be read/parsed
		console.error(error);
		return defaultConfig;
	}
};
export default getConfig;
