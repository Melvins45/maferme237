const express = require("express");
const router = express.Router();
const authAdminController = require("../controllers/authAdminController");
const { sanitizeBody } = require("../middlewares/sanitize");
const { requireNested } = require("../middlewares/validate");

/**
 * @swagger
 * tags:
 *   name: AdminAuth
 *   description: Secure authentication endpoints for administrators, managers, producers, and delivery persons
 */

/**
 * @swagger
 * /admin/administrateurs/register:
 *   post:
 *     summary: Create a new administrator (caller must be administrator)
 *     tags: [AdminAuth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               personne:
 *                 $ref: '#/components/schemas/PersonneCreate'
 *               administrateur:
 *                 type: object
 *                 properties:
 *                   niveauAccesAdministrateur: { type: "integer" }
 *     responses:
 *       201:
 *         description: Administrator created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Access denied
 */
router.post(
  "/administrateurs/register",
  sanitizeBody(["personne", "administrateur"]),
  requireNested({ personne: ["nomPersonne", "emailPersonne", "motDePassePersonne"] }),
  authAdminController.createAdministrateur
);

/**
 * @swagger
 * /admin/gestionnaires/register:
 *   post:
 *     summary: Create a new manager (caller must be administrator)
 *     tags: [AdminAuth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               personne:
 *                 $ref: '#/components/schemas/PersonneCreate'
 *               gestionnaire:
 *                 type: object
 *                 properties:
 *                   roleGestionnaire: { type: "string" }
 *     responses:
 *       201:
 *         description: Manager created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Access denied
 */
router.post(
  "/gestionnaires/register",
  sanitizeBody(["personne", "gestionnaire"]),
  requireNested({ personne: ["nomPersonne", "emailPersonne", "motDePassePersonne"] }),
  authAdminController.createGestionnaire
);

/**
 * @swagger
 * /admin/producteurs/register:
 *   post:
 *     summary: Create a new producer (caller must be administrator or manager)
 *     tags: [AdminAuth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               personne:
 *                 $ref: '#/components/schemas/PersonneCreate'
 *               producteur:
 *                 type: object
 *                 properties:
 *                   specialiteProducteur: { type: "string" }
 *     responses:
 *       201:
 *         description: Producer created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Access denied
 */
router.post(
  "/producteurs/register",
  sanitizeBody(["personne", "producteur"]),
  requireNested({ personne: ["nomPersonne", "emailPersonne", "motDePassePersonne"] }),
  authAdminController.createProducteur
);

/**
 * @swagger
 * /admin/livreurs/register:
 *   post:
 *     summary: Create a new delivery person (caller must be administrator or manager)
 *     tags: [AdminAuth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               personne:
 *                 $ref: '#/components/schemas/PersonneCreate'
 *     responses:
 *       201:
 *         description: Delivery person created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Access denied
 */
router.post(
  "/livreurs/register",
  sanitizeBody(["personne"]),
  requireNested({ personne: ["nomPersonne", "emailPersonne", "motDePassePersonne"] }),
  authAdminController.createLivreur
);

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Unified login for administrators, managers, producers, or delivery persons
 *     tags: [AdminAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful — returns person, all applicable role(s), and token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Missing data
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Secure account not found
 */
router.post(
  "/login",
  sanitizeBody(["emailPersonne", "motDePassePersonne"]),
  requireNested({ emailPersonne: true, motDePassePersonne: true }),
  authAdminController.login
);

module.exports = router;

