// controllers/authLivreurController.js
const { Personnes, Livreurs } = require('../models');
const bcrypt = require('bcrypt');
const { signUser, verifyToken } = require('../services/jwtService');

const extractBearer = (req) => {
  const auth = req.headers.authorization || req.headers.Authorization;
  if (!auth) return null;
  const parts = auth.split(' ');
  if (parts.length !== 2) return null;
  return parts[1];
};

const ensureRoles = (payload, allowedRoles) => {
  if (!payload || !payload.roles) return false;
  return payload.roles.some((r) => allowedRoles.includes(r));
};

exports.createLivreur = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: 'Token manquant' });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: 'Token invalide' });
    }

    // Only gestionnaire or administrateur can create livreurs
    if (!ensureRoles(caller, ['gestionnaire', 'administrateur'])) {
      return res.status(403).json({ error: 'Accès refusé : rôle gestionnaire ou administrateur requis' });
    }

    const { personne } = req.body;
    if (!personne || !personne.nomPersonne || !personne.emailPersonne || !personne.motDePassePersonne) {
      return res.status(400).json({ error: 'Données personne incomplètes' });
    }

    const hashed = await bcrypt.hash(personne.motDePassePersonne, 10);
    const newPersonne = await Personnes.create({
      nom: personne.nomPersonne,
      prenomPersonne: personne.prenomPersonne || personne.nomPersonne,
      emailPersonne: personne.emailPersonne,
      motDePassePersonne: hashed,
      telephonePersonne: personne.telephonePersonne || null,
    });

    const livreurData = await Livreurs.create({
      idLivreur: newPersonne.idPersonne,
    });

    const personneData = newPersonne.toJSON();
    delete personneData.motDePassePersonne;

    const tokenForNew = signUser({ sub: newPersonne.idPersonne, roles: ['livreur'] });

    res.status(201).json({ personne: personneData, livreur: livreurData.toJSON(), token: tokenForNew });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.loginLivreur = async (req, res) => {
  try {
    const { emailPersonne, motDePassePersonne } = req.body;
    if (!emailPersonne || !motDePassePersonne) return res.status(400).json({ error: 'Email et mot de passe requis' });

    const personne = await Personnes.findOne({ where: { emailPersonne } });
    if (!personne) return res.status(401).json({ error: 'Identifiants invalides' });

    const ok = await bcrypt.compare(motDePassePersonne, personne.motDePassePersonne);
    if (!ok) return res.status(401).json({ error: 'Identifiants invalides' });

    const livreur = await Livreurs.findOne({ where: { idLivreur: personne.idPersonne } });
    if (!livreur) return res.status(403).json({ error: 'Compte livreur non trouvé' });

    const personneData = personne.toJSON();
    delete personneData.motDePassePersonne;

    const response = { personne: personneData, livreur: livreur.toJSON() };
    const token = signUser({ sub: personne.idPersonne, roles: ['livreur'] });
    response.token = token;

    res.json(response);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = exports;
