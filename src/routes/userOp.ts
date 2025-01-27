import { Router } from "express";
import { generateUserOperation } from "../controllers/userOp";
import { validateUserOperationInputs } from "../middleware/validateUserOperationInputs";

const userOpRouter = Router();

userOpRouter.post(
  "/user-op",
  validateUserOperationInputs,
  generateUserOperation
);

export default userOpRouter;
