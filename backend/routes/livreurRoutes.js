// routes/livreurRoutes.js
const express = require("express");
const router = express.Router();
const livreurController = require("../controllers/livreurController");

/**
 * @swagger
 * tags:
 *   name: Livreurs
 *   description: Gestion des livreurs (secure)
 */

/**
 * @swagger
 * /livreurs:
 *   get:
 *     summary: Get all livreurs with their person data
 *     tags: [Livreurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all livreurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   personne: { $ref: '#/components/schemas/PersonnePublic' }
 *                   livreur: { $ref: '#/components/schemas/Livreur' }
 *       401:
 *         description: Token manquant or invalid
 *       403:
 *         description: Accès refusé - administrateur ou gestionnaire requis
 *       500:
 *         description: Server error
 */
router.get("/", livreurController.getLivreurs);

/**
 * @swagger
 * /livreurs/{idLivreur}:
 *   get:
 *     summary: Get a single livreur by ID with person data
 *     tags: [Livreurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idLivreur
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Livreur found with person information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 personne: { $ref: '#/components/schemas/PersonnePublic' }
 *                 livreur: { $ref: '#/components/schemas/Livreur' }
 *       400:
 *         description: Missing idLivreur parameter
 *       401:
 *         description: Token manquant or invalid
 *       403:
 *         description: Accès refusé - allowed if ID matches or caller is administrateur/gestionnaire
 *       404:
 *         description: Livreur not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update a livreur
 *     tags: [Livreurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idLivreur
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
 *                 description: Person's first name
 *               prenomPersonne:
 *                 type: string
 *                 description: Person's last name
 *               telephonePersonne:
 *                 type: string
 *                 description: Person's phone number
 *               emailPersonne:
 *                 type: string
 *                 format: email
 *                 description: Person's email
 *               vehiculeTypeLivreur:
 *                 type: string
 *                 description: Vehicle type used for delivery
 *               plaqueImmatriculationLivreur:
 *                 type: string
 *                 description: Vehicle registration plate
 *     responses:
 *       200:
 *         description: Livreur successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 personne: { $ref: '#/components/schemas/PersonnePublic' }
 *                 livreur: { $ref: '#/components/schemas/Livreur' }
 *       400:
 *         description: Missing idLivreur parameter
 *       401:
 *         description: Token manquant or invalid
 *       403:
 *         description: Accès refusé - allowed if ID matches or caller is administrateur/gestionnaire
 *       404:
 *         description: Livreur not found
 *       500:
 *         description: Server error
 */
router.get("/:idLivreur", livreurController.getLivreur);
router.put("/:idLivreur", livreurController.updateLivreur);

module.exports = router;
