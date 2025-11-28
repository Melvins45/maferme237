'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('produits', {
      fields: ['idFournisseur'],
      type: 'foreign key',
      name: 'fk_produits_idFournisseur',
      references: {
        table: 'fournisseurs',
        field: 'idFournisseur'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('produits', 'fk_produits_idFournisseur');
  }
};
