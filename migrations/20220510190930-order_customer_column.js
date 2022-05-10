'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.addColumn('Orders', 'customerId', {
      allowNull: false,
      type: Sequelize.INTEGER,
      onDelete: 'RESTRICT',
      references: {
        model: 'Customers',
        key: 'id',
        as: 'customerId',
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
