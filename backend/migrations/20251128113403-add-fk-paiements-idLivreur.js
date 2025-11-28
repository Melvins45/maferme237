'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('paiements', {
      fields: ['idLivreur'],
      type: 'foreign key',
      name: 'fk_paiements_idLivreur',
      references: {
        table: 'livreurs',
        field: 'idLivreur'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('paiements', 'fk_paiements_idLivreur');
  }
};
