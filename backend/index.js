const express = require("express");
const app = express();
const PORT = 5000;
// const { sequelize } = require("./models");
const clientRoutes = require("./routes/clientRoutes");
const entreprisesRoutes = require("./routes/entreprisesRoutes");
const fournisseurRoutes = require("./routes/fournisseurRoutes");
const authRoutes = require("./routes/authRoutes");
const authAdminRoutes = require("./routes/authAdminRoutes");
const administrateurRoutes = require("./routes/administrateurRoutes");
const gestionnaireRoutes = require("./routes/gestionnaireRoutes");
const producteurRoutes = require("./routes/producteurRoutes");
const livreurRoutes = require("./routes/livreurRoutes");
const produitRoutes = require("./routes/produitRoutes");
const { swaggerUi, specs } = require("./swagger");

app.use(express.json());
app.use("/api/fournisseurs", fournisseurRoutes);
app.use("/api/entreprises", entreprisesRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/administrateurs", administrateurRoutes);
app.use("/api/gestionnaires", gestionnaireRoutes);
app.use("/api/producteurs", producteurRoutes);
app.use("/api/livreurs", livreurRoutes);
app.use("/api/produits", produitRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", authAdminRoutes);

// (async () => {
//   try {
//     await sequelize.sync({ alter: true }); // ou { force: true } en dev
//     console.log("Base synchronisée avec succès !");
//   } catch (error) {
//     console.error("Erreur de synchronisation :", error);
//   }
// })();

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));


app.get("/", (req, res) => {
  res.send("Hello depuis Node.js !");
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`Doc disponible sur http://localhost:${PORT}/api-docs`);
});
