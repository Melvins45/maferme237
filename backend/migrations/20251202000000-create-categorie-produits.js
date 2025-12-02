'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CategorieProduits', {
      idCategorieProduit: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nomCategorieProduit: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      descriptionCategorieProduit: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      dateCreationCategorie: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      idFournisseur: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Fournisseurs',
          key: 'idFournisseur'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      idProducteur: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Producteurs',
          key: 'idProducteur'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      idGestionnaire: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Gestionnaires',
          key: 'idGestionnaire'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      idAdministrateur: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Administrateurs',
          key: 'idAdministrateur'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    await queryInterface.dropTable('CategorieProduits');
  }
};
