const { Caracteristiques, Fournisseurs, Productores, Gestionnaires } = require("../models");
const { extractBearer, ensureRoles } = require("../utils/tokenUtils");
const { verifyToken } = require("../services/jwtService");

// Get all characteristics (accessible to all)
exports.getCaracteristiques = async (req, res) => {
  try {
    const allCaracteristiques = await Caracteristiques.findAll({
      include: [
        { model: Fournisseurs, attributes: ["idFournisseur", "nomFournisseur"] },
        { model: Productores, attributes: ["idProducteur", "nomProducteur"] },
        { model: Gestionnaires, attributes: ["idGestionnaire", "nomGestionnaire"] }
      ]
    });

    res.status(200).json({
      success: true,
      data: allCaracteristiques
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des caractéristiques",
      error: error.message
    });
  }
};

// Get single characteristic (accessible to all)
exports.getCaracteristique = async (req, res) => {
  try {
    const { idCaracteristique } = req.params;
    const characteristic = await Caracteristiques.findByPk(idCaracteristique, {
      include: [
        { model: Fournisseurs, attributes: ["idFournisseur", "nomFournisseur"] },
        { model: Productores, attributes: ["idProducteur", "nomProducteur"] },
        { model: Gestionnaires, attributes: ["idGestionnaire", "nomGestionnaire"] }
      ]
    });

    if (!characteristic) {
      return res.status(404).json({
        success: false,
        message: "Caractéristique non trouvée"
      });
    }

    res.status(200).json({
      success: true,
      data: characteristic
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de la caractéristique",
      error: error.message
    });
  }
};

// Create characteristic (producteur or gestionnaire only)
exports.createCaracteristique = async (req, res) => {
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

    const { nomCaracteristique, typeValeurCaracteristique, uniteValeurCaracteristique } = req.body;

    // Check if user is producteur or gestionnaire
    if (!ensureRoles(caller, ["producteur", "gestionnaire"])) {
      return res.status(403).json({
        success: false,
        message: "Seuls les producteurs et gestionnaires peuvent créer des caractéristiques"
      });
    }

    // Validate input
    if (!nomCaracteristique || !typeValeurCaracteristique) {
      return res.status(400).json({
        success: false,
        message: "Le nom et le type de valeur sont obligatoires"
      });
    }

    // Create characteristic with creator info
    const creatorData = {
      nomCaracteristique,
      typeValeurCaracteristique,
      uniteValeurCaracteristique: uniteValeurCaracteristique || null
    };

    if (caller.role === "producteur") {
      creatorData.idProducteur = caller.sub;
    } else if (caller.role === "gestionnaire") {
      creatorData.idGestionnaire = caller.sub;
    }

    const newCharacteristic = await Caracteristiques.create(creatorData);

    res.status(201).json({
      success: true,
      data: newCharacteristic,
      message: "Caractéristique créée avec succès"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de la caractéristique",
      error: error.message
    });
  }
};

// Update characteristic (gestionnaire or creator producteur)
exports.updateCaracteristique = async (req, res) => {
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

    const { idCaracteristique } = req.params;
    const { nomCaracteristique, typeValeurCaracteristique, uniteValeurCaracteristique } = req.body;

    const characteristic = await Caracteristiques.findByPk(idCaracteristique);

    if (!characteristic) {
      return res.status(404).json({
        success: false,
        message: "Caractéristique non trouvée"
      });
    }

    // Check authorization: gestionnaire or the producteur who created it
    const isGestionnaire = caller.role === "gestionnaire";
    const isCreatorProducteur = caller.role === "producteur" && characteristic.idProducteur === caller.sub;

    if (!isGestionnaire && !isCreatorProducteur) {
      return res.status(403).json({
        success: false,
        message: "Vous n'êtes pas autorisé à modifier cette caractéristique"
      });
    }

    // Update only provided fields
    const updateData = {};
    if (nomCaracteristique !== undefined) updateData.nomCaracteristique = nomCaracteristique;
    if (typeValeurCaracteristique !== undefined) updateData.typeValeurCaracteristique = typeValeurCaracteristique;
    if (uniteValeurCaracteristique !== undefined) updateData.uniteValeurCaracteristique = uniteValeurCaracteristique;

    await characteristic.update(updateData);

    res.status(200).json({
      success: true,
      data: characteristic,
      message: "Caractéristique mise à jour avec succès"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de la caractéristique",
      error: error.message
    });
  }
};

// Delete characteristic (gestionnaire only)
exports.deleteCaracteristique = async (req, res) => {
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

    const { idCaracteristique } = req.params;

    // Only gestionnaires can delete
    if (!ensureRoles(caller, ["gestionnaire"])) {
      return res.status(403).json({
        success: false,
        message: "Seuls les gestionnaires peuvent supprimer des caractéristiques"
      });
    }

    const characteristic = await Caracteristiques.findByPk(idCaracteristique);

    if (!characteristic) {
      return res.status(404).json({
        success: false,
        message: "Caractéristique non trouvée"
      });
    }

    await characteristic.destroy();

    res.status(200).json({
      success: true,
      message: "Caractéristique supprimée avec succès"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de la caractéristique",
      error: error.message
    });
  }
};
