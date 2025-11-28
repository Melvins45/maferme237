'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('pointlivraisons', {
      fields: ['idEntreprise'],
      type: 'foreign key',
      name: 'fk_pointlivraisons_idEntreprise',
      references: {
        table: 'entreprises',
        field: 'idEntreprise'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('pointlivraisons', 'fk_pointlivraisons_idEntreprise');
  }
};
