'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Administrateurs extends Model {
    static associate(models) {
      this.belongsTo(models.Personnes, { foreignKey: 'idAdministrateur' });
      // In models/personnes.js consider: this.hasMany(models.Administrateurs, { foreignKey: 'idAdministrateur' });
    }
  }
  Administrateurs.init({
    idAdministrateur: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    niveauAccesAdministrateur: {
      type: DataTypes.INTEGER,
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
    modelName: 'Administrateurs',
    tableName: 'administrateurs',
    timestamps: true
  });
  return Administrateurs;
};
