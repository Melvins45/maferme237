'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('personnes', {
      idPersonne: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nom: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      prenomPersonne: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      emailPersonne: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      motDePassePersonne: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      telephonePersonne: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      dateCreationCompte: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
        allowNull: false
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('personnes');
  }
};
