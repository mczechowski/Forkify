import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
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

        //Create new recipe object
        state.recipe = new Recipe(id)

        try {
            //Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            //Calculate time
            state.recipe.calcTime();
            //Render recipe
            console.log(state.recipe);
        } catch (err) {
            alert('Error processing recipe!');
        }
    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));