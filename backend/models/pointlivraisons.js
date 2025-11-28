'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Pointlivraisons extends Model {
    static associate(models) {
      this.belongsTo(models.Gestionnaires, { foreignKey: 'idGestionnaire' });
      // In models/gestionnaires.js consider: this.hasMany(models.Pointlivraisons, { foreignKey: 'idGestionnaire' });
      this.belongsTo(models.Entreprises, { foreignKey: 'idEntreprise' });
      // In models/entreprises.js consider: this.hasMany(models.Pointlivraisons, { foreignKey: 'idEntreprise' });
    }
  }
  Pointlivraisons.init({
    idPointLivraison: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    adressePointLivraison: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    idEntreprise: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    idGestionnaire: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Pointlivraisons',
    tableName: 'pointlivraisons',
    timestamps: true
  });
  return Pointlivraisons;
};
