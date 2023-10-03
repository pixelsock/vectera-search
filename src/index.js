import { search } from '../dist/searchApi.js';

// Initialize search functionality on #search-bar element
const searchBar = document.querySelector('#search-bar');
searchBar.addEventListener('input', () => {
  const query = searchBar.value;
  search(query)
    .then((results) => {
      // Display search results on the page
      console.log(results);
    })
    .catch((error) => {
      console.error(error);
    });
});