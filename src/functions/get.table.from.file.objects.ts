#!/usr/bin/env node
'use strict';

import _ from 'lodash';
import Table from 'cli-table';

import {FileObject} from '../types';

const getTableFromFileObjects: Function = (objects: FileObject[], includeNewPath?: boolean): Table => {
	const columns: string[] = ['#', 'File', 'Path'];
	if (includeNewPath) columns.push('New Path');

	const table: Table = new Table({style: {head: ['black'], compact: true}, head: columns});
	let id: number = 0;
	_.each(objects, (o: FileObject) => table.push([String(++id), ..._.values(_.omit(o, ['full']))]));
	return table;
};

export default getTableFromFileObjects;
