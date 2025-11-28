'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('caracteristiques', 'typeValeurCaracteristique', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
    await queryInterface.addColumn('caracteristiques', 'uniteValeurCaracteristique', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('caracteristiques', 'typeValeurCaracteristique');
    await queryInterface.removeColumn('caracteristiques', 'uniteValeurCaracteristique');
  }
};
