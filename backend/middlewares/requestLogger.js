const { RequestLogs } = require("../models");
const { verifyToken } = require("../services/jwtService");

/**
 * Middleware to log all requests
 * Extracts user info from JWT token and saves request details to RequestLogs
 */
const requestLogger = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const auth = req.headers.authorization || req.headers.Authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    let acteurId = null;
    let acteurType = null;

    // Verify token and extract user info
    if (token) {
      try {
        const decoded = verifyToken(token);
        acteurId = decoded.sub;
        acteurType = decoded.role ? decoded.role.charAt(0).toUpperCase() + decoded.role.slice(1) : null;
      } catch (e) {
        // Token invalid or expired, log without user info
      }
    }

    // Capture response data
    const originalJson = res.json;
    res.json = function (data) {
      // Log request after response is sent
      if (acteurId && acteurType) {
        RequestLogs.create({
          acteurId,
          acteurType,
          action: req.method,
          endpoint: req.originalUrl || req.url,
          payload: req.method !== "GET" ? JSON.stringify(req.body) : null,
          dateRequete: new Date()
        }).catch((err) => {
          console.error("Error logging request:", err);
        });
      }

      return originalJson.call(this, data);
    };

    next();
  } catch (error) {
    console.error("Request logger error:", error);
    next();
  }
};

module.exports = requestLogger;
