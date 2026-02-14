# G&D Codex - Au Coeur de Star Wars

Site web statique pour consulter les règles du système de jeu de rôle G&D - Au Coeur de Star Wars. C'est un système de jeu origellement créé par un utilisateur du nom de Caiain pour le MMORPG Star Wars The Old Republic

## 🚀 Lancement du site

⚠️ **Important** : Ce site utilise des modules ES6 et nécessite un serveur HTTP pour fonctionner correctement. Il ne peut pas être ouvert directement avec `file://`.

### Option 1 : PowerShell (Windows)

Utiliser le serveur HTTP PowerShell inclus :

```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
.\server.ps1
```

Puis ouvrir [http://localhost:8000](http://localhost:8000)

### Option 2 : Python

```bash
python -m http.server 8000
```

### Option 3 : Live Server (VS Code)

1. Installer l'extension "Live Server"
2. Clic droit sur `index.html` → "Open with Live Server"

### Option 4 : Node.js

```bash
npx http-server -p 8000
```

## 📁 Structure du projet

```
g_and_d_light_codex/
├── index.html              # Point d'entrée
├── server.ps1              # Serveur HTTP PowerShell
├── src/
│   ├── css/               # Styles
│   │   ├── variables.css  # Variables CSS (couleurs, espacements...)
│   │   ├── reset.css      # Reset CSS moderne
│   │   ├── layout.css     # Mise en page globale
│   │   ├── components.css # Composants UI
│   │   └── responsive.css # Media queries
│   ├── js/                # JavaScript (ES6 Modules)
│   │   ├── main.js        # Point d'entrée de l'application
│   │   ├── components/    # Composants UI
│   │   │   ├── Navigation.js    # Menu de navigation
│   │   │   ├── HomePage.js      # Page d'accueil
│   │   │   └── CategoryPage.js  # Page de catégorie avec sous-pages
│   │   └── utils/         # Utilitaires
│   │       ├── router.js      # Routeur client-side (Hash-based)
│   │       ├── dataStore.js   # Gestion des données JSON
│   │       └── markdown.js    # Parser Markdown (marked.js)
│   ├── data/              # Données JSON
│   │   └── categories.json    # Configuration des catégories
│   ├── content/           # Contenu Markdown
│   │   ├── systeme/           # Règles du système
│   │   ├── personnage/        # Création de personnage (13 pages)
│   │   │   ├── index.md
│   │   │   ├── creation.md
│   │   │   ├── scores-base.md
│   │   │   ├── races.md
│   │   │   ├── archetypes.md
│   │   │   ├── scores-ajoutes.md
│   │   │   ├── talents.md
│   │   │   ├── valeurs-derivees.md
│   │   │   ├── langues.md
│   │   │   ├── personnages-evolues.md
│   │   │   ├── arsenal.md
│   │   │   ├── protections.md
│   │   │   ├── armement.md
│   │   │   └── objets-soutien.md
│   │   ├── systeme/           # Système de jeu
│   │   │   ├── index.md
│   │   │   ├── valeurs-des-des.md
│   │   │   ├── entraide.md
│   │   │   ├── exploits-echecs.md
│   │   │   ├── caracteristiques.md
│   │   │   ├── combat.md
│   │   │   ├── styles-combat.md
│   │   │   └── degats-blessures-soins.md
│   │   └── mj/                # Guide du Maître de Jeu (5 pages)
│   │       ├── index.md
│   │       ├── difficulte-tests.md
│   │       ├── creation-pnj.md
│   │       ├── armements-annexes.md
│   │       ├── regles-optionnelles.md
│   │       └── guide-rencontres.md
│   └── assets/            # Images, icons, etc.
└── README.md
```

## ✨ Fonctionnalités

- ✅ **Design Star Wars** : Thème sombre avec accents bleu Jedi et orange Sith
- ✅ **Responsive** : Adapté mobile, tablette et desktop
- ✅ **Navigation fluide** : Routeur client-side sans rechargement de page
- ✅ **Navigation hiérarchique** : Support des catégories avec sous-pages à plusieurs niveaux
- ✅ **Navigation séquentielle** : Boutons Précédent/Suivant pour parcourir les pages
- ✅ **Fil d'Ariane** : Breadcrumb pour se repérer dans la hiérarchie
- ✅ **Contenu Markdown** : Rédaction facile du contenu avec formatage riche
## 📝 Ajouter du contenu

### Ajouter une nouvelle catégorie

#### 1. Créer le fichier de contenu

Créer un nouveau fichier Markdown dans `src/content/` :

```
src/content/nouvelle-categorie/index.md
```

#### 2. Ajouter la catégorie dans les données

Éditer `src/data/categories.json` :

```json
{
    "id": "nouvelle-categorie",
    "name": "Nouvelle Catégorie",
    "icon": "🎯",
    "description": "Description de la catégorie",
    "contentPath": "nouvelle-categorie/index",
    "order": 4
}
```

### Ajouter des sous-pages

Pour créer une hiérarchie de pages (comme pour "Le Personnage") :

```json
{
    "id": "personnage",
    "name": "Le Personnage",
    "icon": "👤",
    "description": "Guide de création de personnage",
    "contentPath": "personnage/index",
    "order": 2,
    "subPages": [
        {
            "id": "creation",
            "name": "Création du personnage",
            "subPages": [
                {
                    "id": "scores-base",
## 🔧 Technologies utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Variables CSS, Grid, Flexbox, animations
- **JavaScript Vanilla (ES6+)** : Modules natifs, Classes, Async/Await
- **Marked.js** : Rendu Markdown vers HTML (CDN)
- **PowerShell** : Serveur HTTP intégré pour développement local
- **Hash Routing** : Navigation côté client sans serveur backend
            ]
        }
    ]
}
```

Créer les fichiers Markdown correspondants :
- `src/content/personnage/scores-base.md`
- `src/content/personnage/races.md`

### Résultat

- La catégorie apparaît automatiquement sur la page d'accueil
- La navigation hiérarchique se génère automatiquement
- Les boutons Précédent/Suivant permettent de parcourir toutes les pages dans l'ordre

### 3. Résultat

La nouvelle catégorie apparaîtra automatiquement dans la navigation et sur la page d'accueil !

## 🎨 Personnalisation du thème

Modifier les variables CSS dans `src/css/variables.css` :

```css
:root {
    --color-blue-jedi: #4a9eff;    /* Couleur principale */
    --color-orange-sith: #ff6b35;   /* Couleur accent */
    --color-space-dark: #0a0e27;    /* Fond principal */
    /* ... */
}
```

## 🔧 Technologies utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Variables CSS, Grid, Flexbox
- **JavaScript ES6+** : Modules, Classes, Async/Await
- **Markdown** : Format de contenu (via marked.js)

## 📦 Déploiement

### GitHub Pages

1. Pousser le code sur GitHub
2. Aller dans Settings → Pages
3. Sélectionner la branche `main` et dossier `/` (root)
4. Le site sera accessible à `https://[username].github.io/g_and_d_light_codex`

### Netlify / Vercel

1. Connecter le dépôt GitHub
2. Configuration de build : aucune (site statique)
3. Dossier de publication : `/` (root)
4. Déploiement automatique à chaque commit

## 📄 Licence

Ce projet est un système de jeu fanmade basé sur l'univers Star Wars.

## 🤝 Contribution

Pour contribuer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

---

**Que la Force soit avec vous !** ⚔️
