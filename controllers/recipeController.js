const router = require("./userController");

const 

function createRecipe() {

    let newRecipe = {
        recipe: {
            recipeName,
            recipeType,
            description,
            cookingDirections,
            servings,
            prepTime,
            ingredients
        }
    }

    fetch(`http://localhost:4000/recipe/create`, {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionsToken}`
        }),
        body: JSON.stringify(newRecipe)
    })
    .then(response => response.json())
    .then(data => {
        // displayMyRecipes() function for displaying all of the user's recipe 
    })
    .catch(err => {
        console.error(err);
    })


}

module.exports = router