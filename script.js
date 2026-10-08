const BASE_URL = "https://pokeapi.co/api/v2/";
const LOAD_AMOUNT = 24;

let allPokemon = [];
let currentIndex = 0;


function init() {
    loadPokemon();
}


async function loadPokemon() {
    showLoading();
    try {
        const pokemonList = await fetchPokemonList();
        await fetchPokemonDetails(pokemonList);
        renderPokemonList();
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
    const response = await fetch(`${BASE_URL}pokemon?limit=${LOAD_AMOUNT}&offset=${offset}`);
    const data = await response.json();
    return data.results;
}


async function fetchPokemonDetails(pokemonList) {
    for (let i = 0; i < pokemonList.length; i++) {
        const response = await fetch(pokemonList[i].url);
        const data = await response.json();
        allPokemon.push(createPokemonObject(data));
    }
}


function createPokemonObject(data) {
    return {
        id: data.id,
        name: data.name,
        image: data.sprites.other["official-artwork"].front_default,
        types: data.types.map(entry => entry.type.name)
    };
}


function renderPokemonList() {
    const cardList = document.getElementById("cardList");
    let cards = "";
    for (let i = 0; i < allPokemon.length; i++) {
        cards += getPokemonCardTemplate(allPokemon[i], i);
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
    dialog.innerHTML = getDialogTemplate(allPokemon[index]);
    document.body.classList.add("no-scroll");
    dialog.showModal();
}


function closeDialog() {
    document.getElementById("pokemonDialog").close();
}


function handleDialogClose() {
    document.body.classList.remove("no-scroll");
}


function formatPokemonId(id) {
    if (id < 10) {
        return "#00" + id;
    } else if (id < 100) {
        return "#0" + id;
    }
    return "#" + id;
}
