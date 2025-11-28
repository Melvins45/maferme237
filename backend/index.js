const express = require("express");
const app = express();
const PORT = 5000;
// const { sequelize } = require("./models");
const clientRoutes = require("./routes/clientRoutes");
const { swaggerUi, specs } = require("./swagger");

app.use(express.json());
app.use("/api/clients", clientRoutes);

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
