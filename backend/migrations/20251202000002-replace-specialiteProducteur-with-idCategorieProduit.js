'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove specialiteProducteur column if it exists
    try {
      await queryInterface.removeColumn('producteurs', 'specialiteProducteur');
    } catch (e) {
      // Column might not exist, continue
    }

    // Add idCategorieProduit FK column
    await queryInterface.addColumn('producteurs', 'idCategorieProduit', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'CategorieProduits',
        key: 'idCategorieProduit'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove idCategorieProduit column
    await queryInterface.removeColumn('producteurs', 'idCategorieProduit');

    // Add back specialiteProducteur column
    await queryInterface.addColumn('producteurs', 'specialiteProducteur', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
  }
};
