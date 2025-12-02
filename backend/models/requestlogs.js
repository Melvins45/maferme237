'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RequestLogs extends Model {
    static associate(models) {
      // associations can be defined here
    }
  }
  RequestLogs.init({
    idRequeteLog: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    acteurId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    acteurType: {
      type: DataTypes.ENUM("Fournisseur", "Producteur", "Gestionnaire", "Administrateur", "Client", "Entreprise", "Livreur"),
      allowNull: false
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    endpoint: {
      type: DataTypes.STRING
    },
    payload: {
      type: DataTypes.TEXT
    },
    dateRequete: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'RequestLogs',
    tableName: 'requestlogs',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });
  return RequestLogs;
};
