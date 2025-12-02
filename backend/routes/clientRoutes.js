// routes/clientRoutes.js
const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");
const authenticate = require("../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Gestion des clients
 */

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Obtenir tous les clients avec leurs données personnelles
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de tous les clients avec les informations personnelles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   personne: { $ref: '#/components/schemas/PersonnePublic' }
 *                   client: { $ref: '#/components/schemas/Client' }
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé - rôle gestionnaire ou administrateur requis
 *       500:
 *         description: Erreur serveur
 */
router.get("/", clientController.getClients);

/**
 * @swagger
 * /clients/{idClient}:
 *   get:
 *     summary: Obtenir un client spécifique par son ID avec ses données personnelles
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idClient
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Client trouvé avec ses informations personnelles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 personne: { $ref: '#/components/schemas/PersonnePublic' }
 *                 client: { $ref: '#/components/schemas/Client' }
 *       400:
 *         description: Paramètre idClient manquant
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé - gestionnaire ou administrateur requis
 *       404:
 *         description: Client non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get("/:idClient", clientController.getClient);

/**
 * @swagger
 * /clients/{idClient}:
 *   put:
 *     summary: Modifier un client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idClient
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomPersonne:
 *                 type: string
 *                 description: Nom de la personne
 *               prenomPersonne:
 *                 type: string
 *                 description: Prénom de la personne
 *               telephonePersonne:
 *                 type: string
 *                 description: Numéro de téléphone
 *               emailPersonne:
 *                 type: string
 *                 format: email
 *                 description: Adresse email
 *               adresseClient:
 *                 type: string
 *                 description: Adresse du client
 *     responses:
 *       200:
 *         description: Client modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 personne: { $ref: '#/components/schemas/PersonnePublic' }
 *                 client: { $ref: '#/components/schemas/Client' }
 *       400:
 *         description: Paramètre idClient manquant
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé - autorisé si l'ID correspond ou utilisateur est gestionnaire/administrateur
 *       404:
 *         description: Client non trouvé
 *       500:
 *         description: Erreur serveur
 *   delete:
 *     summary: Supprimer un client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idClient
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Client supprimé avec succès
 *       400:
 *         description: Paramètre idClient manquant
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé - autorisé si l'ID correspond ou utilisateur est gestionnaire/administrateur
 *       404:
 *         description: Client non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put("/:idClient", clientController.updateClient);
router.delete("/:idClient", authenticate, clientController.deleteClient);

// L'enregistrement et la connexion sont gérés par authRoutes.js (/api/auth/clients/register et /api/auth/login)

module.exports = router;
