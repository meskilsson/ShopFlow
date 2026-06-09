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

describe("order endpoint authentication", () => {
  it("GET /api/v1/orders requires admin authentication", async () => {
    const response = await request(app).get("/api/v1/orders");

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      message: "Authentication required",
    });
  });

  it("POST /api/v1/orders requires admin authentication", async () => {
    const response = await request(app)
      .post("/api/v1/orders")
      .send({ items: [] });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      message: "Authentication required",
    });
  });
});

describe("cart endpoint validation", () => {
  it("POST /api/v1/cart/items rejects invalid cart item bodies", async () => {
    const response = await request(app)
      .post("/api/v1/cart/items")
      .send({ productVariantId: "not-an-id", quantity: "two" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation error");
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ location: "body", field: "productVariantId" }),
        expect.objectContaining({ location: "body", field: "quantity" }),
      ]),
    );
  });
});

describe("address endpoint validation", () => {
  it("POST /api/v1/address rejects invalid address bodies", async () => {
    const response = await request(app)
      .post("/api/v1/address")
      .send({
        type: "home",
        fullName: "A",
        street: "NoNumberStreet",
        postalCode: "abc",
        city: "1",
        country: "",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation error");
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ location: "body", field: "type" }),
        expect.objectContaining({ location: "body", field: "fullName" }),
        expect.objectContaining({ location: "body", field: "street" }),
        expect.objectContaining({ location: "body", field: "postalCode" }),
        expect.objectContaining({ location: "body", field: "city" }),
        expect.objectContaining({ location: "body", field: "country" }),
      ]),
    );
  });
});

describe("review endpoint validation and auth", () => {
  it("GET /api/v1/products/:productId/reviews validates product ids", async () => {
    const response = await request(app).get("/api/v1/products/not-an-id/reviews");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation error");
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ location: "params", field: "productId" }),
      ]),
    );
  });

  it("POST /api/v1/products/:productId/reviews requires authentication", async () => {
    const productId = "64abc12364abc12364abc123";
    const response = await request(app)
      .post(`/api/v1/products/${productId}/reviews`)
      .send({ rating: 5, comment: "Great" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "No token in cookie" });
  });
});

describe("admin endpoint authentication", () => {
  it("GET /api/v1/admin/users requires authentication", async () => {
    const response = await request(app).get("/api/v1/admin/users");

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      message: "Authentication required",
    });
  });
});
