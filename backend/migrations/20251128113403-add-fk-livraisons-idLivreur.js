'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('livraisons', {
      fields: ['idLivreur'],
      type: 'foreign key',
      name: 'fk_livraisons_idLivreur_livreurs_idLivreur',
      references: {
        table: 'livreurs',
        field: 'idLivreur'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('livraisons', 'fk_livraisons_idLivreur_livreurs_idLivreur');
  }
};
