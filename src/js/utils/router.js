// Router for handling navigation
export class Router {
    constructor() {
        this.routes = [];
        this.currentRoute = null;
        this.onRouteChange = null;
    }

    register(path, handler) {
        this.routes.push({ path, handler });
    }

    matchRoute(currentPath) {
        for (const route of this.routes) {
            if (typeof route.path === 'string') {
                if (route.path === currentPath) {
                    return { handler: route.handler, params: null };
                }
            } else if (route.path instanceof RegExp) {
                const match = currentPath.match(route.path);
                if (match) {
                    return { handler: route.handler, params: match };
                }
            }
        }
        return null;
    }

    navigate(path) {
        const match = this.matchRoute(path);
        if (match) {
            this.currentRoute = path;
            window.history.pushState({}, '', `#${path}`);
            if (match.params) {
                match.handler(match.params);
            } else {
                match.handler();
            }
            if (this.onRouteChange) {
                this.onRouteChange(path);
            }
        }
    }

    handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        const match = this.matchRoute(hash);
        if (match) {
            this.currentRoute = hash;
            if (match.params) {
                match.handler(match.params);
            } else {
                match.handler();
            }
            if (this.onRouteChange) {
                this.onRouteChange(hash);
            }
        }
    }

    init() {
        // Handle initial route
        this.handleRoute();

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });

        // Handle link clicks
        document.addEventListener('click', (e) => {
            // Find the closest link with data-link attribute
            const link = e.target.closest('[data-link]');
            if (link) {
                e.preventDefault();
                const path = link.getAttribute('href').replace(/^#/, '');
                this.navigate(path);
            }
        });
    }
}
