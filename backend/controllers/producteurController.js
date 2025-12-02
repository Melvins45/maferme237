// controllers/producteurController.js
const { Producteurs, Personnes } = require("../models");
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
 * Get all producteurs with their person data
 * Only administrateurs and gestionnaires can access
 */
exports.getProducteurs = async (req, res) => {
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

    const producteurs = await Producteurs.findAll({
      include: { model: Personnes, attributes: { exclude: ["motDePassePersonne"] } }
    });

    const response = producteurs.map(p => {
      const personneData = p.Personne.toJSON();
      delete personneData.motDePassePersonne;
      const producteurData = p.toJSON();
      delete producteurData.Personne;
      return {
        personne: personneData,
        producteur: producteurData
      };
    });

    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

/**
 * Get a single producteur by ID with person data
 * Allow access if ID matches OR if caller is administrateur/gestionnaire
 */
exports.getProducteur = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const { idProducteur } = req.params;
    if (!idProducteur) {
      return res.status(400).json({ error: "idProducteur requis" });
    }

    // Check authorization: allow if ID matches OR if user is administrateur/gestionnaire
    const isOwnId = caller.sub == idProducteur;
    const isAdminOrGest = ensureRoles(caller, ["administrateur", "gestionnaire"]);

    if (!isOwnId && !isAdminOrGest) {
      return res.status(403).json({ error: "Accès refusé" });
    }

    const producteur = await Producteurs.findOne({
      where: { idProducteur },
      include: { model: Personnes, attributes: { exclude: ["motDePassePersonne"] } }
    });

    if (!producteur) {
      return res.status(404).json({ error: "Producteur non trouvé" });
    }

    const personneData = producteur.Personne.toJSON();
    delete personneData.motDePassePersonne;

    const producteurData = producteur.toJSON();
    delete producteurData.Personne;

    const response = {
      personne: personneData,
      producteur: producteurData
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update a producteur
 * Allow update if ID matches OR if caller is administrateur/gestionnaire
 */
exports.updateProducteur = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const { idProducteur } = req.params;
    if (!idProducteur) {
      return res.status(400).json({ error: "idProducteur requis" });
    }

    const isOwnId = caller.sub == idProducteur;
    const isAdminOrGest = ensureRoles(caller, ["administrateur", "gestionnaire"]);

    if (!isOwnId && !isAdminOrGest) {
      return res.status(403).json({ error: "Accès refusé" });
    }

    const producteur = await Producteurs.findOne({
      where: { idProducteur },
      include: { model: Personnes }
    });
    if (!producteur) {
      return res.status(404).json({ error: "Producteur non trouvé" });
    }

    // Update person fields (except password)
    const { nomPersonne, prenomPersonne, telephonePersonne, emailPersonne } = req.body;
    if (nomPersonne) producteur.Personne.nomPersonne = nomPersonne;
    if (prenomPersonne) producteur.Personne.prenomPersonne = prenomPersonne;
    if (telephonePersonne) producteur.Personne.telephonePersonne = telephonePersonne;
    if (emailPersonne) producteur.Personne.emailPersonne = emailPersonne;
    await producteur.Personne.save();

    // Update producteur fields
    const { specProducteur, certificationProducteur } = req.body;
    if (specProducteur) producteur.specProducteur = specProducteur;
    if (certificationProducteur) producteur.certificationProducteur = certificationProducteur;

    await producteur.save();

    const producteurUpdated = await Producteurs.findOne({
      where: { idProducteur },
      include: { model: Personnes, attributes: { exclude: ["motDePassePersonne"] } }
    });

    const personneData = producteurUpdated.Personne.toJSON();
    delete personneData.motDePassePersonne;

    const producteurData = producteurUpdated.toJSON();
    delete producteurData.Personne;

    const response = {
      personne: personneData,
      producteur: producteurData
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete a producteur
 * Only administrateurs can delete producteurs
 */
exports.deleteProducteur = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const { idProducteur } = req.params;
    if (!idProducteur) {
      return res.status(400).json({ error: "idProducteur requis" });
    }

    // Only administrateur can delete producteurs
    if (!ensureRoles(caller, ["administrateur"])) {
      return res.status(403).json({ error: "Accès refusé : seul un administrateur peut supprimer un producteur" });
    }

    const producteur = await Producteurs.findOne({ where: { idProducteur } });
    if (!producteur) {
      return res.status(404).json({ error: "Producteur non trouvé" });
    }

    await producteur.destroy();

    res.status(200).json({ message: "Producteur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = exports;
