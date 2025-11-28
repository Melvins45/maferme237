'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('livraisons', {
      fields: ['idPrecommande'],
      type: 'foreign key',
      name: 'fk_livraisons_idPrecommande_precommandes_idPrecommande',
      references: {
        table: 'precommandes',
        field: 'idPrecommande'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('livraisons', 'fk_livraisons_idPrecommande_precommandes_idPrecommande');
  }
};
