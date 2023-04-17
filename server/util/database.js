require('dotenv').config()
const { CONNECTION_STRING } = process.env
console.log(CONNECTION_STRING)

const Sequelize = require('sequelize')

const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false
    }
  }
})

module.exports = {
  sequelize
}
