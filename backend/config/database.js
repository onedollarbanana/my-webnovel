const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const dbUrl = process.env.DATABASE_URL || 'sqlite::memory:';
const dialect = dbUrl.startsWith('sqlite') ? 'sqlite' : 'postgres';

const sequelize = new Sequelize(dbUrl, {
  dialect,
  logging: false,
});

module.exports = { sequelize };
