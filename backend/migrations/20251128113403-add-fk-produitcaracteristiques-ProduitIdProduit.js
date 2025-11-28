'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('produitcaracteristiques', {
      fields: ['ProduitIdProduit'],
      type: 'foreign key',
      name: 'fk_produitcaracteristiques_idProduit',
      references: {
        table: 'produits',
        field: 'idProduit'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('produitcaracteristiques', 'fk_produitcaracteristiques_idProduit');
  }
};
