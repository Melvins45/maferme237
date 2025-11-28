'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('pointlivraisons', {
      fields: ['idGestionnaire'],
      type: 'foreign key',
      name: 'fk_pointlivraisons_idGestionnaire',
      references: {
        table: 'gestionnaires',
        field: 'idGestionnaire'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('pointlivraisons', 'fk_pointlivraisons_idGestionnaire');
  }
};
