// controllers/produitController.js
const { Produits, CategorieProduits, ProduitImages, Caracteristiques, ProduitCaracteristiques, Fournisseurs, Personnes } = require("../models");
const { verifyToken } = require("../services/jwtService");
const { extractBearer, ensureRoles } = require("../utils/tokenUtils");
const { formatProduitResponse, formatProduitResponseArray } = require("../services/responseFormatter");

/**
 * Create a product
 * - Gestionnaires: product is directly verified (statusVerification=verified) and statutProduction = finished
 * - Fournisseurs: product is NOT verified (statusVerification=waiting_verification) and statutProduction = finished
 * - Producteurs: product is NOT verified (statusVerification=waiting_verification) and statutProduction = started
 */
exports.createProduit = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    // Only gestionnaire, fournisseur, or producteur can create products
    if (!ensureRoles(caller, ["gestionnaire", "fournisseur", "producteur"])) {
      return res.status(403).json({ error: "Accès refusé : seuls les gestionnaires, fournisseurs et producteurs peuvent créer des produits" });
    }

    const {
      nomProduit,
      descriptionProduit,
      prixFournisseurClientProduit,
      prixFournisseurEntrepriseProduit,
      prixFournisseurProduit,
      comissionClientProduit,
      comissionEntrepriseProduit,
      stockProduit,
      stockFournisseurProduit,
      quantiteMinProduitEntreprise,
      quantiteMinProduitClient,
      idCategorieProduit,
      images,
      caracteristiquesProduit
    } = req.body;

    // Validate required fields
    if (!nomProduit) {
      return res.status(400).json({ error: "nomProduit requis" });
    }

    if (!idCategorieProduit) {
      return res.status(400).json({ error: "idCategorieProduit requis" });
    }

    // Verify category exists
    const categorie = await CategorieProduits.findOne({ where: { idCategorieProduit } });
    if (!categorie) {
      return res.status(404).json({ error: "Catégorie de produit non trouvée" });
    }

    // Determine verification status and production status based on user role
    let statutVerificationProduit, statutProductionProduit, idGestionnaire, idFournisseur;

    if (ensureRoles(caller, ["gestionnaire"])) {
      // Gestionnaire: directly verified, finished production
      statutVerificationProduit = "verified";
      statutProductionProduit = "finished";
      idGestionnaire = caller.sub;
    } else if (ensureRoles(caller, ["fournisseur"])) {
      // Fournisseur: waiting verification, finished production
      statutVerificationProduit = "waiting_verification";
      statutProductionProduit = "finished";
      idFournisseur = caller.sub;
    } else if (ensureRoles(caller, ["producteur"])) {
      // Producteur: waiting verification, started production
      statutVerificationProduit = "waiting_verification";
      statutProductionProduit = "started";
    }

    // Create the product
    const produit = await Produits.create({
      nomProduit,
      descriptionProduit: descriptionProduit || null,
      prixFournisseurClientProduit: prixFournisseurClientProduit || null,
      prixFournisseurEntrepriseProduit: prixFournisseurEntrepriseProduit || null,
      prixFournisseurProduit: prixFournisseurProduit || null,
      comissionClientProduit: comissionClientProduit || null,
      comissionEntrepriseProduit: comissionEntrepriseProduit || null,
      stockProduit: stockProduit || 0,
      stockFournisseurProduit: stockFournisseurProduit || 0,
      quantiteMinProduitEntreprise: quantiteMinProduitEntreprise || null,
      quantiteMinProduitClient: quantiteMinProduitClient || null,
      statutVerificationProduit,
      statutProductionProduit,
      idCategorieProduit,
      idGestionnaire: idGestionnaire || null,
      idFournisseur: idFournisseur || null
    });

    // Handle images if provided
    if (images && Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const imageBlob = images[i];
        const isMainImage = i === 0; // First image is the main image

        await ProduitImages.create({
          idProduit: produit.idProduit,
          blobImage: imageBlob,
          estImagePrincipale: isMainImage,
          texteAltImage: `Image ${i + 1} du produit ${nomProduit}`
        });
      }
    }

    // Handle characteristics if provided
    if (caracteristiquesProduit && Array.isArray(caracteristiquesProduit) && caracteristiquesProduit.length > 0) {
      for (const caracItem of caracteristiquesProduit) {
        let idCaracteristique;

        // If caracItem has an id, use it directly
        if (caracItem.idCaracteristique) {
          idCaracteristique = caracItem.idCaracteristique;
          // Verify characteristic exists
          const caracExists = await Caracteristiques.findByPk(idCaracteristique);
          if (!caracExists) {
            return res.status(404).json({ error: `Caractéristique avec l'ID ${idCaracteristique} non trouvée` });
          }
        } else if (caracItem.nomCaracteristique && caracItem.typeValeurCaracteristique) {
          // If caracItem has name and type, create a new characteristic
          const creatorData = {
            nomCaracteristique: caracItem.nomCaracteristique,
            typeValeurCaracteristique: caracItem.typeValeurCaracteristique,
            uniteValeurCaracteristique: caracItem.uniteValeurCaracteristique || null
          };

          // Assign creator based on caller role
          if (ensureRoles(caller, ["producteur"])) {
            creatorData.idProducteur = caller.sub;
          } else if (ensureRoles(caller, ["gestionnaire"])) {
            creatorData.idGestionnaire = caller.sub;
          } else if (ensureRoles(caller, ["fournisseur"])) {
            creatorData.idFournisseur = caller.sub;
          }

          const newCarac = await Caracteristiques.create(creatorData);
          idCaracteristique = newCarac.idCaracteristique;
        } else {
          return res.status(400).json({ error: "Chaque caractéristique doit avoir soit un idCaracteristique soit un nomCaracteristique et typeValeurCaracteristique" });
        }

        // Link characteristic to product with its valeur
        await ProduitCaracteristiques.create({
          idProduit: produit.idProduit,
          idCaracteristique,
          valeurCaracteristique: caracItem.valeurCaracteristique || null
        });
      }
    }

    // Retrieve the created product with images and characteristics
    const produitWithImages = await Produits.findOne({
      where: { idProduit: produit.idProduit },
      include: [
        { model: CategorieProduits, as: 'categorie', attributes: ['idCategorieProduit', 'nomCategorieProduit', 'descriptionCategorieProduit'] },
        { model: ProduitImages, as: 'images' },
        { 
          model: Caracteristiques, 
          as: 'caracteristiques',
          through: { attributes: ['valeurCaracteristique'] },
          attributes: ['idCaracteristique', 'nomCaracteristique', 'typeValeurCaracteristique', 'uniteValeurCaracteristique']
        },
        {
          model: Fournisseurs,
          attributes: ['idFournisseur', 'noteClientFournisseur'],
          include: [
            {
              model: Personnes,
              attributes: ['idPersonne', 'nom']
            }
          ]
        }
      ]
    });

    res.status(201).json({
      message: "Produit créé avec succès",
      data: formatProduitResponse(produitWithImages)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all products with images, category, and characteristics with valuations
 */
exports.getProduits = async (req, res) => {
  try {
    const produits = await Produits.findAll({
      include: [
        { model: CategorieProduits, as: 'categorie', attributes: ['idCategorieProduit', 'nomCategorieProduit', 'descriptionCategorieProduit'] },
        { model: ProduitImages, as: 'images' },
        { 
          model: Caracteristiques, 
          as: 'caracteristiques', 
          through: { attributes: ['valeurCaracteristique'] },
          attributes: ['idCaracteristique', 'nomCaracteristique', 'typeValeurCaracteristique', 'uniteValeurCaracteristique']
        },
        {
          model: Fournisseurs,
          attributes: ['idFournisseur', 'noteClientFournisseur'],
          include: [
            {
              model: Personnes,
              attributes: ['idPersonne', 'nom']
            }
          ]
        }
      ]
    });

    res.status(200).json(formatProduitResponseArray(produits));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all products filtered by user role
 * - Gestionnaires: see all products
 * - Producteurs: see only their products (where idProducteur matches)
 * - Fournisseurs: see only their products (where idFournisseur matches)
 */
exports.getProduitsByRole = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const isGestionnaire = ensureRoles(caller, ["gestionnaire"]);
    const isProducteur = ensureRoles(caller, ["producteur"]);
    const isFournisseur = ensureRoles(caller, ["fournisseur"]);

    // Build where clause based on role
    let whereClause = {};
    if (isGestionnaire) {
      // Gestionnaires see all products
      whereClause = {};
    } else if (isProducteur) {
      // Producteurs see only their products
      whereClause = { idProducteur: caller.sub };
    } else if (isFournisseur) {
      // Fournisseurs see only their products
      whereClause = { idFournisseur: caller.sub };
    } else {
      return res.status(403).json({ error: "Accès refusé : seuls les gestionnaires, producteurs et fournisseurs peuvent voir les produits" });
    }

    const produits = await Produits.findAll({
      where: whereClause,
      include: [
        { model: CategorieProduits, as: 'categorie', attributes: ['idCategorieProduit', 'nomCategorieProduit', 'descriptionCategorieProduit'] },
        { model: ProduitImages, as: 'images' },
        { 
          model: Caracteristiques, 
          as: 'caracteristiques', 
          through: { attributes: ['valeurCaracteristique'] },
          attributes: ['idCaracteristique', 'nomCaracteristique', 'typeValeurCaracteristique', 'uniteValeurCaracteristique']
        },
        {
          model: Fournisseurs,
          attributes: ['idFournisseur', 'noteClientFournisseur'],
          include: [
            {
              model: Personnes,
              attributes: ['idPersonne', 'nom']
            }
          ]
        }
      ]
    });

    res.status(200).json(formatProduitResponseArray(produits));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get a single product by ID with images, category, and characteristics with valuations
 */
exports.getProduit = async (req, res) => {
  try {
    const { idProduit } = req.params;

    if (!idProduit) {
      return res.status(400).json({ error: "idProduit requis" });
    }

    const produit = await Produits.findOne({
      where: { idProduit },
      include: [
        { model: CategorieProduits, as: 'categorie', attributes: ['idCategorieProduit', 'nomCategorieProduit', 'descriptionCategorieProduit'] },
        { model: ProduitImages, as: 'images' },
        { 
          model: Caracteristiques, 
          as: 'caracteristiques', 
          through: { attributes: ['valeurCaracteristique'] },
          attributes: ['idCaracteristique', 'nomCaracteristique', 'typeValeurCaracteristique', 'uniteValeurCaracteristique']
        },
        {
          model: Fournisseurs,
          attributes: ['idFournisseur', 'noteClientFournisseur'],
          include: [
            {
              model: Personnes,
              attributes: ['idPersonne', 'nom']
            }
          ]
        }
      ]
    });

    if (!produit) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    res.status(200).json(formatProduitResponse(produit));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update a product
 * Only gestionnaires can update all products
 * Fournisseurs can update their own products (where idFournisseur matches)
 * Can also update images and characteristics through this endpoint
 */
exports.updateProduit = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const { idProduit } = req.params;
    if (!idProduit) {
      return res.status(400).json({ error: "idProduit requis" });
    }

    const produit = await Produits.findOne({ where: { idProduit } });
    if (!produit) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    // Check authorization
    const isGestionnaire = ensureRoles(caller, ["gestionnaire"]);
    const isFournisseur = ensureRoles(caller, ["fournisseur"]);
    const isFournisseurOwner = isFournisseur && produit.idFournisseur == caller.sub;

    if (!isGestionnaire && !isFournisseurOwner) {
      return res.status(403).json({ error: "Accès refusé : seuls les gestionnaires ou le fournisseur propriétaire peuvent modifier ce produit" });
    }

    const {
      nomProduit,
      descriptionProduit,
      prixFournisseurClientProduit,
      prixFournisseurEntrepriseProduit,
      prixFournisseurProduit,
      comissionClientProduit,
      comissionEntrepriseProduit,
      stockProduit,
      stockFournisseurProduit,
      quantiteMinProduitEntreprise,
      quantiteMinProduitClient,
      statutVerificationProduit,
      statutProductionProduit,
      idCategorieProduit,
      images,
      caracteristiquesProduit
    } = req.body;

    // Fournisseurs cannot modify commission fields
    if (isFournisseurOwner && !isGestionnaire) {
      if (comissionClientProduit !== undefined || comissionEntrepriseProduit !== undefined) {
        return res.status(403).json({ error: "Accès refusé : les fournisseurs ne peuvent pas modifier les champs de commission" });
      }
    }

    // Verify category if changing it
    if (idCategorieProduit) {
      const categorie = await CategorieProduits.findOne({ where: { idCategorieProduit } });
      if (!categorie) {
        return res.status(404).json({ error: "Catégorie de produit non trouvée" });
      }
    }

    // Update product fields if provided
    if (nomProduit) produit.nomProduit = nomProduit;
    if (descriptionProduit !== undefined) produit.descriptionProduit = descriptionProduit;
    if (prixFournisseurClientProduit !== undefined) produit.prixFournisseurClientProduit = prixFournisseurClientProduit;
    if (prixFournisseurEntrepriseProduit !== undefined) produit.prixFournisseurEntrepriseProduit = prixFournisseurEntrepriseProduit;
    if (prixFournisseurProduit !== undefined) produit.prixFournisseurProduit = prixFournisseurProduit;
    // Only gestionnaires can update commission fields
    if (isGestionnaire) {
      if (comissionClientProduit !== undefined) produit.comissionClientProduit = comissionClientProduit;
      if (comissionEntrepriseProduit !== undefined) produit.comisionEntrepriseProduit = comisionEntrepriseProduit;
    }
    // Only gestionnaires can update stockProduit
    if (isGestionnaire) {
      if (stockProduit !== undefined) produit.stockProduit = stockProduit;
    }
    if (stockFournisseurProduit !== undefined) produit.stockFournisseurProduit = stockFournisseurProduit;
    if (quantiteMinProduitEntreprise !== undefined) produit.quantiteMinProduitEntreprise = quantiteMinProduitEntreprise;
    if (quantiteMinProduitClient !== undefined) produit.quantiteMinProduitClient = quantiteMinProduitClient;
    // NOTE: statutVerificationProduit cannot be modified via PUT - use /verify or /unverify endpoints
    if (statutProductionProduit) produit.statutProductionProduit = statutProductionProduit;
    if (idCategorieProduit) produit.idCategorieProduit = idCategorieProduit;

    await produit.save();

    // Handle images updates if provided
    if (images && Array.isArray(images)) {
      for (const imageItem of images) {
        if (imageItem.isDeleted) {
          // Delete image if marked for deletion
          if (imageItem.idProduitImage) {
            await ProduitImages.destroy({ where: { idProduitImage: imageItem.idProduitImage } });
          }
        } else if (imageItem.blobImage) {
          // Update existing image or create new one
          if (imageItem.idProduitImage) {
            // Update existing image
            await ProduitImages.update(
              {
                blobImage: imageItem.blobImage,
                texteAltImage: imageItem.texteAltImage || `Image du produit ${nomProduit || produit.nomProduit}`,
                estImagePrincipale: imageItem.estImagePrincipale || false
              },
              { where: { idProduitImage: imageItem.idProduitImage } }
            );
          } else {
            // Create new image
            await ProduitImages.create({
              idProduit: produit.idProduit,
              blobImage: imageItem.blobImage,
              estImagePrincipale: imageItem.estImagePrincipale || false,
              texteAltImage: imageItem.texteAltImage || `Nouvelle image du produit ${nomProduit || produit.nomProduit}`
            });
          }
        }
      }
    }

    // Handle characteristics updates if provided
    if (caracteristiquesProduit && Array.isArray(caracteristiquesProduit)) {
      for (const caracItem of caracteristiquesProduit) {
        if (caracItem.isDeleted) {
          // Delete characteristic link if marked for deletion
          await ProduitCaracteristiques.destroy({
            where: {
              idProduit: produit.idProduit,
              idCaracteristique: caracItem.idCaracteristique
            }
          });
        } else {
          let idCaracteristique = caracItem.idCaracteristique;

          // Create new characteristic if needed
          if (!idCaracteristique && caracItem.nomCaracteristique && caracItem.typeValeurCaracteristique) {
            const creatorData = {
              nomCaracteristique: caracItem.nomCaracteristique,
              typeValeurCaracteristique: caracItem.typeValeurCaracteristique,
              uniteValeurCaracteristique: caracItem.uniteValeurCaracteristique || null
            };

            // Assign creator based on caller role
            if (ensureRoles(caller, ["producteur"])) {
              creatorData.idProducteur = caller.sub;
            } else if (ensureRoles(caller, ["gestionnaire"])) {
              creatorData.idGestionnaire = caller.sub;
            } else if (ensureRoles(caller, ["fournisseur"])) {
              creatorData.idFournisseur = caller.sub;
            }

            const newCarac = await Caracteristiques.create(creatorData);
            idCaracteristique = newCarac.idCaracteristique;
          }

          if (idCaracteristique) {
            // Verify characteristic exists
            const caracExists = await Caracteristiques.findByPk(idCaracteristique);
            if (!caracExists) {
              return res.status(404).json({ error: `Caractéristique avec l'ID ${idCaracteristique} non trouvée` });
            }

            // Check if link already exists
            const existingLink = await ProduitCaracteristiques.findOne({
              where: {
                idProduit: produit.idProduit,
                idCaracteristique
              }
            });

            if (existingLink) {
              // Update valeur if link exists
              if (caracItem.valeurCaracteristique !== undefined) {
                await existingLink.update({ valeurCaracteristique: caracItem.valeurCaracteristique });
              }
            } else {
              // Create new link with valeur
              await ProduitCaracteristiques.create({
                idProduit: produit.idProduit,
                idCaracteristique,
                valeurCaracteristique: caracItem.valeurCaracteristique || null
              });
            }
          }
        }
      }
    }

    const produitUpdated = await Produits.findOne({
      where: { idProduit },
      include: [
        { model: CategorieProduits, as: 'categorie', attributes: ['idCategorieProduit', 'nomCategorieProduit', 'descriptionCategorieProduit'] },
        { model: ProduitImages, as: 'images' },
        { 
          model: Caracteristiques, 
          as: 'caracteristiques', 
          through: { attributes: ['valeurCaracteristique'] },
          attributes: ['idCaracteristique', 'nomCaracteristique', 'typeValeurCaracteristique', 'uniteValeurCaracteristique']
        },
        {
          model: Fournisseurs,
          attributes: ['idFournisseur', 'noteClientFournisseur'],
          include: [
            {
              model: Personnes,
              attributes: ['idPersonne', 'nom']
            }
          ]
        }
      ]
    });

    res.status(200).json({
      message: "Produit mis à jour avec succès",
      data: formatProduitResponse(produitUpdated)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete a product
 * Only gestionnaires can delete all products
 * Fournisseurs can delete their own products (where idFournisseur matches)
 */
exports.deleteProduit = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const { idProduit } = req.params;
    if (!idProduit) {
      return res.status(400).json({ error: "idProduit requis" });
    }

    const produit = await Produits.findOne({ where: { idProduit } });
    if (!produit) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    // Check authorization
    const isGestionnaire = ensureRoles(caller, ["gestionnaire"]);
    const isFournisseur = ensureRoles(caller, ["fournisseur"]);
    const isFournisseurOwner = isFournisseur && produit.idFournisseur == caller.sub;

    if (!isGestionnaire && !isFournisseurOwner) {
      return res.status(403).json({ error: "Accès refusé : seuls les gestionnaires ou le fournisseur propriétaire peuvent supprimer ce produit" });
    }

    await produit.destroy();

    res.status(200).json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Verify a product (set statutVerificationProduit = 'verified')
 * Only gestionnaires can verify products
 */
exports.verifyProduit = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    // Only gestionnaires can verify products
    if (!ensureRoles(caller, ["gestionnaire"])) {
      return res.status(403).json({ error: "Accès refusé : seuls les gestionnaires peuvent vérifier les produits" });
    }

    const { idProduit } = req.params;
    if (!idProduit) {
      return res.status(400).json({ error: "idProduit requis" });
    }

    const produit = await Produits.findOne({ where: { idProduit } });
    if (!produit) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    // Check if product is already verified
    if (produit.statutVerificationProduit === "verified") {
      return res.status(400).json({ error: "Le produit est déjà vérifié" });
    }

    produit.statutVerificationProduit = "verified";
    await produit.save();

    const produitUpdated = await Produits.findOne({
      where: { idProduit },
      include: [
        { model: CategorieProduits, as: 'categorie', attributes: ['idCategorieProduit', 'nomCategorieProduit', 'descriptionCategorieProduit'] },
        { model: ProduitImages, as: 'images' },
        { 
          model: Caracteristiques, 
          as: 'caracteristiques', 
          through: { attributes: ['valeurCaracteristique'] },
          attributes: ['idCaracteristique', 'nomCaracteristique', 'typeValeurCaracteristique', 'uniteValeurCaracteristique']
        },
        {
          model: Fournisseurs,
          attributes: ['idFournisseur', 'noteClientFournisseur'],
          include: [
            {
              model: Personnes,
              attributes: ['idPersonne', 'nom']
            }
          ]
        }
      ]
    });

    res.status(200).json({
      message: "Produit vérifié avec succès",
      data: formatProduitResponse(produitUpdated)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Unverify a product (set statutVerificationProduit = 'waiting_verification')
 * Only gestionnaires can unverify products
 */
exports.unverifyProduit = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    // Only gestionnaires can unverify products
    if (!ensureRoles(caller, ["gestionnaire"])) {
      return res.status(403).json({ error: "Accès refusé : seuls les gestionnaires peuvent dévérifier les produits" });
    }

    const { idProduit } = req.params;
    if (!idProduit) {
      return res.status(400).json({ error: "idProduit requis" });
    }

    const produit = await Produits.findOne({ where: { idProduit } });
    if (!produit) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    // Check if product is not already in waiting_verification state
    if (produit.statutVerificationProduit !== "verified") {
      return res.status(400).json({ error: "Le produit n'est pas actuellement vérifié" });
    }

    produit.statutVerificationProduit = "waiting_verification";
    await produit.save();

    const produitUpdated = await Produits.findOne({
      where: { idProduit },
      include: [
        { model: CategorieProduits, as: 'categorie', attributes: ['idCategorieProduit', 'nomCategorieProduit', 'descriptionCategorieProduit'] },
        { model: ProduitImages, as: 'images' },
        { 
          model: Caracteristiques, 
          as: 'caracteristiques', 
          through: { attributes: ['valeurCaracteristique'] },
          attributes: ['idCaracteristique', 'nomCaracteristique', 'typeValeurCaracteristique', 'uniteValeurCaracteristique']
        },
        {
          model: Fournisseurs,
          attributes: ['idFournisseur', 'noteClientFournisseur'],
          include: [
            {
              model: Personnes,
              attributes: ['idPersonne', 'nom']
            }
          ]
        }
      ]
    });

    res.status(200).json({
      message: "Produit dévérifié avec succès",
      data: formatProduitResponse(produitUpdated)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = exports;
