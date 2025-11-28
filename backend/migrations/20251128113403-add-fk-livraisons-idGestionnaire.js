'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('livraisons', {
      fields: ['idGestionnaire'],
      type: 'foreign key',
      name: 'fk_livraisons_idGestionnaire_gestionnaires_idGestionnaire',
      references: {
        table: 'gestionnaires',
        field: 'idGestionnaire'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('livraisons', 'fk_livraisons_idGestionnaire_gestionnaires_idGestionnaire');
  }
};
