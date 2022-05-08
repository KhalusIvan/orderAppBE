'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.addColumn('Orders', 'paymentId', {
      allowNull: false,
      type: Sequelize.INTEGER,
      onDelete: 'RESTRICT',
      references: {
        model: 'Payments',
        key: 'id',
        as: 'paymentId',
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
