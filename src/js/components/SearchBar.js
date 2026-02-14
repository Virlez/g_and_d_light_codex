// Search bar component with dropdown results
export class SearchBar {
    constructor(searchEngine, router) {
        this.searchEngine = searchEngine;
        this.router = router;
        this.container = document.getElementById('searchBar');
        this.input = null;
        this.resultsPanel = null;
        this.debounceTimer = null;
        this.isOpen = false;

        if (this.container) {
            this.render();
            this.bindEvents();
        }
    }

    render() {
        this.container.innerHTML = `
            <div class="search-wrapper">
                <span class="search-icon" aria-hidden="true">🔍</span>
                <input
                    type="search"
                    class="search-input"
                    id="searchInput"
                    placeholder="Rechercher..."
                    autocomplete="off"
                    aria-label="Rechercher dans le codex"
                >
                <kbd class="search-shortcut" aria-hidden="true">Ctrl+K</kbd>
                <button class="search-close-btn" id="searchCloseBtn" aria-label="Fermer la recherche">&times;</button>
                <div class="search-results" id="searchResults" role="listbox" aria-label="Résultats de recherche"></div>
            </div>
        `;
        this.input = document.getElementById('searchInput');
        this.resultsPanel = document.getElementById('searchResults');
        this.wrapper = this.container.querySelector('.search-wrapper');
        this.closeBtn = document.getElementById('searchCloseBtn');
    }

    bindEvents() {
        // Input handler with debounce
        this.input.addEventListener('input', () => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => this.onSearch(), 200);
        });

        // Keyboard navigation
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.moveFocus(1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.moveFocus(-1);
            } else if (e.key === 'Enter') {
                const focused = this.resultsPanel.querySelector('.search-result-item.focused');
                if (focused) {
                    e.preventDefault();
                    const path = focused.dataset.path;
                    const query = this.input.value.trim();
                    this.close();
                    this.input.value = '';
                    this.input.blur();
                    this.router.pendingSearchQuery = query;
                    this.router.navigate(path.replace(/^#/, ''));
                }
            } else if (e.key === 'Escape') {
                this.close();
                this.input.blur();
            }
        });

        // Click on result
        this.resultsPanel.addEventListener('click', (e) => {
            const item = e.target.closest('.search-result-item');
            if (item) {
                e.preventDefault();
                e.stopPropagation(); // Prevent router's document click from triggering a second navigate
                const path = item.dataset.path;
                const query = this.input.value.trim();
                this.close();
                this.input.value = '';
                this.input.blur();
                // Store the query so the app can scroll to the match after render
                this.router.pendingSearchQuery = query;
                this.router.navigate(path.replace(/^#/, ''));
            }
        });

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.close();
            }
        });

        // Global keyboard shortcut Ctrl+K
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.input.focus();
                this.input.select();
            }
        });

        // Focus opens results if there's a query; also open mobile overlay
        this.input.addEventListener('focus', () => {
            if (this._isMobile()) {
                this.wrapper.classList.add('search-open');
            }
            if (this.input.value.trim().length >= 2) {
                this.onSearch();
            }
        });

        // Close button (mobile overlay)
        this.closeBtn.addEventListener('click', () => {
            this.close();
            this.input.blur();
        });
    }

    _isMobile() {
        return window.innerWidth <= 768;
    }

    onSearch() {
        const query = this.input.value.trim();
        if (query.length < 2) {
            this.close();
            return;
        }

        const results = this.searchEngine.search(query);
        this.showResults(results, query);
    }

    showResults(results, query) {
        if (results.length === 0) {
            this.resultsPanel.innerHTML = `
                <div class="search-no-results">
                    Aucun résultat pour « ${this.escapeHtml(query)} »
                </div>
            `;
        } else {
            this.resultsPanel.innerHTML = results.map((r, i) => `
                <a class="search-result-item ${i === 0 ? 'focused' : ''}"
                   data-path="${r.path}" role="option" href="${r.path}" data-link>
                    <div class="search-result-header">
                        <span class="search-result-icon">${r.icon}</span>
                        <span class="search-result-title">${this.highlight(r.title, query)}</span>
                    </div>
                    <div class="search-result-meta">
                        <span class="search-result-category">${r.categoryName}</span>
                        ${r.snippet ? `<span class="search-result-snippet">${this.highlight(r.snippet, query)}</span>` : ''}
                    </div>
                </a>
            `).join('');
        }

        this.resultsPanel.classList.add('open');
        this.isOpen = true;
    }

    close() {
        this.resultsPanel.classList.remove('open');
        this.wrapper.classList.remove('search-open');
        this.isOpen = false;
    }

    moveFocus(direction) {
        const items = [...this.resultsPanel.querySelectorAll('.search-result-item')];
        if (items.length === 0) return;

        const current = items.findIndex(el => el.classList.contains('focused'));
        items.forEach(el => el.classList.remove('focused'));

        let next = current + direction;
        if (next < 0) next = items.length - 1;
        if (next >= items.length) next = 0;

        items[next].classList.add('focused');
        items[next].scrollIntoView({ block: 'nearest' });
    }

    highlight(text, query) {
        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escaped})`, 'gi');
        return this.escapeHtml(text).replace(regex, '<mark>$1</mark>');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
