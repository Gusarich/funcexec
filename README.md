# funcexec

FunC executor for main() function

## Installation

For CLI usage:

```bash
npm i -g funcexec
```

For script usage:

```bash
npm i funcexec
```

## Usage

### From CLI

```bash
fce filename [--no-stdlib]
```

Example:

```bash
fce contract.fc
```

Example output:

```
Result: success 0
Gas consumed: 399
Logs:

s0 = CS{Cell{0024d371738b33132338fe203001fe2030fe2030} bits: 36..60; refs: 0..0}
s0 = 1
s0 = 3
```

### From JavaScript / TypeScript

Example:

```typescript
import { execute } from 'funcexec';

async function main() {
    const code = `() main () {
        int a = 1;
        int b = 2;
        int c = a + b;
        ~dump(c);
    }`;

    const result = await execute(code);

    console.log(result);
}

main();
```

Example output:

```json
{
  type: 'success',
  exit_code: 0,
  gas_consumed: 399,
  result: [
    1000000000000000000n,
    1000000000000000000n,
    x{480000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000203782DACE9D900000000000000000000000000000004_},
    x{}
  ],
  action_list_cell: x{},
  logs: '',
  actionList: [],
  debugLogs: [
    '#DEBUG#: s0 = CS{Cell{0024d371738b33132338fe203001fe2030fe2030} bits: 36..60; refs: 0..0}',
    '#DEBUG#: s0 = 1',
    '#DEBUG#: s0 = 3'
  ],
  c7: [
    [
      124711402n,
      0n,
      0n,
      1683456514n,
      1683456514n,
      1683456514n,
      47875142786658879052646382433116183532529609479486613149337769638019042486462n,
      [Array],
      x{8000000000000000000000000000000000000000000000000000000000000000001_},
      x{}
    ]
  ]
}
```
