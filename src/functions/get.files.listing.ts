#!/usr/bin/env node
'use strict';

import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

import fixExtension from './fix.extension';

const getFilesListing: Function = (root: string, ext: string): string[] => {
	ext = fixExtension(ext);

	let files: string[] = [];
	const children: string[] = fs.readdirSync(root);

	const subfiles: string[] = _.filter(children, (child: string) => !fs.lstatSync(path.join(root, child)).isDirectory());
	_.each(subfiles, (file: string) => {
		const fileExt: string = path.extname(file);
		if (ext === _.toLower(fileExt)) files.push(path.join(root, file));
	});

	const subfolders: string[] = _.filter(children, (child: string) => fs.lstatSync(path.join(root, child)).isDirectory());
	_.each(subfolders, (folder: string) => {
		const folderFullPath: string = path.join(root, folder);
		files = _.concat(files, getFilesListing(folderFullPath, ext));
	});

	return _.sortBy(files);
};

export default getFilesListing;
