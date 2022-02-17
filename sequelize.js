const { Sequelize } = require('sequelize');
const { relations } = require('./model/relations');

const database = process.env.DB_NAME
const username = process.env.DB_USER
const password = process.env.DB_PASSWORD

const sequelize = new Sequelize(database, username, password, {
  host: "localhost",
  dialect: "mysql",
});

const modelDefiners = [
	require('./model/currency.model'),
	require('./model/customer.model'),
	require('./model/item.model'),
	require('./model/manufacturer.model'),
	require('./model/user.model'),
	require('./model/workspace.model'),
	require('./model/workspacesUsers.model'),
	require('./model/role.model'),
	require('./model/status.model'),
	require('./model/order.model'),
	require('./model/orderItems.model'),
];

for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

relations(sequelize);

module.exports = sequelize;