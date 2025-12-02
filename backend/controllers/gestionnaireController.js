// controllers/gestionnaireController.js
const { Gestionnaires, Personnes } = require("../models");
const { verifyToken } = require("../services/jwtService");
const { extractBearer, ensureRoles } = require("../utils/tokenUtils");

/**
 * Get all gestionnaires with their person data
 * Only administrateurs can access all, gestionnaires can only see themselves
 */
exports.getGestionnaires = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    // Only administrateur or gestionnaire can access
    if (!ensureRoles(caller, ["administrateur", "gestionnaire"])) {
      return res.status(403).json({ error: "Accès refusé : rôle administrateur ou gestionnaire requis" });
    }

    let where = {};
    // If gestionnaire, only show self
    if (ensureRoles(caller, ["gestionnaire"]) && !ensureRoles(caller, ["administrateur"])) {
      where = { idGestionnaire: caller.sub };
    }

    const gestionnaires = await Gestionnaires.findAll({
      where,
      include: { model: Personnes, attributes: { exclude: ["motDePassePersonne"] } }
    });

    const response = gestionnaires.map(g => {
      const personneData = g.Personne.toJSON();
      delete personneData.motDePassePersonne;
      const gestionnaireData = g.toJSON();
      delete gestionnaireData.Personne;
      return {
        personne: personneData,
        gestionnaire: gestionnaireData
      };
    });

    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

/**
 * Get a single gestionnaire by ID with person data
 * Allow access if ID matches OR if caller is administrateur
 */
exports.getGestionnaire = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const { idGestionnaire } = req.params;
    if (!idGestionnaire) {
      return res.status(400).json({ error: "idGestionnaire requis" });
    }

    // Check authorization: allow if ID matches OR if user is administrateur
    const isOwnId = caller.sub == idGestionnaire;
    const isAdmin = ensureRoles(caller, ["administrateur"]);

    if (!isOwnId && !isAdmin) {
      // Must be gestionnaire to access own only
      if (!ensureRoles(caller, ["gestionnaire"])) {
        return res.status(403).json({ error: "Accès refusé" });
      }
      return res.status(403).json({ error: "Accès refusé : vous ne pouvez accéder qu'à votre propre profil" });
    }

    const gestionnaire = await Gestionnaires.findOne({
      where: { idGestionnaire },
      include: { model: Personnes, attributes: { exclude: ["motDePassePersonne"] } }
    });

    if (!gestionnaire) {
      return res.status(404).json({ error: "Gestionnaire non trouvé" });
    }

    const personneData = gestionnaire.Personne.toJSON();
    delete personneData.motDePassePersonne;

    const gestionnaireData = gestionnaire.toJSON();
    delete gestionnaireData.Personne;

    const response = {
      personne: personneData,
      gestionnaire: gestionnaireData
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update a gestionnaire
 * Allow update if ID matches OR if caller is administrateur
 */
exports.updateGestionnaire = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const { idGestionnaire } = req.params;
    if (!idGestionnaire) {
      return res.status(400).json({ error: "idGestionnaire requis" });
    }

    const isOwnId = caller.sub == idGestionnaire;
    const isAdmin = ensureRoles(caller, ["administrateur"]);

    if (!isOwnId && !isAdmin) {
      return res.status(403).json({ error: "Accès refusé" });
    }

    const gestionnaire = await Gestionnaires.findOne({
      where: { idGestionnaire },
      include: { model: Personnes }
    });
    if (!gestionnaire) {
      return res.status(404).json({ error: "Gestionnaire non trouvé" });
    }

    // Update person fields (except password)
    const { nomPersonne, prenomPersonne, telephonePersonne, emailPersonne } = req.body;
    if (nomPersonne) gestionnaire.Personne.nomPersonne = nomPersonne;
    if (prenomPersonne) gestionnaire.Personne.prenomPersonne = prenomPersonne;
    if (telephonePersonne) gestionnaire.Personne.telephonePersonne = telephonePersonne;
    if (emailPersonne) gestionnaire.Personne.emailPersonne = emailPersonne;
    await gestionnaire.Personne.save();

    // Update gestionnaire fields
    const { roleGestionnaire } = req.body;
    if (roleGestionnaire) gestionnaire.roleGestionnaire = roleGestionnaire;

    await gestionnaire.save();

    const gestionnaireUpdated = await Gestionnaires.findOne({
      where: { idGestionnaire },
      include: { model: Personnes, attributes: { exclude: ["motDePassePersonne"] } }
    });

    const personneData = gestionnaireUpdated.Personne.toJSON();
    delete personneData.motDePassePersonne;

    const gestionnaireData = gestionnaireUpdated.toJSON();
    delete gestionnaireData.Personne;

    const response = {
      personne: personneData,
      gestionnaire: gestionnaireData
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete a gestionnaire
 * Secure models cannot delete themselves unless admin
 * Admin can delete gestionnaires
 */
exports.deleteGestionnaire = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const { idGestionnaire } = req.params;
    if (!idGestionnaire) {
      return res.status(400).json({ error: "idGestionnaire requis" });
    }

    const isOwnId = caller.sub == idGestionnaire;
    const isAdmin = ensureRoles(caller, ["administrateur"]);

    // Gestionnaire cannot delete itself (only admin can)
    if (isOwnId) {
      return res.status(403).json({ error: "Accès refusé : seul un administrateur peut supprimer un gestionnaire" });
    }

    // Only admin can delete gestionnaires
    if (!isAdmin) {
      return res.status(403).json({ error: "Accès refusé" });
    }

    const gestionnaire = await Gestionnaires.findOne({ where: { idGestionnaire } });
    if (!gestionnaire) {
      return res.status(404).json({ error: "Gestionnaire non trouvé" });
    }

    await gestionnaire.destroy();

    res.status(200).json({ message: "Gestionnaire supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = exports;
