'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('paiements', {
      fields: ['idPrecommande'],
      type: 'foreign key',
      name: 'fk_paiements_idPrecommande',
      references: {
        table: 'precommandes',
        field: 'idPrecommande'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('paiements', 'fk_paiements_idPrecommande');
  }
};
