const router = require("express").Router();
const {RecipeModel} = require('../models');
const { UniqueConstraintError, ValidationError } = require("sequelize");
const {validateSession} = require("../middleware");

/*
    Add recipe
*/
router.post("/add", validateSession, async(req, res) => {
    // get the validated user id
    const {id} = req.user;
    // get access to all the arugments that we could expect to get
    const {recipeName, recipeType, description, cookingDirections, servings, prepTime, ingredients, draft} = req.body.recipe;
    // check to see if we have the required fields
    if (!recipeName || !recipeType || !description || !cookingDirections || !servings || !prepTime || !ingredients) return res.status(400).json({message: "recipeName, recipeType, description, cookingDirections, servings, prepTime, and ingrendients are required"});
    // check to see if ingredients is an array
    if (!(ingredients instanceof Array)) return res.status(400).json({message: "ingredients must be an array of strings"});

    try {
        // add recipe
        const createdRecipe = await RecipeModel.create({
            recipeName, recipeType, description, cookingDirections,
            servings, prepTime, ingredients, userId: id
        });

        res.status(201).json({
            message: "Recipe Added Successfully",
            recipe: {
                id: createdRecipe.id,
                recipeName: createdRecipe.recipeName,
                recipeType: createdRecipe.recipeType,
                description: createdRecipe.description,
                cookingDirections: createdRecipe.cookingDirections,
                servings: createdRecipe.servings,
                prepTime: createdRecipe.prepTime,
                ingredients: createdRecipe.ingredients,
                draft: createdRecipe.draft,
                createdAt: createdRecipe.createdAt,
                recipeImageJSON: createdRecipe.recipeImageJSON
            }
        })
    } catch (err) {
        if(err instanceof ValidationError) {
            return res.status(400).json({message: err.message})
        } else {
            return res.status(500).json({message: "Failed to add recipe"});
        }
    }

});
module.exports = router;