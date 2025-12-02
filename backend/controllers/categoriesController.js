const { CategorieProduits, Fournisseurs, Producteurs, Gestionnaires } = require("../models");
const { extractBearer, ensureRoles } = require("../utils/tokenUtils");
const { verifyToken } = require("../services/jwtService");

// Get all categories (accessible to all)
exports.getCategories = async (req, res) => {
  try {
    const allCategories = await CategorieProduits.findAll({
      include: [
        { model: Fournisseurs, attributes: ["idFournisseur", "nomFournisseur"] },
        { model: Producteurs, attributes: ["idProducteur", "nomProducteur"] },
        { model: Gestionnaires, attributes: ["idGestionnaire", "nomGestionnaire"] }
      ]
    });

    res.status(200).json({
      success: true,
      data: allCategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des catégories",
      error: error.message
    });
  }
};

// Get single category (accessible to all)
exports.getCategorie = async (req, res) => {
  try {
    const { idCategorieProduit } = req.params;
    const category = await CategorieProduits.findByPk(idCategorieProduit, {
      include: [
        { model: Fournisseurs, attributes: ["idFournisseur", "nomFournisseur"] },
        { model: Producteurs, attributes: ["idProducteur", "nomProducteur"] },
        { model: Gestionnaires, attributes: ["idGestionnaire", "nomGestionnaire"] }
      ]
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Catégorie non trouvée"
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de la catégorie",
      error: error.message
    });
  }
};

// Create category (producteur or gestionnaire only)
exports.createCategorie = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) {
      return res.status(401).json({ success: false, message: "Token requis" });
    }

    let caller;
    try {
      caller = verifyToken(token);
    } catch (error) {
      return res.status(401).json({ success: false, message: "Token invalide", error: error.message });
    }

    const { nomCategorieProduit, descriptionCategorieProduit } = req.body;

    // Check if user is producteur or gestionnaire
    if (!ensureRoles(caller, ["producteur", "gestionnaire"])) {
      return res.status(403).json({
        success: false,
        message: "Seuls les producteurs et gestionnaires peuvent créer des catégories"
      });
    }

    // Validate input
    if (!nomCategorieProduit) {
      return res.status(400).json({
        success: false,
        message: "Le nom de la catégorie est obligatoire"
      });
    }

    // Create category with creator info
    const creatorData = {
      nomCategorieProduit,
      descriptionCategorieProduit: descriptionCategorieProduit || null
    };

    if (caller.role === "producteur") {
      creatorData.idProducteur = caller.sub;
    } else if (caller.role === "gestionnaire") {
      creatorData.idGestionnaire = caller.sub;
    }

    const newCategory = await CategorieProduits.create(creatorData);

    res.status(201).json({
      success: true,
      data: newCategory,
      message: "Catégorie créée avec succès"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de la catégorie",
      error: error.message
    });
  }
};

// Update category (gestionnaire or creator producteur)
exports.updateCategorie = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) {
      return res.status(401).json({ success: false, message: "Token requis" });
    }

    let caller;
    try {
      caller = verifyToken(token);
    } catch (error) {
      return res.status(401).json({ success: false, message: "Token invalide", error: error.message });
    }

    const { idCategorieProduit } = req.params;
    const { nomCategorieProduit, descriptionCategorieProduit } = req.body;

    const category = await CategorieProduits.findByPk(idCategorieProduit);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Catégorie non trouvée"
      });
    }

    // Check authorization: gestionnaire or the producteur who created it
    const isGestionnaire = caller.role === "gestionnaire";
    const isCreatorProducteur = caller.role === "producteur" && category.idProducteur === caller.sub;

    if (!isGestionnaire && !isCreatorProducteur) {
      return res.status(403).json({
        success: false,
        message: "Vous n'êtes pas autorisé à modifier cette catégorie"
      });
    }

    // Update only provided fields
    const updateData = {};
    if (nomCategorieProduit !== undefined) updateData.nomCategorieProduit = nomCategorieProduit;
    if (descriptionCategorieProduit !== undefined) updateData.descriptionCategorieProduit = descriptionCategorieProduit;

    await category.update(updateData);

    res.status(200).json({
      success: true,
      data: category,
      message: "Catégorie mise à jour avec succès"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de la catégorie",
      error: error.message
    });
  }
};

// Delete category (gestionnaire only)
exports.deleteCategorie = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) {
      return res.status(401).json({ success: false, message: "Token requis" });
    }

    let caller;
    try {
      caller = verifyToken(token);
    } catch (error) {
      return res.status(401).json({ success: false, message: "Token invalide", error: error.message });
    }

    const { idCategorieProduit } = req.params;

    // Only gestionnaires can delete
    if (!ensureRoles(caller, ["gestionnaire"])) {
      return res.status(403).json({
        success: false,
        message: "Seuls les gestionnaires peuvent supprimer des catégories"
      });
    }

    const category = await CategorieProduits.findByPk(idCategorieProduit);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Catégorie non trouvée"
      });
    }

    await category.destroy();

    res.status(200).json({
      success: true,
      message: "Catégorie supprimée avec succès"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de la catégorie",
      error: error.message
    });
  }
};
