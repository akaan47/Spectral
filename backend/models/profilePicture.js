const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const profilePicture = sequelize.define('profilePicture', {
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profilePicture: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },
});

module.exports = profilePicture;
