const {DataTypes} = require("sequelize");
const db = require("../db");

const User = db.define("user", {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                args: true,
                msg: "Username is required"
            },
            min: {
                args: 4,
                msg: "Username must be a minimum of 4 characters long"
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                args: true,
                msg: "Email address is required"
            },
            isEmail: {
                args: true,
                msg: "Must provide a proper email address"
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "Password is required"
            },
            min: {
                args: 6,
                msg: "Password must be a minimum of 6 characters long"
            }
        }
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "First Name can not be empty"
            }
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "Last Name can not be empty"
            }
        }
    },
    profileImageJSON: {
        type: DataTypes.JSON
    },
    aboutMe: {
        type: DataTypes.TEXT
    }
    
},);

module.exports = User;