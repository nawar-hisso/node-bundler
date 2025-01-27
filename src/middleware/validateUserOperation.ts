import { Request, Response, NextFunction } from "express";
import { CustomError } from "../types/customError";
import { handleError } from "../utils/errorHandler";

export function validateUserOperationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { method, params } = req.body;

    if (method !== "eth_sendUserOperation") {
      throw new CustomError(
        "MethodError",
        "Invalid method. Expected 'eth_sendUserOperation'."
      );
    }

    if (!Array.isArray(params) || params.length < 2) {
      const data = {
        missingFields: ["userOp", "entryPoint"],
      };
      throw new CustomError("ValidationError", data);
    }

    const userOp = params[0];

    const requiredFields = [
      "sender",
      "nonce",
      "callData",
      "callGasLimit",
      "verificationGasLimit",
      "preVerificationGas",
      "maxFeePerGas",
      "maxPriorityFeePerGas",
      "signature",
    ];

    const missingFields = [];
    for (const field of requiredFields) {
      if (!userOp[field]) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      const data = { missingFields };
      throw new CustomError("ValidationError", data);
    }

    next();
  } catch (error) {
    handleError(req, res, error);
  }
}
