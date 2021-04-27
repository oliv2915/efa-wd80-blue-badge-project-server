const router = require("express").Router();
const {RecipeModel, UserModel} = require('../models');
const { UniqueConstraintError, ValidationError } = require("sequelize");
const {validateSession} = require("../middleware");
const { response } = require("express");

/*
    Add recipe (private)
*/
router.post("/add", validateSession, async (req, res) => {
    // get the validated user id
    const {id} = req.user;
    // get access to all the arugments that we could expect to get
    const {recipeName, recipeType, description, cookingDirections, servings, prepTime, ingredients, draft} = req.body.recipe;
    // check to see if we have the required fields
    if (!recipeName || !recipeType || !description || !cookingDirections || !servings || !prepTime || !ingredients) return res.status(400).json({message: "recipeName, recipeType, description, cookingDirections, servings, prepTime, and ingrendients are required"});
    // check to see if ingredients is an array
    if (!(ingredients instanceof Array)) return res.status(400).json({message: "ingredients must be an array of strings"});

    try {
        const recipeObj = {
            recipeName, recipeType, description, cookingDirections,
            servings, prepTime, ingredients, userId: id, draft
        }
        // add recipe
        const createdRecipe = await RecipeModel.create(recipeObj);

        return res.status(201).json({
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
                recipeImageURL: createdRecipe.recipeImageURL
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
/*
    Update recipe by id (private)
*/
router.put("/update/:id", validateSession, async (req, res) => {
    if (!req.params.id) return res.status(400).json({message: "Recipe ID is required"});
    // get access to all the arugments that we could expect to get
    const {recipeName, recipeType, description, cookingDirections, servings, prepTime, ingredients, draft} = req.body.recipe;
    if (!recipeName || !recipeType || !description || !cookingDirections || !servings || !prepTime || !ingredients) return res.status(400).json({message: "recipeName, recipeType, description, cookingDirections, servings, prepTime, and ingredients are required"});
    // check to see if the ingrendients is an array
    if (!(ingredients instanceof Array)) return res.status({message: "ingredients must be an array of strings"});
    // build a query obj
    const query = {
        where: {
            id: req.params.id,
            userId: req.user.id
        }
    };
    // try to update the recipe
    try {
        // find the recipe in the database
        const foundRecipe = await RecipeModel.findOne(query);
        // if we did not find a recipe, return a message
        if (!foundRecipe) return res.status(404).json({message: "No recipe found to update."});

        // compare the user supplied recipe data to the foundRecipe. If there is a different, update

        const recipeDataToUpdate = {
            recipeName: (recipeName === foundRecipe.recipeName) ? foundRecipe.recipeName : recipeName,
            recipeType: (recipeType === foundRecipe.recipeType) ? foundRecipe.recipeType : recipeType,
            description: (description === foundRecipe.description) ? foundRecipe.description : description,
            cookingDirections: (cookingDirections === foundRecipe.cookingDirections) ? foundRecipe.cookingDirections : cookingDirections,
            servings: (servings === foundRecipe.servings) ? foundRecipe.servings : servings,
            prepTime: (prepTime === foundRecipe.prepTime) ? foundRecipe.prepTime : prepTime,
            ingredients: (ingredients === foundRecipe.ingredients) ? foundRecipe.ingredients : ingredients,
            draft: (draft === foundRecipe.draft) ? foundRecipe.draft : draft
        };
        // update the recipe
        await RecipeModel.update(recipeDataToUpdate, query);
        // get the knewly updated recipe
        const recipe = await RecipeModel.findOne(query);
        // return the update recipe
        return res.status(201).json({
            message: "Recipe updated successfully",
            recipe: {
                id: recipe.id,
                recipeName: recipe.recipeName,
                recipeType: recipe.recipeType,
                description: recipe.description,
                cookingDirections: recipe.cookingDirections,
                servings: recipe.servings,
                prepTime: recipe.prepTime,
                ingredients: recipe.ingredients,
                draft: recipe.draft,
                createdAt: recipe.createdAt,
                updatedAt: recipe.updatedAt,
                recipeImageURL: recipe.recipeImageURL
            }
        });
    } catch (err) {
        if(err instanceof ValidationError) {
            return res.status(400).json({message: err.message})
        } else {
            return res.status(500).json({message: "Failed to update the recipe"});
        }
    }
});
/* 
    Get user recipes (private)
*/
router.get("/all", validateSession, async (req, res) => {
    try {
        const foundRecipes = await RecipeModel.findAll({
            where:{userId: req.user.id},
            include: UserModel,
            order: [["updatedAt", "DESC"]]
        });
        // for each recipe, return a clean copy that we can use
        const cleanRecipes = [];
        foundRecipes.forEach(recipe => {
            cleanRecipes.push({
                id: recipe.id,
                recipeName: recipe.recipeName,
                recipeType: recipe.recipeType,
                description: recipe.description,
                cookingDirections: recipe.cookingDirections,
                servings: recipe.servings,
                prepTime: recipe.prepTime,
                ingredients: recipe.ingredients,
                recipeImageURL: recipe.recipeImageURL,
                user: {
                    username: recipe.user.username
                }
            });
        });
        return res.status(200).json(cleanRecipes);
    } catch (err) {
        return res.status(500).json({message: "Can't get all recipes"});
    }
});
/*
    Get all published recipes (public)
*/
router.get("/published", async (req, res) => {
    try {
        // only search for recipes that are published draft = false, we also need the user.username
        const foundRecipes = await RecipeModel.findAll({
            where:{draft: false},
            include: UserModel,
            order: [["updatedAt", "DESC"]]
        });
        // for each recipe, return a clean copy that we can use
        const cleanRecipes = [];
        foundRecipes.forEach(recipe => {
            cleanRecipes.push({
                id: recipe.id,
                recipeName: recipe.recipeName,
                recipeType: recipe.recipeType,
                description: recipe.description,
                cookingDirections: recipe.cookingDirections,
                servings: recipe.servings,
                prepTime: recipe.prepTime,
                ingredients: recipe.ingredients,
                recipeImageURL: recipe.recipeImageURL,
                user: {
                    username: recipe.user.username
                }
            })
        })
        return res.status(200).json(cleanRecipes);
    } catch (err) {
        return res.status(500).json({message: "No published recipes found"});
    }
});

/*
Delete Recipe by ID 
*/

router.delete('/delete/:id', validateSession, async (req, res) => {
    const userId = req.user.id;
    const recipeId = req.params.id;
    console.log(req.params);
    if (!recipeId) return res.status(400).json({message: "Recipe ID is required"});

    try {
        const query = {
            where: {
                id: recipeId,
            userId: userId
            }
        };

        await RecipeModel.destroy(query);
        return res.status(200).json({message: "Recipe Removed"});
    } catch (err) {
        return res.status(500).json({message: "Issue deleting recipe"});
    }
});

module.exports = router;