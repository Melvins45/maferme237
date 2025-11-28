'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('souhaitproduits', {
      fields: ['idClient'],
      type: 'foreign key',
      name: 'fk_souhaitproduits_idClient',
      references: {
        table: 'clients',
        field: 'idClient'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('souhaitproduits', 'fk_souhaitproduits_idClient');
  }
};
