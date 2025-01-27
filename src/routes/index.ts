import { Router } from "express";
import rpcRouter from "./rpc";
import userOpRouter from "./userOp";

const router = Router();
router.use(userOpRouter);
router.use(rpcRouter);

export default router;
