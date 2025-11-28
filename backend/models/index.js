"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
let config;

// Try to load config from config/config.json, fallback to config.js if present
try {
	config = require(path.join(__dirname, "..", "config", "config.json"))[env];
} catch (err) {
	try {
		config = require(path.join(__dirname, "..", "config", "config.js"))[env];
	} catch (err2) {
		// If no config file, fall back to environment variables
		config = {
			username: process.env.DB_USER || process.env.DB_USERNAME,
			password: process.env.DB_PASS || process.env.DB_PASSWORD,
			database: process.env.DB_NAME || process.env.DATABASE,
			host: process.env.DB_HOST || "127.0.0.1",
			dialect: process.env.DB_DIALECT || "mysql",
		};
	}
}

const db = {};

let sequelize;
if (config.use_env_variable) {
	sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
	sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
	.filter((file) => {
		return (
			file.indexOf(".") !== 0 && file !== basename && (file.slice(-3) === ".js" || file.slice(-3) === ".cjs")
		);
	})
	.forEach((file) => {
		const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
		db[model.name] = model;
	});

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

