import request from "supertest";
import app from "../../index";

describe("POST /user-op", () => {
  it("should return a signed user operation", async () => {
    const response = await request(app).post("/v1/user-op").send({
      to: "0x0065512840A4c8E80b047C2246c06302d0B3801C",
      amount: 0.0001,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("userOp");
  });

  it("should fail with invalid address", async () => {
    const response = await request(app).post("/v1/user-op").send({
      amount: 0.0001,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error.code).toBe(-32602);
    expect(response.body.error.message).toBe("Missing/Invalid fields: address");
  });

  it("should fail with invalid amount", async () => {
    const response = await request(app).post("/v1/user-op").send({
      to: "0x0065512840A4c8E80b047C2246c06302d0B3801C",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error.code).toBe(-32602);
    expect(response.body.error.message).toBe("Missing/Invalid fields: amount");
  });
});
