// Main application entry point
import { Router } from './utils/router.js';
import { DataStore } from './utils/dataStore.js';
import { MarkdownParser, loadMarkdownLibrary } from './utils/markdown.js';
import { Navigation } from './components/Navigation.js';
import { HomePage } from './components/HomePage.js';
import { CategoryPage } from './components/CategoryPage.js';

class App {
    constructor() {
        this.router = new Router();
        this.dataStore = new DataStore();
        this.markdownParser = new MarkdownParser();
        this.navigation = null;
        this.homePage = null;
        this.categoryPage = null;
        this.appElement = document.getElementById('app');
        this.initThemeToggle();
    }

    initThemeToggle() {
        // Load saved theme or default to dark
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Setup theme toggle button
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
            });
        }
    }

    async init() {
        console.log('🚀 Initialisation de l\'application...');
        
        try {
            // Load markdown library
            console.log('📚 Chargement de marked.js...');
            await loadMarkdownLibrary();
            console.log('✓ marked.js chargé');
            
            // Load categories data
            console.log('📂 Chargement des catégories...');
            await this.dataStore.loadCategories();
            console.log('✓ Catégories chargées:', this.dataStore.getAllCategories());
            
            // Initialize components
            console.log('🔧 Initialisation des composants...');
            this.navigation = new Navigation(this.dataStore, this.router);
            this.homePage = new HomePage(this.dataStore);
            this.categoryPage = new CategoryPage(this.dataStore, this.markdownParser);
            console.log('✓ Composants initialisés');
            
            // Setup routes
            console.log('🛣️ Configuration des routes...');
            this.setupRoutes();
            console.log('✓ Routes configurées');
            
            // Render navigation
            console.log('🧭 Rendu de la navigation...');
            this.navigation.render();
            console.log('✓ Navigation rendue');
            
            // Initialize router
            console.log('🔀 Initialisation du routeur...');
            this.router.init();
            console.log('✓ Routeur initialisé');
            
            // Update active link on route change
            this.router.onRouteChange = () => {
                this.navigation.updateActiveLink();
                window.scrollTo(0, 0);
            };
            
            console.log('✅ Application initialisée avec succès !');
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation:', error);
            this.appElement.innerHTML = `
                <div class="content-section">
                    <h1>Erreur d'initialisation</h1>
                    <p>Impossible de charger l'application.</p>
                    <p><strong>Erreur:</strong> ${error.message}</p>
                    <p>Consultez la console (F12) pour plus de détails.</p>
                </div>
            `;
        }
    }

    setupRoutes() {
        // Home route
        this.router.register('/', () => {
            this.appElement.innerHTML = this.homePage.render();
        });

        // Category with subpage route
        this.router.register(/^\/category\/([^\/]+)\/(.+)$/, async (match) => {
            const categoryId = match[1];
            const subPageId = match[2];
            const content = await this.categoryPage.render(categoryId, subPageId);
            this.appElement.innerHTML = content;
        });

        // Category route (without subpage)
        this.router.register(/^\/category\/(.+)$/, async (match) => {
            const categoryId = match[1];
            const content = await this.categoryPage.render(categoryId);
            this.appElement.innerHTML = content;
        });
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});
