'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('produitcaracteristiques', {
      fields: ['idCaracteristique'],
      type: 'foreign key',
      name: 'fk_produitcaracteristiques_idCaracteristique',
      references: {
        table: 'caracteristiques',
        field: 'idCaracteristique'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('produitcaracteristiques', 'fk_produitcaracteristiques_idCaracteristique');
  }
};
