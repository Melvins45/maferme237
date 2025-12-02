// routes/entreprisesRoutes.js
const express = require("express");
const router = express.Router();
const entrepriseController = require("../controllers/entrepriseController");
const authenticate = require("../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Entreprises
 *   description: Gestion des entreprises
 */

/**
 * @swagger
 * /entreprises:
 *   get:
 *     summary: Get all enterprises with their person data
 *     tags: [Entreprises]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all enterprises with person information
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   personne: { $ref: '#/components/schemas/PersonnePublic' }
 *                   entreprise: { $ref: '#/components/schemas/Entreprise' }
 *       401:
 *         description: Token manquant or invalid
 *       403:
 *         description: Accès refusé - rôle gestionnaire ou administrateur requis
 *       500:
 *         description: Server error
 */
router.get("/", entrepriseController.getEntreprises);

/**
 * @swagger
 * /entreprises/{idEntreprise}:
 *   get:
 *     summary: Get a single enterprise by ID with person data
 *     tags: [Entreprises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idEntreprise
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Enterprise found with person information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 personne: { $ref: '#/components/schemas/PersonnePublic' }
 *                 entreprise: { $ref: '#/components/schemas/Entreprise' }
 *       400:
 *         description: Missing idEntreprise parameter
 *       401:
 *         description: Token manquant or invalid
 *       403:
 *         description: Accès refusé - gestionnaire ou administrateur requis
 *       404:
 *         description: Enterprise not found
 *       500:
 *         description: Server error
 */
router.get("/:idEntreprise", entrepriseController.getEntreprise);

/**
 * @swagger
 * /entreprises/{idEntreprise}:
 *   put:
 *     summary: Update an enterprise
 *     tags: [Entreprises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idEntreprise
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
 *               secteurActiviteEntreprise:
 *                 type: string
 *                 description: Business sector
 *     responses:
 *       200:
 *         description: Enterprise updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 personne: { $ref: '#/components/schemas/PersonnePublic' }
 *                 entreprise: { $ref: '#/components/schemas/Entreprise' }
 *       400:
 *         description: Missing idEntreprise parameter
 *       401:
 *         description: Token manquant or invalid
 *       403:
 *         description: Accès refusé - allowed if ID matches or user is gestionnaire/administrateur
 *       404:
 *         description: Enterprise not found
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /entreprises/{idEntreprise}:
 *   delete:
 *     summary: Delete an entreprise
 *     tags: [Entreprises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idEntreprise
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Entreprise deleted successfully
 *       400:
 *         description: Missing idEntreprise parameter
 *       401:
 *         description: Token manquant or invalid
 *       403:
 *         description: Accès refusé - allowed if ID matches or user is gestionnaire/administrateur
 *       404:
 *         description: Entreprise not found
 *       500:
 *         description: Server error
 */
router.put("/:idEntreprise", entrepriseController.updateEntreprise);
router.delete("/:idEntreprise", authenticate, entrepriseController.deleteEntreprise);

// Register and login are handled by authRoutes.js (/api/auth/entreprises/register and /api/auth/login)

module.exports = router;

