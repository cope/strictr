#!/usr/bin/env node
'use strict';

import * as fs from 'fs';
import * as path from 'path';

import _ from 'lodash';

const getFilesListing: Function = (root: string): string[] => {
	const supportedExtensions: string[] = ['.js', '.ts'];

	let files: string[] = [];
	const children: string[] = fs.readdirSync(root);

	const subfiles: string[] = _.filter(children, (child: string) => !fs.lstatSync(path.join(root, child)).isDirectory());
	_.each(subfiles, (file: string) => {
		const fileExt: string = path.extname(file);
		if (supportedExtensions.includes(_.toLower(fileExt))) {
			files.push(path.join(root, file));
		}
	});

	const subfolders: string[] = _.filter(children, (child: string) => fs.lstatSync(path.join(root, child)).isDirectory());
	_.each(subfolders, (folder: string) => {
		const folderFullPath: string = path.join(root, folder);
		files = _.concat(files, getFilesListing(folderFullPath));
	});

	return _.sortBy(files);
};

export default getFilesListing;
