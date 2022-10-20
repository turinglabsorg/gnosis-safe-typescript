# Gnosis Safe Typescript

This repo is intended to explain and collect example to use Gnosis Safe multisignature wallet with Typescript, to automate and integrate transactions *outside* the gnosis safe application.

In order to start build the dependencies first with:
```
yarn
```

Then create and compile the `.env` file:
```
cp .env.example .env
```

You will need three different private keys and relative addresses, an [Infura](https://infura.io) account and, if you want to test the nft transfer, you will need an NFT contract on Goerli. First address will also need some funds on Goerli, because it's the one that will run transactions on the blockchain.

Other two addresses can sign off-chain, so they will not need any fund.

## Create safe
To create a new safe simply run the test:
```
yarn dev:create
```
This will create a 2/3 multisig, if you want to customize the thresold you can change the constant at row `22` of file `src/create-safe.ts`.

Answer will be something like:
```
Creating adapter..
Creating new Safe Factory..
Defining Safe owners and threshold..
Deploying new safe..
Safe deployed, getting address..
Safe address is: 0xBdF7aBDce8d766FCD6DCF9B03814575B92af864e
```

A new file called `safe` will be created, containing the safe address.
Now you can transfer both Goerli funds or NFTs and try the other two functions.

## Transfer funds

This test will transfer `1 wei` to first account, while the other account will sign and approve the transaction. To start the test run:
```
yarn dev:send:funds
```

Answer is very long so maybe it's the case to explain the steps:

1) Create the adapter for the owner
2) Connect to an existing safe (reding the file `safe` previously created)
3) Create the raw transaction
4) Sign the transaction with the first address
5) Sign the transaction with the second address
6) Execute the transaction

Each step is commented, so you'll be able to read the log and follow the steps:
```
1) Creating adapter..
2a) Reading safe address..
2b) Creating new Safe SDK..
3) SDK created, creating transaction..

Safe transaction created: EthSafeTransaction {
  signatures: Map(0) {},
  data: {
    to: '0xe6ccdb4d4da367a6a31297a00e6fda1933cc4e50',
    value: '0x1',
    data: '0x',
    operation: 0,
    baseGas: 0,
    gasPrice: 0,
    gasToken: '0x0000000000000000000000000000000000000000',
    refundReceiver: '0x0000000000000000000000000000000000000000',
    nonce: 2,
    safeTxGas: 0
  }
}

4) Signing transaction with signer 1..
First signed transaction: EthSafeTransaction {
  signatures: Map(1) {
    '0xe6ccdb4d4da367a6a31297a00e6fda1933cc4e50' => EthSignSignature {
      signer: '0xE6CCdb4d4dA367a6a31297a00e6fDA1933cC4e50',
      data: '0x1ce60455f819df64f60c6dbf0ff8f2efc20c6d967fb4eb38a46c13d083f16cf95c6a493bf9eecd2dc6d38321848494d610e2606154c6e9acdc7ee213f9f19abb20'
    }
  },
  data: {
    to: '0xe6ccdb4d4da367a6a31297a00e6fda1933cc4e50',
    value: '0x1',
    data: '0x',
    operation: 0,
    baseGas: 0,
    gasPrice: 0,
    gasToken: '0x0000000000000000000000000000000000000000',
    refundReceiver: '0x0000000000000000000000000000000000000000',
    nonce: 2,
    safeTxGas: 0
  }
}

5) Signing transaction with signer 2..
Second signed transaction: EthSafeTransaction {
  signatures: Map(2) {
    '0xe6ccdb4d4da367a6a31297a00e6fda1933cc4e50' => EthSignSignature {
      signer: '0xE6CCdb4d4dA367a6a31297a00e6fDA1933cC4e50',
      data: '0x1ce60455f819df64f60c6dbf0ff8f2efc20c6d967fb4eb38a46c13d083f16cf95c6a493bf9eecd2dc6d38321848494d610e2606154c6e9acdc7ee213f9f19abb20'
    },
    '0x38bf9d7482c4e50ee77bc30ab4fe47e9a0768640' => EthSignSignature {
      signer: '0x38bf9d7482C4E50Ee77Bc30AB4fe47e9A0768640',
      data: '0xb321c67d3cbdfda7117364acdcf14ccdb3281b6360863a5ac9dad677afbf33a7120f1b54261e2a323ecd7629a395c648241fd62dafdfcf1180cbb4ab6d382fb920'
    }
  },
  data: {
    to: '0xe6ccdb4d4da367a6a31297a00e6fda1933cc4e50',
    value: '0x1',
    data: '0x',
    operation: 0,
    baseGas: 0,
    gasPrice: 0,
    gasToken: '0x0000000000000000000000000000000000000000',
    refundReceiver: '0x0000000000000000000000000000000000000000',
    nonce: 2,
    safeTxGas: 0
  }
}

6) Executing transaction..
Transaction response: {
  to: '0x23A25AB47a33f399CcF67aCEe7B47c3Cd1d2D248',
  from: '0xE6CCdb4d4dA367a6a31297a00e6fDA1933cC4e50',
  contractAddress: null,
  transactionIndex: 33,
  gasUsed: BigNumber { _hex: '0x0108b9', _isBigNumber: true },
  logsBloom: '0x00000000400000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000040000000000000000000000000000000000008000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000004000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  blockHash: '0x5d023add8186e98d3ea5fb4dcd99639644d181f43cc8b549c90936119f7299a5',
  transactionHash: '0x1fec773283821efc6a76f69b5c3c28e56226712eedb466b65292f2e7ecf9756b',
  logs: [
    {
      transactionIndex: 33,
      blockNumber: 7801694,
      transactionHash: '0x1fec773283821efc6a76f69b5c3c28e56226712eedb466b65292f2e7ecf9756b',
      address: '0x23A25AB47a33f399CcF67aCEe7B47c3Cd1d2D248',
      topics: [Array],
      data: '0x000000000000000000000000e6ccdb4d4da367a6a31297a00e6fda1933cc4e50000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000082b321c67d3cbdfda7117364acdcf14ccdb3281b6360863a5ac9dad677afbf33a7120f1b54261e2a323ecd7629a395c648241fd62dafdfcf1180cbb4ab6d382fb920000000000000000000000000e6ccdb4d4da367a6a31297a00e6fda1933cc4e5000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000e6ccdb4d4da367a6a31297a00e6fda1933cc4e500000000000000000000000000000000000000000000000000000000000000002',
      logIndex: 59,
      blockHash: '0x5d023add8186e98d3ea5fb4dcd99639644d181f43cc8b549c90936119f7299a5'
    },
    {
      transactionIndex: 33,
      blockNumber: 7801694,
      transactionHash: '0x1fec773283821efc6a76f69b5c3c28e56226712eedb466b65292f2e7ecf9756b',
      address: '0x23A25AB47a33f399CcF67aCEe7B47c3Cd1d2D248',
      topics: [Array],
      data: '0x0adb3efbcf5c3cb0a4374b680e00bcc5e4898070c731a4f5a78b903a865ca9910000000000000000000000000000000000000000000000000000000000000000',
      logIndex: 60,
      blockHash: '0x5d023add8186e98d3ea5fb4dcd99639644d181f43cc8b549c90936119f7299a5'
    }
  ],
  blockNumber: 7801694,
  confirmations: 1,
  cumulativeGasUsed: BigNumber { _hex: '0x948060', _isBigNumber: true },
  effectiveGasPrice: BigNumber { _hex: '0x06dca73bc5', _isBigNumber: true },
  status: 1,
  type: 2,
  byzantium: true,
  events: [
    {
      transactionIndex: 33,
      blockNumber: 7801694,
      transactionHash: '0x1fec773283821efc6a76f69b5c3c28e56226712eedb466b65292f2e7ecf9756b',
      address: '0x23A25AB47a33f399CcF67aCEe7B47c3Cd1d2D248',
      topics: [Array],
      data: '0x000000000000000000000000e6ccdb4d4da367a6a31297a00e6fda1933cc4e50000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000082b321c67d3cbdfda7117364acdcf14ccdb3281b6360863a5ac9dad677afbf33a7120f1b54261e2a323ecd7629a395c648241fd62dafdfcf1180cbb4ab6d382fb920000000000000000000000000e6ccdb4d4da367a6a31297a00e6fda1933cc4e5000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000e6ccdb4d4da367a6a31297a00e6fda1933cc4e500000000000000000000000000000000000000000000000000000000000000002',
      logIndex: 59,
      blockHash: '0x5d023add8186e98d3ea5fb4dcd99639644d181f43cc8b549c90936119f7299a5',
      removeListener: [Function (anonymous)],
      getBlock: [Function (anonymous)],
      getTransaction: [Function (anonymous)],
      getTransactionReceipt: [Function (anonymous)]
    },
    {
      transactionIndex: 33,
      blockNumber: 7801694,
      transactionHash: '0x1fec773283821efc6a76f69b5c3c28e56226712eedb466b65292f2e7ecf9756b',
      address: '0x23A25AB47a33f399CcF67aCEe7B47c3Cd1d2D248',
      topics: [Array],
      data: '0x0adb3efbcf5c3cb0a4374b680e00bcc5e4898070c731a4f5a78b903a865ca9910000000000000000000000000000000000000000000000000000000000000000',
      logIndex: 60,
      blockHash: '0x5d023add8186e98d3ea5fb4dcd99639644d181f43cc8b549c90936119f7299a5',
      args: [Array],
      decode: [Function (anonymous)],
      event: 'ExecutionSuccess',
      eventSignature: 'ExecutionSuccess(bytes32,uint256)',
      removeListener: [Function (anonymous)],
      getBlock: [Function (anonymous)],
      getTransaction: [Function (anonymous)],
      getTransactionReceipt: [Function (anonymous)]
    }
  ]
}
```

## Transfer NFTs

This test will transfer the NFT with token id defined in the `.env` file at contract defined also there.
Answer will be similar to the previous one and you can run the test with:
```
yarn dev:send:nfts
```

## Enjoy!

This small tutorial is completed, feel free to fork it!