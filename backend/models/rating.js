const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./user');
const Fiction = require('./fiction');

const Rating = sequelize.define('Rating', {
  value: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 },
  },
});

User.hasMany(Rating, { foreignKey: 'userId' });
Rating.belongsTo(User, { foreignKey: 'userId' });
Fiction.hasMany(Rating, { foreignKey: 'fictionId' });
Rating.belongsTo(Fiction, { foreignKey: 'fictionId' });

module.exports = Rating;
