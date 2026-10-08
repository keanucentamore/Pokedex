function getPokemonCardTemplate(pokemon, index) {
    return `
        <li>
            <button class="card type-${pokemon.types[0]}" data-id="card" aria-label="Show details of ${pokemon.name}"
                onclick="openDialog(${index})">
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


function getDialogTemplate(pokemon) {
    return `
        <div class="dialog-content" data-id="overlay-pokemon-name" onclick="event.stopPropagation()">
            <div class="dialog-top">
                <div class="dialog-dots" aria-hidden="true">
                    <div class="screen-dot"></div>
                    <div class="screen-dot"></div>
                </div>
                <button class="dialog-close-button" data-id="close-dialog-button" aria-label="Close details"
                    onclick="closeDialog()">X</button>
            </div>
            <div class="dialog-screen">
                <div class="dialog-hero type-${pokemon.types[0]}">
                    <div class="dialog-title-row">
                        <h2 class="dialog-name">${pokemon.name}</h2>
                        <span class="dialog-id">${formatPokemonId(pokemon.id)}</span>
                    </div>
                    <img class="dialog-image" data-id="dialog-image" src="${pokemon.image}" alt="${pokemon.name}">
                    <div class="card-types">${getTypeBadges(pokemon.types)}</div>
                </div>
            </div>
        </div>`;
}
