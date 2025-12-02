const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/auth");
const {
  getCaracteristiques,
  getCaracteristique,
  createCaracteristique,
  updateCaracteristique,
  deleteCaracteristique
} = require("../controllers/caracteristiquesController");

/**
 * @swagger
 * tags:
 *   name: Caractéristiques
 *   description: Gestion des caractéristiques de produits
 */

/**
 * @swagger
 * /caracteristiques:
 *   get:
 *     summary: Obtenir toutes les caractéristiques
 *     tags: [Caractéristiques]
 *     responses:
 *       200:
 *         description: Liste de toutes les caractéristiques
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Caracteristique'
 *       500:
 *         description: Erreur serveur
 */
router.get("/", getCaracteristiques);

/**
 * @swagger
 * /caracteristiques/{idCaracteristique}:
 *   get:
 *     summary: Obtenir une caractéristique par son ID
 *     tags: [Caractéristiques]
 *     parameters:
 *       - in: path
 *         name: idCaracteristique
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Caractéristique trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Caracteristique'
 *       404:
 *         description: Caractéristique non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get("/:idCaracteristique", getCaracteristique);

/**
 * @swagger
 * /caracteristiques:
 *   post:
 *     summary: Créer une nouvelle caractéristique
 *     tags: [Caractéristiques]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Créer une définition de caractéristique.
 *       Rôles autorisés : producteur ou gestionnaire
 *       
 *       Note : Pour lier les caractéristiques aux produits avec des valuations, utilisez PUT /api/produits/:id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nomCaracteristique
 *               - typeValeurCaracteristique
 *             properties:
 *               nomCaracteristique:
 *                 type: string
 *                 description: "Nom de la caractéristique"
 *               typeValeurCaracteristique:
 *                 type: string
 *                 description: "Type de valeur (ex: text, number, boolean)"
 *               uniteValeurCaracteristique:
 *                 type: string
 *                 description: "Unité de la valeur (optionnel, ex: kg, m, %)"
 *     responses:
 *       201:
 *         description: Caractéristique créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Caracteristique'
 *                 message:
 *                   type: string
 *       400:
 *         description: Données manquantes ou invalides
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé - seul producteur ou gestionnaire peut créer une caractéristique
 *       500:
 *         description: Erreur serveur
 */
router.post("/", authenticate, createCaracteristique);

/**
 * @swagger
 * /caracteristiques/{idCaracteristique}:
 *   put:
 *     summary: Modifier une caractéristique
 *     tags: [Caractéristiques]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Modifier une définition de caractéristique.
 *       Rôles autorisés : gestionnaire ou créateur (producteur)
 *       
 *       Note : Pour modifier les valuations d'une caractéristique pour un produit, utilisez PUT /api/produits/:id
 *     parameters:
 *       - in: path
 *         name: idCaracteristique
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
 *               nomCaracteristique:
 *                 type: string
 *                 description: Nom de la caractéristique
 *               typeValeurCaracteristique:
 *                 type: string
 *                 description: Type de valeur
 *               uniteValeurCaracteristique:
 *                 type: string
 *                 description: Unité de la valeur
 *     responses:
 *       200:
 *         description: Caractéristique modifiée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Caracteristique'
 *                 message:
 *                   type: string
 *       400:
 *         description: Données manquantes ou invalides
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé - seul gestionnaire ou créateur peut modifier
 *       404:
 *         description: Caractéristique non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put("/:idCaracteristique", authenticate, updateCaracteristique);

/**
 * @swagger
 * /caracteristiques/{idCaracteristique}:
 *   delete:
 *     summary: Supprimer une caractéristique
 *     tags: [Caractéristiques]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Supprimer une définition de caractéristique.
 *       Rôles autorisés : gestionnaire uniquement
 *       
 *       Note : Les liens vers les produits sont automatiquement supprimés via les contraintes CASCADE.
 *     parameters:
 *       - in: path
 *         name: idCaracteristique
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Caractéristique supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé - seul gestionnaire peut supprimer une caractéristique
 *       404:
 *         description: Caractéristique non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:idCaracteristique", authenticate, deleteCaracteristique);

module.exports = router;
