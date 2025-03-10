import { SigningMethod } from "@safe-global/protocol-kit";
import { MetaTransactionData, OperationType } from "@safe-global/types-kit";
import { initProtocolKit } from "./setup";
import SafeApiKit from "@safe-global/api-kit";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

async function run() {
  const walletClient = createWalletClient({
    account: privateKeyToAccount(process.env.SIGNER! as `0x${string}`),
    transport: http(process.env.RPC_URL!),
  });
  const apiKit = new SafeApiKit({
    chainId: 42161n,
  });
  const protocolKit = await initProtocolKit();
  const transactions: MetaTransactionData[] = [
    {
      to: "0xE6c30AD5AeE7AD22e9F39D51d67667587cdD05A1",
      value: "1",
      data: "0x",
      operation: OperationType.Call, // Optional
    },
  ];
  const safeTransaction = await protocolKit.createTransaction({
    transactions,
  });

  const safeTxHash = await protocolKit.getTransactionHash(safeTransaction);
  const signature = await protocolKit.signHash(safeTxHash);

  // Propose transaction to the service
  await apiKit.proposeTransaction({
    safeAddress: await protocolKit.getAddress(),
    safeTransactionData: safeTransaction.data,
    safeTxHash,
    senderAddress: walletClient.account.address,
    senderSignature: signature.data,
  });
}

run();
