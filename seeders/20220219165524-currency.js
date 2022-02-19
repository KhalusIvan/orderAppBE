'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
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
      "Currencies",
      [
        {
          name: "Гривня",
          code: "UAH",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Євро",
          code: "EUR",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Доллар",
          code: "USD",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
