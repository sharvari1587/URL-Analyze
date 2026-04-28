const request = require("supertest");
const app = require("../app"); // ✅ NOT server.js

describe("URL Analyzer API", () => {
  it("should return analysis for a URL", async () => {
    const res = await request(app)
      .post("/analyze")
      .send({ url: "https://redbus.in" });

    expect(res.statusCode).toBe(200);
  });
});