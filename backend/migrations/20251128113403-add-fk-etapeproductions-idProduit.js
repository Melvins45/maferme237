'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add foreign keys for the new join table `etapeproduits`
    await queryInterface.addConstraint('etapeproduits', {
      fields: ['idProduit'],
      type: 'foreign key',
      name: 'fk_etapeproduits_idProduit',
      references: {
        table: 'produits',
        field: 'idProduit'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('etapeproduits', {
      fields: ['idEtapeProduction'],
      type: 'foreign key',
      name: 'fk_etapeproduits_idEtapeProduction',
      references: {
        table: 'etapeproductions',
        field: 'idEtapeProduction'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('etapeproduits', 'fk_etapeproduits_idProduit');
    await queryInterface.removeConstraint('etapeproduits', 'fk_etapeproduits_idEtapeProduction');
  }
};
