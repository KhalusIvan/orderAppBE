function relations(sequelize) {
  const {
    manufacturer,
    currency,
    item,
    workspace,
    customer,
    user,
    workspace_user,
    role,
    status,
    order,
    order_item,
  } = sequelize.models;

  currency.hasMany(manufacturer);
  manufacturer.belongsTo(currency);

  item.belongsTo(manufacturer);
  manufacturer.hasMany(item);

  manufacturer.belongsTo(workspace);
  workspace.hasMany(manufacturer);

  customer.belongsTo(workspace);
  workspace.hasMany(customer);

  user.belongsTo(workspace);
  workspace.hasMany(user);

  user.belongsToMany(workspace, { through: workspace_user });
  workspace.belongsToMany(user, { through: workspace_user });

  workspace_user.belongsTo(role);
  role.hasMany(workspace_user);

  order.belongsTo(status);
  status.hasMany(order);

  order.belongsTo(user);
  user.hasMany(order);

  order.belongsTo(customer);
  customer.hasMany(order);

  order.belongsToMany(item, { through: order_item });
  item.belongsToMany(order, { through: order_item });
}

module.exports = { relations };
