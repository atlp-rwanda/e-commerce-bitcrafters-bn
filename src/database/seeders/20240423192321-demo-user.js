'use strict'

const { CreatedAt, UpdatedAt } = require('sequelize-typescript')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        username: 'John',
        email: 'John@gmail.com',
        password: 'password1',
        createdAt: new Date(2000),
        updatedAt: new Date(2000),
      },
      {
        username: 'Karangwa',
        email: 'k@gmail.com',
        password: 'password2',
        createdAt: new Date(2000),
        updatedAt: new Date(2000),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  },
}
