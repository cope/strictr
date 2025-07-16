#!/usr/bin/env node
'use strict';

export interface Config {
	directories: string[];
}

export interface FileObject {
	name: string;
	path: string;
	full: string;
}

export interface CommanderOptions {
	config?: string;
	fix?: boolean;
	add?: boolean;
}

export interface PackageJson {
	name: string;
	version: string;
	description: string;
	[key: string]: any;
}
