'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('requestlogs', {
      idRequeteLog: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      acteurId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      acteurType: {
        type: Sequelize.ENUM("Fournisseur", "Producteur", "Gestionnaire", "Administrateur", "Client", "Entreprise", "Livreur"),
        allowNull: false
      },
      action: {
        type: Sequelize.STRING,
        allowNull: false
      },
      endpoint: {
        type: Sequelize.STRING
      },
      payload: {
        type: Sequelize.TEXT
      },
      dateRequete: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('requestlogs');
  }
};
