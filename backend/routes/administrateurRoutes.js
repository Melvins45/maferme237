// routes/administrateurRoutes.js
const express = require("express");
const router = express.Router();
const administrateurController = require("../controllers/administrateurController");
const authenticate = require("../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Administrateurs
 *   description: Gestion des administrateurs (secure)
 */

/**
 * @swagger
 * /administrateurs:
 *   get:
 *     summary: Get all administrateurs with their person data
 *     tags: [Administrateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of administrateurs visible to caller (based on level)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   personne: { $ref: '#/components/schemas/PersonnePublic' }
 *                   administrateur: { $ref: '#/components/schemas/Administrateur' }
 *       401:
 *         description: Token manquant or invalid
 *       403:
 *         description: Accès refusé - administrateur requis
 *       500:
 *         description: Server error
 */
router.get("/", administrateurController.getAdministrateurs);

/**
 * @swagger
 * /administrateurs/{idAdministrateur}:
 *   get:
 *     summary: Get a single administrateur by ID with person data
 *     tags: [Administrateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idAdministrateur
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Administrateur found with person information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 personne: { $ref: '#/components/schemas/PersonnePublic' }
 *                 administrateur: { $ref: '#/components/schemas/Administrateur' }
 *       400:
 *         description: Missing idAdministrateur parameter
 *       401:
 *         description: Token manquant or invalid
 *       403:
 *         description: Accès refusé - allowed if ID matches or caller has superior level
 *       404:
 *         description: Administrateur not found
 *       500:
 *         description: Server error
 */
router.get("/:idAdministrateur", administrateurController.getAdministrateur);

/**
 * @swagger
 * /administrateurs/{idAdministrateur}:
 *   put:
 *     summary: Update an administrateur
 *     tags: [Administrateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idAdministrateur
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
 *               niveauAccesAdministrateur:
 *                 type: integer
 *                 description: Admin access level (higher number = more permissions)
 *     responses:
 *       200:
 *         description: Administrateur updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 personne: { $ref: '#/components/schemas/PersonnePublic' }
 *                 administrateur: { $ref: '#/components/schemas/Administrateur' }
 *       400:
 *         description: Missing idAdministrateur parameter
 *       401:
 *         description: Token manquant or invalid
 *       403:
 *         description: Accès refusé - allowed if ID matches or caller has strict superior level
 *       404:
 *         description: Administrateur not found
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /administrateurs/{idAdministrateur}:
 *   delete:
 *     summary: Delete an administrateur
 *     tags: [Administrateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idAdministrateur
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Administrateur deleted successfully
 *       400:
 *         description: Missing idAdministrateur parameter
 *       401:
 *         description: Token manquant or invalid
 *       403:
 *         description: Accès refusé - cannot delete self unless level 1, or caller has strict superior level
 *       404:
 *         description: Administrateur not found
 *       500:
 *         description: Server error
 */
router.put("/:idAdministrateur", administrateurController.updateAdministrateur);
router.delete("/:idAdministrateur", authenticate, administrateurController.deleteAdministrateur);

module.exports = router;
