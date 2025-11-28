'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('souhaitproduits', {
      fields: ['idFournisseur'],
      type: 'foreign key',
      name: 'fk_souhaitproduits_idFournisseur',
      references: {
        table: 'fournisseurs',
        field: 'idFournisseur'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('souhaitproduits', 'fk_souhaitproduits_idFournisseur');
  }
};
