#!/usr/bin/env node

import { compileFunc } from '@ton-community/func-js'
import { SmartContract, TvmRunnerAsynchronous } from 'ton-contract-executor'
import { Cell, InternalMessage, CommonMessageInfo, CellMessage, Address } from 'ton'
import * as fs from 'fs'

async function execute (sourceFile) {
    const source = fs.readFileSync(sourceFile).toString()
    const stdlib = fs.readFileSync('stdlib.fc').toString()

    const compileResult = await compileFunc({
        sources: {
            'stdlib.fc': stdlib,
            'main.fc': source,
        },
        entryPoints: ['stdlib.fc', 'main.fc'],
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

execute(process.argv.at(-1))