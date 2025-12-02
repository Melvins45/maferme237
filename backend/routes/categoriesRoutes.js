// routes/categoriesRoutes.js
const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categoriesController");
const authenticate = require("../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Catégories
 *   description: Gestion des catégories de produits
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Obtenir toutes les catégories
 *     tags: [Catégories]
 *     description: Récupère la liste complète de toutes les catégories avec leurs créateurs (producteur, gestionnaire ou fournisseur)
 *     responses:
 *       200:
 *         description: Liste de toutes les catégories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       idCategorieProduit: { type: integer }
 *                       nomCategorieProduit: { type: string }
 *                       descriptionCategorieProduit: { type: string }
 *                       dateCreationCategorieProduit: { type: string, format: date-time }
 *                       idProducteur: { type: integer, nullable: true }
 *                       idGestionnaire: { type: integer, nullable: true }
 *                       idFournisseur: { type: integer, nullable: true }
 *                       createdAt: { type: string, format: date-time }
 *                       updatedAt: { type: string, format: date-time }
 *       500:
 *         description: Erreur serveur
 *   post:
 *     summary: Créer une nouvelle catégorie
 *     tags: [Catégories]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Créer une catégorie selon le rôle de l'utilisateur :
 *       - Producteurs : peut créer des catégories (idProducteur assigné)
 *       - Gestionnaires : peut créer des catégories (idGestionnaire assigné)
 *       - Fournisseurs : peut créer des catégories (idFournisseur assigné)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nomCategorieProduit
 *             properties:
 *               nomCategorieProduit:
 *                 type: string
 *                 description: "Nom de la catégorie"
 *               descriptionCategorieProduit:
 *                 type: string
 *                 description: "Description de la catégorie (optionnel)"
 *     responses:
 *       201:
 *         description: Catégorie créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     idCategorieProduit: { type: integer }
 *                     nomCategorieProduit: { type: string }
 *                     descriptionCategorieProduit: { type: string }
 *                     dateCreationCategorieProduit: { type: string, format: date-time }
 *                     idProducteur: { type: integer, nullable: true }
 *                     idGestionnaire: { type: integer, nullable: true }
 *                     idFournisseur: { type: integer, nullable: true }
 *                 message: { type: string }
 *       400:
 *         description: Champ obligatoire manquant
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé - seuls producteurs, gestionnaires et fournisseurs peuvent créer
 *       500:
 *         description: Erreur serveur
 */
router.get("/", categoriesController.getCategories);
router.post("/", authenticate, categoriesController.createCategorie);

/**
 * @swagger
 * /categories/{idCategorieProduit}:
 *   get:
 *     summary: Obtenir une catégorie par ID
 *     tags: [Catégories]
 *     description: Récupère une catégorie spécifique avec ses informations de créateur
 *     parameters:
 *       - in: path
 *         name: idCategorieProduit
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Catégorie trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     idCategorieProduit: { type: integer }
 *                     nomCategorieProduit: { type: string }
 *                     descriptionCategorieProduit: { type: string }
 *                     dateCreationCategorieProduit: { type: string, format: date-time }
 *                     idProducteur: { type: integer, nullable: true }
 *                     idGestionnaire: { type: integer, nullable: true }
 *                     idFournisseur: { type: integer, nullable: true }
 *       404:
 *         description: Catégorie non trouvée
 *       500:
 *         description: Erreur serveur
 *   put:
 *     summary: Modifier une catégorie
 *     tags: [Catégories]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Modifier une catégorie :
 *       - Gestionnaires : peuvent modifier toutes les catégories
 *       - Producteurs : peuvent modifier uniquement leurs propres catégories
 *       - Fournisseurs : peuvent modifier uniquement leurs propres catégories
 *     parameters:
 *       - in: path
 *         name: idCategorieProduit
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
 *               nomCategorieProduit:
 *                 type: string
 *                 description: "Nouveau nom de la catégorie"
 *               descriptionCategorieProduit:
 *                 type: string
 *                 description: "Nouvelle description de la catégorie"
 *     responses:
 *       200:
 *         description: Catégorie mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     idCategorieProduit: { type: integer }
 *                     nomCategorieProduit: { type: string }
 *                     descriptionCategorieProduit: { type: string }
 *                     dateCreationCategorieProduit: { type: string, format: date-time }
 *                 message: { type: string }
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé - non propriétaire ou rôle insuffisant
 *       404:
 *         description: Catégorie non trouvée
 *       500:
 *         description: Erreur serveur
 *   delete:
 *     summary: Supprimer une catégorie
 *     tags: [Catégories]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Supprimer une catégorie.
 *       
 *       **Restriction** : Seuls les gestionnaires peuvent supprimer les catégories.
 *     parameters:
 *       - in: path
 *         name: idCategorieProduit
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Catégorie supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé - seuls les gestionnaires peuvent supprimer
 *       404:
 *         description: Catégorie non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get("/:idCategorieProduit", categoriesController.getCategorie);
router.put("/:idCategorieProduit", authenticate, categoriesController.updateCategorie);
router.delete("/:idCategorieProduit", authenticate, categoriesController.deleteCategorie);

module.exports = router;
