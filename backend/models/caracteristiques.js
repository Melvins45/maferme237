'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Caracteristiques extends Model {
    static associate(models) {
    }
  }
  Caracteristiques.init({
    idCaracteristique: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nomCaracteristique: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    typeValeurCaracteristique: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    uniteValeurCaracteristique: {
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
    modelName: 'Caracteristiques',
    tableName: 'caracteristiques',
    timestamps: true
  });
  return Caracteristiques;
};
