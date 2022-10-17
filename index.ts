import {AptosAccount, AptosClient, HexString} from "aptos";
import * as dotenv from 'dotenv'

dotenv.config()

const client = new AptosClient('https://fullnode.testnet.aptoslabs.com/v1/')
const PRIVATE_KEY = process.env.PRIVATE_KEY as string

async function main() {
    const account = new AptosAccount(new HexString(PRIVATE_KEY).toUint8Array())
    const payload = {
        "arguments": [
            "1000000",
            "0"
        ],
        "function": "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::scripts::swap",
        "type": "entry_function_payload",
        "type_arguments": [
            "0x1::aptos_coin::AptosCoin",
            "0x43417434fd869edee76cca2a4d2301e528a1551b1d719b75c350c3c97d15b8b9::coins::USDT",
            "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::curves::Uncorrelated"
        ]
    }
    const raw = await client.generateTransaction(account.address().toString(), payload)
    const userTransaction = await client.simulateTransaction(account, raw, {
        estimatePrioritizedGasUnitPrice: true,
        estimateGasUnitPrice: true,
        estimateMaxGasAmount: true
    })
    console.log(userTransaction) // => userTransaction.gas_used:
}

main().then(() => {
    process.exitCode = 0
}).catch((e) => {
    console.log(e)
    process.exitCode = 1
})
