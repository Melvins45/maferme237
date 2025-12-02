// controllers/clientController.js
const { Clients, Personnes } = require("../models");
const { verifyToken } = require("../services/jwtService");
const { extractBearer, ensureRoles } = require("../utils/tokenUtils");

/**
 * Get all clients with their person data
 * Only gestionnaires and administrateurs can access
 */
exports.getClients = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    // Only gestionnaire or administrateur can access all clients
    if (!ensureRoles(caller, ["gestionnaire", "administrateur"])) {
      return res.status(403).json({ error: "Accès refusé : rôle gestionnaire ou administrateur requis" });
    }

    const clients = await Clients.findAll({
      include: [
        {
          model: Personnes,
          attributes: { exclude: ['motDePassePersonne'] }
        }
      ]
    });

    const response = clients.map(c => {
      const personneData = c.Personne.toJSON();
      delete personneData.motDePassePersonne;
      const clientData = c.toJSON();
      delete clientData.Personne;
      return {
        personne: personneData,
        client: clientData
      };
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get a single client by ID with person data
 * Only gestionnaires and administrateurs can access
 */
exports.getClient = async (req, res) => {
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

    const { idClient } = req.params;
    if (!idClient) {
      return res.status(400).json({ error: "idClient requis" });
    }

    const client = await Clients.findOne({
      where: { idClient },
      include: [
        {
          model: Personnes,
          attributes: { exclude: ['motDePassePersonne'] }
        }
      ]
    });

    if (!client) {
      return res.status(404).json({ error: "Client non trouvé" });
    }

    const personneData = client.Personne.toJSON();
    delete personneData.motDePassePersonne;

    const clientData = client.toJSON();
    delete clientData.Personne;

    const response = {
      personne: personneData,
      client: clientData
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update a client
 * Allow update if ID matches OR if user is gestionnaire/administrateur
 */
exports.updateClient = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const { idClient } = req.params;
    if (!idClient) {
      return res.status(400).json({ error: "idClient requis" });
    }

    // Check authorization: allow if ID matches OR if user is gestionnaire/administrateur
    const isOwnId = caller.sub == idClient;
    const isAdminOrGest = ensureRoles(caller, ["gestionnaire", "administrateur"]);

    if (!isOwnId && !isAdminOrGest) {
      return res.status(403).json({ error: "Accès refusé" });
    }

    const client = await Clients.findOne({
      where: { idClient },
      include: { model: Personnes }
    });
    if (!client) {
      return res.status(404).json({ error: "Client non trouvé" });
    }

    // Update person fields (except password)
    const { nomPersonne, prenomPersonne, telephonePersonne, emailPersonne } = req.body;
    if (nomPersonne) client.Personne.nomPersonne = nomPersonne;
    if (prenomPersonne) client.Personne.prenomPersonne = prenomPersonne;
    if (telephonePersonne) client.Personne.telephonePersonne = telephonePersonne;
    if (emailPersonne) client.Personne.emailPersonne = emailPersonne;
    await client.Personne.save();

    // Update client fields
    const { adresseClient } = req.body;
    if (adresseClient) client.adresseClient = adresseClient;

    await client.save();

    const clientUpdated = await Clients.findOne({
      where: { idClient },
      include: { model: Personnes, attributes: { exclude: ["motDePassePersonne"] } }
    });

    const personneData = clientUpdated.Personne.toJSON();
    delete personneData.motDePassePersonne;

    const clientData = clientUpdated.toJSON();
    delete clientData.Personne;

    const response = {
      personne: personneData,
      client: clientData
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete a client
 * Allow delete if ID matches OR if user is gestionnaire/administrateur
 */
exports.deleteClient = async (req, res) => {
  try {
    const token = extractBearer(req);
    if (!token) return res.status(401).json({ error: "Token manquant" });
    let caller;
    try {
      caller = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const { idClient } = req.params;
    if (!idClient) {
      return res.status(400).json({ error: "idClient requis" });
    }

    const isOwnId = caller.sub == idClient;
    const isAdminOrGest = ensureRoles(caller, ["gestionnaire", "administrateur"]);

    if (!isOwnId && !isAdminOrGest) {
      return res.status(403).json({ error: "Accès refusé" });
    }

    const client = await Clients.findOne({ where: { idClient } });
    if (!client) {
      return res.status(404).json({ error: "Client non trouvé" });
    }

    await client.destroy();

    res.status(200).json({ message: "Client supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
