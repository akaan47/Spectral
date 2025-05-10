const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('social', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

// 
module.exports = sequelize;
