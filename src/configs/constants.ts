import dotenv from "dotenv";

dotenv.config();

export const port = process.env.PORT || "";
export const version = process.env.VERSION || "";
export const nodeEnv = process.env.NODE_ENV || "";
export const providerUrl = process.env.PROVIDER_URL || "";
export const privateKey = process.env.PRIVATE_KEY || "";
export const chainId = process.env.CHAIN_ID || "";
export const bundlerUrl = process.env.BUNDLER_URL || "";
export const biconomyPaymasterApiKey =
  process.env.BICONOMY_PAYMASTER_API_KEY || "";
export const eoaPrivateKeys = process.env.EOA_PRIVATE_KEYS?.split(",") || [];
