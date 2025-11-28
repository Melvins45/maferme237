"use strict";
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Etapeproductioncaracteristiques extends Model {
    static associate(models) {
      this.belongsTo(models.Etapeproductions, { foreignKey: 'idEtapeProduction' });
      // In models/etapeproductions.js consider: this.hasMany(models.Etapeproductioncaracteristiques, { foreignKey: 'idEtapeProduction' });
      this.belongsTo(models.Caracteristiques, { foreignKey: 'idCaracteristique' });
      // In models/caracteristiques.js consider: this.hasMany(models.Etapeproductioncaracteristiques, { foreignKey: 'idCaracteristique' });
    }
  }
  Etapeproductioncaracteristiques.init({
    valeurCaracteristique: {
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
    idEtapeProduction: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    idCaracteristique: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Etapeproductioncaracteristiques',
    tableName: 'etapeproductioncaracteristiques',
    timestamps: true
  });
  return Etapeproductioncaracteristiques;
};
