import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';

//Global search
const state = {};

/** --------------------- SEARCH CONTROLLER ------------------------ */
const controlSearch = async () => {
    // 1. get the query from the view
    const query = searchView.getInput();
    console.log(query);

    if (query) {
        // 2. new search object and add to state
        state.search = new Search(query);

        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchRes);

        // 4. Search for recepies
        try {
            await state.search.getResults(); //wait for result

            // 5. Render results on UT
            clearLoader();
            searchView.renderResults(state.search.result)
        } catch (err) {
            alert('Something wrong with the search...')
            clearLoader();
        }
    }
}

//All EventListeners

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault(); //don't reload page
    controlSearch();
})

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline ')  //secet colsest element in current button class

    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResult();
    searchView.renderResults(state.search.result, goToPage);
})

/** --------------------- RECIPE CONTROLLER ------------------------ */
const controlRecipe = async () => {
    // Get ID from URL
    const uriHash = window.location.hash.replace('#', '');
    const id = encodeURIComponent(uriHash)
    console.log(id);

    if (id) {
        //Prepate UI for changers
        recipeView.clearRecipe();
        renderLoader(elements.recipe)

        //Highlight selcted search item
        if (state.search) searchView.highlightSelected(uriHash);

        //Create new recipe object
        state.recipe = new Recipe(id)

        try {
            //Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //Calculate time
            state.recipe.calcTime();

            //Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        } catch (err) {
            alert('Error processing recipe!  index.js file');
        }
    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        //decrease btn is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        //increase btn is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
});

window.l = new List();