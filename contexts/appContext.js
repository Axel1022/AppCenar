const { Sequelize } = require("sequelize");
const config = require("./config");

const connection = new Sequelize(
  config.database,
  config.username,
  config.password,
  config.params
);

module.exports = connection;
