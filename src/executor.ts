import { stdlib } from './stdlib';
import { compileFunc } from '@ton-community/func-js';
import {
    ExecutionResult,
    SmartContract,
    TvmRunnerAsynchronous,
    internal,
} from 'ton-contract-executor';
import { Address, Cell, toNano } from 'ton-core';

export async function execute(
    source: string,
    include_stdlib?: boolean
): Promise<ExecutionResult> {
    const targets = include_stdlib ? ['stdlib.fc', 'main.fc'] : ['main.fc'];

    const compileResult = await compileFunc({
        sources: {
            'stdlib.fc': stdlib,
            'main.fc': source,
        },
        targets,
    });

    if (compileResult.status === 'error')
        throw new Error(compileResult.message);

    const contract = await SmartContract.fromCell(
        Cell.fromBoc(Buffer.from(compileResult.codeBoc, 'base64'))[0],
        new Cell()
    );

    const res = await contract.sendInternalMessage(
        internal({
            dest: Address.parseRaw('0:00000000000000000000000000000000'),
            value: toNano('1000000000'),
            bounce: false,
            body: Cell.EMPTY,
        })
    );

    await TvmRunnerAsynchronous.getShared().cleanup();

    return res;
}
