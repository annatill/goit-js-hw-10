import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';
import * as debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
inputEl.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

const ulEl = document.querySelector('.country-list');
ulEl.addEventListener('click', onClick);

const divEl = document.querySelector('.country-info');
divEl.addEventListener('click', onClickButton);
let data = null;

function onSearch() {
  divEl.innerHTML = '';
  ulEl.replaceChildren();
  const value = inputEl.value.trim();
  if (!value) {
    return;
  }
  fetchCountries(value)
    .then(countries => {
      data = countries;
      if (countries.length > 10) {
        return Notiflix.Notify.info(
          `Too many matches found. Please enter a more specific name`
        );
      }
      if (countries.length >= 2) {
        const liMarkup = countries.map(makeListItem).join('');
        ulEl.insertAdjacentHTML('beforeend', liMarkup);
      }
      if (countries.length === 1) {
        const countryMarkup = makeCountryMarkup(countries[0]);
        divEl.innerHTML = countryMarkup;
      }
    })

    .catch(error => {
      Notiflix.Notify.failure(error.message);
    });
}

function makeListItem(
  { flags: { svg: svgFlag }, name: { official: officialName } },
  index
) {
  return `<li class="country-item">
    <img class = "icon" src="${svgFlag}">
    <a href="#" data-index="${index}">${officialName}</a>
  </li>`;
}

function makeCountryMarkup(
  {
    flags: { svg: svgFlag },
    name: { official: officialName },
    capital,
    population,
    languages,
  },
  country
) {
  return `<div class="country-card">
  <button class="close-btn" type="button" data-action="close-button">Back</button>
    <img class="icon-card" src="${svgFlag}">
    <div class="country-card--info">
    ${
      officialName
        ? `<p><span class="card-info">Country: </span> ${officialName}</p>`
        : ''
    }
    ${
      capital ? `<p><span class="card-info">Capital: </span>${capital}</p>` : ''
    }
    ${
      population
        ? `<p><span class="card-info">Population: </span>${population}</p>`
        : ''
    }
    ${
      languages
        ? `<p><span class="card-info">Languages: </span>${Object.values(
            languages
          ).join(', ')}</p>`
        : ''
    }
    </div>
 </div>`;
}

function onClick(event) {
  event.preventDefault();
  if (!event.target.matches('a')) {
    return;
  }
  const index = event.target.dataset.index;
  const country = data[index];

  ulEl.replaceChildren();
  const countryMarkup = makeCountryMarkup(country);
  divEl.innerHTML = countryMarkup;
}

function onClickButton() {
  if (event.target.nodeName !== 'BUTTON') {
    return;
  }

  divEl.innerHTML = '';
  const liMarkup = data.map(makeListItem).join('');
  ulEl.insertAdjacentHTML('beforeend', liMarkup);
}
