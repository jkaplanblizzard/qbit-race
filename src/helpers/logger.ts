import * as fs from 'fs';
import * as path from 'path';

import { LOGFILE } from '../config';

class Logger {

    constructor () {}

    private log(level: string, msg: string){
        const dateString = new Date().toISOString();
        const logString = `[${dateString}] ${level}: ${msg}\n`;
        console.log(logString.trim());
        const logfile = path.join(__dirname, '../../logs', LOGFILE);
        fs.appendFileSync(logfile, logString);
    }

    public info(msg: string){
        this.log('INFO', msg);
    }

    public error(msg: string){
        this.log('ERROR', msg);
    }
}

export const logger = new Logger();