'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('produits', {
      fields: ['idGestionnaire'],
      type: 'foreign key',
      name: 'fk_produits_idGestionnaire',
      references: {
        table: 'gestionnaires',
        field: 'idGestionnaire'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('produits', 'fk_produits_idGestionnaire');
  }
};
