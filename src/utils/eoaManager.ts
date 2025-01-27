import { Wallet, JsonRpcProvider } from "ethers";
import { Mutex } from "async-mutex";
import { eoaPrivateKeys, providerUrl } from "../configs/constants";
import { hasPendingTransactions } from "./hasPendingTransactions";

const provider = new JsonRpcProvider(providerUrl);
const wallets = eoaPrivateKeys.map((el) => new Wallet(el, provider));

let currentEOAIndex = 0;
const mutex = new Mutex();

export async function getEoa(): Promise<Wallet> {
  try {
    return await mutex.runExclusive(async () => {
      let eoa = wallets[currentEOAIndex];
      let isBusy = await hasPendingTransactions(eoa.address);

      while (isBusy) {
        currentEOAIndex = (currentEOAIndex + 1) % wallets.length;
        eoa = wallets[currentEOAIndex];
        isBusy = await hasPendingTransactions(eoa.address);
      }
      currentEOAIndex = (currentEOAIndex + 1) % wallets.length;
      return eoa;
    });
  } catch (error) {
    throw error;
  }
}
