'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.addColumn('Orders', 'firstName', Sequelize.STRING)
    queryInterface.addColumn('Orders', 'lastName', Sequelize.STRING)
    queryInterface.addColumn('Orders', 'middleName', Sequelize.STRING)
    queryInterface.addColumn('Orders', 'city', Sequelize.STRING)
    queryInterface.addColumn('Orders', 'postOffice', Sequelize.INTEGER)
    queryInterface.addColumn('Orders', 'telephone', Sequelize.STRING)
    queryInterface.addColumn('Orders', 'workspaceId', {
      allowNull: false,
      type: Sequelize.INTEGER,
      onDelete: 'RESTRICT',
      references: {
        model: 'Workspaces',
        key: 'id',
        as: 'workspaceId',
      },
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
}
