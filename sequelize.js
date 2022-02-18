const { Sequelize } = require('sequelize');

const database = process.env.DB_NAME
const username = process.env.DB_USER
const password = process.env.DB_PASSWORD

const sequelize = new Sequelize(database, username, password, {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;