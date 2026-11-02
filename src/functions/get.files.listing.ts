#!/usr/bin/env node
'use strict';

import * as fs from 'fs';
import * as path from 'path';

const getFilesListing: Function = (root: string): string[] => {
	const supportedExtensions: string[] = ['.js', '.ts'];

	let files: string[] = [];
	const children: fs.Dirent[] = fs.readdirSync(root, {withFileTypes: true});

	children.forEach((child: fs.Dirent): void => {
		const childFullPath: string = path.join(root, child.name);
		if (child.isDirectory()) files = files.concat(getFilesListing(childFullPath));
		else if (supportedExtensions.includes(path.extname(child.name).toLowerCase())) files.push(childFullPath);
	});

	return files.sort();
};

export default getFilesListing;
