'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('entreprises', {
      fields: ['idEntreprise'],
      type: 'foreign key',
      name: 'fk_entreprises_idEntreprise_personnes_idPersonne',
      references: {
        table: 'personnes',
        field: 'idPersonne'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('entreprises', 'fk_entreprises_idEntreprise_personnes_idPersonne');
  }
};
