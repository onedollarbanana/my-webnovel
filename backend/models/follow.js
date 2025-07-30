const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./user');
const Fiction = require('./fiction');

const Follow = sequelize.define('Follow', {});

User.hasMany(Follow, { foreignKey: 'userId' });
Follow.belongsTo(User, { foreignKey: 'userId' });
Fiction.hasMany(Follow, { foreignKey: 'fictionId' });
Follow.belongsTo(Fiction, { foreignKey: 'fictionId' });

module.exports = Follow;
