import { http, type Hex, createWalletClient, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
  type SupportedSigner,
  createSmartAccountClient,
} from "@biconomy/account";
import { getChain } from "../utils/getChain";
import {
  biconomyPaymasterApiKey,
  bundlerUrl,
  chainId,
  privateKey,
} from "../configs/constants";
import { Request, Response } from "express";
import { handleError } from "../utils/errorHandler";
import { CustomError } from "../types/customError";

export const generateUserOperation = async (req: Request, res: Response) => {
  try {
    const { to, amount } = req.body;

    const account = privateKeyToAccount(privateKey as Hex);
    const client = createWalletClient({
      account,
      chain: getChain(Number(chainId)),
      transport: http(),
    });

    const smartAccount = await createSmartAccountClient({
      signer: client as SupportedSigner,
      bundlerUrl: bundlerUrl,
      biconomyPaymasterApiKey: biconomyPaymasterApiKey,
    });

    const txData = {
      to,
      value: parseEther(amount.toString()),
    };

    const userOp = await smartAccount.buildUserOp([txData]);

    const signedUserOp = await smartAccount.signUserOp(userOp);

    res.json({
      userOp: signedUserOp,
    });
  } catch (error) {
    handleError(req, res, new CustomError("BlockchainError", error));
  }
};
