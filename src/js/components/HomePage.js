// Home page component
export class HomePage {
    constructor(dataStore) {
        this.dataStore = dataStore;
    }

    render() {
        const categories = this.dataStore.getAllCategories();
        
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
