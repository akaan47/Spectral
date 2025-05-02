const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('social', 'username', 'password', {
  host: 'HOST', 
  dialect: 'mysql',
});

module.exports = sequelize;
