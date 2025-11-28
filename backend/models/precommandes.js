'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Precommandes extends Model {
    static associate(models) {
      this.belongsTo(models.Clients, { foreignKey: 'idClient' });
      // In models/clients.js consider: this.hasMany(models.Precommandes, { foreignKey: 'idClient' });
      this.belongsTo(models.Entreprises, { foreignKey: 'idEntreprise' });
      // In models/entreprises.js consider: this.hasMany(models.Precommandes, { foreignKey: 'idEntreprise' });
      this.belongsTo(models.Gestionnaires, { foreignKey: 'idGestionnaire' });
      // In models/gestionnaires.js consider: this.hasMany(models.Precommandes, { foreignKey: 'idGestionnaire' });
    }
  }
  Precommandes.init({
    idPrecommande: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    datePrecommande: {
      type: DataTypes.DATE,
      allowNull: true
    },
    statutPrecommande: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    idClient: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idEntreprise: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idGestionnaire: {
      type: DataTypes.INTEGER,
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
    modelName: 'Precommandes',
    tableName: 'precommandes',
    timestamps: true
  });
  return Precommandes;
};
