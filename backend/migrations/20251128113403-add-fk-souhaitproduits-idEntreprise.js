'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('souhaitproduits', {
      fields: ['idEntreprise'],
      type: 'foreign key',
      name: 'fk_souhaitproduits_idEntreprise',
      references: {
        table: 'entreprises',
        field: 'idEntreprise'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('souhaitproduits', 'fk_souhaitproduits_idEntreprise');
  }
};
