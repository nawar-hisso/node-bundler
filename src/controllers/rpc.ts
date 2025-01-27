import { Contract } from "ethers";
import { getEoa } from "../utils/eoaManager";
import { CustomError } from "../types/customError";
import { entryPointAbi } from "../configs/entryPointAbi";
import { Request, Response } from "express";
import { handleError } from "../utils/errorHandler";

export async function sendUserOperation(req: Request, res: Response) {
  try {
    const { jsonrpc, id, params } = req.body;

    const userOp = params[0];
    const entryPointAddress = params[1];

    const gas = 2000000;
    const eoa = await getEoa();

    const entryPoint = new Contract(entryPointAddress, entryPointAbi, eoa);

    const tx = await entryPoint.handleOps([userOp], eoa.address, {
      gasLimit: gas,
    });
    await tx.wait();

    res.json({
      jsonrpc,
      id,
      result: tx.hash,
    });
  } catch (error: any) {
    handleError(req, res, new CustomError("BlockchainError", error));
  }
}
