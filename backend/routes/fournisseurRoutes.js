// routes/fournisseurRoutes.js
const express = require("express");
const router = express.Router();
const fournisseurController = require("../controllers/fournisseurController");
const authenticate = require("../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Fournisseurs
 *   description: Gestion des fournisseurs
 */

// Register and login are handled by authRoutes.js (/api/auth/fournisseurs/register and /api/auth/login)

/**
 * @swagger
 * /fournisseurs:
 *   get:
 *     summary: Get all suppliers
 *     tags: [Fournisseurs]
 *     responses:
 *       200:
 *         description: List of all suppliers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   personne: { $ref: '#/components/schemas/PersonnePublic' }
 *                   fournisseur: { $ref: '#/components/schemas/Fournisseur' }
 *       500:
 *         description: Server error
 */
router.get("/", fournisseurController.getFournisseurs);

/**
 * @swagger
 * /fournisseurs/{idFournisseur}:
 *   get:
 *     summary: Get a single supplier by ID
 *     tags: [Fournisseurs]
 *     parameters:
 *       - in: path
 *         name: idFournisseur
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Supplier found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 personne: { $ref: '#/components/schemas/PersonnePublic' }
 *                 fournisseur: { $ref: '#/components/schemas/Fournisseur' }
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Server error
 */
router.get("/:idFournisseur", fournisseurController.getFournisseur);

/**
 * @swagger
 * /fournisseurs/{idFournisseur}:
 *   put:
 *     summary: Update a supplier
 *     tags: [Fournisseurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idFournisseur
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
 *               noteClientFournisseur:
 *                 type: number
 *                 description: Client rating for supplier
 *               noteEntrepriseFournisseur:
 *                 type: number
 *                 description: Enterprise rating for supplier
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 personne: { $ref: '#/components/schemas/PersonnePublic' }
 *                 fournisseur: { $ref: '#/components/schemas/Fournisseur' }
 *       400:
 *         description: Missing idFournisseur parameter
 *       401:
 *         description: Token manquant or invalid
 *       403:
 *         description: Accès refusé - allowed if ID matches or user is gestionnaire/administrateur
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /fournisseurs/{idFournisseur}:
 *   delete:
 *     summary: Delete a supplier
 *     tags: [Fournisseurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idFournisseur
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Supplier deleted successfully
 *       400:
 *         description: Missing idFournisseur parameter
 *       401:
 *         description: Token manquant or invalid
 *       403:
 *         description: Accès refusé - allowed if ID matches or user is gestionnaire/administrateur
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Server error
 */
router.put("/:idFournisseur", fournisseurController.updateFournisseur);
router.delete("/:idFournisseur", authenticate, fournisseurController.deleteFournisseur);

/**
 * @swagger
 * /fournisseurs/{idFournisseur}/verify:
 *   post:
 *     summary: Verify a supplier (admin or manager only)
 *     tags: [Fournisseurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idFournisseur
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Supplier verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 personne: { $ref: '#/components/schemas/PersonnePublic' }
 *                 fournisseur: { $ref: '#/components/schemas/Fournisseur' }
 *       400:
 *         description: Missing data
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Access denied - gestionnaire ou administrateur requis
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Server error
 */
router.post("/:idFournisseur/verify", fournisseurController.verifyFournisseur);

/**
 * @swagger
 * /fournisseurs/{idFournisseur}/unverify:
 *   post:
 *     summary: Remove verification from a supplier (admin only)
 *     tags: [Fournisseurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idFournisseur
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Supplier unverified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 personne: { $ref: '#/components/schemas/PersonnePublic' }
 *                 fournisseur: { $ref: '#/components/schemas/Fournisseur' }
 *       400:
 *         description: Missing data
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Access denied (administrateur requis)
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Server error
 */
router.post("/:idFournisseur/unverify", fournisseurController.unverifyFournisseur);

module.exports = router;
