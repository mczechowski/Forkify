//they do not have recipe IDs so I used the recipe.uri instead
// https://developer.edamam.com/edamam-docs-recipe-api
import { numberOfRecipes } from '../views/searchView';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        const key = 'b11e84f67a0338222804549c411a9406';
        const id = '966b799c';
        //const numberOfRecipes = 20;
        try {
            const res = await fetch(`https://api.edamam.com/search?q=${this.query}&app_id=${id}&app_key=${key}&to=${numberOfRecipes}`);
            const resJson = await res.json();
            const recipiess = resJson.hits;
            this.result = recipiess.map(element => { return element.recipe });

            console.log(this.result);
        } catch (error) {
            alert(error);
        }
    }
}
