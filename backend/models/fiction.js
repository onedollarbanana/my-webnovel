const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./user');

const Fiction = sequelize.define('Fiction', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.TEXT,
  genre: DataTypes.STRING,
  coverImage: DataTypes.STRING,
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

User.hasMany(Fiction, { foreignKey: 'authorId' });
Fiction.belongsTo(User, { as: 'author', foreignKey: 'authorId' });

module.exports = Fiction;
