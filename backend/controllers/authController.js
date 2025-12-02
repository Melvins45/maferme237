// controllers/authController.js
const { 
  Personnes, 
  Clients, 
  Fournisseurs, 
  Livreurs, 
  Entreprises 
} = require("../models");
const bcrypt = require("bcrypt");
const { signUser } = require("../services/jwtService");

exports.register = async (req, res) => {
  try {
    const { personne, client, fournisseur, entreprise } = req.body;
    
    if (!personne || !personne.nomPersonne || !personne.emailPersonne || !personne.motDePassePersonne) {
      return res.status(400).json({ error: "Données personne incomplètes" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(personne.motDePassePersonne, 10);

    // Create personne
    const newPersonne = await Personnes.create({
      nom: personne.nomPersonne,
      prenomPersonne: personne.nomPersonne,
      emailPersonne: personne.emailPersonne,
      motDePassePersonne: hashedPassword,
      telephonePersonne: personne.telephonePersonne || null
    });

    // If client provided, create client record
    let clientData = null;
    if (client) {
      clientData = await Clients.create({
        idClient: newPersonne.idPersonne,
        ...client
      });
    }

    // If fournisseur provided, create fournisseur record
    let fournisseurData = null;
    if (fournisseur) {
      fournisseurData = await Fournisseurs.create({
        idFournisseur: newPersonne.idPersonne,
        ...fournisseur
      });
    }

    // If entreprise provided, create entreprise record
    let entrepriseData = null;
    if (entreprise) {
      entrepriseData = await Entreprises.create({
        idEntreprise: newPersonne.idPersonne,
        secteurActiviteEntreprise: entreprise.secteurActiviteEntreprise || null,
        ...entreprise
      });
    }

    // Build response with all attributes
    const personneData = newPersonne.toJSON();
    delete personneData.motDePassePersonne;
    
    const response = {
      personne: personneData
    };

    const rolesArray = [];
    if (clientData) {
      const clientJson = clientData.toJSON();
      delete clientJson.Personne;
      response.client = clientJson;
      rolesArray.push('client');
    }

    if (fournisseurData) {
      const fournisseurJson = fournisseurData.toJSON();
      delete fournisseurJson.Personne;
      response.fournisseur = fournisseurJson;
      rolesArray.push('fournisseur');
    }

    if (entrepriseData) {
      const entrepriseJson = entrepriseData.toJSON();
      delete entrepriseJson.Personne;
      response.entreprise = entrepriseJson;
      rolesArray.push('entreprise');
    }

    // Sign token including roles
    const token = signUser({ sub: newPersonne.idPersonne, roles: rolesArray });
    response.token = token;

    res.status(201).json(response);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { emailPersonne, motDePassePersonne } = req.body;
    
    if (!emailPersonne || !motDePassePersonne) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    const personne = await Personnes.findOne({ where: { emailPersonne } });
    if (!personne) return res.status(401).json({ error: "Identifiants invalides" });

    const ok = await bcrypt.compare(motDePassePersonne, personne.motDePassePersonne);
    if (!ok) return res.status(401).json({ error: "Identifiants invalides" });

    // Search for user roles in permitted affiliated tables (public roles)
    const roles = {};

    const client = await Clients.findOne({ where: { idClient: personne.idPersonne } });
    if (client) roles.client = client;

    const fournisseur = await Fournisseurs.findOne({ where: { idFournisseur: personne.idPersonne } });
    if (fournisseur) roles.fournisseur = fournisseur;

    const entreprise = await Entreprises.findOne({ where: { idEntreprise: personne.idPersonne } });
    if (entreprise) roles.entreprise = entreprise;

    // If no public role found
    if (Object.keys(roles).length === 0) {
      return res.status(403).json({ error: "Compte non trouvé" });
    }

    // Build response with personne and roles
    const personneData = personne.toJSON();
    delete personneData.motDePassePersonne;
    
    const response = {
      personne: personneData
    };

    if (roles.client) {
      const clientJson = roles.client.toJSON();
      delete clientJson.Personne;
      response.client = clientJson;
    }
    if (roles.fournisseur) {
      const fournisseurJson = roles.fournisseur.toJSON();
      delete fournisseurJson.Personne;
      response.fournisseur = fournisseurJson;
    }
    if (roles.entreprise) {
      const entrepriseJson = roles.entreprise.toJSON();
      delete entrepriseJson.Personne;
      response.entreprise = entrepriseJson;
    }

    // Build roles array for token
    const rolesArray = Object.keys(roles).filter((r) => roles[r]);
    const token = signUser({ sub: personne.idPersonne, roles: rolesArray });
    response.token = token;

    res.json(response);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
