import { Request, Response } from "express";
import { CustomError } from "../types/customError";
import { ErrorDecoder } from "ethers-decode-error";
import { entryPointAbi } from "../configs/entryPointAbi";

const errorDecoder = ErrorDecoder.create([entryPointAbi]);

export async function handleError(
  req: Request,
  res: Response,
  error: any
): Promise<void> {
  let { statusCode, errorCode, message, errorData } = initializeErrorDefaults();

  const { jsonrpc, id } = req.body;

  if (error instanceof CustomError) {
    switch (error.type) {
      case "ValidationError":
        ({ statusCode, errorCode, message, errorData } =
          handleValidationError(error));
        break;
      case "MethodError":
        ({ statusCode, errorCode, message, errorData } = handleMethodError());
        break;
      case "BlockchainError":
        ({ statusCode, errorCode, message, errorData } =
          await handleBlockchainError(error));
        break;
      default:
        message = "Unknown error type";
        break;
    }
  }

  const errorObj: any = {
    code: errorCode,
    message,
  };

  if (errorData) {
    errorObj.data = errorData;
  }

  res.status(statusCode).json({
    jsonrpc,
    id,
    error: errorObj,
  });
}

// Initializes default error values.
function initializeErrorDefaults() {
  return {
    statusCode: 500,
    errorCode: -32603,
    message: "Internal error",
    errorData: null,
  };
}

// Handles validation errors.
function handleValidationError(error: any) {
  return {
    statusCode: 400,
    errorCode: -32602,
    message: `Missing/Invalid fields: ${error?.data?.missingFields?.join(
      ", "
    )}`,
    errorData: null,
  };
}

// Handles method not found errors.
function handleMethodError() {
  return {
    statusCode: 404,
    errorCode: -32601,
    message: "Method not found",
    errorData: null,
  };
}

// Handles blockchain errors, including network-related errors.
async function handleBlockchainError(error: any) {
  let { statusCode, errorCode, message, errorData } = initializeErrorDefaults();

  const { info, data } = error.data;

  if (info && info.error) {
    const { code } = info.error;
    errorCode = code || errorCode;
  }

  if (data?.code) {
    ({ statusCode, errorCode, message, errorData } = handleNetworkError(
      data?.code
    ));
  } else {
    ({ message, errorData } = await decodeCustomError(error));
  }

  return { statusCode, errorCode, message, errorData };
}

// Handles network-related errors based on the error code.
function handleNetworkError(code: string) {
  switch (code) {
    case "ECONNREFUSED":
      return {
        statusCode: 502,
        errorCode: -32002,
        message: "Blockchain node is unavailable. Connection refused.",
        errorData: null,
      };
    case "ETIMEDOUT":
      return {
        statusCode: 504,
        errorCode: -32003,
        message: "Blockchain RPC call timed out.",
        errorData: null,
      };
    case "ENETUNREACH":
      return {
        statusCode: 503,
        errorCode: -32004,
        message: "Network is unreachable.",
        errorData: null,
      };
    default:
      return initializeErrorDefaults();
  }
}

// Decodes custom errors and extracts a meaningful message.
async function decodeCustomError(error: any) {
  const decodedError = await errorDecoder.decode(error.data);
  const type = decodedError.type;
  const errorData = error?.data?.data;

  switch (type) {
    case "CustomError":
      const reasonIndex = decodedError?.fragment?.inputs?.findIndex(
        (input) => input.name === "reason"
      );
      return { errorData, message: decodedError.args[reasonIndex] || "" };
    default:
      return { errorData, message: decodedError.reason || "" };
  }
}
