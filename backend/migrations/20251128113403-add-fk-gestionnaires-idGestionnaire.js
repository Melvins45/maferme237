'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('gestionnaires', {
      fields: ['idGestionnaire'],
      type: 'foreign key',
      name: 'fk_gestionnaires_idGestionnaire',
      references: {
        table: 'personnes',
        field: 'idPersonne'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('gestionnaires', 'fk_gestionnaires_idGestionnaire');
  }
};
