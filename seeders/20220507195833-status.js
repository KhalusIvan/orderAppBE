'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      'Statuses',
      [
        {
          name: 'Оформлено',
          finish: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Відправлено',
          finish: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Доставлено',
          finish: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Забрано',
          finish: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Відмінено',
          finish: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Проведено',
          finish: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    )
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
}
