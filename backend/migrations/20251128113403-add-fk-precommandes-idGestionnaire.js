'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('precommandes', {
      fields: ['idGestionnaire'],
      type: 'foreign key',
      name: 'fk_precommandes_idGestionnaire',
      references: {
        table: 'gestionnaires',
        field: 'idGestionnaire'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('precommandes', 'fk_precommandes_idGestionnaire');
  }
};
