'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('ligneprecommandes', {
      fields: ['idProduit'],
      type: 'foreign key',
      name: 'fk_ligneprecommandes_idProduit',
      references: {
        table: 'produits',
        field: 'idProduit'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('ligneprecommandes', 'fk_ligneprecommandes_idProduit');
  }
};
