// Main application entry point
import { Router } from './utils/router.js';
import { DataStore } from './utils/dataStore.js';
import { MarkdownParser, loadMarkdownLibrary } from './utils/markdown.js';
import { Navigation } from './components/Navigation.js';
import { HomePage } from './components/HomePage.js';
import { CategoryPage } from './components/CategoryPage.js';
import { SearchEngine } from './utils/searchEngine.js';
import { SearchBar } from './components/SearchBar.js';

class App {
    constructor() {
        this.router = new Router();
        this.dataStore = new DataStore();
        this.markdownParser = new MarkdownParser();
        this.navigation = null;
        this.homePage = null;
        this.categoryPage = null;
        this.searchEngine = null;
        this.searchBar = null;
        this.appElement = document.getElementById('app');
        this.initThemeToggle();
    }

    initThemeToggle() {
        // Load saved theme or default to jedi
        const savedTheme = localStorage.getItem('theme') || 'jedi';
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Setup theme toggle button
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'jedi' ? 'sith' : 'jedi';
                
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
            this.searchEngine = new SearchEngine(this.dataStore);
            this.searchBar = new SearchBar(this.searchEngine, this.router);
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
                const query = this.router.pendingSearchQuery;
                this.router.pendingSearchQuery = null;
                if (query) {
                    // Wait for async content render, then scroll to match
                    this._scrollToSearchMatch(query);
                } else {
                    window.scrollTo(0, 0);
                }
            };
            
            console.log('✅ Application initialisée avec succès !');
            
            // Build search index in background
            this.searchEngine.buildIndex();
            
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

    /**
     * Scroll to the first occurrence of search terms in the rendered page content.
     * Retries a few times to wait for async content to finish rendering.
     */
    _scrollToSearchMatch(query, attempt = 0) {
        const maxAttempts = 10;
        const contentEl = this.appElement.querySelector('.content-section');

        if (!contentEl && attempt < maxAttempts) {
            setTimeout(() => this._scrollToSearchMatch(query, attempt + 1), 150);
            return;
        }
        if (!contentEl) return;

        // Normalize query: strip accents, split into terms
        const terms = query
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .split(/\s+/)
            .filter(t => t.length >= 2);
        if (terms.length === 0) return;

        // Walk text nodes to find the first match, skipping nav elements
        const walker = document.createTreeWalker(contentEl, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                const parent = node.parentElement;
                if (parent && parent.closest('.sub-navigation, .breadcrumb, .page-navigation')) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        });
        let matchNode = null;
        let matchIndex = -1;
        let matchTerm = '';

        while (walker.nextNode()) {
            const nodeText = walker.currentNode.textContent
                .toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            for (const term of terms) {
                const idx = nodeText.indexOf(term);
                if (idx !== -1) {
                    matchNode = walker.currentNode;
                    matchIndex = idx;
                    matchTerm = term;
                    break;
                }
            }
            if (matchNode) break;
        }

        if (!matchNode) {
            window.scrollTo(0, 0);
            return;
        }

        // Wrap the matched text in a highlight <mark>
        const text = matchNode.textContent;
        const realIndex = text.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .indexOf(matchTerm);
        const before = text.slice(0, realIndex);
        const matched = text.slice(realIndex, realIndex + matchTerm.length);
        const after = text.slice(realIndex + matchTerm.length);

        const mark = document.createElement('mark');
        mark.className = 'search-highlight';
        mark.textContent = matched;

        const parent = matchNode.parentNode;
        const fragment = document.createDocumentFragment();
        if (before) fragment.appendChild(document.createTextNode(before));
        fragment.appendChild(mark);
        if (after) fragment.appendChild(document.createTextNode(after));
        parent.replaceChild(fragment, matchNode);

        // Scroll to the highlighted element
        mark.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Remove the highlight after a few seconds
        setTimeout(() => {
            mark.classList.add('search-highlight-fade');
            setTimeout(() => {
                // Replace mark with plain text
                const textNode = document.createTextNode(mark.textContent);
                mark.parentNode.replaceChild(textNode, mark);
            }, 1000);
        }, 2500);
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
