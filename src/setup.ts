import Safe from "@safe-global/protocol-kit";
import dotenv from "dotenv";
dotenv.config();

export const initProtocolKit = async () => {
  return await Safe.init({
    provider: process.env.RPC_URL!,
    signer: process.env.SIGNER!,
    safeAddress: process.env.SAFE_ADDRESS!,
  });
};
