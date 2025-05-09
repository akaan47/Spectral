const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isadmin: {
    type: DataTypes.INTEGER,
    defaultValue: false,
  },
  isbanned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isbannedreason: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
}, {
  timestamps: true,
});

module.exports = User;
