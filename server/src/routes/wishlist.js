/**
 * Wishlist Routes — Get, Toggle, Clear
 * All routes are protected (require JWT).
 *
 * GET    /api/wishlist         — Get the user's wishlist
 * POST   /api/wishlist/toggle  — Toggle a product in/out of wishlist
 * DELETE /api/wishlist         — Clear the entire wishlist
 */

const express = require("express");
const fs = require("fs");
const path = require("path");
const store = require("../data/store");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// All wishlist routes require authentication
router.use(authenticate);

// Load products for enrichment
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
 * Helper: Get or create a wishlist for the current user.
 */
function getUserWishlist(userId) {
  let wishlist = store.findOne("wishlists", (w) => w.userId === userId);
  if (!wishlist) {
    wishlist = {
      userId,
      productIds: [],
      updatedAt: new Date().toISOString(),
    };
    store.insertOne("wishlists", wishlist);
  }
  return wishlist;
}

/**
 * Helper: Enrich wishlist with product data.
 */
function enrichWishlist(wishlist) {
  const products = loadProducts();
  const items = wishlist.productIds
    .map((pid) => products.find((p) => p.id === pid))
    .filter(Boolean);

  return {
    productIds: wishlist.productIds,
    items,
    count: items.length,
  };
}

/**
 * GET /api/wishlist
 * Returns the current user's wishlist with product data.
 */
router.get("/", (req, res) => {
  try {
    const wishlist = getUserWishlist(req.user.id);
    const enriched = enrichWishlist(wishlist);

    res.json({ wishlist: enriched });
  } catch (err) {
    console.error("Get wishlist error:", err);
    res
      .status(500)
      .json({
        error: "Internal server error",
        message: "Something went wrong.",
      });
  }
});

/**
 * POST /api/wishlist/toggle
 * Body: { productId }
 * Adds the product if not in wishlist, removes it if already there.
 */
router.post("/toggle", (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        error: "Validation error",
        message: "productId is required.",
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

    const wishlist = getUserWishlist(req.user.id);
    const isAlreadyInList = wishlist.productIds.includes(productId);
    let action;

    if (isAlreadyInList) {
      wishlist.productIds = wishlist.productIds.filter(
        (id) => id !== productId,
      );
      action = "removed";
    } else {
      wishlist.productIds.push(productId);
      action = "added";
    }

    wishlist.updatedAt = new Date().toISOString();

    store.updateOne(
      "wishlists",
      (w) => w.userId === req.user.id,
      () => wishlist,
    );

    const enriched = enrichWishlist(wishlist);
    res.json({
      message: `${product.name} ${action === "added" ? "added to" : "removed from"} wishlist`,
      action,
      wishlist: enriched,
    });
  } catch (err) {
    console.error("Toggle wishlist error:", err);
    res
      .status(500)
      .json({
        error: "Internal server error",
        message: "Something went wrong.",
      });
  }
});

/**
 * DELETE /api/wishlist
 * Clears the entire wishlist.
 */
router.delete("/", (req, res) => {
  try {
    store.updateOne(
      "wishlists",
      (w) => w.userId === req.user.id,
      (wl) => ({
        ...wl,
        productIds: [],
        updatedAt: new Date().toISOString(),
      }),
    );

    res.json({
      message: "Wishlist cleared",
      wishlist: { productIds: [], items: [], count: 0 },
    });
  } catch (err) {
    console.error("Clear wishlist error:", err);
    res
      .status(500)
      .json({
        error: "Internal server error",
        message: "Something went wrong.",
      });
  }
});

module.exports = router;
