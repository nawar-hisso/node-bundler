import { JsonRpcProvider } from "ethers";
import { providerUrl } from "../configs/constants";

const provider = new JsonRpcProvider(providerUrl);

export async function hasPendingTransactions(
  walletAddress: string
): Promise<boolean> {
  try {
    const pendingNonce = await provider.getTransactionCount(
      walletAddress,
      "pending"
    );
    const latestNonce = await provider.getTransactionCount(
      walletAddress,
      "latest"
    );

    return pendingNonce > latestNonce;
  } catch (error) {
    throw error;
  }
}
