import request from "supertest";
import app from "../app";

describe("Auth Endpoints", () => {
  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "adiop@isra.sn",
        password: "12345",
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("tokens");
      expect(res.body.data).toHaveProperty("user");
    });

    it("should reject invalid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "wrong@email.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
