// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { sanitizeBody } = require('../middlewares/sanitize');
const { requireNested } = require('../middlewares/validate');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints for simple (public) authentication - clients, suppliers, enterprises
 */

/**
 * @swagger
 * /auth/clients/register:
 *   post:
 *     summary: Register a new client
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               personne:
 *                 $ref: '#/components/schemas/PersonneCreate'
 *               client:
 *                 type: object
 *                 properties:
 *                   adresseClient: { type: "string" }
 *     responses:
 *       201:
 *         description: Registration successful — returns person, client, and token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid or incomplete data
 */
router.post(
  '/clients/register',
  sanitizeBody(['personne', 'client']),
  requireNested({ personne: ['nomPersonne', 'emailPersonne', 'motDePassePersonne'] }),
  authController.register
);

/**
 * @swagger
 * /auth/fournisseurs/register:
 *   post:
 *     summary: Register a new supplier
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               personne:
 *                 $ref: '#/components/schemas/PersonneCreate'
 *               fournisseur:
 *                 type: object
 *     responses:
 *       201:
 *         description: Registration successful — returns person, supplier, and token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid or incomplete data
 */
router.post(
  '/fournisseurs/register',
  sanitizeBody(['personne', 'fournisseur']),
  requireNested({ personne: ['nomPersonne', 'emailPersonne', 'motDePassePersonne'] }),
  authController.register
);

/**
 * @swagger
 * /auth/entreprises/register:
 *   post:
 *     summary: Register a new enterprise
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               personne:
 *                 $ref: '#/components/schemas/PersonneCreate'
 *               entreprise:
 *                 type: object
 *                 properties:
 *                   secteurActiviteEntreprise: { type: "string" }
 *     responses:
 *       201:
 *         description: Registration successful — returns person, enterprise, and token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid or incomplete data
 */
router.post(
  '/entreprises/register',
  sanitizeBody(['personne', 'entreprise']),
  requireNested({ personne: ['nomPersonne', 'emailPersonne', 'motDePassePersonne'] }),
  authController.register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Unified login for clients, suppliers, or enterprises
 *     tags: [Auth]
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
 *         description: Account not found
 */
router.post(
  '/login',
  sanitizeBody(['emailPersonne', 'motDePassePersonne']),
  requireNested({ emailPersonne: true, motDePassePersonne: true }),
  authController.login
);

module.exports = router;

