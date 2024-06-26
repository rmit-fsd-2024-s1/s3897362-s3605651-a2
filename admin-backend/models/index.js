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

// Import Reviews from existing backend
db.review = require("../../backend/src/database/models/review")(
  sequelize,
  DataTypes
);

// Import User from existing backend
db.user = require("../../backend/src/database/models/user")(
  sequelize,
  DataTypes
);

module.exports = db;
