'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('paiements', {
      fields: ['idLivraison'],
      type: 'foreign key',
      name: 'fk_paiements_idLivraison',
      references: {
        table: 'livraisons',
        field: 'idLivraison'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('paiements', 'fk_paiements_idLivraison');
  }
};
