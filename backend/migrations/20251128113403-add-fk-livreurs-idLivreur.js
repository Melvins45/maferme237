'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('livreurs', {
      fields: ['idLivreur'],
      type: 'foreign key',
      name: 'fk_livreurs_idLivreur',
      references: {
        table: 'personnes',
        field: 'idPersonne'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('livreurs', 'fk_livreurs_idLivreur');
  }
};
