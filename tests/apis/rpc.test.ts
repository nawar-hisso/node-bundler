import request from "supertest";
import app from "../../index";

describe("Integration Test (1): /user-op and /rpc", () => {
  let userOpResponse: any;

  beforeAll(async () => {
    const response = await request(app).post("/v1/user-op").send({
      to: "0x0065512840A4c8E80b047C2246c06302d0B3801C",
      amount: 0.0001,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("userOp");

    userOpResponse = response.body.userOp;
  });

  it("should success with a transaction hash", async () => {
    const rpcResponse = await request(app)
      .post("/v1/rpc")
      .send({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_sendUserOperation",
        params: [userOpResponse, "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789"],
      });

    expect(rpcResponse.status).toBe(200);
    expect(rpcResponse.body).toHaveProperty("result");
  }, 30000);

  it("should fail with invalid nonce", async () => {
    const rpcResponse = await request(app)
      .post("/v1/rpc")
      .send({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_sendUserOperation",
        params: [userOpResponse, "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789"],
      });

    expect(rpcResponse.status).toBe(500);
    expect(rpcResponse.body).toHaveProperty("error");
    expect(rpcResponse.body.error.code).toBe(-32603);
    expect(rpcResponse.body.error.message).toBe("AA25 invalid account nonce");
  }, 30000);
});

describe("Integration Test (2): /user-op and /rpc", () => {
  let userOpResponse: any;

  beforeAll(async () => {
    const response = await request(app).post("/v1/user-op").send({
      to: "0x0065512840A4c8E80b047C2246c06302d0B3801C",
      amount: 0.0001,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("userOp");

    userOpResponse = response.body.userOp;
  });

  it("should fail with a signature error", async () => {
    const wrongSignature =
      "0x00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000001c5b32f37f5bea87bdd5374eb2ac54ea8e0000000000000000000000000000000000000000000000000000000000000041c3f16a2907827d68bbccba03a235a90ab2e31d1063fd08f401c4f2c186e955de58a0bcf5a5e034542933134ce9fd64109decb8bc28244cd044896f9289ccc0611b00000000000000000000000000000000000000000000000000000000000000";

    userOpResponse.signature = wrongSignature;

    const rpcResponse = await request(app)
      .post("/v1/rpc")
      .send({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_sendUserOperation",
        params: [userOpResponse, "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789"],
      });

    expect(rpcResponse.status).toBe(500);
    expect(rpcResponse.body).toHaveProperty("error");
    expect(rpcResponse.body.error.code).toBe(-32603);
    expect(rpcResponse.body.error.message).toBe("AA24 signature error");
  }, 30000);
});
