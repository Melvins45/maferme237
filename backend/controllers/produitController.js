// controllers/produitController.js
const { Produits, CategorieProduits } = require("../models");
const { verifyToken } = require("../services/jwtService");

const extractBearer = (req) => {
  const auth = req.headers.authorization || req.headers.Authorization;
  if (!auth) return null;
  const parts = auth.split(" ");
  if (parts.length !== 2) return null;
  return parts[1];
};

const ensureRoles = (payload, allowedRoles) => {
  if (!payload || !payload.roles) return false;
  return payload.roles.some((r) => allowedRoles.includes(r));
};

/**
 * Create a product
 * - Gestionnaires: product is directly verified and statutProduction = finished
 * - Fournisseurs: product is NOT verified and statutProduction = finished
 * - Producteurs: product is NOT verified and statutProduction = started
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
      prixClientProduit,
      prixEntrepriseProduit,
      prixFournisseurProduit,
      stockProduit,
      stockFournisseurProduit,
      quantiteMinProduitEntreprise,
      quantiteMinProduitClient,
      idCategorieProduit
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
      // Fournisseur: not verified, finished production
      statutVerificationProduit = "not_verified";
      statutProductionProduit = "finished";
      idFournisseur = caller.sub;
    } else if (ensureRoles(caller, ["producteur"])) {
      // Producteur: not verified, started production
      statutVerificationProduit = "not_verified";
      statutProductionProduit = "started";
    }

    // Create the product
    const produit = await Produits.create({
      nomProduit,
      descriptionProduit: descriptionProduit || null,
      prixClientProduit: prixClientProduit || null,
      prixEntrepriseProduit: prixEntrepriseProduit || null,
      prixFournisseurProduit: prixFournisseurProduit || null,
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

    const produitData = produit.toJSON();

    res.status(201).json({
      message: "Produit créé avec succès",
      produit: produitData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all products
 */
exports.getProduits = async (req, res) => {
  try {
    const produits = await Produits.findAll({
      include: { model: CategorieProduits, as: 'categorie' }
    });

    res.status(200).json(produits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get a single product by ID
 */
exports.getProduit = async (req, res) => {
  try {
    const { idProduit } = req.params;

    if (!idProduit) {
      return res.status(400).json({ error: "idProduit requis" });
    }

    const produit = await Produits.findOne({
      where: { idProduit },
      include: { model: CategorieProduits, as: 'categorie' }
    });

    if (!produit) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    res.status(200).json(produit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update a product
 * Only gestionnaires can update products
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

    // Only gestionnaire can update
    if (!ensureRoles(caller, ["gestionnaire"])) {
      return res.status(403).json({ error: "Accès refusé : seuls les gestionnaires peuvent modifier les produits" });
    }

    const { idProduit } = req.params;
    if (!idProduit) {
      return res.status(400).json({ error: "idProduit requis" });
    }

    const produit = await Produits.findOne({ where: { idProduit } });
    if (!produit) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    const {
      nomProduit,
      descriptionProduit,
      prixClientProduit,
      prixEntrepriseProduit,
      prixFournisseurProduit,
      stockProduit,
      stockFournisseurProduit,
      quantiteMinProduitEntreprise,
      quantiteMinProduitClient,
      statutVerificationProduit,
      statutProductionProduit,
      idCategorieProduit
    } = req.body;

    // Verify category if changing it
    if (idCategorieProduit) {
      const categorie = await CategorieProduits.findOne({ where: { idCategorieProduit } });
      if (!categorie) {
        return res.status(404).json({ error: "Catégorie de produit non trouvée" });
      }
    }

    // Update fields if provided
    if (nomProduit) produit.nomProduit = nomProduit;
    if (descriptionProduit) produit.descriptionProduit = descriptionProduit;
    if (prixClientProduit !== undefined) produit.prixClientProduit = prixClientProduit;
    if (prixEntrepriseProduit !== undefined) produit.prixEntrepriseProduit = prixEntrepriseProduit;
    if (prixFournisseurProduit !== undefined) produit.prixFournisseurProduit = prixFournisseurProduit;
    if (stockProduit !== undefined) produit.stockProduit = stockProduit;
    if (stockFournisseurProduit !== undefined) produit.stockFournisseurProduit = stockFournisseurProduit;
    if (quantiteMinProduitEntreprise !== undefined) produit.quantiteMinProduitEntreprise = quantiteMinProduitEntreprise;
    if (quantiteMinProduitClient !== undefined) produit.quantiteMinProduitClient = quantiteMinProduitClient;
    if (statutVerificationProduit) produit.statutVerificationProduit = statutVerificationProduit;
    if (statutProductionProduit) produit.statutProductionProduit = statutProductionProduit;
    if (idCategorieProduit) produit.idCategorieProduit = idCategorieProduit;

    await produit.save();

    const produitUpdated = await Produits.findOne({
      where: { idProduit },
      include: { model: CategorieProduits, as: 'categorie' }
    });

    res.status(200).json({
      message: "Produit mis à jour avec succès",
      produit: produitUpdated
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete a product
 * Only gestionnaires can delete products
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

    // Only gestionnaire can delete
    if (!ensureRoles(caller, ["gestionnaire"])) {
      return res.status(403).json({ error: "Accès refusé : seuls les gestionnaires peuvent supprimer les produits" });
    }

    const { idProduit } = req.params;
    if (!idProduit) {
      return res.status(400).json({ error: "idProduit requis" });
    }

    const produit = await Produits.findOne({ where: { idProduit } });
    if (!produit) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    await produit.destroy();

    res.status(200).json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = exports;
