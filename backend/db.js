// db.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("maferme237", "root", "", {
  host: "localhost",
  dialect: "mysql", // ou "postgres"
});

module.exports = sequelize;
// Test de la connexion
//sequelize
//  .authenticate()