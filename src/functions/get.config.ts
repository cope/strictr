#!/usr/bin/env node
'use strict';

import * as fs from 'fs';
import path from 'path';

import {cloneDeep, find, set} from 'lodash';
import fixExtension from './fix.extension';
import {Config} from '../types';

const hasJS: Function = (srcFolder: string): boolean => {
	const files: string[] = fs.readdirSync(srcFolder);
	const foundJS: string | undefined = find(files, (file: string): boolean => {
		const ext: string = path.extname(file);
		return ext === '.js';
	});
	return !!foundJS;
};

const getDefaultConfig: Function = (root: string): Config => {
	const defaultConfig: Config = {
		srcFolderName: 'src',
		testFolderName: 'test',
		filesExtension: '.ts'
	};

	try {
		const config: Config = cloneDeep(defaultConfig);

		const srcFolder: string = path.join(root, 'src');
		if (fs.lstatSync(srcFolder).isDirectory()) {
			if (hasJS(srcFolder)) {
				set(config, 'filesExtension', '.js');
			}
		}

		return config;
	} catch (error) {
		console.error(error);
		return defaultConfig;
	}
};

const getConfig: Function = (root: string, configFile: string): Config => {
	const defaultConfig: Config = getDefaultConfig(root);
	try {
		const userConfig: Partial<Config> = require(path.join(root, configFile));

		const config: Config = {...defaultConfig, ...userConfig};
		set(config, 'filesExtension', fixExtension(config.filesExtension));

		return config;
	} catch (error) {
		console.error(error);
		return defaultConfig;
	}
};
export default getConfig;
