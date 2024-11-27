class Recipe {
    constructor(name, ingredients, instructions, image) {
        this.name = name;
        this.ingredients = ingredients; // Expecting an array
        this.instructions = instructions;
        this.image = image; // Store image URL
    }

    static getRecipesFromLocalStorage() {
        const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        return recipes.map(recipe => new Recipe(recipe.name, recipe.ingredients, recipe.instructions, recipe.image));
    }

    static saveRecipesToLocalStorage(recipes) {
        localStorage.setItem('recipes', JSON.stringify(recipes));
    }
}

const form = document.getElementById('recipeForm');
const recipeList = document.getElementById('recipeList');

// Function to display recipes
function displayRecipes() {
    const recipes = Recipe.getRecipesFromLocalStorage();
    recipeList.innerHTML = '';
    recipes.forEach((recipe, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${recipe.name}</strong>
            <p>Ingredients: ${recipe.ingredients.join(', ')}</p>
            <p>Instructions: ${recipe.instructions}</p>
            ${recipe.image ? `<img src="${recipe.image}" alt="${recipe.name}">` : ''}
            <button class="edit-btn" data-index="${index}">Edit</button>
            <button class="delete-btn" data-index="${index}">Delete</button>
        `;
        recipeList.appendChild(li);
    });
}

// Function to add a recipe
function addRecipe(event) {
    event.preventDefault();

    const name = document.getElementById('recipeName').value;
    const ingredients = document.getElementById('ingredients').value.split(',').map(item => item.trim());
    const instructions = document.getElementById('instructions').value;
    const imageFile = document.getElementById('recipeImage').files[0];

    // Convert the image file to a base64 string
    const reader = new FileReader();
    reader.onloadend = () => {
        const image = reader.result; // Base64 string of the image
        const recipes = Recipe.getRecipesFromLocalStorage();
        recipes.push(new Recipe(name, ingredients, instructions, image));
        Recipe.saveRecipesToLocalStorage(recipes);
        displayRecipes();
        form.reset();
    };
    
    if (imageFile) {
        reader.readAsDataURL(imageFile); // Read image file as a base64 URL
    } else {
        // If no image is selected, add the recipe without an image
        const recipes = Recipe.getRecipesFromLocalStorage();
        recipes.push(new Recipe(name, ingredients, instructions, ''));
        Recipe.saveRecipesToLocalStorage(recipes);
        displayRecipes();
        form.reset();
    }
}

// Function to edit a recipe
function editRecipe(index) {
    const recipes = Recipe.getRecipesFromLocalStorage();
    const recipe = recipes[index];

    document.getElementById('recipeName').value = recipe.name;
    document.getElementById('ingredients').value = recipe.ingredients.join(', ');
    document.getElementById('instructions').value = recipe.instructions;

    // Remove the recipe from local storage after editing
    recipes.splice(index, 1);
    Recipe.saveRecipesToLocalStorage(recipes);
    displayRecipes();
}

// Function to delete a recipe
function deleteRecipe(index) {
    const recipes = Recipe.getRecipesFromLocalStorage();
    recipes.splice(index, 1);
    Recipe.saveRecipesToLocalStorage(recipes);
    displayRecipes();
}

// Event listeners
form.addEventListener('submit', addRecipe);

recipeList.addEventListener('click', (event) => {
    const index = event.target.dataset.index;
    if (event.target.classList.contains('edit-btn')) {
        editRecipe(index);
    } else if (event.target.classList.contains('delete-btn')) {
        deleteRecipe(index);
    }
});

// Initial display of recipes
displayRecipes();
