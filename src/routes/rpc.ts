import { Router } from "express";
import { sendUserOperation } from "../controllers/rpc";
import { validateUserOperationMiddleware } from "../middleware/validateUserOperation";

const rpcRouter = Router();

rpcRouter.post("/rpc", validateUserOperationMiddleware, sendUserOperation);

export default rpcRouter;
