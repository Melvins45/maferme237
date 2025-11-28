'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Entreprises extends Model {
    static associate(models) {
      this.belongsTo(models.Personnes, { foreignKey: 'idEntreprise' });
      // In models/personnes.js consider: this.hasMany(models.Entreprises, { foreignKey: 'idEntreprise' });
    }
  }
  Entreprises.init({
    idEntreprise: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    secteurActiviteEntreprise: {
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
    modelName: 'Entreprises',
    tableName: 'entreprises',
    timestamps: true
  });
  return Entreprises;
};
