// Search engine that indexes all pages and their markdown content
export class SearchEngine {
    constructor(dataStore) {
        this.dataStore = dataStore;
        this.index = []; // { title, path, categoryName, content }
        this.ready = false;
    }

    /**
     * Build the search index by crawling all categories and subpages,
     * loading their markdown content for full-text search.
     */
    async buildIndex() {
        const categories = this.dataStore.getAllCategories();
        const promises = [];

        for (const category of categories) {
            // Index the category index page
            promises.push(
                this._indexPage({
                    title: category.name,
                    path: `#/category/${category.id}`,
                    categoryName: category.name,
                    icon: category.icon,
                    contentPath: category.contentPath,
                })
            );

            // Index subpages recursively
            if (category.subPages) {
                this._collectPages(category.subPages, category, promises);
            }
        }

        await Promise.all(promises);
        this.ready = true;
        console.log(`🔍 Index de recherche construit: ${this.index.length} pages`);
    }

    _collectPages(subPages, category, promises) {
        for (const page of subPages) {
            promises.push(
                this._indexPage({
                    title: page.name,
                    path: `#/category/${category.id}/${page.id}`,
                    categoryName: category.name,
                    icon: page.icon || '📄',
                    contentPath: page.contentPath,
                })
            );

            if (page.subPages) {
                this._collectPages(page.subPages, category, promises);
            }
        }
    }

    async _indexPage(entry) {
        try {
            const content = await this.dataStore.loadContent(entry.contentPath);
            // Strip markdown syntax for cleaner search
            const plainText = content
                .replace(/#{1,6}\s+/g, '')
                .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
                .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                .replace(/[|`>-]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();

            this.index.push({
                title: entry.title,
                path: entry.path,
                categoryName: entry.categoryName,
                icon: entry.icon,
                content: plainText,
            });
        } catch (e) {
            // Page without content — still index by title
            this.index.push({
                title: entry.title,
                path: entry.path,
                categoryName: entry.categoryName,
                icon: entry.icon,
                content: '',
            });
        }
    }

    /**
     * Search the index for pages matching the query.
     * Returns results sorted by relevance (title match first, then content).
     */
    search(query) {
        if (!query || query.trim().length < 2) return [];

        const terms = query
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip accents
            .split(/\s+/)
            .filter(t => t.length >= 2);

        if (terms.length === 0) return [];

        const results = [];

        for (const entry of this.index) {
            const titleNorm = entry.title
                .toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const contentNorm = entry.content
                .toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

            let score = 0;
            let matched = true;

            for (const term of terms) {
                const inTitle = titleNorm.includes(term);
                const inContent = contentNorm.includes(term);

                if (!inTitle && !inContent) {
                    matched = false;
                    break;
                }

                if (inTitle) score += 10;
                if (inContent) score += 1;
            }

            if (matched && score > 0) {
                // Extract a snippet around the first match in content
                let snippet = '';
                if (entry.content) {
                    const idx = contentNorm.indexOf(terms[0]);
                    if (idx !== -1) {
                        const start = Math.max(0, idx - 40);
                        const end = Math.min(entry.content.length, idx + 80);
                        snippet = (start > 0 ? '...' : '') +
                                  entry.content.slice(start, end) +
                                  (end < entry.content.length ? '...' : '');
                    }
                }

                results.push({
                    title: entry.title,
                    path: entry.path,
                    categoryName: entry.categoryName,
                    icon: entry.icon,
                    snippet,
                    score,
                });
            }
        }

        // Sort by score descending
        results.sort((a, b) => b.score - a.score);
        return results.slice(0, 10);
    }
}
