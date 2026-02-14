// Category page component
export class CategoryPage {
    constructor(dataStore, markdownParser) {
        this.dataStore = dataStore;
        this.markdownParser = markdownParser;
    }

    async render(categoryId, subPageId = null) {
        const category = this.dataStore.getCategoryById(categoryId);
        if (!category) {
            return `
                <div class="content-section">
                    <h1>Catégorie non trouvée</h1>
                    <p>La catégorie demandée n'existe pas.</p>
                    <a href="#/" class="btn btn-primary" data-link>Retour à l'accueil</a>
                </div>
            `;
        }

        // Déterminer le contenu à charger
        let contentPath = category.contentPath;
        let currentPage = category;
        let isSystemeSection = false;

        if (subPageId && category.subPages) {
            // Chercher dans les sous-pages de premier niveau
            const subPage = category.subPages.find(sp => sp.id === subPageId);
            if (subPage) {
                contentPath = subPage.contentPath;
                currentPage = subPage;
            } else {
                // Chercher dans les sous-pages de second niveau
                for (const firstLevel of category.subPages) {
                    if (firstLevel.subPages) {
                        const secondLevel = firstLevel.subPages.find(sp => sp.id === subPageId);
                        if (secondLevel) {
                            contentPath = secondLevel.contentPath;
                            currentPage = secondLevel;
                            break;
                        }
                    }
                }
            }
        }

        // Suppression du cas particulier SYSTÈME : chaque sous-page doit charger son propre fichier markdown via contentPath

        // Show loading state
        const appElement = document.getElementById('app');
        appElement.innerHTML = this.renderBreadcrumb(category, currentPage, subPageId) + `
            <div class="loading">
                <div class="spinner"></div>
            </div>
        `;

        // Load content
        try {
            const markdownContent = await this.dataStore.loadContent(contentPath);
            let htmlContent;

            if (window.marked) {
                htmlContent = window.marked.parse(markdownContent);
            } else {
                htmlContent = this.markdownParser.parse(markdownContent);
            }

            return this.renderBreadcrumb(category, currentPage, subPageId) + `
                <div class="content-section">
                    ${this.renderSubNav(category, subPageId)}
                    ${htmlContent}
                    ${this.renderNavigation(category, subPageId)}
                </div>
            `;
        } catch (error) {
            console.error('Erreur chargement contenu:', error);
            return this.renderBreadcrumb(category, currentPage, subPageId) + `
                <div class="content-section">
                    <h1>Erreur de chargement</h1>
                    <p>Impossible de charger le contenu de cette section.</p>
                    <a href="#/" class="btn btn-primary" data-link>Retour à l'accueil</a>
                </div>
            `;
        }
    }

    renderBreadcrumb(category, currentPage, subPageId) {
        let breadcrumb = `
            <div class="breadcrumb">
                <span class="breadcrumb-item">
                    <a href="#/" class="breadcrumb-link" data-link>Accueil</a>
                </span>
                <span class="breadcrumb-item">
                    <a href="#/category/${category.id}" class="breadcrumb-link" data-link>${category.name}</a>
                </span>
        `;

        if (subPageId && currentPage.id !== category.id) {
            breadcrumb += `
                <span class="breadcrumb-item">
                    <span class="breadcrumb-current">${currentPage.name}</span>
                </span>
            `;
        }

        breadcrumb += `</div>`;
        return breadcrumb;
    }

    renderSubNav(category, currentSubPageId) {
        if (!category.subPages || category.subPages.length === 0) {
            return '';
        }

        const subNavItems = category.subPages.map(subPage => {
            const isActive = currentSubPageId === subPage.id ? 'active' : '';
            const hasChildren = subPage.subPages && subPage.subPages.length > 0;
            
            let html = `
                <div class="sub-nav-item ${isActive}">
                    <a href="#/category/${category.id}/${subPage.id}" class="sub-nav-link" data-link>
                        <span class="sub-nav-icon">${subPage.icon || '📄'}</span>
                        <span class="sub-nav-name">${subPage.name}</span>
                    </a>
            `;

            if (hasChildren) {
                html += `<div class="sub-nav-children">`;
                subPage.subPages.forEach(child => {
                    const childActive = currentSubPageId === child.id ? 'active' : '';
                    html += `
                        <a href="#/category/${category.id}/${child.id}" class="sub-nav-child-link ${childActive}" data-link>
                            ${child.name}
                        </a>
                    `;
                });
                html += `</div>`;
            }

            html += `</div>`;
            return html;
        }).join('');

        return `
            <div class="sub-navigation">
                <h3>Navigation</h3>
                ${subNavItems}
            </div>
        `;
    }

    renderNavigation(category, currentSubPageId) {
        // Créer une liste plate de toutes les pages
        const allPages = this.flattenPages(category);
        
        // Trouver l'index de la page actuelle
        const currentIndex = allPages.findIndex(page => 
            currentSubPageId ? page.id === currentSubPageId : page.id === category.id
        );
        
        if (currentIndex === -1 || allPages.length <= 1) {
            return '';
        }

        const prevPage = currentIndex > 0 ? allPages[currentIndex - 1] : null;
        const nextPage = currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null;

        let html = '<div class="page-navigation">';

        if (prevPage) {
            const prevUrl = prevPage.id === category.id 
                ? `#/category/${category.id}` 
                : `#/category/${category.id}/${prevPage.id}`;
            html += `
                <a href="${prevUrl}" class="nav-button nav-prev" data-link>
                    <span class="nav-arrow">←</span>
                    <div class="nav-content">
                        <span class="nav-label">Précédent</span>
                        <span class="nav-title">${prevPage.name}</span>
                    </div>
                </a>
            `;
        } else {
            html += '<div class="nav-button-spacer"></div>';
        }

        if (nextPage) {
            const nextUrl = nextPage.id === category.id 
                ? `#/category/${category.id}` 
                : `#/category/${category.id}/${nextPage.id}`;
            html += `
                <a href="${nextUrl}" class="nav-button nav-next" data-link>
                    <div class="nav-content">
                        <span class="nav-label">Suivant</span>
                        <span class="nav-title">${nextPage.name}</span>
                    </div>
                    <span class="nav-arrow">→</span>
                </a>
            `;
        } else {
            html += '<div class="nav-button-spacer"></div>';
        }

        html += '</div>';
        return html;
    }

    flattenPages(category) {
        const pages = [{ id: category.id, name: category.name }];
        
        if (category.subPages) {
            category.subPages.forEach(subPage => {
                pages.push({ id: subPage.id, name: subPage.name });
                
                if (subPage.subPages) {
                    subPage.subPages.forEach(childPage => {
                        pages.push({ id: childPage.id, name: childPage.name });
                    });
                }
            });
        }
        
        return pages;
    }
}
