'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove foreign key constraint first
    await queryInterface.removeConstraint('CategorieProduits', 'CategorieProduits_ibfk_4');
    
    // Drop the column
    await queryInterface.removeColumn('CategorieProduits', 'idAdministrateur');
  },

  down: async (queryInterface, Sequelize) => {
    // Add the column back
    await queryInterface.addColumn('CategorieProduits', 'idAdministrateur', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Administrateurs',
        key: 'idAdministrateur'
      },
      onDelete: 'SET NULL'
    });
  }
};
