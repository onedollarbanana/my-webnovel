const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Fiction = require('./fiction');
const User = require('./user');

const Chapter = sequelize.define('Chapter', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: DataTypes.TEXT,
});

Fiction.hasMany(Chapter, { foreignKey: 'fictionId' });
Chapter.belongsTo(Fiction, { foreignKey: 'fictionId' });

User.hasMany(Chapter, { foreignKey: 'authorId' });
Chapter.belongsTo(User, { as: 'author', foreignKey: 'authorId' });

module.exports = Chapter;
