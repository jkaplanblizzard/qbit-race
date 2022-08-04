#!/usr/bin/env node
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

//Create logs folder if it doesnt exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir) || !fs.lstatSync(logsDir).isDirectory()){
    fs.mkdirSync(logsDir);
}

import { setLogfile } from '../build/config.js';
setLogfile('tag_errored.log');
import { tagErroredTorrents } from '../build/tag_error.js';
const args = process.argv.slice(2);
tagErroredTorrents(args);