'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('etapeproductions', {
      fields: ['idProducteur'],
      type: 'foreign key',
      name: 'fk_etapeproductions_idProducteur_producteurs_idProducteur',
      references: {
        table: 'producteurs',
        field: 'idProducteur'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('etapeproductions', 'fk_etapeproductions_idProducteur_producteurs_idProducteur');
  }
};
