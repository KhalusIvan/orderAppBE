"use strict";

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
      "Roles",
      [
        {
          name: "Адмін системи",
          admin: true,
          owner: false,
          seller: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Власник",
          admin: false,
          owner: true,
          seller: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Адміністратор",
          admin: false,
          owner: false,
          seller: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Продавець",
          admin: false,
          owner: false,
          seller: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Roles", null, {});
  },
};
