// controllers/clientController.js
const { Client, Personne } = require("../models");

exports.createClient = async (req, res) => {
  try {
    const personne = await Personne.create(req.body.personne);
    const client = await Client.create({
      idPersonne: personne.idPersonne,
      adresseClient: req.body.adresseClient,
      telephoneClient: req.body.telephoneClient,
    });
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
