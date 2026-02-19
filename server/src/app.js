const express = require("express");
const cors = require("cors");

// Import route modules
const authRoutes = require("./routes/auth");
const productsRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const wishlistRoutes = require("./routes/wishlist");
const ordersRoutes = require("./routes/orders");

const app = express();

// ─── Middleware ───────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Request logging (dev)
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const logColor = res.statusCode >= 400 ? "\x1b[31m" : "\x1b[32m";
    console.log(
      `${logColor}${req.method}\x1b[0m ${req.originalUrl} → ${res.statusCode} (${duration}ms)`,
    );
  });
  next();
});

// ─── Routes ──────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", ordersRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "ShopSmart Backend is running",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "/api/auth (signup, login, profile)",
      products: "/api/products (list, search, filter, get)",
      cart: "/api/cart (get, add, update, remove, clear)",
      wishlist: "/api/wishlist (get, toggle, clear)",
      orders: "/api/orders (place, history, get)",
    },
  });
});

// Root Route
app.get("/", (req, res) => {
  res.json({
    name: "ShopSmart Backend API",
    version: "1.0.0",
    docs: "GET /api/health for available endpoints",
  });
});

// ─── 404 Handler ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    message: `Route ${req.method} ${req.originalUrl} does not exist.`,
  });
});

// ─── Error Handler ───────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: "An unexpected error occurred.",
  });
});

module.exports = app;
