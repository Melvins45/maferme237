// controllers/livreurController.js
const { Livreurs, Personnes } = require("../models");
const { verifyToken } = require("../services/jwtService");
const { extractBearer, ensureRoles } = require("../utils/tokenUtils");

/**
 * Get all livreurs with their person data
 * Only administrateurs and gestionnaires can access
 */
exports.getLivreurs = async (req, res) => {
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

    const livreurs = await Livreurs.findAll({
      include: { model: Personnes, attributes: { exclude: ["motDePassePersonne"] } }
    });

    const response = livreurs.map(l => {
      const personneData = l.Personne.toJSON();
      delete personneData.motDePassePersonne;
      const livreurData = l.toJSON();
      delete livreurData.Personne;
      return {
        personne: personneData,
        livreur: livreurData
      };
    });

    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

/**
 * Get a single livreur by ID with person data
 * Allow access if ID matches OR if caller is administrateur/gestionnaire
 */
exports.getLivreur = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const { idLivreur } = req.params;
    if (!idLivreur) {
      return res.status(400).json({ error: "idLivreur requis" });
    }

    // Check authorization: allow if ID matches OR if user is administrateur/gestionnaire
    const isOwnId = caller.sub == idLivreur;
    const isAdminOrGest = ensureRoles(caller, ["administrateur", "gestionnaire"]);

    if (!isOwnId && !isAdminOrGest) {
      return res.status(403).json({ error: "Accès refusé" });
    }

    const livreur = await Livreurs.findOne({
      where: { idLivreur },
      include: { model: Personnes, attributes: { exclude: ["motDePassePersonne"] } }
    });

    if (!livreur) {
      return res.status(404).json({ error: "Livreur non trouvé" });
    }

    const personneData = livreur.Personne.toJSON();
    delete personneData.motDePassePersonne;

    const livreurData = livreur.toJSON();
    delete livreurData.Personne;

    const response = {
      personne: personneData,
      livreur: livreurData
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update a livreur
 * Allow update if ID matches OR if caller is administrateur/gestionnaire
 */
exports.updateLivreur = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const { idLivreur } = req.params;
    if (!idLivreur) {
      return res.status(400).json({ error: "idLivreur requis" });
    }

    const isOwnId = caller.sub == idLivreur;
    const isAdminOrGest = ensureRoles(caller, ["administrateur", "gestionnaire"]);

    if (!isOwnId && !isAdminOrGest) {
      return res.status(403).json({ error: "Accès refusé" });
    }

    const livreur = await Livreurs.findOne({
      where: { idLivreur },
      include: { model: Personnes }
    });
    if (!livreur) {
      return res.status(404).json({ error: "Livreur non trouvé" });
    }

    // Update person fields (except password)
    const { nomPersonne, prenomPersonne, telephonePersonne, emailPersonne } = req.body;
    if (nomPersonne) livreur.Personne.nomPersonne = nomPersonne;
    if (prenomPersonne) livreur.Personne.prenomPersonne = prenomPersonne;
    if (telephonePersonne) livreur.Personne.telephonePersonne = telephonePersonne;
    if (emailPersonne) livreur.Personne.emailPersonne = emailPersonne;
    await livreur.Personne.save();

    // Update livreur fields
    const { vehiculeTypeLivreur, plaqueImmatriculationLivreur } = req.body;
    if (vehiculeTypeLivreur) livreur.vehiculeTypeLivreur = vehiculeTypeLivreur;
    if (plaqueImmatriculationLivreur) livreur.plaqueImmatriculationLivreur = plaqueImmatriculationLivreur;

    await livreur.save();

    const livreurUpdated = await Livreurs.findOne({
      where: { idLivreur },
      include: { model: Personnes, attributes: { exclude: ["motDePassePersonne"] } }
    });

    const personneData = livreurUpdated.Personne.toJSON();
    delete personneData.motDePassePersonne;

    const livreurData = livreurUpdated.toJSON();
    delete livreurData.Personne;

    const response = {
      personne: personneData,
      livreur: livreurData
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete a livreur
 * Only administrateurs can delete livreurs
 */
exports.deleteLivreur = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const { idLivreur } = req.params;
    if (!idLivreur) {
      return res.status(400).json({ error: "idLivreur requis" });
    }

    // Only administrateur can delete livreurs
    if (!ensureRoles(caller, ["administrateur"])) {
      return res.status(403).json({ error: "Accès refusé : seul un administrateur peut supprimer un livreur" });
    }

    const livreur = await Livreurs.findOne({ where: { idLivreur } });
    if (!livreur) {
      return res.status(404).json({ error: "Livreur non trouvé" });
    }

    await livreur.destroy();

    res.status(200).json({ message: "Livreur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = exports;
