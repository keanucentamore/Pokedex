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


function getNotFoundTemplate() {
    return `<p class="status-text" data-id="not-found">No match found.</p>`;
}


function getDialogTemplate(pokemon) {
    return `
        <div class="dialog-content" data-id="overlay-pokemon-name" onclick="event.stopPropagation()">
            ${getDialogTopTemplate()}
            <div class="dialog-screen">
                <div id="dialogHero">${getDialogHeroTemplate(pokemon)}</div>
                ${getDialogTabsTemplate()}
            </div>
            ${getDialogNavTemplate()}
        </div>`;
}


function getDialogNavTemplate() {
    return `
        <div class="dialog-nav">
            <button class="dialog-nav-button" data-id="prev-button" aria-label="Previous Pokémon"
                onclick="showPreviousPokemon()"><img src="./assets/icons/arrow-left.svg" alt=""></button>
            <span class="dialog-counter" id="dialogCounter">${getCounterText()}</span>
            <button class="dialog-nav-button" data-id="next-button" aria-label="Next Pokémon"
                onclick="showNextPokemon()"><img src="./assets/icons/arrow-right.svg" alt=""></button>
        </div>`;
}


function getDialogTopTemplate() {
    return `
        <div class="dialog-top">
            <div class="dialog-dots" aria-hidden="true">
                <div class="screen-dot"></div>
                <div class="screen-dot"></div>
            </div>
            <button class="dialog-close-button" data-id="close-dialog-button" aria-label="Close details"
                onclick="closeDialog()">X</button>
        </div>`;
}


function getDialogHeroTemplate(pokemon) {
    return `
        <div class="dialog-hero type-${pokemon.types[0]}">
            <div class="dialog-title-row">
                <h2 class="dialog-name">${pokemon.name}</h2>
                <span class="dialog-id">${formatPokemonId(pokemon.id)}</span>
            </div>
            <img class="dialog-image" data-id="dialog-image" src="${pokemon.image}" alt="${pokemon.name}">
            <div class="card-types">${getTypeBadges(pokemon.types)}</div>
        </div>`;
}


function getDialogTabsTemplate() {
    return `
        <div class="dialog-tabs">
            <button class="tab-button" id="aboutTab" aria-label="Show about" onclick="showTab('about')">About</button>
            <button class="tab-button" id="statsTab" aria-label="Show base stats" onclick="showTab('stats')">Stats</button>
            <button class="tab-button" id="evolutionTab" aria-label="Show evolution chain"
                onclick="showTab('evolution')">Evolution</button>
        </div>
        <div class="tab-content" id="tabContent"></div>`;
}


function getAboutTemplate(pokemon) {
    return `
        <table class="info-table">
            <tr><th>Height</th><td>${pokemon.height / 10} m</td></tr>
            <tr><th>Weight</th><td>${pokemon.weight / 10} kg</td></tr>
            <tr><th>Abilities</th><td class="about-abilities">${pokemon.abilities.join(", ")}</td></tr>
        </table>`;
}


function getStatsTemplate(pokemon) {
    return `<table class="info-table">${getStatRows(pokemon)}</table>`;
}


function getStatRowTemplate(stat, type) {
    return `
        <tr>
            <th>${STAT_LABELS[stat.name]}</th>
            <td class="stat-value">${stat.value}</td>
            <td class="stat-bar-cell">
                <div class="stat-bar">
                    <div class="stat-bar-fill type-${type}" style="width: ${stat.value / STAT_BAR_MAX * 100}%"></div>
                </div>
            </td>
        </tr>`;
}


function getTabMessageTemplate(text) {
    return `<p class="tab-message">${text}</p>`;
}


function getEvolutionTemplate(stages) {
    return `<ul class="evolution-list">${getEvolutionItems(stages)}</ul>`;
}


function getEvolutionItemTemplate(stage) {
    return `
        <li class="evolution-item">
            <img class="evolution-image" src="${stage.image}" alt="${stage.name}">
            <span class="evolution-name">${stage.name}</span>
        </li>`;
}
