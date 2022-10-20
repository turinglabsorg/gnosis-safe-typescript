import { ethers } from 'ethers'
import EthersAdapter from '@gnosis.pm/safe-ethers-lib'
import dotenv from 'dotenv'
import Safe, { SafeFactory, SafeAccountConfig } from '@gnosis.pm/safe-core-sdk'
import fs from 'fs'
dotenv.config()

async function run() {
    if (process.env.SIGNER_1 !== undefined && process.env.ADDRESS_1 !== undefined && process.env.ADDRESS_2 !== undefined && process.env.ADDRESS_3 !== undefined) {
        console.log("Creating adapter..")
        const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER)
        const safeOwner = new ethers.Wallet(process.env.SIGNER_1).connect(provider)
        const ethAdapter = new EthersAdapter({
            ethers,
            signer: safeOwner
        })
        console.log("Creating new Safe Factory..")
        const safeFactory = await SafeFactory.create({ ethAdapter })
        console.log("Defining Safe owners and threshold..")
        const owners = [process.env.ADDRESS_1, process.env.ADDRESS_2, process.env.ADDRESS_3]
        // Customize threshold here
        const threshold = 2
        const safeAccountConfig: SafeAccountConfig = {
            owners,
            threshold
        }

        console.log("Deploying new safe..")
        const safeSdk: Safe = await safeFactory.deploySafe({ safeAccountConfig })

        console.log("Safe deployed, getting address..")
        const newSafeAddress = safeSdk.getAddress()
        console.log("Safe address is:", newSafeAddress)
        fs.writeFileSync("./safe", newSafeAddress)
    }
}

run()