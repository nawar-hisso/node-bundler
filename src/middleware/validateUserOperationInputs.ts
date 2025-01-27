import { Request, Response, NextFunction } from "express";
import { isAddress } from "viem";
import { CustomError } from "../types/customError";
import { handleError } from "../utils/errorHandler";

export const validateUserOperationInputs = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { to, amount } = req.body;

    if (!to || !isAddress(to)) {
      const data = {
        missingFields: ["address"],
      };
      throw new CustomError("ValidationError", data);
    }

    if (typeof amount !== "number" || amount <= 0) {
      const data = {
        missingFields: ["amount"],
      };
      throw new CustomError("ValidationError", data);
    }

    next();
  } catch (error) {
    handleError(req, res, error);
  }
};
