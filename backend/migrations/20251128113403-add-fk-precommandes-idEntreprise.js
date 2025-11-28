'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('precommandes', {
      fields: ['idEntreprise'],
      type: 'foreign key',
      name: 'fk_precommandes_idEntreprise',
      references: {
        table: 'entreprises',
        field: 'idEntreprise'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('precommandes', 'fk_precommandes_idEntreprise');
  }
};
