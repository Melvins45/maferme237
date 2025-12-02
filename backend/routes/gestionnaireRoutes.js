// routes/gestionnaireRoutes.js
const express = require("express");
const router = express.Router();
const gestionnaireController = require("../controllers/gestionnaireController");
const authenticate = require("../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Gestionnaires
 *   description: Gestion des gestionnaires (secure)
 */

/**
 * @swagger
 * /gestionnaires:
 *   get:
 *     summary: Get all gestionnaires with their person data
 *     tags: [Gestionnaires]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of gestionnaires - administrateurs see all, gestionnaires see only themselves
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   personne: { $ref: '#/components/schemas/PersonnePublic' }
 *                   gestionnaire: { $ref: '#/components/schemas/Gestionnaire' }
 *       401:
 *         description: Token manquant or invalid
 *       403:
 *         description: Accès refusé - administrateur ou gestionnaire requis
 *       500:
 *         description: Server error
 */
router.get("/", gestionnaireController.getGestionnaires);

/**
 * @swagger
 * /gestionnaires/{idGestionnaire}:
 *   get:
 *     summary: Get a single gestionnaire by ID with person data
 *     tags: [Gestionnaires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idGestionnaire
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Gestionnaire found with person information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 personne: { $ref: '#/components/schemas/PersonnePublic' }
 *                 gestionnaire: { $ref: '#/components/schemas/Gestionnaire' }
 *       400:
 *         description: Missing idGestionnaire parameter
 *       401:
 *         description: Token manquant or invalid
 *       403:
 *         description: Accès refusé - allowed if ID matches or caller is administrateur
 *       404:
 *         description: Gestionnaire not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update a gestionnaire
 *     tags: [Gestionnaires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idGestionnaire
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
 *               roleGestionnaire:
 *                 type: string
 *                 description: Gestionnaire role
 *     responses:
 *       200:
 *         description: Gestionnaire successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 personne: { $ref: '#/components/schemas/PersonnePublic' }
 *                 gestionnaire: { $ref: '#/components/schemas/Gestionnaire' }
 *       400:
 *         description: Missing idGestionnaire parameter
 *       401:
 *         description: Token manquant or invalid
 *       403:
 *         description: Accès refusé - allowed if ID matches or caller is administrateur
 *       404:
 *         description: Gestionnaire not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a gestionnaire
 *     tags: [Gestionnaires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idGestionnaire
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Gestionnaire deleted successfully
 *       400:
 *         description: Missing idGestionnaire parameter
 *       401:
 *         description: Token manquant or invalid
 *       403:
 *         description: Accès refusé - only administrateur can delete gestionnaires
 *       404:
 *         description: Gestionnaire not found
 *       500:
 *         description: Server error
 */
router.get("/:idGestionnaire", gestionnaireController.getGestionnaire);
router.put("/:idGestionnaire", gestionnaireController.updateGestionnaire);
router.delete("/:idGestionnaire", authenticate, gestionnaireController.deleteGestionnaire);

module.exports = router;
