'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('CategorieProduits', 'dateCreationCategorie', 'dateCreationCategorieProduit');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('CategorieProduits', 'dateCreationCategorieProduit', 'dateCreationCategorie');
  }
};
