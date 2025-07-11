#!/usr/bin/env node
'use strict';

const {exit}: {exit: (code: number) => never} = require('node:process');

const bail: Function = (message?: string): void => {
	console.error(message);
	exit(2);
};
export default bail;
