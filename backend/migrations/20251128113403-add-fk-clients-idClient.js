'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('clients', {
      fields: ['idClient'],
      type: 'foreign key',
      name: 'fk_clients_idClient_personnes_idPersonne',
      references: {
        table: 'personnes',
        field: 'idPersonne'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('clients', 'fk_clients_idClient_personnes_idPersonne');
  }
};
