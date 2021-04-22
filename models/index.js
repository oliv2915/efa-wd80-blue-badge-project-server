const UserModel = require("./userModel");
const RecipeModel = require("./recipeModel");

/*
    Model Associations
*/
// 1:Many - User has many Receipes
UserModel.hasMany(RecipeModel, {foreignKey: {allowNull: false}});
RecipeModel.belongsTo(UserModel);


module.exports = {UserModel, RecipeModel};