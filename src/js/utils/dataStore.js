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
            // Gérer les ancres dans le chemin (ex: systeme/index#ancre)
            let file = path;
            let anchor = null;
            if (path.includes('#')) {
                [file, anchor] = path.split('#');
            }
            const response = await fetch(`src/content/${file}.md`);
            if (!response.ok) throw new Error('Content not found');
            const content = await response.text();
            if (!anchor) return content;

            // Extraire la section correspondant à l'ancre
            // On cherche un titre markdown qui correspond à l'ancre (format github)
            // Ex: # 1 - Les valeurs des dés => ancre: 1---les-valeurs-des-dés
            const anchorRegex = new RegExp(`^#{1,6}\\s+.*${anchor.replace(/[-]/g, '[ -]')}.*$`, 'im');
            const lines = content.split('\n');
            let start = -1;
            let end = lines.length;
            // Trouver la ligne de début
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].toLowerCase().replace(/[^a-z0-9]+/g, '-') === anchor.toLowerCase()) {
                    start = i;
                    break;
                }
                // Alternative : chercher le titre qui contient l'ancre
                if (lines[i].toLowerCase().includes(anchor.replace(/-/g, ' '))) {
                    start = i;
                    break;
                }
            }
            if (start === -1) return '# Contenu non disponible\n\nSection non trouvée.';
            // Trouver la fin de la section (prochain titre de même niveau ou supérieur)
            const currentHeaderLevel = (lines[start].match(/^#+/) || [''])[0].length;
            for (let j = start + 1; j < lines.length; j++) {
                const match = lines[j].match(/^#+/);
                if (match && match[0].length <= currentHeaderLevel) {
                    end = j;
                    break;
                }
            }
            return lines.slice(start, end).join('\n');
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
