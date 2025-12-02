// routes/producteurRoutes.js
const express = require("express");
const router = express.Router();
const producteurController = require("../controllers/producteurController");

/**
 * @swagger
 * tags:
 *   name: Producteurs
 *   description: Gestion des producteurs (secure)
 */

/**
 * @swagger
 * /producteurs:
 *   get:
 *     summary: Get all producteurs with their person data
 *     tags: [Producteurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all producteurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   personne: { $ref: '#/components/schemas/PersonnePublic' }
 *                   producteur: { $ref: '#/components/schemas/Producteur' }
 *       401:
 *         description: Token manquant or invalid
 *       403:
 *         description: Accès refusé - administrateur ou gestionnaire requis
 *       500:
 *         description: Server error
 */
router.get("/", producteurController.getProducteurs);

/**
 * @swagger
 * /producteurs/{idProducteur}:
 *   get:
 *     summary: Get a single producteur by ID with person data
 *     tags: [Producteurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idProducteur
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producteur found with person information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 personne: { $ref: '#/components/schemas/PersonnePublic' }
 *                 producteur: { $ref: '#/components/schemas/Producteur' }
 *       400:
 *         description: Missing idProducteur parameter
 *       401:
 *         description: Token manquant or invalid
 *       403:
 *         description: Accès refusé - allowed if ID matches or caller is administrateur/gestionnaire
 *       404:
 *         description: Producteur not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update a producteur
 *     tags: [Producteurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idProducteur
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
 *               specProducteur:
 *                 type: string
 *                 description: Producer specialization
 *               certificationProducteur:
 *                 type: string
 *                 description: Producer certification
 *     responses:
 *       200:
 *         description: Producteur successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 personne: { $ref: '#/components/schemas/PersonnePublic' }
 *                 producteur: { $ref: '#/components/schemas/Producteur' }
 *       400:
 *         description: Missing idProducteur parameter
 *       401:
 *         description: Token manquant or invalid
 *       403:
 *         description: Accès refusé - allowed if ID matches or caller is administrateur/gestionnaire
 *       404:
 *         description: Producteur not found
 *       500:
 *         description: Server error
 */
router.get("/:idProducteur", producteurController.getProducteur);
router.put("/:idProducteur", producteurController.updateProducteur);

module.exports = router;
