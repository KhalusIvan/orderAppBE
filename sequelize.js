const { Sequelize } = require('sequelize')

const host = process.env.DB_HOST
const database = process.env.DB_NAME
const username = process.env.DB_USER
const password = process.env.DB_PASSWORD
const PORT = process.env.PORT || 8889

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL)
  : new Sequelize(database, username, password, {
      host: host,
      port: PORT,
      dialect: 'mysql',
    })

module.exports = sequelize
