import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';
import Likes from './models/Likes';

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
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id));

        } catch (err) {
            alert('Error processing recipe!  index.js file');
        }
    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe))

/** --------------------- LIST CONTROLLER ------------------------ */

const controlList = () => {
    // create new list if there in none yet
    if (!state.list) state.list = new List();

    // add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })
}

//Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        //Delete from state
        state.list.deleteItem(id);
        //Delete from UI
        listView.deleteItem(id);
        //Handle the count update
    } else if (e.target.matches('.shopping__count--value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

/** --------------------- LIKE CONTROLLER ------------------------ */
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.uri;
    console.log('CurrnetID is: ' + currentID);
    //User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        //Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img,
        );
        //Toggle the like button
        likesView.toggleLikeBtn(true);

        //Add like to UI list
        likesView.renderLike(newLike);
        console.log(state.likes);
        //User HAS yet liked current recipe
    } else {
        //Remove like from the state
        state.likes.deleteLike(currentID);
        //Toggle the like button
        likesView.toggleLikeBtn(false);
        //Remove like from UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes())
}

//Restore liked recipies on page load
window.addEventListener('load', ()=>{
    state.likes = new Likes();

    //Restore likes
    state.likes.readStorage();

    //Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    //Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

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
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        //Like controller
        controlLike();
    }
});