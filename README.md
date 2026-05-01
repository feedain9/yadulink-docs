# Yadulink Help Center

Documentation officielle de [Yadulink](https://yadulink.com), l'outil d'automatisation LinkedIn intelligent.

🌐 **Site en production** : [docs.yadulink.com](https://docs.yadulink.com)

## Stack technique

- [Docusaurus 3](https://docusaurus.io/) - Générateur de site statique
- [GitHub Pages](https://pages.github.com/) - Hébergement statique
- [GitHub Actions](https://github.com/features/actions) - CI/CD automatique

## Développement local

### Prérequis

- Node.js 18+
- npm 9+

### Installation

```bash
# Cloner le repo
git clone https://github.com/feedain9/yadulink-docs.git
cd yadulink-docs

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm start
```

Le site sera accessible sur `http://localhost:3000`

### Build

```bash
npm run build
```

Les fichiers statiques seront générés dans le dossier `build/`

## Structure du projet

```
yadulink-docs/
├── docs/                    # Articles de documentation (Markdown)
│   ├── index.md             # Page d'accueil
│   ├── pour-commencer/      # Guides de démarrage
│   ├── automatisations/     # Docs automatisations
│   ├── ia/                  # Docs IA
│   ├── fils-dactus/         # Docs fils d'actu
│   └── ...
├── src/
│   └── css/
│       └── custom.css       # Thème personnalisé (couleurs Yadulink)
├── static/
│   └── img/                 # Images et assets
├── docusaurus.config.js     # Configuration principale
├── sidebars.js              # Navigation sidebar
└── package.json
```

## Ajouter de la documentation

1. Créer un fichier `.md` dans le dossier `docs/` approprié
2. Ajouter le frontmatter YAML :

```markdown
---
sidebar_position: 1
title: Mon titre
---

# Mon article

Contenu...
```

3. Commit et push - le déploiement est automatique

## Déploiement et DNS

Le site est publié automatiquement par GitHub Actions vers GitHub Pages à chaque push sur `master`.

Configuration actuelle :

- Repository : `feedain9/yadulink-docs`
- Domaine GitHub Pages : `docs.yadulink.com`
- Fichier de domaine : `static/CNAME`
- Build publié : dossier `build/`

Pour que `docs.yadulink.com` pointe vers GitHub Pages :

1. Dans GitHub repo settings > Pages, configurer le custom domain
2. Ajouter un CNAME record DNS :
   ```
   docs.yadulink.com -> feedain9.github.io
   ```

## Internationalisation

Le site supporte le français (défaut) et l'anglais.

Pour traduire :

```bash
npm run write-translations -- --locale en
```

Puis éditer les fichiers dans `i18n/en/`

## Licence

© Yadulink - Tous droits réservés
