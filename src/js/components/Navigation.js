// Navigation component
export class Navigation {
    constructor(dataStore, router) {
        this.dataStore = dataStore;
        this.router = router;
        this.navElement = document.getElementById('mainNav');
        this.mobileToggle = document.getElementById('mobileMenuToggle');
        
        this.setupMobileMenu();
    }

    setupMobileMenu() {
        this.mobileToggle.addEventListener('click', () => {
            this.navElement.classList.toggle('active');
            this.mobileToggle.classList.toggle('active');
        });

        // Close menu when clicking a link
        this.navElement.addEventListener('click', (e) => {
            if (e.target.matches('.nav-link')) {
                this.navElement.classList.remove('active');
                this.mobileToggle.classList.remove('active');
            }
        });
    }

    render() {
        const categories = this.dataStore.getAllCategories();
        
        const homeLink = `
            <a href="/" class="nav-link" data-link>
                Accueil
            </a>
        `;

        const categoryLinks = categories.map(category => `
            <a href="/category/${category.id}" class="nav-link" data-link>
                ${category.icon} ${category.name}
            </a>
        `).join('');

        this.navElement.innerHTML = homeLink + categoryLinks;
        this.updateActiveLink();
    }

    updateActiveLink() {
        const links = this.navElement.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === window.location.hash.slice(1) || 
                (href === '/' && !window.location.hash)) {
                link.classList.add('active');
            }
        });
    }
}
