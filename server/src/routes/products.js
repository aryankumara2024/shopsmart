/**
 * Products Routes — List, Get, Search, Filter
 *
 * GET /api/products          — List all products (with optional filters)
 * GET /api/products/:id      — Get a single product by ID
 * GET /api/products/categories/list — Get all unique categories
 */

const express = require("express");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Load products from seed data file
const PRODUCTS_FILE = path.join(__dirname, "..", "data", "products.json");

function loadProducts() {
  try {
    const raw = fs.readFileSync(PRODUCTS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error loading products:", err.message);
    return [];
  }
}

/**
 * GET /api/products
 * Query params:
 *   - category: filter by category name
 *   - search: search by name or description
 *   - minPrice / maxPrice: price range filter
 *   - sort: 'price-low' | 'price-high' | 'rating' | 'popular' | 'newest'
 *   - page: page number (default 1)
 *   - limit: items per page (default 12)
 *   - badge: filter by badge value
 */
router.get("/", (req, res) => {
  try {
    let products = loadProducts();

    const { category, search, minPrice, maxPrice, sort, page, limit, badge } =
      req.query;

    // Filter by category
    if (category && category !== "all") {
      products = products.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase(),
      );
    }

    // Filter by search query
    if (search) {
      const query = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query),
      );
    }

    // Filter by price range
    if (minPrice) {
      products = products.filter((p) => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      products = products.filter((p) => p.price <= parseFloat(maxPrice));
    }

    // Filter by badge
    if (badge) {
      products = products.filter(
        (p) => p.badge && p.badge.toLowerCase() === badge.toLowerCase(),
      );
    }

    // Total count before pagination
    const totalCount = products.length;

    // Sort
    switch (sort) {
      case "price-low":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        products.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        products.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        products.sort((a, b) => b.reviews - a.reviews);
        break;
      case "newest":
        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        // Default: featured (no specific sort)
        break;
    }

    // Pagination
    const pageNum = parseInt(page) || 1;
    const pageSize = Math.min(parseInt(limit) || 12, 50); // Max 50 per page
    const startIndex = (pageNum - 1) * pageSize;
    const paginatedProducts = products.slice(startIndex, startIndex + pageSize);

    res.json({
      products: paginatedProducts,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (err) {
    console.error("Products list error:", err);
    res
      .status(500)
      .json({
        error: "Internal server error",
        message: "Something went wrong.",
      });
  }
});

/**
 * GET /api/products/categories/list
 * Returns an array of unique category names.
 */
router.get("/categories/list", (req, res) => {
  try {
    const products = loadProducts();
    const categories = [...new Set(products.map((p) => p.category))].sort();
    res.json({ categories });
  } catch (err) {
    console.error("Categories error:", err);
    res
      .status(500)
      .json({
        error: "Internal server error",
        message: "Something went wrong.",
      });
  }
});

/**
 * GET /api/products/:id
 * Returns a single product by ID.
 */
router.get("/:id", (req, res) => {
  try {
    const products = loadProducts();
    const product = products.find((p) => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({
        error: "Not found",
        message: `Product with ID "${req.params.id}" not found.`,
      });
    }

    res.json({ product });
  } catch (err) {
    console.error("Product detail error:", err);
    res
      .status(500)
      .json({
        error: "Internal server error",
        message: "Something went wrong.",
      });
  }
});

module.exports = router;
