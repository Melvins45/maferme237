'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Personnes extends Model {
    static associate(models) {
    }
  }
  Personnes.init({
    idPersonne: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    prenomPersonne: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    emailPersonne: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    motDePassePersonne: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    telephonePersonne: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    dateCreationCompte: {
      type: DataTypes.DATE,
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
    modelName: 'Personnes',
    tableName: 'personnes',
    timestamps: true
  });
  return Personnes;
};
