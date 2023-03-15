import Notiflix from 'notiflix';

const FILTERED_FIELDS = 'name,capital,population,flags,languages';

function fetchCountries(searchQuery) {
  return fetch(
    `https://restcountries.com/v3.1/name/${searchQuery}?fields=${FILTERED_FIELDS}`
  ).then(response => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject({
      message: 'Oops, there is no country with that name',
    });
  });
}
export { fetchCountries };
