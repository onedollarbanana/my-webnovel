const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./user');
const Chapter = require('./chapter');

const Comment = sequelize.define('Comment', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

User.hasMany(Comment, { foreignKey: 'authorId' });
Comment.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
Chapter.hasMany(Comment, { foreignKey: 'chapterId' });
Comment.belongsTo(Chapter, { foreignKey: 'chapterId' });

module.exports = Comment;
