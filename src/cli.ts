#!/usr/bin/env node

import { execute } from './executor';
import * as fs from 'fs';

async function main() {
    if (process.argv.length >= 3) {
        const filename = process.argv.at(2);
        const include_stdlib = !process.argv.includes('--no-stdlib');
        const result = await execute(
            fs.readFileSync(filename!).toString(),
            include_stdlib
        );

        console.log(`\nResult: ${result.type} ${result.exit_code}`);
        console.log(`Gas consumed: ${result.gas_consumed}`);
        console.log('Logs:\n');
        console.log(result.debugLogs.join('\n').replace(/#DEBUG#: /g, ''));
        console.log();
    } else {
        console.log(`Usage:
  fce filename [--no-stdlib]`);
    }
}

main();
