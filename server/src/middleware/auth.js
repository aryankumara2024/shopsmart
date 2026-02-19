/**
 * JWT Authentication Middleware
 * Extracts and verifies the Bearer token from the Authorization header.
 * Attaches the decoded user payload to req.user.
 */

const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET || "shopsmart_super_secret_key_change_in_production";

/**
 * Required auth — rejects request with 401 if no valid token.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Authentication required",
      message:
        "Please provide a valid Bearer token in the Authorization header",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expired",
        message: "Your session has expired. Please log in again.",
      });
    }
    return res.status(401).json({
      error: "Invalid token",
      message: "The provided token is invalid.",
    });
  }
}

/**
 * Optional auth — attaches user if valid token present, but doesn't reject.
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch {
    req.user = null;
  }

  next();
}

/**
 * Generate a JWT token for a user.
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  );
}

module.exports = { authenticate, optionalAuth, generateToken, JWT_SECRET };
