export default class Recipe {
    constructor(uri) {
        this.uri = uri;
    }

    async getRecipe() {
        const key = 'b11e84f67a0338222804549c411a9406';
        const id = '966b799c';
        try {
            const res = await fetch(`https://api.edamam.com/search?r=${this.uri}&app_id=${id}&app_key=${key}`)
            const resJson = await res.json();
            console.log(resJson[0]);

            this.title = resJson[0].label;
            this.author = resJson[0].source;
            this.img = resJson[0].image;
            this.url = resJson[0].url;
            this.ingredients = resJson[0].ingredientLines;
            this.servings = resJson[0].yield;

        } catch (error) {
            console.log(error);
            alert('Something went wrong :(');
        }
    }

    calcTime() {
        // Assuming that we need 15 mint for erarch 3 ingredients;
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }
}