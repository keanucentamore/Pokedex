const BASE_URL = "https://pokeapi.co/api/v2/";
const LOAD_AMOUNT = 24;

const STAT_LABELS = {
    "hp": "HP",
    "attack": "Attack",
    "defense": "Defense",
    "special-attack": "Sp. Atk",
    "special-defense": "Sp. Def",
    "speed": "Speed"
};

const STAT_BAR_MAX = 160;

let allPokemon = [];
let displayedPokemon = [];
let currentIndex = 0;
let activeTab = "about";
let evolutionCache = {};


function init() {
    loadPokemon();
}


async function loadPokemon() {
    showLoading();
    try {
        const pokemonList = await fetchPokemonList();
        await fetchPokemonDetails(pokemonList);
        resetSearch();
        showAllPokemon();
    } catch (error) {
        document.getElementById("statusMessage").innerHTML = getErrorTemplate();
    }
    hideLoading();
}


function showLoading() {
    document.getElementById("statusMessage").innerHTML = "";
    document.getElementById("loadingScreen").classList.remove("d-none");
    document.getElementById("loadMoreButton").disabled = true;
}


function hideLoading() {
    document.getElementById("loadingScreen").classList.add("d-none");
    document.getElementById("loadMoreButton").disabled = false;
}


async function fetchPokemonList() {
    const offset = allPokemon.length;
    const data = await fetchJson(`${BASE_URL}pokemon?limit=${LOAD_AMOUNT}&offset=${offset}`);
    return data.results;
}


async function fetchPokemonDetails(pokemonList) {
    for (let i = 0; i < pokemonList.length; i++) {
        const data = await fetchJson(pokemonList[i].url);
        allPokemon.push(createPokemonObject(data));
    }
}


async function fetchJson(url) {
    const response = await fetch(url);
    return await response.json();
}


function createPokemonObject(data) {
    return {
        id: data.id,
        name: data.name,
        image: data.sprites.other["official-artwork"].front_default,
        types: data.types.map(entry => entry.type.name),
        height: data.height,
        weight: data.weight,
        abilities: data.abilities.map(entry => entry.ability.name),
        stats: data.stats.map(entry => createStatObject(entry)),
        speciesUrl: data.species.url
    };
}


function createStatObject(entry) {
    return {
        name: entry.stat.name,
        value: entry.base_stat
    };
}


function showAllPokemon() {
    displayedPokemon = allPokemon;
    renderPokemonList();
}


function handleSearchInput() {
    const searchText = document.getElementById("searchInput").value;
    document.getElementById("searchButton").disabled = searchText.length < 3;
    if (searchText.length < 3 && displayedPokemon !== allPokemon) {
        showAllPokemon();
    }
}


function searchPokemon() {
    const searchText = document.getElementById("searchInput").value.toLowerCase();
    displayedPokemon = allPokemon.filter(pokemon => pokemon.name.includes(searchText));
    renderPokemonList();
    if (displayedPokemon.length === 0) {
        document.getElementById("statusMessage").innerHTML = getNotFoundTemplate();
    }
}


function resetSearch() {
    document.getElementById("searchInput").value = "";
    document.getElementById("searchButton").disabled = true;
}


function renderPokemonList() {
    const cardList = document.getElementById("cardList");
    document.getElementById("statusMessage").innerHTML = "";
    let cards = "";
    for (let i = 0; i < displayedPokemon.length; i++) {
        cards += getPokemonCardTemplate(displayedPokemon[i], i);
    }
    cardList.innerHTML = cards;
}


function getTypeBadges(types) {
    let badges = "";
    for (let i = 0; i < types.length; i++) {
        badges += getTypeBadgeTemplate(types[i]);
    }
    return badges;
}


function openDialog(index) {
    currentIndex = index;
    const dialog = document.getElementById("pokemonDialog");
    dialog.innerHTML = getDialogTemplate(displayedPokemon[index]);
    renderActiveTab();
    document.body.classList.add("no-scroll");
    dialog.showModal();
}


function closeDialog() {
    document.getElementById("pokemonDialog").close();
}


function handleDialogClose() {
    document.body.classList.remove("no-scroll");
}


function showNextPokemon() {
    currentIndex = currentIndex + 1;
    if (currentIndex >= displayedPokemon.length) {
        currentIndex = 0;
    }
    updateDialogPokemon();
}


function showPreviousPokemon() {
    currentIndex = currentIndex - 1;
    if (currentIndex < 0) {
        currentIndex = displayedPokemon.length - 1;
    }
    updateDialogPokemon();
}


function updateDialogPokemon() {
    document.getElementById("dialogHero").innerHTML = getDialogHeroTemplate(displayedPokemon[currentIndex]);
    document.getElementById("dialogCounter").innerHTML = getCounterText();
    renderActiveTab();
}


function getCounterText() {
    return (currentIndex + 1) + " / " + displayedPokemon.length;
}


function showTab(tabName) {
    activeTab = tabName;
    renderActiveTab();
}


function renderActiveTab() {
    const pokemon = displayedPokemon[currentIndex];
    switch (activeTab) {
        case "about":
            showTabContent(getAboutTemplate(pokemon));
            break;
        case "stats":
            showTabContent(getStatsTemplate(pokemon));
            break;
        case "evolution":
            renderEvolutionTab(pokemon);
            break;
    }
    updateTabButtons();
}


function showTabContent(html) {
    document.getElementById("tabContent").innerHTML = html;
}


async function renderEvolutionTab(pokemon) {
    showTabContent(getTabMessageTemplate("Loading evolution…"));
    try {
        const stages = await getEvolution(pokemon);
        if (activeTab === "evolution" && displayedPokemon[currentIndex] === pokemon) {
            showTabContent(getEvolutionTemplate(stages));
        }
    } catch (error) {
        showTabContent(getTabMessageTemplate("Evolution could not be loaded."));
    }
}


async function getEvolution(pokemon) {
    if (evolutionCache[pokemon.name]) {
        return evolutionCache[pokemon.name];
    }
    const species = await fetchJson(pokemon.speciesUrl);
    const evolutionData = await fetchJson(species.evolution_chain.url);
    const stages = await createEvolutionStages(evolutionData.chain);
    evolutionCache[pokemon.name] = stages;
    saveEvolutionForAllStages(stages);
    return stages;
}


function saveEvolutionForAllStages(stages) {
    for (let i = 0; i < stages.length; i++) {
        evolutionCache[stages[i].name] = stages;
    }
}


async function createEvolutionStages(chain) {
    const names = getEvolutionNames(chain);
    const stages = [];
    for (let i = 0; i < names.length; i++) {
        const image = await getPokemonImage(names[i]);
        stages.push({ name: names[i], image: image });
    }
    return stages;
}


function getEvolutionNames(chain) {
    const links = [chain];
    const names = [];
    for (let i = 0; i < links.length; i++) {
        names.push(links[i].species.name);
        for (let j = 0; j < links[i].evolves_to.length; j++) {
            links.push(links[i].evolves_to[j]);
        }
    }
    return names;
}


async function getPokemonImage(name) {
    const index = allPokemon.findIndex(pokemon => pokemon.name === name);
    if (index !== -1) {
        return allPokemon[index].image;
    }
    try {
        const data = await fetchJson(`${BASE_URL}pokemon/${name}`);
        return data.sprites.other["official-artwork"].front_default;
    } catch (error) {
        return "./assets/icons/pokeball.svg";
    }
}


function getEvolutionItems(stages) {
    let items = "";
    for (let i = 0; i < stages.length; i++) {
        items += getEvolutionItemTemplate(stages[i]);
    }
    return items;
}


function updateTabButtons() {
    const tabButtons = document.querySelectorAll(".tab-button");
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove("tab-button-active");
    }
    document.getElementById(activeTab + "Tab").classList.add("tab-button-active");
}


function getStatRows(pokemon) {
    let rows = "";
    for (let i = 0; i < pokemon.stats.length; i++) {
        rows += getStatRowTemplate(pokemon.stats[i], pokemon.types[0]);
    }
    return rows;
}


function formatPokemonId(id) {
    if (id < 10) {
        return "#00" + id;
    } else if (id < 100) {
        return "#0" + id;
    }
    return "#" + id;
}
