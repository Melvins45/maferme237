// controllers/entrepriseController.js
const { Entreprises, Personnes } = require("../models");
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
 * Get all enterprises with their person data
 * Only gestionnaires and administrateurs can access
 */
exports.getEntreprises = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    // Only gestionnaire or administrateur can access all enterprises
    if (!ensureRoles(caller, ["gestionnaire", "administrateur"])) {
      return res.status(403).json({ error: "Accès refusé : rôle gestionnaire ou administrateur requis" });
    }

    const entreprises = await Entreprises.findAll({
      include: [
        {
          model: Personnes,
          attributes: { exclude: ['motDePassePersonne'] }
        }
      ]
    });

    const response = entreprises.map(e => {
      const personneData = e.Personne.toJSON();
      delete personneData.motDePassePersonne;
      const entrepriseData = e.toJSON();
      delete entrepriseData.Personne;
      return {
        personne: personneData,
        entreprise: entrepriseData
      };
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get a single enterprise by ID with person data
 * Only gestionnaires and administrateurs can access
 */
exports.getEntreprise = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    // Only gestionnaire or administrateur can access
    if (!ensureRoles(caller, ["gestionnaire", "administrateur"])) {
      return res.status(403).json({ error: "Accès refusé : rôle gestionnaire ou administrateur requis" });
    }

    const { idEntreprise } = req.params;
    if (!idEntreprise) {
      return res.status(400).json({ error: "idEntreprise requis" });
    }

    const entreprise = await Entreprises.findOne({
      where: { idEntreprise },
      include: [
        {
          model: Personnes,
          attributes: { exclude: ['motDePassePersonne'] }
        }
      ]
    });

    if (!entreprise) {
      return res.status(404).json({ error: "Entreprise non trouvée" });
    }

    const personneData = entreprise.Personne.toJSON();
    delete personneData.motDePassePersonne;

    const entrepriseData = entreprise.toJSON();
    delete entrepriseData.Personne;

    const response = {
      personne: personneData,
      entreprise: entrepriseData
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update an enterprise
 * Allow update if ID matches OR if user is gestionnaire/administrateur
 */
exports.updateEntreprise = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const { idEntreprise } = req.params;
    if (!idEntreprise) {
      return res.status(400).json({ error: "idEntreprise requis" });
    }

    // Check authorization: allow if ID matches OR if user is gestionnaire/administrateur
    const isOwnId = caller.sub == idEntreprise;
    const isAdminOrGest = ensureRoles(caller, ["gestionnaire", "administrateur"]);

    if (!isOwnId && !isAdminOrGest) {
      return res.status(403).json({ error: "Accès refusé" });
    }

    const entreprise = await Entreprises.findOne({
      where: { idEntreprise },
      include: { model: Personnes }
    });
    if (!entreprise) {
      return res.status(404).json({ error: "Entreprise non trouvée" });
    }

    // Update person fields (except password)
    const { nomPersonne, prenomPersonne, telephonePersonne, emailPersonne } = req.body;
    if (nomPersonne) entreprise.Personne.nomPersonne = nomPersonne;
    if (prenomPersonne) entreprise.Personne.prenomPersonne = prenomPersonne;
    if (telephonePersonne) entreprise.Personne.telephonePersonne = telephonePersonne;
    if (emailPersonne) entreprise.Personne.emailPersonne = emailPersonne;
    await entreprise.Personne.save();

    // Update entreprise fields
    const { secteurActiviteEntreprise } = req.body;
    if (secteurActiviteEntreprise) entreprise.secteurActiviteEntreprise = secteurActiviteEntreprise;

    await entreprise.save();

    const entrepriseUpdated = await Entreprises.findOne({
      where: { idEntreprise },
      include: { model: Personnes, attributes: { exclude: ["motDePassePersonne"] } }
    });

    const personneData = entrepriseUpdated.Personne.toJSON();
    delete personneData.motDePassePersonne;

    const entrepriseData = entrepriseUpdated.toJSON();
    delete entrepriseData.Personne;

    const response = {
      personne: personneData,
      entreprise: entrepriseData
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete an entreprise
 * Allow delete if ID matches OR if user is gestionnaire/administrateur
 */
exports.deleteEntreprise = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const { idEntreprise } = req.params;
    if (!idEntreprise) {
      return res.status(400).json({ error: "idEntreprise requis" });
    }

    const isOwnId = caller.sub == idEntreprise;
    const isAdminOrGest = ensureRoles(caller, ["gestionnaire", "administrateur"]);

    if (!isOwnId && !isAdminOrGest) {
      return res.status(403).json({ error: "Accès refusé" });
    }

    const entreprise = await Entreprises.findOne({ where: { idEntreprise } });
    if (!entreprise) {
      return res.status(404).json({ error: "Entreprise non trouvée" });
    }

    await entreprise.destroy();

    res.status(200).json({ message: "Entreprise supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
