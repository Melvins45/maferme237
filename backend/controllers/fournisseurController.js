// controllers/fournisseurController.js
const { Fournisseurs, Personnes } = require("../models");
const { verifyToken } = require("../services/jwtService");
const { extractBearer, ensureRoles } = require("../utils/tokenUtils");

/**
 * Verify a supplier (set verifieFournisseur to true and record verifiedBy)
 * Only administrators and managers can verify suppliers
 */
exports.verifyFournisseur = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    // Only administrateur or gestionnaire can verify
    if (!ensureRoles(caller, ["administrateur", "gestionnaire"])) {
      return res.status(403).json({ error: "Accès refusé : rôle administrateur ou gestionnaire requis" });
    }

    const { idFournisseur } = req.params;
    if (!idFournisseur) {
      return res.status(400).json({ error: "idFournisseur requis" });
    }

    const fournisseur = await Fournisseurs.findOne({
      where: { idFournisseur },
      include: { model: Personnes, attributes: { exclude: ["motDePassePersonne"] } }
    });

    if (!fournisseur) {
      return res.status(404).json({ error: "Fournisseur non trouvé" });
    }

    // Update verification status
    const updated = await fournisseur.update({
      verifieFournisseur: true,
      verifiedBy: caller.sub
    });

    const personneData = fournisseur.Personne.toJSON();
    delete personneData.motDePassePersonne;

    const fournisseurData = updated.toJSON();
    delete fournisseurData.Personne;

    const response = {
      personne: personneData,
      fournisseur: fournisseurData
    };

    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

/**
 * Unverify a supplier (set verifieFournisseur to false and clear verifiedBy)
 * Only administrators can unverify suppliers
 */
exports.unverifyFournisseur = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    // Only administrateur can unverify
    if (!ensureRoles(caller, ["administrateur"])) {
      return res.status(403).json({ error: "Accès refusé : rôle administrateur requis" });
    }

    const { idFournisseur } = req.params;
    if (!idFournisseur) {
      return res.status(400).json({ error: "idFournisseur requis" });
    }

    const fournisseur = await Fournisseurs.findOne({
      where: { idFournisseur },
      include: { model: Personnes, attributes: { exclude: ["motDePassePersonne"] } }
    });

    if (!fournisseur) {
      return res.status(404).json({ error: "Fournisseur non trouvé" });
    }

    // Update verification status
    const updated = await fournisseur.update({
      verifieFournisseur: false,
      verifiedBy: null
    });

    const personneData = fournisseur.Personne.toJSON();
    delete personneData.motDePassePersonne;

    const fournisseurData = updated.toJSON();
    delete fournisseurData.Personne;

    const response = {
      personne: personneData,
      fournisseur: fournisseurData
    };

    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

/**
 * Get all suppliers with their person data
 */
exports.getFournisseurs = async (req, res) => {
  try {
    const fournisseurs = await Fournisseurs.findAll({
      include: { model: Personnes, attributes: { exclude: ["motDePassePersonne"] } }
    });

    const response = fournisseurs.map(f => {
      const personneData = f.Personne.toJSON();
      delete personneData.motDePassePersonne;
      const fournisseurData = f.toJSON();
      delete fournisseurData.Personne;
      return {
        personne: personneData,
        fournisseur: fournisseurData
      };
    });

    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

/**
 * Get a single supplier by ID with person data
 */
exports.getFournisseur = async (req, res) => {
  try {
    const { idFournisseur } = req.params;
    if (!idFournisseur) {
      return res.status(400).json({ error: "idFournisseur requis" });
    }

    const fournisseur = await Fournisseurs.findOne({
      where: { idFournisseur },
      include: { model: Personnes, attributes: { exclude: ["motDePassePersonne"] } }
    });

    if (!fournisseur) {
      return res.status(404).json({ error: "Fournisseur non trouvé" });
    }

    const personneData = fournisseur.Personne.toJSON();
    delete personneData.motDePassePersonne;

    const fournisseurData = fournisseur.toJSON();
    delete fournisseurData.Personne;

    const response = {
      personne: personneData,
      fournisseur: fournisseurData
    };

    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

/**
 * Update a fournisseur
 * Allow update if ID matches OR if user is gestionnaire/administrateur
 */
exports.updateFournisseur = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const { idFournisseur } = req.params;
    if (!idFournisseur) {
      return res.status(400).json({ error: "idFournisseur requis" });
    }

    // Check authorization: allow if ID matches OR if user is gestionnaire/administrateur
    const isOwnId = caller.sub == idFournisseur;
    const isAdminOrGest = ensureRoles(caller, ["gestionnaire", "administrateur"]);

    if (!isOwnId && !isAdminOrGest) {
      return res.status(403).json({ error: "Accès refusé" });
    }

    const fournisseur = await Fournisseurs.findOne({
      where: { idFournisseur },
      include: { model: Personnes }
    });
    if (!fournisseur) {
      return res.status(404).json({ error: "Fournisseur non trouvé" });
    }

    // Update person fields (except password)
    const { nomPersonne, prenomPersonne, telephonePersonne, emailPersonne } = req.body;
    if (nomPersonne) fournisseur.Personne.nomPersonne = nomPersonne;
    if (prenomPersonne) fournisseur.Personne.prenomPersonne = prenomPersonne;
    if (telephonePersonne) fournisseur.Personne.telephonePersonne = telephonePersonne;
    if (emailPersonne) fournisseur.Personne.emailPersonne = emailPersonne;
    await fournisseur.Personne.save();

    // Update fournisseur fields
    const { noteClientFournisseur, noteEntrepriseFournisseur } = req.body;
    if (noteClientFournisseur) fournisseur.noteClientFournisseur = noteClientFournisseur;
    if (noteEntrepriseFournisseur) fournisseur.noteEntrepriseFournisseur = noteEntrepriseFournisseur;

    await fournisseur.save();

    const fournisseurUpdated = await Fournisseurs.findOne({
      where: { idFournisseur },
      include: { model: Personnes, attributes: { exclude: ["motDePassePersonne"] } }
    });

    const personneData = fournisseurUpdated.Personne.toJSON();
    delete personneData.motDePassePersonne;

    const fournisseurData = fournisseurUpdated.toJSON();
    delete fournisseurData.Personne;

    const response = {
      personne: personneData,
      fournisseur: fournisseurData
    };

    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

/**
 * Delete a fournisseur
 * Allow delete if ID matches OR if user is gestionnaire/administrateur
 */
exports.deleteFournisseur = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const { idFournisseur } = req.params;
    if (!idFournisseur) {
      return res.status(400).json({ error: "idFournisseur requis" });
    }

    const isOwnId = caller.sub == idFournisseur;
    const isAdminOrGest = ensureRoles(caller, ["gestionnaire", "administrateur"]);

    if (!isOwnId && !isAdminOrGest) {
      return res.status(403).json({ error: "Accès refusé" });
    }

    const fournisseur = await Fournisseurs.findOne({ where: { idFournisseur } });
    if (!fournisseur) {
      return res.status(404).json({ error: "Fournisseur non trouvé" });
    }

    await fournisseur.destroy();

    res.status(200).json({ message: "Fournisseur supprimé avec succès" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = exports;
