'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Clients extends Model {
    static associate(models) {
      this.belongsTo(models.Personnes, { foreignKey: 'idClient' });
      // In models/personnes.js consider: this.hasMany(models.Clients, { foreignKey: 'idClient' });
    }
  }
  Clients.init({
    idClient: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    adresseClient: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
  }, {
    sequelize,
    modelName: 'Clients',
    tableName: 'clients',
    timestamps: true
  });
  return Clients;
};
