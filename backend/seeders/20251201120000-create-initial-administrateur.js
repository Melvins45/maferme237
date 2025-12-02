"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const email = "nitopopm@yahoo.com";
    const plain = "maferme237Douala@2025";
    const hashed = await bcrypt.hash(plain, 10);

    // Insert personne
    await queryInterface.bulkInsert(
      "personnes",
      [
        {
          nom: "Nitopop Jeatsa",
          prenomPersonne: "Guillaume Melvin",
          emailPersonne: email,
          motDePassePersonne: hashed,
          telephonePersonne: null,
          dateCreationCompte: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // Fetch the inserted personne id
    const [results] = await queryInterface.sequelize.query(
      "SELECT idPersonne FROM personnes WHERE emailPersonne = ? LIMIT 1",
      { replacements: [email] }
    );

    if (!results || results.length === 0) {
      throw new Error("Unable to find inserted personne");
    }

    const idPersonne = results[0].idPersonne;

    // Insert administrateur record with idAdministrateur = idPersonne
    await queryInterface.bulkInsert(
      "administrateurs",
      [
        {
          idAdministrateur: idPersonne,
          niveauAccesAdministrateur: "1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    const email = "nitopopm@yahoo.com";

    // Find person
    const [rows] = await queryInterface.sequelize.query(
      "SELECT idPersonne FROM personnes WHERE emailPersonne = ? LIMIT 1",
      { replacements: [email] }
    );

    if (rows && rows.length) {
      const id = rows[0].idPersonne;
      await queryInterface.bulkDelete("administrateurs", { idAdministrateur: id }, {});
      await queryInterface.bulkDelete("personnes", { idPersonne: id }, {});
    }
  },
};
