#!/usr/bin/env node
'use strict';

import * as fs from 'fs';
import * as path from 'path';

const getFilesListing: Function = (root: string): string[] => {
	const supportedExtensions: string[] = ['.js', '.ts'];

	let files: string[] = [];
	const children: string[] = fs.readdirSync(root);

	const subfiles: string[] = children.filter((child: string): boolean => !fs.lstatSync(path.join(root, child)).isDirectory());
	subfiles.forEach((file: string): void => {
		const fileExt: string = path.extname(file);
		if (supportedExtensions.includes(fileExt.toLowerCase())) {
			files.push(path.join(root, file));
		}
	});

	const subfolders: string[] = children.filter((child: string): boolean => fs.lstatSync(path.join(root, child)).isDirectory());
	subfolders.forEach((folder: string): void => {
		const folderFullPath: string = path.join(root, folder);
		files = files.concat(getFilesListing(folderFullPath));
	});

	return files.sort();
};

export default getFilesListing;
