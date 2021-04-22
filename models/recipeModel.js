const {DataTypes} = require("sequelize");
const db = require("../db");

const Recipe = db.define("recipe", {
    recipeName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "Recipe Name can not be empty"
            }
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "Recipe Description can not be empty"
            }
        }
    },
    cookingDirections: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "Cooking Directions can not be empty"
            }
        }
    },
    servings: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "Servings can not be empty"
            }
        }
    },
    prepTime: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "Prep Time can not be empty"
            }
        }
    },
    ingredients: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "Ingredients can not be empty"
            }
        }
    },
    draft: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
    
},);

module.exports = Recipe;