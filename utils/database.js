const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('new-test', 'root', 'beqston', {
    host:'localhost',
    dialect:'mysql'
});

module.exports = sequelize;