'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('caracteristiques', 'idFournisseur', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'fournisseurs',
        key: 'idFournisseur'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('caracteristiques', 'idProducteur', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'producteurs',
        key: 'idProducteur'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('caracteristiques', 'idGestionnaire', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'gestionnaires',
        key: 'idGestionnaire'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('caracteristiques', 'idFournisseur');
    await queryInterface.removeColumn('caracteristiques', 'idProducteur');
    await queryInterface.removeColumn('caracteristiques', 'idGestionnaire');
  }
};
