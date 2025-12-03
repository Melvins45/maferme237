// routes/produitRoutes.js
const express = require("express");
const router = express.Router();
const produitController = require("../controllers/produitController");
const authenticate = require("../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Produits
 *   description: Gestion des produits avec images et caractéristiques
 */

/**
 * @swagger
 * /produits:
 *   post:
 *     summary: Créer un nouveau produit avec images et caractéristiques
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Créer un produit selon le rôle de l'utilisateur :
 *       - Gestionnaires : le produit est directement vérifié (statutVerification=verified) et statutProduction=finished
 *       - Fournisseurs : le produit n'est PAS vérifié (statutVerification=waiting_verification) et statutProduction=finished
 *       - Producteurs : le produit n'est PAS vérifié (statutVerification=waiting_verification) et statutProduction=started
 *       
 *       Images : Passer en tant que tableau de chaînes base64 ou blob dans le champ "images". La première image devient l'image principale (estImagePrincipale=true)
 *       
 *       Caractéristiques : Passer en tant que tableau dans le champ "caracteristiquesProduit". Chaque élément peut soit :
 *       - Avoir idCaracteristique pour lier une caractéristique existante
 *       - Avoir nomCaracteristique + typeValeurCaracteristique pour créer une nouvelle caractéristique (avec optional uniteValeurCaracteristique)
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
 *                 description: Nom du produit
 *               descriptionProduit:
 *                 type: string
 *                 description: Description du produit
 *               prixFournisseurClientProduit:
 *                 type: integer
 *                 description: Prix fournisseur pour les clients
 *               prixFournisseurEntrepriseProduit:
 *                 type: integer
 *                 description: Prix fournisseur pour les entreprises
 *               prixFournisseurProduit:
 *                 type: number
 *                 format: float
 *                 description: Prix fournisseur base
 *               comissionClientProduit:
 *                 type: integer
 *                 description: Commission pour les ventes clients
 *               comissionEntrepriseProduit:
 *                 type: integer
 *                 description: Commission pour les ventes entreprise
 *               stockProduit:
 *                 type: integer
 *                 description: Stock du produit
 *               stockFournisseurProduit:
 *                 type: integer
 *                 description: Stock du fournisseur
 *               quantiteMinProduitEntreprise:
 *                 type: integer
 *                 description: Quantité minimale pour une entreprise
 *               quantiteMinProduitClient:
 *                 type: integer
 *                 description: Quantité minimale pour un client
 *               idCategorieProduit:
 *                 type: integer
 *                 description: ID de la catégorie du produit
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Tableau d'images (blob). La première image est l'image principale.
 *               caracteristiquesProduit:
 *                 type: array
 *                 items:
 *                   type: object
 *                   oneOf:
 *                     - type: object
 *                       properties:
 *                         idCaracteristique:
 *                           type: integer
 *                     - type: object
 *                       required:
 *                         - nomCaracteristique
 *                         - typeValeurCaracteristique
 *                       properties:
 *                         nomCaracteristique:
 *                           type: string
 *                         typeValeurCaracteristique:
 *                           type: string
 *                         uniteValeurCaracteristique:
 *                           type: string
 *                 description: Tableau de caractéristiques - soit lier une existante par ID soit en créer une nouvelle
 *     responses:
 *       201:
 *         description: Produit créé avec succès avec images et caractéristiques
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     produit:
 *                       type: object
 *                       properties:
 *                         idProduit: { type: integer }
 *                         nomProduit: { type: string }
 *                         descriptionProduit: { type: string }
 *                         prixFournisseurClientProduit: { type: integer }
 *                         prixFournisseurEntrepriseProduit: { type: integer }
 *                         prixFournisseurProduit: { type: number }
 *                         comissionClientProduit: { type: integer }
 *                         comissionEntrepriseProduit: { type: integer }
 *                         stockProduit: { type: integer }
 *                         stockFournisseurProduit: { type: integer }
 *                         quantiteMinProduitEntreprise: { type: integer }
 *                         quantiteMinProduitClient: { type: integer }
 *                         statutVerificationProduit: { type: string }
 *                         statutProductionProduit: { type: string }
 *                         idCategorieProduit: { type: integer }
 *                         idFournisseur: { type: integer }
 *                         idGestionnaire: { type: integer }
 *                         createdAt: { type: string, format: date-time }
 *                         updatedAt: { type: string, format: date-time }
 *                     categorie:
 *                       type: object
 *                       properties:
 *                         idCategorieProduit: { type: integer }
 *                         nomCategorie: { type: string }
 *                         descriptionCategorie: { type: string }
 *                     images:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           idProduitImage: { type: integer }
 *                           blobImage: { type: string, format: binary }
 *                           estImagePrincipale: { type: boolean }
 *                           texteAltImage: { type: string }
 *                     caracteristiques:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           idCaracteristique: { type: integer }
 *                           nomCaracteristique: { type: string }
 *                           typeValeurCaracteristique: { type: string }
 *                           uniteValeurCaracteristique: { type: string }
 *                           produitcaracteristiques:
 *                             type: object
 *                             properties:
 *                               valeurCaracteristique: { type: string }
 *                   personne:
 *                     type: object
 *                     nullable: true
 *                     description: Informations de la personne (uniquement si fournisseur)
 *                     properties:
 *                       idPersonne: { type: integer }
 *                       nomPersonne: { type: string }
 *                   fournisseur:
 *                     type: object
 *                     nullable: true
 *                     description: Informations du fournisseur (uniquement si le produit est créé par un fournisseur)
 *                     properties:
 *                       idFournisseur: { type: integer }
 *                       noteClientFournisseur: { type: string }
 *       400:
 *         description: Champs obligatoires manquants ou données de caractéristique invalides
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé - seul gestionnaire, fournisseur ou producteur peuvent créer
 *       404:
 *         description: Catégorie ou caractéristique non trouvée
 *       500:
 *         description: Erreur serveur
 *   get:
 *     summary: Obtenir tous les produits avec images et caractéristiques
 *     tags: [Produits]
 *     description: |
 *       Récupère la liste complète de tous les produits avec :
 *       - Toutes les images du produit (principale et secondaires)
 *       - Toutes les caractéristiques associées avec leurs valuations
 *       - Catégorie du produit
 *     responses:
 *       200:
 *         description: Liste de tous les produits avec leurs images et caractéristiques
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   produit:
 *                     type: object
 *                     properties:
 *                       idProduit: { type: integer }
 *                       nomProduit: { type: string }
 *                       descriptionProduit: { type: string }
 *                       prixFournisseurClientProduit: { type: integer }
 *                       prixFournisseurEntrepriseProduit: { type: integer }
 *                       prixFournisseurProduit: { type: number }
 *                       comissionClientProduit: { type: integer }
 *                       comissionEntrepriseProduit: { type: integer }
 *                       stockProduit: { type: integer }
 *                       stockFournisseurProduit: { type: integer }
 *                       quantiteMinProduitEntreprise: { type: integer }
 *                       quantiteMinProduitClient: { type: integer }
 *                       statutVerificationProduit: { type: string }
 *                       statutProductionProduit: { type: string }
 *                       idCategorieProduit: { type: integer }
 *                       idFournisseur: { type: integer }
 *                       idGestionnaire: { type: integer }
 *                       createdAt: { type: string, format: date-time }
 *                       updatedAt: { type: string, format: date-time }
 *                   categorie:
 *                     type: object
 *                     properties:
 *                       idCategorieProduit: { type: integer }
 *                       nomCategorie: { type: string }
 *                       descriptionCategorie: { type: string }
 *                   images:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         idProduitImage: { type: integer }
 *                         blobImage: { type: string, format: binary }
 *                         estImagePrincipale: { type: boolean }
 *                         texteAltImage: { type: string }
 *                   caracteristiques:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         idCaracteristique: { type: integer }
 *                         nomCaracteristique: { type: string }
 *                         typeValeurCaracteristique: { type: string }
 *                         uniteValeurCaracteristique: { type: string }
 *                         produitcaracteristiques:
 *                           type: object
 *                           properties:
 *                             valeurCaracteristique: { type: string }
 *                   personne:
 *                     type: object
 *                     nullable: true
 *                     description: Informations de la personne (uniquement si fournisseur)
 *                     properties:
 *                       idPersonne: { type: integer }
 *                       nomPersonne: { type: string }
 *                   fournisseur:
 *                     type: object
 *                     nullable: true
 *                     description: Informations du fournisseur (uniquement si le produit est créé par un fournisseur)
 *                     properties:
 *                       idFournisseur: { type: integer }
 *                       noteClientFournisseur: { type: string }
 *       500:
 *         description: Erreur serveur
 */
router.post("/", authenticate, produitController.createProduit);
router.get("/", produitController.getProduits);
router.get("/by-role/all", authenticate, produitController.getProduitsByRole);

/**
 * @swagger
 * /produits/by-role/all:
 *   get:
 *     summary: Obtenir tous les produits filtrés par le rôle de l'utilisateur
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Retourne les produits en fonction du rôle de l'utilisateur authentifié :
 *       - **Gestionnaires** : Voir tous les produits
 *       - **Producteurs** : Voir uniquement leurs produits (idProducteur = user ID)
 *       - **Fournisseurs** : Voir uniquement leurs produits (idFournisseur = user ID)
 *       
 *       Chaque produit inclut :
 *       - Images du produit (stockées comme blobs)
 *       - Caractéristiques associées avec leurs valuations
 *       - Informations de la catégorie du produit
 *     responses:
 *       200:
 *         description: Liste des produits filtrés selon le rôle
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produit'
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé - seuls les gestionnaires, producteurs et fournisseurs peuvent voir les produits
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /produits/{idProduit}:
 *   get:
 *     summary: Obtenir un produit par son ID avec images, catégorie et caractéristiques
 *     tags: [Produits]
 *     description: |
 *       Retourne un produit avec toutes les données associées :
 *       - Images du produit (stockées comme blobs)
 *       - Caractéristiques associées avec leurs valuations
 *       - Informations de la catégorie du produit
 *     parameters:
 *       - in: path
 *         name: idProduit
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produit trouvé avec images, caractéristiques et catégorie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 produit:
 *                   type: object
 *                   properties:
 *                     idProduit: { type: integer }
 *                     nomProduit: { type: string }
 *                     descriptionProduit: { type: string }
 *                     prixFournisseurClientProduit: { type: integer }
 *                     prixFournisseurEntrepriseProduit: { type: integer }
 *                     prixFournisseurProduit: { type: number }
 *                     comissionClientProduit: { type: integer }
 *                     comissionEntrepriseProduit: { type: integer }
 *                     stockProduit: { type: integer }
 *                     stockFournisseurProduit: { type: integer }
 *                     quantiteMinProduitEntreprise: { type: integer }
 *                     quantiteMinProduitClient: { type: integer }
 *                     statutVerificationProduit: { type: string }
 *                     statutProductionProduit: { type: string }
 *                     idCategorieProduit: { type: integer }
 *                     idFournisseur: { type: integer }
 *                     idGestionnaire: { type: integer }
 *                     createdAt: { type: string, format: date-time }
 *                     updatedAt: { type: string, format: date-time }
 *                 categorie:
 *                   type: object
 *                   properties:
 *                     idCategorieProduit: { type: integer }
 *                     nomCategorie: { type: string }
 *                     descriptionCategorie: { type: string }
 *                 images:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       idProduitImage: { type: integer }
 *                       blobImage: { type: string, format: binary }
 *                       estImagePrincipale: { type: boolean }
 *                       texteAltImage: { type: string }
 *                 caracteristiques:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       idCaracteristique: { type: integer }
 *                       nomCaracteristique: { type: string }
 *                       typeValeurCaracteristique: { type: string }
 *                       uniteValeurCaracteristique: { type: string }
 *                       produitcaracteristiques:
 *                         type: object
 *                         properties:
 *                           valeurCaracteristique: { type: string }
 *                 personne:
 *                   type: object
 *                   nullable: true
 *                   description: Informations de la personne (uniquement si fournisseur)
 *                   properties:
 *                     idPersonne: { type: integer }
 *                     nomPersonne: { type: string }
 *                 fournisseur:
 *                   type: object
 *                   nullable: true
 *                   description: Informations du fournisseur (uniquement si le produit est créé par un fournisseur)
 *                   properties:
 *                     idFournisseur: { type: integer }
 *                     noteClientFournisseur: { type: string }
 *       400:
 *         description: Paramètre idProduit manquant
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur serveur
 *   put:
 *     summary: Modifier un produit avec gestion des images et caractéristiques
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Modifier les données du produit et gérer les images et caractéristiques associées :
 *       
 *       **Autorisations :**
 *       - Gestionnaires : peuvent modifier tous les champs
 *       - Fournisseurs : peuvent modifier leur propre produit SAUF les champs `stockProduit` et `comissionClientProduit`, `comissionEntrepriseProduit`
 *       
 *       **Gestion des Images :**
 *       - Pour ajouter une nouvelle image : inclure un objet avec `blobImage`
 *       - Pour mettre à jour une existante : inclure `idProduitImage` + nouveau `blobImage`
 *       - Pour supprimer : mettre `isDeleted: true` avec `idProduitImage`
 *       
 *       **Gestion des Caractéristiques :**
 *       - Pour lier une existante : inclure `idCaracteristique` + `valeurCaracteristique`
 *       - Pour en créer une nouvelle : inclure `nomCaracteristique`, `typeValeurCaracteristique` + optionnel `valeurCaracteristique`
 *       - Pour mettre à jour la valuation : inclure `idCaracteristique` + nouvelle `valeurCaracteristique`
 *       - Pour délier : mettre `isDeleted: true` avec `idCaracteristique`
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
 *               prixFournisseurClientProduit: { type: integer }
 *               prixFournisseurEntrepriseProduit: { type: integer }
 *               prixFournisseurProduit: { type: number }
 *               comissionClientProduit: { type: integer }
 *               comissionEntrepriseProduit: { type: integer }
 *               stockProduit: { type: integer }
 *               stockFournisseurProduit: { type: integer }
 *               quantiteMinProduitEntreprise: { type: integer }
 *               quantiteMinProduitClient: { type: integer }
 *               statutVerificationProduit: { type: string }
 *               statutProductionProduit: { type: string }
 *               idCategorieProduit: { type: integer }
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     idProduitImage:
 *                       type: integer
 *                       description: Requis pour modification/suppression
 *                     blobImage:
 *                       type: string
 *                       format: binary
 *                       description: Nouvelle image ou image mise à jour
 *                     texteAltImage:
 *                       type: string
 *                     estImagePrincipale:
 *                       type: boolean
 *                     isDeleted:
 *                       type: boolean
 *                       description: Mettre à true pour supprimer l'image
 *               caracteristiquesProduit:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     idCaracteristique:
 *                       type: integer
 *                       description: ID de la caractéristique existante à lier ou mettre à jour
 *                     nomCaracteristique:
 *                       type: string
 *                       description: Nom pour une nouvelle caractéristique
 *                     typeValeurCaracteristique:
 *                       type: string
 *                       description: Type pour une nouvelle caractéristique
 *                     uniteValeurCaracteristique:
 *                       type: string
 *                       description: Unité pour une nouvelle caractéristique
 *                     valeurCaracteristique:
 *                       type: string
 *                       description: Valeur de la caractéristique pour ce produit
 *                     isDeleted:
 *                       type: boolean
 *                       description: Mettre à true pour délier la caractéristique du produit
 *     responses:
 *       200:
 *         description: Produit modifié avec succès
 *       400:
 *         description: Données manquantes ou invalides
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé - seul gestionnaire ou propriétaire du produit (fournisseur) peuvent modifier
 *       404:
 *         description: Produit, caractéristique ou catégorie non trouvé(e)
 *       500:
 *         description: Erreur serveur
 *   delete:
 *     summary: Supprimer un produit (supprime les images et caractéristiques automatiquement)
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
 *         description: Produit supprimé avec succès
 *       400:
 *         description: Paramètre idProduit manquant
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé - seul gestionnaire ou propriétaire du produit (fournisseur) peuvent supprimer
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get("/:idProduit", produitController.getProduit);
router.put("/:idProduit", authenticate, produitController.updateProduit);
router.delete("/:idProduit", authenticate, produitController.deleteProduit);

/**
 * @swagger
 * /produits/{idProduit}/verify:
 *   post:
 *     summary: Vérifier un produit
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Marquer un produit comme vérifié (statutVerificationProduit = 'verified').
 *       
 *       **Autorisations** : Seuls les gestionnaires peuvent vérifier les produits.
 *       
 *       **Logique** : 
 *       - Le produit doit être en état 'waiting_verification'
 *       - Après vérification, le statut passe à 'verified'
 *     parameters:
 *       - in: path
 *         name: idProduit
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit à vérifier
 *     responses:
 *       200:
 *         description: Produit vérifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     produit:
 *                       type: object
 *                       properties:
 *                         idProduit: { type: integer }
 *                         nomProduit: { type: string }
 *                         descriptionProduit: { type: string }
 *                         statutVerificationProduit: 
 *                           type: string
 *                           enum: ['verified']
 *                         statutProductionProduit: { type: string }
 *                         createdAt: { type: string, format: date-time }
 *                         updatedAt: { type: string, format: date-time }
 *                     images:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           idProduitImage: { type: integer }
 *                           estImagePrincipale: { type: boolean }
 *                     caracteristiques:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           idCaracteristique: { type: integer }
 *                         nomCaracteristique: { type: string }
 *                     personne:
 *                       type: object
 *                       nullable: true
 *                       description: Informations de la personne (uniquement si fournisseur)
 *                       properties:
 *                         idPersonne: { type: integer }
 *                         nomPersonne: { type: string }
 *                     fournisseur:
 *                       type: object
 *                       nullable: true
 *                       description: Informations du fournisseur (uniquement si le produit est créé par un fournisseur)
 *                       properties:
 *                         idFournisseur: { type: integer }
 *                         noteClientFournisseur: { type: string }
 *       400:
 *         description: Le produit est déjà vérifié ou données invalides
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé - seuls les gestionnaires peuvent vérifier les produits
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post("/:idProduit/verify", authenticate, produitController.verifyProduit);

/**
 * @swagger
 * /produits/{idProduit}/unverify:
 *   post:
 *     summary: Dévérifier un produit
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Remettre un produit en état "en attente de vérification" (statutVerificationProduit = 'waiting_verification').
 *       
 *       **Autorisations** : Seuls les gestionnaires peuvent dévérifier les produits.
 *       
 *       **Logique** : 
 *       - Le produit doit être en état 'verified'
 *       - Après dévérification, le statut repasse à 'waiting_verification'
 *     parameters:
 *       - in: path
 *         name: idProduit
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit à dévérifier
 *     responses:
 *       200:
 *         description: Produit dévérifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     produit:
 *                       type: object
 *                       properties:
 *                         idProduit: { type: integer }
 *                         nomProduit: { type: string }
 *                         descriptionProduit: { type: string }
 *                         statutVerificationProduit: 
 *                           type: string
 *                           enum: ['waiting_verification']
 *                         statutProductionProduit: { type: string }
 *                         createdAt: { type: string, format: date-time }
 *                         updatedAt: { type: string, format: date-time }
 *                     images:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           idProduitImage: { type: integer }
 *                           estImagePrincipale: { type: boolean }
 *                     caracteristiques:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           idCaracteristique: { type: integer }
 *                         nomCaracteristique: { type: string }
 *                     personne:
 *                       type: object
 *                       nullable: true
 *                       description: Informations de la personne (uniquement si fournisseur)
 *                       properties:
 *                         idPersonne: { type: integer }
 *                         nomPersonne: { type: string }
 *                     fournisseur:
 *                       type: object
 *                       nullable: true
 *                       description: Informations du fournisseur (uniquement si le produit est créé par un fournisseur)
 *                       properties:
 *                         idFournisseur: { type: integer }
 *                         noteClientFournisseur: { type: string }
 *       400:
 *         description: Le produit n'est pas vérifié ou données invalides
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé - seuls les gestionnaires peuvent dévérifier les produits
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post("/:idProduit/unverify", authenticate, produitController.unverifyProduit);

module.exports = router;
