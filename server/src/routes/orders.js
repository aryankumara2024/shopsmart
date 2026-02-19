/**
 * Orders Routes — Place Order, Get History, Get by ID
 * All routes are protected (require JWT).
 *
 * POST /api/orders              — Place an order from the current cart
 * GET  /api/orders              — Get order history for the current user
 * GET  /api/orders/:id          — Get a specific order by ID
 */

const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const store = require("../data/store");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// All order routes require authentication
router.use(authenticate);

// Load products
function loadProducts() {
  try {
    const raw = fs.readFileSync(
      path.join(__dirname, "..", "data", "products.json"),
      "utf-8",
    );
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * POST /api/orders
 * Places an order from the user's current cart.
 * Body (optional): { shippingAddress }
 */
router.post("/", (req, res) => {
  try {
    const { shippingAddress } = req.body;

    // Get user's cart
    const cart = store.findOne("carts", (c) => c.userId === req.user.id);

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        error: "Empty cart",
        message: "Your cart is empty. Add items before placing an order.",
      });
    }

    // Enrich items with product data
    const products = loadProducts();
    const orderItems = cart.items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;
        return {
          productId: item.productId,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          quantity: item.quantity,
          subtotal: parseFloat((product.price * item.quantity).toFixed(2)),
        };
      })
      .filter(Boolean);

    if (orderItems.length === 0) {
      return res.status(400).json({
        error: "Invalid cart",
        message: "Cart contains invalid products.",
      });
    }

    // Calculate totals
    const subtotal = parseFloat(
      orderItems.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2),
    );
    const shipping = subtotal >= 99 ? 0 : 9.99;
    const tax = parseFloat((subtotal * 0.08).toFixed(2));
    const total = parseFloat((subtotal + shipping + tax).toFixed(2));

    // Create the order
    const order = {
      id: `order_${crypto.randomUUID().split("-")[0]}`,
      userId: req.user.id,
      items: orderItems,
      subtotal,
      shipping,
      tax,
      total,
      status: "confirmed",
      shippingAddress: shippingAddress || null,
      paymentStatus: "paid",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000, // 3 days from now
      ).toISOString(),
    };

    store.insertOne("orders", order);

    // Clear the cart
    store.updateOne(
      "carts",
      (c) => c.userId === req.user.id,
      (c) => ({
        ...c,
        items: [],
        updatedAt: new Date().toISOString(),
      }),
    );

    res.status(201).json({
      message: "Order placed successfully!",
      order,
    });
  } catch (err) {
    console.error("Place order error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: "Something went wrong.",
    });
  }
});

/**
 * GET /api/orders
 * Returns all orders for the current user, newest first.
 */
router.get("/", (req, res) => {
  try {
    const orders = store.findMany("orders", (o) => o.userId === req.user.id);
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      orders,
      count: orders.length,
    });
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: "Something went wrong.",
    });
  }
});

/**
 * GET /api/orders/:id
 * Returns a specific order by ID.
 */
router.get("/:id", (req, res) => {
  try {
    const order = store.findOne(
      "orders",
      (o) => o.id === req.params.id && o.userId === req.user.id,
    );

    if (!order) {
      return res.status(404).json({
        error: "Not found",
        message: `Order "${req.params.id}" not found.`,
      });
    }

    res.json({ order });
  } catch (err) {
    console.error("Get order error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: "Something went wrong.",
    });
  }
});

module.exports = router;
