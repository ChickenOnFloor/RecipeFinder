let backdrop = document.querySelector('.backdrop');
let infoData = document.querySelector('.info');
let recipePage = document.querySelector('.recipe-info');
const apiKey = NEXT_PUBLIC_API_KEY;
const recipeList = document.querySelector('.cards');
const search = document.querySelector('.search-bar');
let currentPage = 1;
const recipesPerPage = 40;
let searchQuery = '';
function fetchRecipes(page, query = '') {
    const offset = (page - 1) * recipesPerPage;
    const url = query
        ? `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=${recipesPerPage}&offset=${offset}&apiKey=${apiKey}`
        : `https://api.spoonacular.com/recipes/random?number=${recipesPerPage}&offset=${offset}&apiKey=${apiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayRecipes(data.results || data.recipes);
        })
        .catch(error => console.log('Error fetching recipes:', error));
}
function displayRecipes(recipes) {
    if (!recipes) return;

    recipeList.innerHTML = '';
    recipes.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('card');
        recipeDiv.setAttribute('data-id', recipe.id);
        const ingredients = recipe.extendedIngredients || [];
        const ingredientsJSON = JSON.stringify(ingredients);

        const imgUrl = recipe.image ? recipe.image : './assets/biryani.webp'; // Fallback for missing image

        recipeDiv.innerHTML = `
            <img src="${imgUrl}" alt="Recipe Image">
            <h1>${recipe.title}</h1>
            <div>
                <h3>Ready In: ${recipe.readyInMinutes} Mins</h3>
            </div>
            <button class="info-btn" data-recipe-id="${recipe.id}" 
                    data-recipe-title="${recipe.title}" 
                    data-recipe-image="${imgUrl}">
                    Show Recipe
            </button>
        `;

        recipeList.appendChild(recipeDiv);
    });
    addEventListenersToButtons();
}

function addEventListenersToButtons() {
    const buttons = document.querySelectorAll(".info-btn");
    buttons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const recipeId = btn.getAttribute("data-recipe-id");
            fetchRecipeDetails(recipeId);
        });
    });
}
function fetchRecipeDetails(recipeId) {
    const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(recipe => {
            console.log('Detailed recipe data:', recipe);
            showCook(
                recipe.image,
                recipe.title,
                recipe.instructions || 'No instructions available',
                recipe.extendedIngredients || []
            );
        })
        .catch(error => console.log('Error fetching recipe details:', error));
}
const showCook = (img, name, instruction, ingredients) => {
    const ingredientsList = ingredients.map(ingredient => `<li>${ingredient.name}</li>`).join('');

    infoData.innerHTML = `
        <div class="info1">
            <img src="${img}" alt="Recipe Image"/>
            <h1>${name}</h1>
            <h3>How To Cook</h3>
            <p>${instruction}</p>
        </div>
        <div class="info2">
            <h3>Ingredients</h3>
            <ul>${ingredientsList}</ul>
        </div>`;
        const viewportWidth = window.innerWidth;
        if (viewportWidth < 768) {
            recipePage.style.display="flex"
            backdrop.style.display = 'block';
            infoData.style.display = 'flex';
        }
        else{
            recipePage.style.display="flex"
            backdrop.style.display = 'block';
            infoData.style.display = 'grid';
        }
        
};
search.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    currentPage = 1;
    fetchRecipes(currentPage, searchQuery);
});
fetchRecipes(currentPage, searchQuery);
backdrop.addEventListener("click", () => {
    recipePage.style.display="none"
    backdrop.style.display = 'none';
    infoData.style.display = 'none';
})
