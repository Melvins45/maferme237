// routes/clientRoutes.js
const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");
/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Gestion des clients
 */

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Créer un client
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               personne:
 *                 type: object
 *                 properties:
 *                   nomPersonne:
 *                     type: string
 *                   emailPersonne:
 *                     type: string
 *                   motDePassePersonne:
 *                     type: string
 *               adresseClient:
 *                 type: string
 *     responses:
 *       200:
 *         description: Client créé avec succès
 */
router.post("/", clientController.createClient);
router.get("/", async (req, res) => {
  const clients = await Client.findAll({ include: "Personne" });
  res.json(clients);
});

module.exports = router;
