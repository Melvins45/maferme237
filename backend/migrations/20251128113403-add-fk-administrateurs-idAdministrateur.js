'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('administrateurs', {
      fields: ['idAdministrateur'],
      type: 'foreign key',
      name: 'fk_administrateurs_idAdministrateur_personnes_idPersonne',
      references: {
        table: 'personnes',
        field: 'idPersonne'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('administrateurs', 'fk_administrateurs_idAdministrateur_personnes_idPersonne');
  }
};
