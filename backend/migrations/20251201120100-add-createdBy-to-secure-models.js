'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add createdBy to Administrateurs
    await queryInterface.addColumn('administrateurs', 'createdBy', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'personnes',
        key: 'idPersonne'
      }
    });

    // Add createdBy to Gestionnaires
    await queryInterface.addColumn('gestionnaires', 'createdBy', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'personnes',
        key: 'idPersonne'
      }
    });

    // Add createdBy to Producteurs
    await queryInterface.addColumn('producteurs', 'createdBy', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'personnes',
        key: 'idPersonne'
      }
    });

    // Add createdBy to Livreurs
    await queryInterface.addColumn('livreurs', 'createdBy', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'personnes',
        key: 'idPersonne'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove createdBy from Administrateurs
    await queryInterface.removeColumn('administrateurs', 'createdBy');

    // Remove createdBy from Gestionnaires
    await queryInterface.removeColumn('gestionnaires', 'createdBy');

    // Remove createdBy from Producteurs
    await queryInterface.removeColumn('producteurs', 'createdBy');

    // Remove createdBy from Livreurs
    await queryInterface.removeColumn('livreurs', 'createdBy');
  }
};
