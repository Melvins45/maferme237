'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Gestionnaires extends Model {
    static associate(models) {
      this.belongsTo(models.Personnes, { foreignKey: 'idGestionnaire' });
      // In models/personnes.js consider: this.hasMany(models.Gestionnaires, { foreignKey: 'idGestionnaire' });
    }
  }
  Gestionnaires.init({
    idGestionnaire: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    roleGestionnaire: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'personnes',
        key: 'idPersonne'
      }
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
    modelName: 'Gestionnaires',
    tableName: 'gestionnaires',
    timestamps: true
  });
  return Gestionnaires;
};
