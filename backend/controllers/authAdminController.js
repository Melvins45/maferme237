// controllers/authAdminController.js
const {
  Personnes,
  Administrateurs,
  Gestionnaires,
  Producteurs,
  Livreurs,
} = require("../models");
const bcrypt = require("bcrypt");
const { signUser, verifyToken } = require("../services/jwtService");
const { formatAuthResponse } = require("../services/responseFormatter");
const { extractBearer, ensureRoles } = require("../utils/tokenUtils");

exports.createAdministrateur = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    if (!ensureRoles(caller, ["administrateur"])) {
      return res.status(403).json({ error: "Accès refusé : rôle administrateur requis" });
    }

    const { personne, administrateur } = req.body;
    if (!personne || !personne.nomPersonne || !personne.emailPersonne || !personne.motDePassePersonne) {
      return res.status(400).json({ error: "Données personne incomplètes" });
    }

    const hashed = await bcrypt.hash(personne.motDePassePersonne, 10);
    const newPersonne = await Personnes.create({
      nom: personne.nomPersonne,
      prenomPersonne: personne.prenomPersonne || personne.nomPersonne,
      emailPersonne: personne.emailPersonne,
      motDePassePersonne: hashed,
      telephonePersonne: personne.telephonePersonne || null,
    });

    const adminData = await Administrateurs.create({
      idAdministrateur: newPersonne.idPersonne,
      niveauAccesAdministrateur: administrateur && administrateur.niveauAccesAdministrateur ? administrateur.niveauAccesAdministrateur : 1,
      createdBy: caller.sub,
    });

    const tokenForNew = signUser({ sub: newPersonne.idPersonne, roles: ["administrateur"] });
    const response = formatAuthResponse(newPersonne, { administrateur: adminData }, tokenForNew);

    res.status(201).json(response);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.createGestionnaire = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    if (!ensureRoles(caller, ["administrateur"])) {
      return res.status(403).json({ error: "Accès refusé : rôle administrateur requis" });
    }

    const { personne, gestionnaire } = req.body;
    if (!personne || !personne.nomPersonne || !personne.emailPersonne || !personne.motDePassePersonne) {
      return res.status(400).json({ error: "Données personne incomplètes" });
    }

    const hashed = await bcrypt.hash(personne.motDePassePersonne, 10);
    const newPersonne = await Personnes.create({
      nom: personne.nomPersonne,
      prenomPersonne: personne.prenomPersonne || personne.nomPersonne,
      emailPersonne: personne.emailPersonne,
      motDePassePersonne: hashed,
      telephonePersonne: personne.telephonePersonne || null,
    });

    const gestionnaireData = await Gestionnaires.create({
      idGestionnaire: newPersonne.idPersonne,
      roleGestionnaire: gestionnaire && gestionnaire.roleGestionnaire ? gestionnaire.roleGestionnaire : null,
      createdBy: caller.sub,
    });

    const tokenForNew = signUser({ sub: newPersonne.idPersonne, roles: ["gestionnaire"] });
    const response = formatAuthResponse(newPersonne, { gestionnaire: gestionnaireData }, tokenForNew);

    res.status(201).json(response);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.createProducteur = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    if (!ensureRoles(caller, ["administrateur", "gestionnaire"])) {
      return res.status(403).json({ error: "Accès refusé : rôle gestionnaire ou administrateur requis" });
    }

    const { personne, producteur } = req.body;
    if (!personne || !personne.nomPersonne || !personne.emailPersonne || !personne.motDePassePersonne) {
      return res.status(400).json({ error: "Données personne incomplètes" });
    }

    const hashed = await bcrypt.hash(personne.motDePassePersonne, 10);
    const newPersonne = await Personnes.create({
      nom: personne.nomPersonne,
      prenomPersonne: personne.prenomPersonne || personne.nomPersonne,
      emailPersonne: personne.emailPersonne,
      motDePassePersonne: hashed,
      telephonePersonne: personne.telephonePersonne || null,
    });

    const producteurData = await Producteurs.create({
      idProducteur: newPersonne.idPersonne,
      specialiteProducteur: producteur && producteur.specialiteProducteur ? producteur.specialiteProducteur : null,
      createdBy: caller.sub,
    });

    const tokenForNew = signUser({ sub: newPersonne.idPersonne, roles: ["producteur"] });
    const response = formatAuthResponse(newPersonne, { producteur: producteurData }, tokenForNew);

    res.status(201).json(response);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.createLivreur = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    // Only gestionnaire or administrateur can create livreurs
    if (!ensureRoles(caller, ["gestionnaire", "administrateur"])) {
      return res.status(403).json({ error: "Accès refusé : rôle gestionnaire ou administrateur requis" });
    }

    const { personne } = req.body;
    if (!personne || !personne.nomPersonne || !personne.emailPersonne || !personne.motDePassePersonne) {
      return res.status(400).json({ error: "Données personne incomplètes" });
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
      createdBy: caller.sub,
    });

    const tokenForNew = signUser({ sub: newPersonne.idPersonne, roles: ["livreur"] });
    const response = formatAuthResponse(newPersonne, { livreur: livreurData }, tokenForNew);

    res.status(201).json(response);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.loginLivreur = async (req, res) => {
  try {
    const { emailPersonne, motDePassePersonne } = req.body;
    if (!emailPersonne || !motDePassePersonne) return res.status(400).json({ error: "Email et mot de passe requis" });

    const personne = await Personnes.findOne({ where: { emailPersonne } });
    if (!personne) return res.status(401).json({ error: "Identifiants invalides" });

    const ok = await bcrypt.compare(motDePassePersonne, personne.motDePassePersonne);
    if (!ok) return res.status(401).json({ error: "Identifiants invalides" });

    const roles = {};
    const admin = await Administrateurs.findOne({ where: { idAdministrateur: personne.idPersonne } });
    if (admin) roles.administrateur = admin;

    const gestionnaire = await Gestionnaires.findOne({ where: { idGestionnaire: personne.idPersonne } });
    if (gestionnaire) roles.gestionnaire = gestionnaire;

    const producteur = await Producteurs.findOne({ where: { idProducteur: personne.idPersonne } });
    if (producteur) roles.producteur = producteur;

    const livreur = await Livreurs.findOne({ where: { idLivreur: personne.idPersonne } });
    if (livreur) roles.livreur = livreur;

    // If no secure role found
    if (Object.keys(roles).length === 0) {
      return res.status(403).json({ error: "Compte non trouvé" });
    }

    const personneData = personne.toJSON();
    delete personneData.motDePassePersonne;

    const roleObjects = {};
    if (roles.administrateur) {
      const cleaned = roles.administrateur.toJSON();
      delete cleaned.Personne;
      roleObjects.administrateur = cleaned;
    }
    if (roles.gestionnaire) {
      const cleaned = roles.gestionnaire.toJSON();
      delete cleaned.Personne;
      roleObjects.gestionnaire = cleaned;
    }
    if (roles.producteur) {
      const cleaned = roles.producteur.toJSON();
      delete cleaned.Personne;
      roleObjects.producteur = cleaned;
    }
    if (roles.livreur) {
      const cleaned = roles.livreur.toJSON();
      delete cleaned.Personne;
      roleObjects.livreur = cleaned;
    }

    const rolesArray = Object.keys(roles).filter((r) => roles[r]);
    const token = signUser({ sub: personne.idPersonne, roles: rolesArray });

    const response = { personne: personneData, ...roleObjects, token };

    res.json(response);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.login = async (req, res) => {
  return exports.loginLivreur(req, res);
};

exports.loginAdministrateur = async (req, res) => {
  try {
    const { emailPersonne, motDePassePersonne } = req.body;
    if (!emailPersonne || !motDePassePersonne) return res.status(400).json({ error: "Email et mot de passe requis" });

    const personne = await Personnes.findOne({ where: { emailPersonne } });
    if (!personne) return res.status(401).json({ error: "Identifiants invalides" });

    const ok = await bcrypt.compare(motDePassePersonne, personne.motDePassePersonne);
    if (!ok) return res.status(401).json({ error: "Identifiants invalides" });

    const admin = await Administrateurs.findOne({ where: { idAdministrateur: personne.idPersonne } });
    if (!admin) return res.status(403).json({ error: "Compte administrateur non trouvé" });

    const personneData = personne.toJSON();
    delete personneData.motDePassePersonne;

    const adminData = admin.toJSON();
    delete adminData.Personne;

    const token = signUser({ sub: personne.idPersonne, roles: ["administrateur"] });
    const response = { personne: personneData, administrateur: adminData, token };

    res.json(response);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.loginGestionnaire = async (req, res) => {
  try {
    const { emailPersonne, motDePassePersonne } = req.body;
    if (!emailPersonne || !motDePassePersonne) return res.status(400).json({ error: "Email et mot de passe requis" });

    const personne = await Personnes.findOne({ where: { emailPersonne } });
    if (!personne) return res.status(401).json({ error: "Identifiants invalides" });

    const ok = await bcrypt.compare(motDePassePersonne, personne.motDePassePersonne);
    if (!ok) return res.status(401).json({ error: "Identifiants invalides" });

    const gestionnaire = await Gestionnaires.findOne({ where: { idGestionnaire: personne.idPersonne } });
    if (!gestionnaire) return res.status(403).json({ error: "Compte gestionnaire non trouvé" });

    const personneData = personne.toJSON();
    delete personneData.motDePassePersonne;

    const gestionnaireData = gestionnaire.toJSON();
    delete gestionnaireData.Personne;

    const token = signUser({ sub: personne.idPersonne, roles: ["gestionnaire"] });
    const response = { personne: personneData, gestionnaire: gestionnaireData, token };

    res.json(response);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.loginProducteur = async (req, res) => {
  try {
    const { emailPersonne, motDePassePersonne } = req.body;
    if (!emailPersonne || !motDePassePersonne) return res.status(400).json({ error: "Email et mot de passe requis" });

    const personne = await Personnes.findOne({ where: { emailPersonne } });
    if (!personne) return res.status(401).json({ error: "Identifiants invalides" });

    const ok = await bcrypt.compare(motDePassePersonne, personne.motDePassePersonne);
    if (!ok) return res.status(401).json({ error: "Identifiants invalides" });

    const producteur = await Producteurs.findOne({ where: { idProducteur: personne.idPersonne } });
    if (!producteur) return res.status(403).json({ error: "Compte producteur non trouvé" });

    const personneData = personne.toJSON();
    delete personneData.motDePassePersonne;

    const producteurData = producteur.toJSON();
    delete producteurData.Personne;

    const token = signUser({ sub: personne.idPersonne, roles: ["producteur"] });
    const response = { personne: personneData, producteur: producteurData, token };

    res.json(response);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = exports;
