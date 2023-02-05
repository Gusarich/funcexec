#!/usr/bin/env node

import { compileFunc } from '@ton-community/func-js'
import { SmartContract, TvmRunnerAsynchronous } from 'ton-contract-executor'
import { Cell } from 'ton'
import * as fs from 'fs'

async function execute (sourceFile, include_stdlib) {
    const source = fs.readFileSync(sourceFile).toString()
    const stdlib = fs.readFileSync('./stdlib.fc').toString()

    var targets
    if (include_stdlib) {
        targets = ['stdlib.fc', 'main.fc']
    }
    else [
        targets = ['main.fc']
    ]
    const compileResult = await compileFunc({
        sources: {
            'stdlib.fc': stdlib,
            'main.fc': source,
        },
        targets
    })

    if (compileResult.status === 'error') throw new Error(compileResult.message)

    const contract = await SmartContract.fromCell(
        Cell.fromBoc(Buffer.from(compileResult.codeBoc, 'base64'))[0],
        new Cell(),
    )
    
    const res = await contract.runContract('recv_internal', [], {
        mutateCode: true,
        mutateData: true,
        gasLimits: 1e8
    })

    console.log(`\nResult: ${res.type} ${res.exit_code}`)
    console.log(`Gas consumed: ${res.gas_consumed}`)
    console.log('Logs:\n')
    console.log(res.debugLogs.join('\n').replace(/#DEBUG#: /g, ''))
    console.log()

    await TvmRunnerAsynchronous.getShared().cleanup()
}

if (process.argv.length >= 3) {
    const filename = process.argv.at(2)
    const include_stdlib = !process.argv.includes('--no-stdlib')
    execute(filename, include_stdlib)
}
else {
    console.log(`Usage:
  fce filename [--no-stdlib]`)
}
