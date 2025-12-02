'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // This migration handles the refactoring of ProduitCaracteristiques model:
    // 1. Rename ProduitIdProduit column to idProduit
    // 2. This consolidates model and database naming conventions

    await queryInterface.renameColumn('produitcaracteristiques', 'ProduitIdProduit', 'idProduit');

    // Drop and re-add the foreign key constraint with the new column name
    await queryInterface.removeConstraint('produitcaracteristiques', 'fk_produitcaracteristiques_idProduit');
    
    await queryInterface.addConstraint('produitcaracteristiques', {
      fields: ['idProduit'],
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

  down: async (queryInterface, Sequelize) => {
    // Rollback: restore the previous foreign key and column name
    await queryInterface.removeConstraint('produitcaracteristiques', 'fk_produitcaracteristiques_idProduit');
    
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

    await queryInterface.renameColumn('produitcaracteristiques', 'idProduit', 'ProduitIdProduit');
  }
};
