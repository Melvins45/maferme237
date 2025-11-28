'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('paiements', {
      fields: ['idGestionnaire'],
      type: 'foreign key',
      name: 'fk_paiements_idGestionnaire',
      references: {
        table: 'gestionnaires',
        field: 'idGestionnaire'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('paiements', 'fk_paiements_idGestionnaire');
  }
};
