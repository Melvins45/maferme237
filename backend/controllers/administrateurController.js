// controllers/administrateurController.js
const { Administrateurs, Personnes } = require("../models");
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
 * Get all administrateurs with their person data
 * Only administrateurs can access and only view those with equal or inferior level
 */
exports.getAdministrateurs = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    // Only administrateur can access
    if (!ensureRoles(caller, ["administrateur"])) {
      return res.status(403).json({ error: "Accès refusé : rôle administrateur requis" });
    }

    // Get caller's administrateur record to check level
    const callerAdmin = await Administrateurs.findOne({ where: { idAdministrateur: caller.sub } });
    if (!callerAdmin) return res.status(403).json({ error: "Administrateur non trouvé" });

    // Get all administrateurs with equal or inferior level
    const administrateurs = await Administrateurs.findAll({
      where: { niveauAccesAdministrateur: { [require("sequelize").Op.lte]: callerAdmin.niveauAccesAdministrateur } },
      include: { model: Personnes, attributes: { exclude: ["motDePassePersonne"] } }
    });

    const response = administrateurs.map(a => {
      const personneData = a.Personne.toJSON();
      delete personneData.motDePassePersonne;
      const adminData = a.toJSON();
      delete adminData.Personne;
      return {
        personne: personneData,
        administrateur: adminData
      };
    });

    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

/**
 * Get a single administrateur by ID with person data
 * Allow access if ID matches OR if caller is admin with equal/superior level
 */
exports.getAdministrateur = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const { idAdministrateur } = req.params;
    if (!idAdministrateur) {
      return res.status(400).json({ error: "idAdministrateur requis" });
    }

    // Check authorization: allow if ID matches
    const isOwnId = caller.sub == idAdministrateur;
    
    if (!isOwnId) {
      // If not own ID, must be admin with equal or superior level
      if (!ensureRoles(caller, ["administrateur"])) {
        return res.status(403).json({ error: "Accès refusé" });
      }

      // Check level
      const callerAdmin = await Administrateurs.findOne({ where: { idAdministrateur: caller.sub } });
      const targetAdmin = await Administrateurs.findOne({ where: { idAdministrateur } });
      
      if (!callerAdmin || !targetAdmin) {
        return res.status(403).json({ error: "Accès refusé" });
      }

      if (callerAdmin.niveauAccesAdministrateur < targetAdmin.niveauAccesAdministrateur) {
        return res.status(403).json({ error: "Accès refusé : niveau insuffisant" });
      }
    }

    const administrateur = await Administrateurs.findOne({
      where: { idAdministrateur },
      include: { model: Personnes, attributes: { exclude: ["motDePassePersonne"] } }
    });

    if (!administrateur) {
      return res.status(404).json({ error: "Administrateur non trouvé" });
    }

    const personneData = administrateur.Personne.toJSON();
    delete personneData.motDePassePersonne;

    const adminData = administrateur.toJSON();
    delete adminData.Personne;

    const response = {
      personne: personneData,
      administrateur: adminData
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update an administrateur
 * Allow update if ID matches OR if caller is admin with strict superior level
 */
exports.updateAdministrateur = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const { idAdministrateur } = req.params;
    if (!idAdministrateur) {
      return res.status(400).json({ error: "idAdministrateur requis" });
    }

    const isOwnId = caller.sub == idAdministrateur;

    if (!isOwnId) {
      // If not own ID, must be admin with strict superior level
      if (!ensureRoles(caller, ["administrateur"])) {
        return res.status(403).json({ error: "Accès refusé" });
      }

      const callerAdmin = await Administrateurs.findOne({ where: { idAdministrateur: caller.sub } });
      const targetAdmin = await Administrateurs.findOne({ where: { idAdministrateur } });
      
      if (!callerAdmin || !targetAdmin) {
        return res.status(403).json({ error: "Accès refusé" });
      }

      // Strict superior level check (>) not (>=)
      if (callerAdmin.niveauAccesAdministrateur <= targetAdmin.niveauAccesAdministrateur) {
        return res.status(403).json({ error: "Accès refusé : niveau insuffisant" });
      }
    }

    const administrateur = await Administrateurs.findOne({
      where: { idAdministrateur },
      include: { model: Personnes }
    });
    if (!administrateur) {
      return res.status(404).json({ error: "Administrateur non trouvé" });
    }

    // Update person fields (except password)
    const { nomPersonne, prenomPersonne, telephonePersonne, emailPersonne } = req.body;
    if (nomPersonne) administrateur.Personne.nomPersonne = nomPersonne;
    if (prenomPersonne) administrateur.Personne.prenomPersonne = prenomPersonne;
    if (telephonePersonne) administrateur.Personne.telephonePersonne = telephonePersonne;
    if (emailPersonne) administrateur.Personne.emailPersonne = emailPersonne;
    await administrateur.Personne.save();

    // Update administrateur fields
    const { niveauAccesAdministrateur } = req.body;
    if (niveauAccesAdministrateur !== undefined) {
      administrateur.niveauAccesAdministrateur = niveauAccesAdministrateur;
    }

    await administrateur.save();

    const adminUpdated = await Administrateurs.findOne({
      where: { idAdministrateur },
      include: { model: Personnes, attributes: { exclude: ["motDePassePersonne"] } }
    });

    const personneData = adminUpdated.Personne.toJSON();
    delete personneData.motDePassePersonne;

    const adminData = adminUpdated.toJSON();
    delete adminData.Personne;

    const response = {
      personne: personneData,
      administrateur: adminData
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete an administrateur
 * Cannot delete own admin account unless level 1
 * Admins can delete other admins with strict superior level and all other models
 */
exports.deleteAdministrateur = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const { idAdministrateur } = req.params;
    if (!idAdministrateur) {
      return res.status(400).json({ error: "idAdministrateur requis" });
    }

    const isOwnId = caller.sub == idAdministrateur;

    // Cannot delete own admin account unless level 1
    if (isOwnId) {
      const callerAdmin = await Administrateurs.findOne({ where: { idAdministrateur: caller.sub } });
      if (!callerAdmin || callerAdmin.niveauAccesAdministrateur !== 1) {
        return res.status(403).json({ error: "Accès refusé : seul un administrateur niveau 1 peut se supprimer" });
      }
    } else {
      // If not own ID, must be admin with strict superior level
      if (!ensureRoles(caller, ["administrateur"])) {
        return res.status(403).json({ error: "Accès refusé" });
      }

      const callerAdmin = await Administrateurs.findOne({ where: { idAdministrateur: caller.sub } });
      const targetAdmin = await Administrateurs.findOne({ where: { idAdministrateur } });
      
      if (!callerAdmin || !targetAdmin) {
        return res.status(403).json({ error: "Accès refusé" });
      }

      // Strict superior level check (>) not (>=)
      if (callerAdmin.niveauAccesAdministrateur <= targetAdmin.niveauAccesAdministrateur) {
        return res.status(403).json({ error: "Accès refusé : niveau insuffisant" });
      }
    }

    const administrateur = await Administrateurs.findOne({ where: { idAdministrateur } });
    if (!administrateur) {
      return res.status(404).json({ error: "Administrateur non trouvé" });
    }

    await administrateur.destroy();

    res.status(200).json({ message: "Administrateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = exports;
