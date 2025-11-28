'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('etapeproductions', {
      fields: ['idFournisseur'],
      type: 'foreign key',
      name: 'fk_etapeproductions_idFournisseur_fournisseurs_idFournisseur',
      references: {
        table: 'fournisseurs',
        field: 'idFournisseur'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('etapeproductions', 'fk_etapeproductions_idFournisseur_fournisseurs_idFournisseur');
  }
};
