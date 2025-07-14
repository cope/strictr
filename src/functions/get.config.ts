#!/usr/bin/env node
'use strict';

import * as fs from 'fs';
import path from 'path';

import {cloneDeep} from 'lodash';
import {Config} from '../types';

const getDefaultConfig: Function = (): Config => {
	const defaultConfig: Config = {
		srcFolderName: 'src',
		testFolderName: 'test'
	};

	try {
		const config: Config = cloneDeep(defaultConfig);
		return config;
	} catch (error) {
		console.error(error);
		return defaultConfig;
	}
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

		const config: Config = {...defaultConfig, ...userConfig};

		return config;
	} catch (error) {
		// Only log error if file exists but can't be read/parsed
		console.error(error);
		return defaultConfig;
	}
};
export default getConfig;
