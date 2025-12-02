'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('produits', 'idCategorieProduit', {
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
    await queryInterface.removeColumn('produits', 'idCategorieProduit');
  }
};
