// middlewares/auth.js
const { verifyToken } = require("../services/jwtService");

module.exports = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Token requis" });

  try {
    req.user = verifyToken(token); // { sub, role, iat, exp }
    next();
  } catch {
    res.status(401).json({ error: "Token invalide" });
  }
};
