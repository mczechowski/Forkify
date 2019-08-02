import Search from './models/Search'

//Global search
const state = {};

const controlSearch = async () => {
    // 1. get the query from the view
    const query = 'pizza'; 

    if (query) {
        // 2. new search object and add to state
        state.search = new Search(query);

        // 3. Prepare UI for results

        // 4. Search for recepies
        await state.search.getResults(); //wait for result

        // 5. Render results on UT
        console.log(state.search.result)
    }
}

document.querySelector('.search').addEventListener('submit', e => {
    e.preventDefault(); //don't reload page
    controlSearch();
})

