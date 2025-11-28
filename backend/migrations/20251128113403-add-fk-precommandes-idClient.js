'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('precommandes', {
      fields: ['idClient'],
      type: 'foreign key',
      name: 'fk_precommandes_idClient',
      references: {
        table: 'clients',
        field: 'idClient'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('precommandes', 'fk_precommandes_idClient');
  }
};
