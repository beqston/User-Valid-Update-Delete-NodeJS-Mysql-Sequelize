const {DataTypes} = require('sequelize');
const sequelize = require('../utils/database');

const User = sequelize.define('users', {
    id: {
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    age:{
        type:DataTypes.DOUBLE,
        allowNull:false
    }
},
{
    timestamps:false
});

module.exports = User;