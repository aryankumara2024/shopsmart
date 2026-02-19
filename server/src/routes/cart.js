/**
 * Cart Routes — Get, Add, Update, Remove, Clear
 * All routes are protected (require JWT).
 *
 * GET    /api/cart          — Get the current user's cart
 * POST   /api/cart          — Add an item to cart
 * PUT    /api/cart/:productId — Update quantity of an item
 * DELETE /api/cart/:productId — Remove an item from cart
 * DELETE /api/cart          — Clear the entire cart
 */

const express = require("express");
const fs = require("fs");
const path = require("path");
const store = require("../data/store");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// All cart routes require authentication
router.use(authenticate);

// Load products to validate product IDs and get product data
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
 * Helper: Get or create a cart for the current user.
 */
function getUserCart(userId) {
  let cart = store.findOne("carts", (c) => c.userId === userId);
  if (!cart) {
    cart = {
      userId,
      items: [],
      updatedAt: new Date().toISOString(),
    };
    store.insertOne("carts", cart);
  }
  return cart;
}

/**
 * Helper: Enrich cart items with full product data.
 */
function enrichCartItems(cart) {
  const products = loadProducts();
  const enrichedItems = cart.items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        productId: item.productId,
        quantity: item.quantity,
        addedAt: item.addedAt,
        product: product || null,
      };
    })
    .filter((item) => item.product !== null);

  const subtotal = enrichedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shipping = subtotal >= 99 ? 0 : 9.99;
  const tax = parseFloat((subtotal * 0.08).toFixed(2));
  const total = parseFloat((subtotal + shipping + tax).toFixed(2));

  return {
    items: enrichedItems,
    itemCount: enrichedItems.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: parseFloat(subtotal.toFixed(2)),
    shipping,
    tax,
    total,
    freeShippingEligible: subtotal >= 99,
    freeShippingRemaining:
      subtotal < 99 ? parseFloat((99 - subtotal).toFixed(2)) : 0,
  };
}

/**
 * GET /api/cart
 * Returns the current user's cart with enriched product data.
 */
router.get("/", (req, res) => {
  try {
    const cart = getUserCart(req.user.id);
    const enriched = enrichCartItems(cart);

    res.json({
      cart: enriched,
    });
  } catch (err) {
    console.error("Get cart error:", err);
    res
      .status(500)
      .json({
        error: "Internal server error",
        message: "Something went wrong.",
      });
  }
});

/**
 * POST /api/cart
 * Body: { productId, quantity? }
 * Adds an item to cart. If item already exists, increments quantity.
 */
router.post("/", (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        error: "Validation error",
        message: "productId is required.",
      });
    }

    if (quantity < 1 || !Number.isInteger(quantity)) {
      return res.status(400).json({
        error: "Validation error",
        message: "Quantity must be a positive integer.",
      });
    }

    // Verify product exists
    const products = loadProducts();
    const product = products.find((p) => p.id === productId);
    if (!product) {
      return res.status(404).json({
        error: "Not found",
        message: `Product "${productId}" not found.`,
      });
    }

    // Check stock
    if (!product.inStock || product.stock < quantity) {
      return res.status(400).json({
        error: "Out of stock",
        message: `Insufficient stock for "${product.name}".`,
      });
    }

    const cart = getUserCart(req.user.id);
    const existingItem = cart.items.find((i) => i.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        addedAt: new Date().toISOString(),
      });
    }

    cart.updatedAt = new Date().toISOString();

    store.updateOne(
      "carts",
      (c) => c.userId === req.user.id,
      () => cart,
    );

    const enriched = enrichCartItems(cart);
    res.json({
      message: `${product.name} added to cart`,
      cart: enriched,
    });
  } catch (err) {
    console.error("Add to cart error:", err);
    res
      .status(500)
      .json({
        error: "Internal server error",
        message: "Something went wrong.",
      });
  }
});

/**
 * PUT /api/cart/:productId
 * Body: { quantity }
 * Updates the quantity of an item in cart.
 */
router.put("/:productId", (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0 || !Number.isInteger(quantity)) {
      return res.status(400).json({
        error: "Validation error",
        message: "Quantity must be a non-negative integer.",
      });
    }

    const cart = getUserCart(req.user.id);
    const itemIndex = cart.items.findIndex((i) => i.productId === productId);

    if (itemIndex === -1) {
      return res.status(404).json({
        error: "Not found",
        message: "Item not found in cart.",
      });
    }

    if (quantity === 0) {
      // Remove item
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    cart.updatedAt = new Date().toISOString();

    store.updateOne(
      "carts",
      (c) => c.userId === req.user.id,
      () => cart,
    );

    const enriched = enrichCartItems(cart);
    res.json({
      message: quantity === 0 ? "Item removed from cart" : "Cart updated",
      cart: enriched,
    });
  } catch (err) {
    console.error("Update cart error:", err);
    res
      .status(500)
      .json({
        error: "Internal server error",
        message: "Something went wrong.",
      });
  }
});

/**
 * DELETE /api/cart/:productId
 * Removes a specific item from cart.
 */
router.delete("/:productId", (req, res) => {
  try {
    const { productId } = req.params;
    const cart = getUserCart(req.user.id);
    const itemIndex = cart.items.findIndex((i) => i.productId === productId);

    if (itemIndex === -1) {
      return res.status(404).json({
        error: "Not found",
        message: "Item not found in cart.",
      });
    }

    const removedItem = cart.items.splice(itemIndex, 1)[0];
    cart.updatedAt = new Date().toISOString();

    store.updateOne(
      "carts",
      (c) => c.userId === req.user.id,
      () => cart,
    );

    const enriched = enrichCartItems(cart);
    res.json({
      message: "Item removed from cart",
      removedProductId: removedItem.productId,
      cart: enriched,
    });
  } catch (err) {
    console.error("Remove from cart error:", err);
    res
      .status(500)
      .json({
        error: "Internal server error",
        message: "Something went wrong.",
      });
  }
});

/**
 * DELETE /api/cart
 * Clears the entire cart.
 */
router.delete("/", (req, res) => {
  try {
    store.updateOne(
      "carts",
      (c) => c.userId === req.user.id,
      (cart) => ({
        ...cart,
        items: [],
        updatedAt: new Date().toISOString(),
      }),
    );

    res.json({
      message: "Cart cleared",
      cart: {
        items: [],
        itemCount: 0,
        subtotal: 0,
        shipping: 9.99,
        tax: 0,
        total: 9.99,
        freeShippingEligible: false,
        freeShippingRemaining: 99,
      },
    });
  } catch (err) {
    console.error("Clear cart error:", err);
    res
      .status(500)
      .json({
        error: "Internal server error",
        message: "Something went wrong.",
      });
  }
});

module.exports = router;
