import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResult = () => {
    elements.searchResList.innerHTML = '';
};

export const numberOfRecipes = 15;

const limitRecipeTitle = (label, limit = 18) => {
    const newLabel = [];
    if (label.length > limit) {
        label.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newLabel.push(cur);
            }
            return acc + cur.length;
        }, 0);
        //return result
        return `${newLabel.join(' ')}...`
    }
    return label
}

const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="${recipe.shareAs}">
            <figure class="results__fig">
                <img src="${recipe.image}" alt="${recipe.image}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.label)}</h4>
                <p class="results__author">${recipe.source}</p>
            </div>
        </a>
    </li>`;
    elements.searchResList.insertAdjacentHTML("beforeend", markup);
};

export const renderResults = recipes => {
    recipes.forEach(renderRecipe);
};