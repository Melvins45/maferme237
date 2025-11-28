// services/jwtService.js
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "devsecret";

exports.signUser = (payload) => jwt.sign(payload, SECRET, { expiresIn: "7d" });
exports.verifyToken = (token) => jwt.verify(token, SECRET);
