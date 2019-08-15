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
        await state.search.getResults(); //wait for result

        // 5. Render results on UT
        clearLoader();
        searchView.renderResults(state.search.result)
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
const convertUri = encodeURIComponent("http://www.edamam.com/ontologies/edamam.owl#recipe_a7d58871fda455844753aace394440ae")
const r = new Recipe(convertUri)
r.getRecipe();
console.log(r);