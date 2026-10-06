const BASE_URL = "https://pokeapi.co/api/v2/";
const LOAD_AMOUNT = 24;


let offset = 0;
let allPokemon = [];


function init() {
    loadPokemon();
}


async function loadPokemon() {
    try {
        const pokemonList = await fetchPokemonList();
        await fetchPokemonDetails(pokemonList);
        offset = offset + LOAD_AMOUNT;
        renderPokemonList();
    } catch (error) {
        document.getElementById("statusMessage").innerHTML = getErrorTemplate();
    }
}


async function fetchPokemonList() {
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
        cards += getPokemonCardTemplate(allPokemon[i]);
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


function formatPokemonId(id) {
    if (id < 10) {
        return "#00" + id;
    } else if (id < 100) {
        return "#0" + id;
    }
    return "#" + id;
}