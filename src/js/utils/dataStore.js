// Data store for managing application state
export class DataStore {
    constructor() {
        this.categories = [];
        this.currentCategory = null;
    }

    async loadCategories() {
        try {
            const response = await fetch('src/data/categories.json');
            this.categories = await response.json();
            return this.categories;
        } catch (error) {
            console.error('Error loading categories:', error);
            return [];
        }
    }

    async loadContent(path) {
        try {
            const response = await fetch(`src/content/${path}.md`);
            if (!response.ok) throw new Error('Content not found');
            const content = await response.text();
            return content;
        } catch (error) {
            console.error('Error loading content:', error);
            return '# Contenu non disponible\n\nCe contenu est en cours de rédaction.';
        }
    }

    getCategoryById(id) {
        return this.categories.find(cat => cat.id === id);
    }

    getAllCategories() {
        return this.categories;
    }
}
