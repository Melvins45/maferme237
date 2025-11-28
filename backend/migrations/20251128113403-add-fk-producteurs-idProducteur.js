'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('producteurs', {
      fields: ['idProducteur'],
      type: 'foreign key',
      name: 'fk_producteurs_idProducteur',
      references: {
        table: 'personnes',
        field: 'idPersonne'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('producteurs', 'fk_producteurs_idProducteur');
  }
};
