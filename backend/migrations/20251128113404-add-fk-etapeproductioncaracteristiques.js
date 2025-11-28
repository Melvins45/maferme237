"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('etapeproductioncaracteristiques', {
      fields: ['idCaracteristique'],
      type: 'foreign key',
      name: 'fk_etapeproductioncaracteristiques_idCaracteristique',
      references: {
        table: 'caracteristiques',
        field: 'idCaracteristique'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('etapeproductioncaracteristiques', {
      fields: ['idEtapeProduction'],
      type: 'foreign key',
      name: 'fk_etapeproductioncaracteristiques_idEtapeProduction',
      references: {
        table: 'etapeproductions',
        field: 'idEtapeProduction'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('etapeproductioncaracteristiques', 'fk_etapeproductioncaracteristiques_idCaracteristique');
    await queryInterface.removeConstraint('etapeproductioncaracteristiques', 'fk_etapeproductioncaracteristiques_idEtapeProduction');
  }
};
