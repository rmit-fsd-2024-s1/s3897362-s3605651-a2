const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/config");

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.DIALECT,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models from your existing backend
db.product = require("../../backend/src/database/models/product")(
  sequelize,
  DataTypes
);

module.exports = db;
