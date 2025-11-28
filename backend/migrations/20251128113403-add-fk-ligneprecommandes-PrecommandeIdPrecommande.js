'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('ligneprecommandes', {
      fields: ['idPrecommande'],
      type: 'foreign key',
      name: 'fk_ligneprecommandes_idPrecommande',
      references: {
        table: 'precommandes',
        field: 'idPrecommande'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('ligneprecommandes', 'fk_ligneprecommandes_idPrecommande');
  }
};
