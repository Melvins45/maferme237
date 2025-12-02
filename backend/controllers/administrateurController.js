// controllers/administrateurController.js
const { Administrateurs, Personnes } = require("../models");
const { verifyToken } = require("../services/jwtService");
const { extractBearer, ensureRoles } = require("../utils/tokenUtils");

/**
 * Get all administrateurs with their person data
 * Niveau 1: Peut voir tous les administrateurs
 * Niveau 2: Peut voir les administrateurs de niveau 2 et supérieur
 * Niveau 3: Peut voir seulement les administrateurs de niveau 3
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

    let administrateurs;
    const Sequelize = require("sequelize");

    // Niveau 1: Peut voir tous les admins
    if (callerAdmin.niveauAccesAdministrateur === 1) {
      administrateurs = await Administrateurs.findAll({
        include: { model: Personnes, attributes: { exclude: ["motDePassePersonne"] } }
      });
    }
    // Niveau 2: Peut voir niveaux 2 et supérieur (1,2)
    else if (callerAdmin.niveauAccesAdministrateur === 2) {
      administrateurs = await Administrateurs.findAll({
        where: { niveauAccesAdministrateur: { [Sequelize.Op.lte]: 2 } },
        include: { model: Personnes, attributes: { exclude: ["motDePassePersonne"] } }
      });
    }
    // Niveau 3: Peut voir seulement niveaux 3
    else if (callerAdmin.niveauAccesAdministrateur === 3) {
      administrateurs = await Administrateurs.findAll({
        where: { niveauAccesAdministrateur: 3 },
        include: { model: Personnes, attributes: { exclude: ["motDePassePersonne"] } }
      });
    }

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
 * Niveau 1: Peut modifier tous les autres admins et assigner niveaux jusqu'à 1
 * Niveau 2: Peut modifier les admins de niveau 3 seulement et assigner seulement niveau 3
 * Niveau 3: Ne peut modifier aucun autre admin
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
    const callerAdmin = await Administrateurs.findOne({ where: { idAdministrateur: caller.sub } });

    if (!callerAdmin) {
      return res.status(403).json({ error: "Accès refusé" });
    }

    // Si ce n'est pas son propre ID
    if (!isOwnId) {
      const targetAdmin = await Administrateurs.findOne({ where: { idAdministrateur } });
      
      if (!targetAdmin) {
        return res.status(404).json({ error: "Administrateur cible non trouvé" });
      }

      // Vérifier les permissions selon le niveau du caller
      if (callerAdmin.niveauAccesAdministrateur === 1) {
        // Niveau 1: Peut modifier tous les autres admins
      } else if (callerAdmin.niveauAccesAdministrateur === 2) {
        // Niveau 2: Peut modifier seulement les admins de niveau 3
        if (targetAdmin.niveauAccesAdministrateur !== 3) {
          return res.status(403).json({ error: "Accès refusé : niveau 2 ne peut modifier que les admins de niveau 3" });
        }
      } else if (callerAdmin.niveauAccesAdministrateur === 3) {
        // Niveau 3: Ne peut modifier aucun autre admin
        return res.status(403).json({ error: "Accès refusé : niveau 3 ne peut modifier aucun autre admin" });
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
      // Vérifier que le caller ne peut assigner que les niveaux appropriés
      if (!isOwnId) {
        if (callerAdmin.niveauAccesAdministrateur === 1) {
          // Niveau 1: Peut assigner jusqu'au niveau 1
          if (niveauAccesAdministrateur < 1 || niveauAccesAdministrateur > 1) {
            return res.status(400).json({ error: "Niveau 1 ne peut assigner que le niveau 1" });
          }
        } else if (callerAdmin.niveauAccesAdministrateur === 2) {
          // Niveau 2: Peut assigner seulement niveau 3
          if (niveauAccesAdministrateur !== 3) {
            return res.status(400).json({ error: "Niveau 2 ne peut assigner que le niveau 3" });
          }
        }
      }
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
 * Niveau 1: Peut se supprimer lui-même et supprimer les niveaux 2 et 3
 * Niveau 2: Peut supprimer seulement les niveaux 3
 * Niveau 3: Ne peut supprimer aucun admin
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
    const callerAdmin = await Administrateurs.findOne({ where: { idAdministrateur: caller.sub } });

    if (!callerAdmin) {
      return res.status(403).json({ error: "Accès refusé" });
    }

    const administrateur = await Administrateurs.findOne({ where: { idAdministrateur } });
    if (!administrateur) {
      return res.status(404).json({ error: "Administrateur non trouvé" });
    }

    // Vérifier les permissions selon le niveau du caller
    if (isOwnId) {
      // Seul un admin niveau 1 peut se supprimer lui-même
      if (callerAdmin.niveauAccesAdministrateur !== 1) {
        return res.status(403).json({ error: "Accès refusé : seul un administrateur niveau 1 peut se supprimer" });
      }
    } else {
      // Supprimer un autre admin
      if (callerAdmin.niveauAccesAdministrateur === 1) {
        // Niveau 1: Peut supprimer les niveaux 2 et 3
      } else if (callerAdmin.niveauAccesAdministrateur === 2) {
        // Niveau 2: Peut supprimer seulement les niveaux 3
        if (administrateur.niveauAccesAdministrateur !== 3) {
          return res.status(403).json({ error: "Accès refusé : niveau 2 ne peut supprimer que les admins de niveau 3" });
        }
      } else if (callerAdmin.niveauAccesAdministrateur === 3) {
        // Niveau 3: Ne peut supprimer aucun admin
        return res.status(403).json({ error: "Accès refusé : niveau 3 ne peut supprimer aucun admin" });
      }
    }

    await administrateur.destroy();

    res.status(200).json({ message: "Administrateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = exports;
