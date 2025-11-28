// controllers/authController.js
const { Personne } = require("../models");
const bcrypt = require("bcrypt");
const { signUser } = require("../services/jwtService");

exports.register = async (req, res) => {
  try {
    const { nomPersonne, emailPersonne, motDePassePersonne, telephonePersonne, role } = req.body;
    const personne = await Personne.create({ nomPersonne, emailPersonne, motDePassePersonne, telephonePersonne, role });
    res.status(201).json({ id: personne.idPersonne, email: personne.emailPersonne });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { emailPersonne, motDePassePersonne } = req.body;
    const user = await Personne.findOne({ where: { emailPersonne } });
    if (!user) return res.status(401).json({ error: "Identifiants invalides" });

    const ok = await bcrypt.compare(motDePassePersonne, user.motDePassePersonne);
    if (!ok) return res.status(401).json({ error: "Identifiants invalides" });

    const token = signUser({ sub: user.idPersonne, role: user.role });
    res.json({ token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
