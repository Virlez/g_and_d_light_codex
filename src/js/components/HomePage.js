// Home page component
export class HomePage {
    constructor(dataStore) {
        this.dataStore = dataStore;
    }

    render() {
        const categories = this.dataStore.getAllCategories();
        
        // Bouton créateur de fiche
        const characterSheetBtn = `
            <div class="character-sheet-access">
                <a href="https://virlez.github.io/g-d-light-character-sheet/" target="_blank" rel="noopener" class="character-sheet-btn">
                    <span class="character-sheet-icon" aria-hidden="true">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="3" width="18" height="18" rx="3" fill="#4a9eff"/>
                            <path d="M7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h6v2H7v-2z" fill="#fff"/>
                        </svg>
                    </span>
                    <span class="character-sheet-label">Créateur de fiche de personnage</span>
                </a>
            </div>
        `;

        return `
            <div class="home-hero">
                <h1 class="home-title">Codex G&D</h1>
                <h2 class="home-subtitle">Au Coeur de Star Wars</h2>
                <p class="home-description">
                    Bienvenue dans le codex de règles du système G&D - Au Coeur de Star Wars.
                    Ce système de jeu de rôle vous permet de vivre des aventures épiques
                    dans la galaxie lointaine, très lointaine...
                </p>
            </div>
            ${characterSheetBtn}
            <div class="grid grid-3">
                ${categories.map(category => `
                    <a href="/category/${category.id}" data-link class="card category-card">
                        <div class="card-icon">${category.icon}</div>
                        <h2 class="card-title">${category.name}</h2>
                        <p class="card-description">${category.description}</p>
                    </a>
                `).join('')}
            </div>
        `;
    }
}
