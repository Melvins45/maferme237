'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('souhaitproduits', {
      fields: ['idGestionnaire'],
      type: 'foreign key',
      name: 'fk_souhaitproduits_idGestionnaire',
      references: {
        table: 'gestionnaires',
        field: 'idGestionnaire'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('souhaitproduits', 'fk_souhaitproduits_idGestionnaire');
  }
};
