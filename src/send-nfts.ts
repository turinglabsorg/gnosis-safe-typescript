import { ethers } from 'ethers'
import EthersAdapter from '@gnosis.pm/safe-ethers-lib'
import dotenv from 'dotenv'
import Safe, { SafeFactory, SafeAccountConfig } from '@gnosis.pm/safe-core-sdk'
import { SafeTransactionDataPartial } from '@gnosis.pm/safe-core-sdk-types'
import fs from 'fs'
dotenv.config()

const ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

function signTransactionOffchain(transaction: any, signer: string) {
    return new Promise(async response => {
        if (signer !== undefined && process.env[signer] !== undefined) {
            const signer_key: string = <string>process.env[signer]
            const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER)
            const signerWallet = new ethers.Wallet(signer_key).connect(provider)
            const ethAdapter = new EthersAdapter({
                ethers,
                signer: signerWallet
            })
            const safeAddress = fs.readFileSync("./safe").toString()
            const safeSdk = await Safe.create({ ethAdapter, safeAddress })
            const signedSafeTransaction = await safeSdk.signTransaction(transaction)
            response(signedSafeTransaction)
        } else { response(false) }
    })
}

async function run() {
    if (process.env.SIGNER_1 !== undefined && process.env.ADDRESS_1 !== undefined && process.env.NFT_CONTRACT !== undefined && process.env.TOKEN_ID !== undefined) {
        console.log("Creating adapter..")
        const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER)
        const safeOwner = new ethers.Wallet(process.env.SIGNER_1).connect(provider)
        const ethAdapter = new EthersAdapter({
            ethers,
            signer: safeOwner
        })

        console.log("Reading safe address..")
        const safeAddress = fs.readFileSync("./safe").toString()

        console.log("Creating new Safe SDK..")
        const safeSdk = await Safe.create({ ethAdapter, safeAddress })

        console.log("SDK created, encoding function data..")
        const contractInterface = new ethers.utils.Interface(ABI)
        const data = await contractInterface.encodeFunctionData("transferFrom", [safeAddress, process.env.ADDRESS_1, process.env.TOKEN_ID])
        console.log("Encoded data are:", data)
        
        console.log("Data calculated, creating transaction..")
        const safeTransactionData: SafeTransactionDataPartial = {
            to: <string>process.env.NFT_CONTRACT,
            value: "0x0",
            data: data
        }

        const safeTransaction = await safeSdk.createTransaction({ safeTransactionData })
        console.log("Safe transaction created:", safeTransaction)

        console.log("Signing transaction with signer 1..")
        const signedSafeTransactionAddress1 = <any>await signTransactionOffchain(safeTransaction, "SIGNER_1")
        console.log("First signed transaction:", signedSafeTransactionAddress1)

        console.log("Signing transaction with signer 2..")
        const signedSafeTransactionAddress2 = <any>await signTransactionOffchain(signedSafeTransactionAddress1, "SIGNER_2")
        console.log("Second signed transaction:", signedSafeTransactionAddress2)

        console.log("Executing transaction..")
        const executeTxResponse = await safeSdk.executeTransaction(signedSafeTransactionAddress2)
        const response = await executeTxResponse.transactionResponse?.wait()
        console.log("Transaction response:", response)
    }
}

run()