/*
 ** Estado da aplicação (state)
 */

//tabelas de paises
let tabCountries = null;
//tabelas de favoritos
let tabFavorites = null;

//lista de todos os paises que vira por requisição http
let allCountries = [];
//lista dos paises favoritos que tbm se inicia vazio e vira por requisição http
let favoriteCountries = [];
//lista de paises
let countCountries = 0;
//lista de favoritos
let countFavorites = 0;
//total da população
let totalPopulationList = 0;
//total da população dos paises favoritos
let totalPopulationFavorites = 0;
//guardar o number format
let numberFormat = null;

//Segura que a aplicação só carrega após todos os elementos forem carregados
window.addEventListener('load', () => {
  //fazer o mapeamento do DOM
  tabCountries = document.querySelector('#tabCountries');
  tabFavorites = document.querySelector('#tabFavorites');
  countCountries = document.querySelector('#countCountries');
  countFavorites = document.querySelector('#countFavorites');
  totalPopulationList = document.querySelector('#totalPopulationList');

  // prettier-ignore
  totalPopulationFavorites 
    = document.querySelector('#totalPopulationFavorites');

  //formatação dos numeros
  numberFormat = Intl.NumberFormat('pt-BR');
  //invocação do fecth
  fetchCountries();
});

//invocando a lista de paises via async/await
async function fetchCountries() {
  const res = await fetch('https://restcountries.eu/rest/v2/all');
  const json = await res.json();
  allCountries = json.map((country) => {
    const { numericCode, translations, population, flag } = country;
    return {
      id: numericCode,
      name: translations.pt,
      population,
      formattedPopulation: formatNumber(population),
      flag,
    };
  });
  //irá escrever os dados na tela
  render();
}

//invoca as funções
function render() {
  renderCountryList();
  renderFavorites();
  renderSummary();
  handleCountryButtons();
}

//montando o html da lista
function renderCountryList() {
  let countriesHTML = '<div>';

  allCountries.forEach((country) => {
    const { name, flag, id, population, formattedPopulation } = country;

    const countryHTML = `
      <div class='country'>
        <div>
          <a id="${id}" class="waves-effect waves-light btn blue darken-3">+</a>
        </div>
        <div>
          <img src="${flag}" alt="${name}">
        </div>
        <div>
          <ul>
            <li>${name}</li>
            <li>${formattedPopulation}</li>
          </ul>
        </div>
      </div>  
    `;

    countriesHTML += countryHTML;
  });
  countriesHTML += '</div>';
  tabCountries.innerHTML = countriesHTML;
}
//Criar a lista de favoritos
function renderFavorites() {
  let favoritesHTML = '<div>';

  favoriteCountries.forEach((country) => {
    const { name, flag, id, population, formattedPopulation } = country;

    const favoriteCountryHTML = `
      <div class='country'>
        <div>
          <a id="${id}" class="waves-effect waves-light btn red darken-4">-</a>
        </div>
        <div>
          <img src="${flag}" alt="${name}">
        </div>
        <div>
          <ul>
            <li>${name}</li>
            <li>${formattedPopulation}</li>
          </ul>
        </div>
      </div>  
    `;

    favoritesHTML += favoriteCountryHTML;
  });

  favoritesHTML += '</div>';
  tabFavorites.innerHTML = favoritesHTML;
}

//Criando a soma da população e a quantidade de paises, tanto no total, quanto no favorito
function renderSummary() {
  countCountries.textContent = allCountries.length;
  countFavorites.textContent = favoriteCountries.length;

  const totalPopulation = allCountries.reduce((accumulator, current) => {
    return accumulator + current.population;
  }, 0);

  const totalFavorites = favoriteCountries.reduce((accumulator, current) => {
    return accumulator + current.population;
  }, 0);

  totalPopulationList.textContent = formatNumber(totalPopulation);
  totalPopulationFavorites.textContent = formatNumber(totalFavorites);
}
//Definindo a funcionalidade dos botões
function handleCountryButtons() {
  const countryButtons = Array.from(tabCountries.querySelectorAll('.btn'));
  const favoritesButtons = Array.from(tabFavorites.querySelectorAll('.btn'));

  countryButtons.forEach((button) => {
    button.addEventListener('click', () => addToFavorites(button.id));
  });
  favoritesButtons.forEach((button) => {
    button.addEventListener('click', () => removeFromFavorites(button.id));
  });
}
//função responsavel por adicionar o pais como favorito
function addToFavorites(id) {
  const countryToAdd = allCountries.find((country) => country.id === id);

  favoriteCountries = [...favoriteCountries, countryToAdd];
  //ordenando a lista dos favoritos
  favoriteCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  //remover o pais adicionado na lista dos favoritos da lista dos paises
  //ele faz a comparação dos id's, caso seja diferente, ele mantem o pais na lista, senão, remove
  allCountries = allCountries.filter((country) => country.id !== id);

  render();
}

//função responsável por remover o pais da lista dos favoritos
function removeFromFavorites(id) {
  //prettier-ignore
  const countryToRemove = favoriteCountries.find((country) => country.id === id);

  allCountries = [...allCountries, countryToRemove];
  //ordenando a lista dos favoritos
  allCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  //remover o pais adicionado na lista dos favoritos da lista dos paises
  //ele faz a comparação dos id's, caso seja diferente, ele mantem o pais na lista, senão, remove
  favoriteCountries = favoriteCountries.filter((country) => country.id !== id);

  render();
}
//Formando a população
function formatNumber(number) {
  return numberFormat.format(number);
}
