function getPokemonCardTemplate(pokemon) {
    return `
        <li>
            <button class="card type-${pokemon.types[0]}" data-id="card" aria-label="Show details of ${pokemon.name}">
                <span class="card-header">
                    <span class="card-name">${pokemon.name}</span>
                    <span class="card-id">${formatPokemonId(pokemon.id)}</span>
                </span>
                <img class="card-image" data-id="card-image" src="${pokemon.image}" alt="${pokemon.name}">
                <span class="card-types">${getTypeBadges(pokemon.types)}</span>
            </button>
        </li>`;
}


function getTypeBadgeTemplate(type) {
    return `<span class="type-badge type-${type}">${type}</span>`;
}


function getErrorTemplate() {
    return `<p class="status-text">Pokémon could not be loaded. Please try again later.</p>`;
}