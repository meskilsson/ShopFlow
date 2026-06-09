process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test-secret-for-jest";
process.env.NODE_ENV = "test";

import request from "supertest";
import app from "../server";

describe("public utility endpoints", () => {
  it("GET /health returns ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });

  it("returns 404 JSON for unknown routes", async () => {
    const response = await request(app).get("/does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "The route GET /does-not-exist does not exist",
    });
  });
});

describe("auth endpoint validation", () => {
  it("POST /api/v1/auth/login rejects invalid request bodies", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "not-an-email", password: "" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation error");
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ location: "body", field: "email" }),
        expect.objectContaining({ location: "body", field: "password" }),
      ]),
    );
  });

  it("GET /api/v1/auth/me requires authentication", async () => {
    const response = await request(app).get("/api/v1/auth/me");

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      message: "Authentication required",
    });
  });
});

describe("user endpoint validation", () => {
  it("POST /api/v1/users rejects invalid registration data", async () => {
    const response = await request(app)
      .post("/api/v1/users")
      .send({
        name: "J",
        email: "bad-email",
        username: "no spaces allowed",
        password: "short",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation error");
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ location: "body", field: "name" }),
        expect.objectContaining({ location: "body", field: "email" }),
        expect.objectContaining({ location: "body", field: "username" }),
        expect.objectContaining({ location: "body", field: "password" }),
      ]),
    );
  });

  it("GET /api/v1/users requires authentication before listing users", async () => {
    const response = await request(app).get("/api/v1/users");

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      message: "Authentication required",
    });
  });
});

describe("product endpoint validation", () => {
  it("GET /api/v1/products validates query parameters", async () => {
    const response = await request(app).get(
      "/api/v1/products?sort=unknown&page=0&limit=101",
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation error");
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ location: "query", field: "sort" }),
        expect.objectContaining({ location: "query", field: "page" }),
        expect.objectContaining({ location: "query", field: "limit" }),
      ]),
    );
  });

  it("POST /api/v1/products requires authentication", async () => {
    const response = await request(app).post("/api/v1/products").send({});

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      message: "Authentication required",
    });
  });
});

