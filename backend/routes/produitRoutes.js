// routes/produitRoutes.js
const express = require("express");
const router = express.Router();
const produitController = require("../controllers/produitController");
const authenticate = require("../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Produits
 *   description: Gestion des produits
 */

/**
 * @swagger
 * /produits:
 *   post:
 *     summary: Create a new product with images
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Create a product based on user role:
 *       - Gestionnaires: product is directly verified (statutVerification=verified) and statutProduction=finished
 *       - Fournisseurs: product is NOT verified (statutVerification=waiting_verification) and statutProduction=finished
 *       - Producteurs: product is NOT verified (statutVerification=waiting_verification) and statutProduction=started
 *       
 *       Images: Pass as array of base64 or blob strings in "images" field. First image becomes main image (estImagePrincipale=true)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nomProduit
 *               - idCategorieProduit
 *             properties:
 *               nomProduit:
 *                 type: string
 *                 description: Product name
 *               descriptionProduit:
 *                 type: string
 *                 description: Product description
 *               prixClientProduit:
 *                 type: number
 *                 format: float
 *                 description: Client price
 *               prixEntrepriseProduit:
 *                 type: number
 *                 format: float
 *                 description: Enterprise price
 *               prixFournisseurProduit:
 *                 type: number
 *                 format: float
 *                 description: Supplier price
 *               stockProduit:
 *                 type: integer
 *                 description: Product stock
 *               stockFournisseurProduit:
 *                 type: integer
 *                 description: Supplier stock
 *               quantiteMinProduitEntreprise:
 *                 type: integer
 *                 description: Minimum quantity for enterprise
 *               quantiteMinProduitClient:
 *                 type: integer
 *                 description: Minimum quantity for client
 *               idCategorieProduit:
 *                 type: integer
 *                 description: Product category ID
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Array of image blobs. First image is main image.
 *     responses:
 *       201:
 *         description: Product successfully created with images
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 produit:
 *                   type: object
 *                   properties:
 *                     idProduit: { type: integer }
 *                     nomProduit: { type: string }
 *                     statutVerificationProduit: { type: string }
 *                     statutProductionProduit: { type: string }
 *                     images:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           idProduitImage: { type: integer }
 *                           estImagePrincipale: { type: boolean }
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Token manquant or invalid
 *       403:
 *         description: Accès refusé - only gestionnaire, fournisseur, producteur can create
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 *   get:
 *     summary: Get all products with images
 *     tags: [Produits]
 *     responses:
 *       200:
 *         description: List of all products with their images
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   idProduit: { type: integer }
 *                   nomProduit: { type: string }
 *                   descriptionProduit: { type: string }
 *                   statutVerificationProduit: { type: string }
 *                   statutProductionProduit: { type: string }
 *                   images:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         idProduitImage: { type: integer }
 *                         blobImage: { type: string, format: binary }
 *                         estImagePrincipale: { type: boolean }
 *       500:
 *         description: Server error
 */
router.post("/", authenticate, produitController.createProduit);
router.get("/", produitController.getProduits);

/**
 * @swagger
 * /produits/{idProduit}:
 *   get:
 *     summary: Get a single product by ID with images
 *     tags: [Produits]
 *     parameters:
 *       - in: path
 *         name: idProduit
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product found with all images
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idProduit: { type: integer }
 *                 nomProduit: { type: string }
 *                 images:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       idProduitImage: { type: integer }
 *                       blobImage: { type: string, format: binary }
 *                       estImagePrincipale: { type: boolean }
 *       400:
 *         description: Missing idProduit parameter
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update a product
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idProduit
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
 *               nomProduit: { type: string }
 *               descriptionProduit: { type: string }
 *               prixClientProduit: { type: number }
 *               prixEntrepriseProduit: { type: number }
 *               prixFournisseurProduit: { type: number }
 *               stockProduit: { type: integer }
 *               stockFournisseurProduit: { type: integer }
 *               quantiteMinProduitEntreprise: { type: integer }
 *               quantiteMinProduitClient: { type: integer }
 *               statutVerificationProduit: { type: string }
 *               statutProductionProduit: { type: string }
 *               idCategorieProduit: { type: integer }
 *     responses:
 *       200:
 *         description: Product successfully updated with category and images
 *       400:
 *         description: Missing idProduit parameter
 *       401:
 *         description: Token manquant or invalid
 *       403:
 *         description: Accès refusé - only gestionnaire or product owner fournisseur can update
 *       404:
 *         description: Product or category not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a product
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idProduit
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product successfully deleted
 *       400:
 *         description: Missing idProduit parameter
 *       401:
 *         description: Token manquant or invalid
 *       403:
 *         description: Accès refusé - only gestionnaire or product owner fournisseur can delete
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get("/:idProduit", produitController.getProduit);
router.put("/:idProduit", authenticate, produitController.updateProduit);
router.delete("/:idProduit", authenticate, produitController.deleteProduit);

module.exports = router;
