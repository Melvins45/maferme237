'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('plannificationetapeproductions', {
      fields: ['idEtapeProduction'],
      type: 'foreign key',
      name: 'fk_plannificationetapeproductions_idEtapeProduction',
      references: {
        table: 'etapeproductions',
        field: 'idEtapeProduction'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('plannificationetapeproductions', {
      fields: ['idFournisseur'],
      type: 'foreign key',
      name: 'fk_plannificationetapeproductions_idFournisseur',
      references: {
        table: 'fournisseurs',
        field: 'idFournisseur'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addConstraint('plannificationetapeproductions', {
      fields: ['idProducteur'],
      type: 'foreign key',
      name: 'fk_plannificationetapeproductions_idProducteur',
      references: {
        table: 'producteurs',
        field: 'idProducteur'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('plannificationetapeproductions', 'fk_plannificationetapeproductions_idEtapeProduction');
    await queryInterface.removeConstraint('plannificationetapeproductions', 'fk_plannificationetapeproductions_idFournisseur');
    await queryInterface.removeConstraint('plannificationetapeproductions', 'fk_plannificationetapeproductions_idProducteur');
  }
};
