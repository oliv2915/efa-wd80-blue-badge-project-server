const {DataTypes} = require("sequelize");
const db = require("../db");

const Recipe = db.define("recipe", {
    recipeName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cookingDirections: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    servings: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    prepTime: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ingredients: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    },
    draft: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
    
},);

module.exports = Recipe;