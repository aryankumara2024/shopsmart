const request = require("supertest");
const app = require("../src/app");

describe("Health Check", () => {
  it("GET /api/health should return 200 and status ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "ok");
    expect(res.body).toHaveProperty("endpoints");
  });
});

describe("Products API", () => {
  it("GET /api/products should return a list of products", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("products");
    expect(res.body).toHaveProperty("pagination");
    expect(res.body.products.length).toBeGreaterThan(0);
  });

  it("GET /api/products?category=Electronics should filter by category", async () => {
    const res = await request(app).get("/api/products?category=Electronics");
    expect(res.statusCode).toEqual(200);
    res.body.products.forEach((p) => {
      expect(p.category).toBe("Electronics");
    });
  });

  it("GET /api/products?search=headphones should search products", async () => {
    const res = await request(app).get("/api/products?search=headphones");
    expect(res.statusCode).toEqual(200);
    expect(res.body.products.length).toBeGreaterThan(0);
  });

  it("GET /api/products?sort=price-low should sort by price ascending", async () => {
    const res = await request(app).get("/api/products?sort=price-low");
    expect(res.statusCode).toEqual(200);
    const prices = res.body.products.map((p) => p.price);
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  });

  it("GET /api/products/:id should return a single product", async () => {
    const res = await request(app).get("/api/products/prod_1");
    expect(res.statusCode).toEqual(200);
    expect(res.body.product).toHaveProperty("id", "prod_1");
    expect(res.body.product).toHaveProperty("name");
  });

  it("GET /api/products/:id should return 404 for invalid ID", async () => {
    const res = await request(app).get("/api/products/nonexistent");
    expect(res.statusCode).toEqual(404);
  });

  it("GET /api/products/categories/list should return categories", async () => {
    const res = await request(app).get("/api/products/categories/list");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("categories");
    expect(Array.isArray(res.body.categories)).toBe(true);
    expect(res.body.categories.length).toBeGreaterThan(0);
  });
});

describe("Auth API", () => {
  const testUser = {
    name: "Test User",
    email: `testuser_${Date.now()}@example.com`,
    password: "securePassword123",
  };
  let authToken;

  it("POST /api/auth/signup should create a new user", async () => {
    const res = await request(app).post("/api/auth/signup").send(testUser);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body.user).not.toHaveProperty("password");
    authToken = res.body.token;
  });

  it("POST /api/auth/signup should reject duplicate email", async () => {
    const res = await request(app).post("/api/auth/signup").send(testUser);
    expect(res.statusCode).toEqual(409);
  });

  it("POST /api/auth/signup should validate required fields", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ email: "a@b.com" });
    expect(res.statusCode).toEqual(400);
  });

  it("POST /api/auth/login should return token for valid credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(testUser.email);
    authToken = res.body.token;
  });

  it("POST /api/auth/login should reject invalid password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: "wrongpassword",
    });
    expect(res.statusCode).toEqual(401);
  });

  it("GET /api/auth/profile should return user data with valid token", async () => {
    const res = await request(app)
      .get("/api/auth/profile")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body.user).not.toHaveProperty("password");
  });

  it("GET /api/auth/profile should reject without token", async () => {
    const res = await request(app).get("/api/auth/profile");
    expect(res.statusCode).toEqual(401);
  });
});

describe("Cart API", () => {
  let authToken;

  beforeAll(async () => {
    const email = `cartuser_${Date.now()}@example.com`;
    const res = await request(app).post("/api/auth/signup").send({
      name: "Cart User",
      email,
      password: "password123",
    });
    authToken = res.body.token;
  });

  it("GET /api/cart should return empty cart", async () => {
    const res = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.cart.items).toHaveLength(0);
  });

  it("POST /api/cart should add item to cart", async () => {
    const res = await request(app)
      .post("/api/cart")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ productId: "prod_1", quantity: 2 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.cart.items).toHaveLength(1);
    expect(res.body.cart.items[0].quantity).toBe(2);
  });

  it("PUT /api/cart/:productId should update quantity", async () => {
    const res = await request(app)
      .put("/api/cart/prod_1")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ quantity: 5 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.cart.items[0].quantity).toBe(5);
  });

  it("DELETE /api/cart/:productId should remove item", async () => {
    // Add a second item first
    await request(app)
      .post("/api/cart")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ productId: "prod_2", quantity: 1 });

    const res = await request(app)
      .delete("/api/cart/prod_1")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.cart.items).toHaveLength(1);
  });

  it("Cart should require authentication", async () => {
    const res = await request(app).get("/api/cart");
    expect(res.statusCode).toEqual(401);
  });
});

describe("Wishlist API", () => {
  let authToken;

  beforeAll(async () => {
    const email = `wishlistuser_${Date.now()}@example.com`;
    const res = await request(app).post("/api/auth/signup").send({
      name: "Wishlist User",
      email,
      password: "password123",
    });
    authToken = res.body.token;
  });

  it("POST /api/wishlist/toggle should add product to wishlist", async () => {
    const res = await request(app)
      .post("/api/wishlist/toggle")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ productId: "prod_1" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.action).toBe("added");
    expect(res.body.wishlist.count).toBe(1);
  });

  it("POST /api/wishlist/toggle should remove product if already in wishlist", async () => {
    const res = await request(app)
      .post("/api/wishlist/toggle")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ productId: "prod_1" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.action).toBe("removed");
    expect(res.body.wishlist.count).toBe(0);
  });
});

describe("Orders API", () => {
  let authToken;

  beforeAll(async () => {
    const email = `orderuser_${Date.now()}@example.com`;
    const res = await request(app).post("/api/auth/signup").send({
      name: "Order User",
      email,
      password: "password123",
    });
    authToken = res.body.token;
  });

  it("POST /api/orders should fail with empty cart", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(400);
  });

  it("POST /api/orders should place order from cart", async () => {
    // Add items to cart first
    await request(app)
      .post("/api/cart")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ productId: "prod_1", quantity: 1 });

    await request(app)
      .post("/api/cart")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ productId: "prod_3", quantity: 2 });

    // Place order
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ shippingAddress: "123 Test St, Test City" });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("order");
    expect(res.body.order.items).toHaveLength(2);
    expect(res.body.order).toHaveProperty("total");
    expect(res.body.order.status).toBe("confirmed");

    // Cart should be cleared after order
    const cartRes = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${authToken}`);
    expect(cartRes.body.cart.items).toHaveLength(0);
  });

  it("GET /api/orders should return order history", async () => {
    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.orders.length).toBeGreaterThan(0);
  });
});

describe("404 Handler", () => {
  it("should return 404 for unknown routes", async () => {
    const res = await request(app).get("/api/nonexistent");
    expect(res.statusCode).toEqual(404);
  });
});
