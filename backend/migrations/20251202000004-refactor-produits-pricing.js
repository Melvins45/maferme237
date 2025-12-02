'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // This migration refactors the produits table pricing structure:
    // 1. Removes prixClientProduit and prixEntrepriseProduit columns
    // 2. Adds prixFournisseurClientProduit (supplier price for clients)
    // 3. Adds prixFournisseurEntrepriseProduit (supplier price for enterprises)
    // 4. Adds comissionClientProduit (commission for clients sales)
    // 5. Adds comissionEntrepriseProduit (commission for enterprise sales)

    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Remove old columns
      await queryInterface.removeColumn('produits', 'prixClientProduit', { transaction });
      await queryInterface.removeColumn('produits', 'prixEntrepriseProduit', { transaction });

      // Add new columns
      await queryInterface.addColumn('produits', 'prixFournisseurClientProduit', {
        type: Sequelize.INTEGER,
        allowNull: true
      }, { transaction });

      await queryInterface.addColumn('produits', 'prixFournisseurEntrepriseProduit', {
        type: Sequelize.INTEGER,
        allowNull: true
      }, { transaction });

      await queryInterface.addColumn('produits', 'comissionClientProduit', {
        type: Sequelize.INTEGER,
        allowNull: true
      }, { transaction });

      await queryInterface.addColumn('produits', 'comissionEntrepriseProduit', {
        type: Sequelize.INTEGER,
        allowNull: true
      }, { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Rollback: restore old columns and remove new ones
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Remove new columns
      await queryInterface.removeColumn('produits', 'prixFournisseurClientProduit', { transaction });
      await queryInterface.removeColumn('produits', 'prixFournisseurEntrepriseProduit', { transaction });
      await queryInterface.removeColumn('produits', 'comissionClientProduit', { transaction });
      await queryInterface.removeColumn('produits', 'comissionEntrepriseProduit', { transaction });

      // Restore old columns
      await queryInterface.addColumn('produits', 'prixClientProduit', {
        type: Sequelize.FLOAT,
        allowNull: true
      }, { transaction });

      await queryInterface.addColumn('produits', 'prixEntrepriseProduit', {
        type: Sequelize.FLOAT,
        allowNull: true
      }, { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
