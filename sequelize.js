const { Sequelize } = require('sequelize');
const { relations } = require('./models/relations');

const database = process.env.DB_NAME
const username = process.env.DB_USER
const password = process.env.DB_PASSWORD

const sequelize = new Sequelize(database, username, password, {
  host: "localhost",
  dialect: "mysql",
});

const modelDefiners = [
	require('./models/currency.model'),
	require('./models/customer.model'),
	require('./models/item.model'),
	require('./models/manufacturer.model'),
	require('./models/user.model'),
	require('./models/workspace.model'),
	require('./models/workspacesUsers.model'),
	require('./models/role.model'),
	require('./models/status.model'),
	require('./models/order.model'),
	require('./models/orderItems.model'),
];

for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

relations(sequelize);

module.exports = sequelize;