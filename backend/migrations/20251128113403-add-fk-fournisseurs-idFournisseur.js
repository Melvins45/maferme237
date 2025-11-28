'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('fournisseurs', {
      fields: ['idFournisseur'],
      type: 'foreign key',
      name: 'fk_fournisseurs_idFournisseur',
      references: {
        table: 'personnes',
        field: 'idPersonne'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('fournisseurs', 'fk_fournisseurs_idFournisseur');
  }
};
