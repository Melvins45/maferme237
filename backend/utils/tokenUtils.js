const { verifyToken } = require("../services/jwtService");

/**
 * Extract Bearer token from Authorization header
 * @param {Object} req - Express request object
 * @returns {String|null} - Raw token string or null if not found
 */
const extractBearer = (req) => {
  const auth = req.headers.authorization || req.headers.Authorization;
  if (!auth) return null;
  const parts = auth.split(" ");
  if (parts.length !== 2) return null;
  return parts[1];
};

/**
 * Ensure user has required roles
 * @param {Object} payload - Decoded token payload
 * @param {Array<String>} allowedRoles - Array of allowed roles
 * @returns {Boolean} - true if user has one of the required roles
 */
const ensureRoles = (payload, allowedRoles) => {
  if (!payload || !payload.roles) return false;
  return payload.roles.some((r) => allowedRoles.includes(r));
};

module.exports = {
  extractBearer,
  ensureRoles
};
