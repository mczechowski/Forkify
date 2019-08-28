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

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', ' teaspoons', 'teaspoon', 'ounces', 'ounce', 'cups', 'pounds'];
        const unitShort = ['tbsp', 'tbsp', 'tsp', 'tsp', 'oz', 'oz', 'cup', 'pound'];
        const units = [...unitShort, 'kg', 'g']
        const newIngredients = this.ingredients.map(el => {
            // uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unitsLong, units[i]);
            });

            //remove parenheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //parse ingredients int count, unit and ingredients
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIngredient;
            if (unitIndex > -1) {
                //there is a unit
                //Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval('4+1/2') --> 4.5
                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }
                objIngredient = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }

            } else if (parseInt(arrIng[0], 10)) {
                //there is NO unit, but 1st element is number
                objIngredient = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ') //take the entire array except 1st element and back(join) into string
                }
            } else if (unitIndex === -1) {
                //there is NO unit and NO number in 1st posiotion
                objIngredient = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIngredient;
        });
        this.ingredients = newIngredients;
    }

    updateServings(type) {
        //Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        //Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }


}