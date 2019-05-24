const UserModel = require('../models/UserModel');
const Sequelize = require('sequelize');

// set up le db
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    operatorsAliases: process.env.DB_OPERATORS_ALIASES,
    storage: process.env.DB_STORAGE
});

const User = UserModel(sequelize, Sequelize);

sequelize.sync({ force: true })
    .then(() => {
        console.log(`Database & tables created!`)
    });

module.exports = {
    User,
};
