'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('personnes', {
      fields: ['emailPersonne'],
      type: 'unique',
      name: 'uq_personnes_emailPersonne'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('personnes', 'uq_personnes_emailPersonne');
  }
};
