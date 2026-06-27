# Liste des Packages à Installer

Ce fichier répertorie tous les packages (dépendances et dépendances de développement) requis pour le projet **Transcendence**, répartis par zone du projet : **Racine (Root)**, **Backend (NestJS)**, et **Frontend (React + Vite)**.

> [!NOTE]
> Comme le projet contient déjà les fichiers `package.json` et `package-lock.json` dans chaque dossier, la méthode la plus rapide et recommandée pour tout installer est de vous rendre dans chaque dossier et d'exécuter la commande :
> ```bash
> npm install
> # ou pour une installation stricte et identique au lockfile :
> npm ci
> ```
> Cependant, si vous préférez installer les packages manuellement ou individuellement, vous trouverez ci-dessous les listes détaillées et les commandes correspondantes.

---

## Sommaire
1. [Racine du Projet (Root)](#1-racine-du-projet-root)
2. [Backend (NestJS)](#2-backend-nestjs)
3. [Frontend (React + Vite)](#3-frontend-react--vite)

---

## 1. Racine du Projet (Root)

Le projet dispose d'un fichier `package.json` à la racine pour certaines dépendances globales ou partagées.

### Commande d'installation rapide
```bash
npm install
```

### Dépendances de Production (Dependencies)
| Package | Version | Description |
| :--- | :--- | :--- |
| `@prisma/client` | `^7.8.0` | Client ORM Prisma pour interagir avec la base de données |
| `@prisma/adapter-pg` | `^7.8.0` | Adaptateur Prisma pour PostgreSQL |
| `pg` | `^8.20.0` | Client PostgreSQL pour Node.js |
| `socket.io-client` | `^4.8.3` | Client de communication en temps réel WebSockets |
| `lucide-react` | `^1.17.0` | Bibliothèque d'icônes vectorielles épurées |
| `shadcn` | `^4.10.0` | Outil CLI pour l'installation de composants UI |
| `class-variance-authority` | `^0.7.1` | Utilitaire pour créer des variantes CSS (classes Tailwind) |
| `clsx` | `^2.1.1` | Utilitaire pour construire conditionnellement des chaînes de classes CSS |
| `tailwind-merge` | `^3.6.0` | Fusionne les classes Tailwind CSS sans conflits |
| `tw-animate-css` | `^1.4.0` | Utilitaires d'animations pour Tailwind |

### Dépendances de Développement (DevDependencies)
| Package | Version | Description |
| :--- | :--- | :--- |
| `@types/pg` | `^8.20.0` | Définitions de types TypeScript pour le module `pg` |

---

## 2. Backend (NestJS)

Le backend est structuré autour du framework **NestJS** avec **Prisma** comme ORM et **PostgreSQL** comme base de données.

### Commande d'installation rapide
```bash
cd backend && npm install
```

### Dépendances de Production (Dependencies)
| Package | Version | Description / Rôle |
| :--- | :--- | :--- |
| `@nestjs/common` | `^11.1.24` | Décorateurs, helpers et composants fondamentaux de NestJS |
| `@nestjs/core` | `^11.0.1` | Noyau principal du framework NestJS |
| `@nestjs/platform-express` | `^11.0.1` | Adaptateur Express pour le serveur NestJS |
| `@nestjs/jwt` | `^11.0.2` | Module d'authentification par Jetons JWT (JSON Web Tokens) |
| `@nestjs/websockets` | `^11.1.24` | Module NestJS pour la gestion des WebSockets |
| `@nestjs/platform-socket.io` | `^11.1.24` | Adaptateur Socket.io pour les passerelles WebSockets NestJS |
| `socket.io` | `^4.8.3` | Serveur WebSockets pour la communication bidirectionnelle en temps réel |
| `socket.io-client` | `^4.8.3` | Client Socket.io pour des connexions inter-services en temps réel |
| `@prisma/client` | `^7.8.0` | Client de base de données généré par Prisma |
| `@prisma/adapter-pg` | `^7.8.0` | Adaptateur Prisma pour PostgreSQL |
| `pg` | `^8.11.0` | Pilote de connexion PostgreSQL |
| `class-validator` | `^0.15.1` | Validation de données (DTO) basée sur des décorateurs |
| `class-transformer` | `^0.5.1` | Sérialisation et transformation d'objets (JSON vers Classes) |
| `reflect-metadata` | `^0.2.2` | Polyfill requis par NestJS pour la réflexion de métadonnées |
| `rxjs` | `^7.8.1` | Bibliothèque de programmation réactive |

### Dépendances de Développement (DevDependencies)
| Package | Version | Description / Rôle |
| :--- | :--- | :--- |
| `@nestjs/cli` | `^11.0.0` | Interface en ligne de commande pour NestJS (build, start, generate) |
| `@nestjs/schematics` | `^11.0.0` | Schémas de génération de code pour NestJS CLI |
| `@nestjs/testing` | `^11.1.24` | Utilitaires de test unitaire et d'intégration pour NestJS |
| `typescript` | `^5.7.3` | Langage TypeScript |
| `ts-node` | `^10.9.2` | Exécuteur direct de TypeScript pour Node.js (sans pré-compilation) |
| `ts-loader` | `^9.5.2` | Chargeur TypeScript pour Webpack |
| `tsconfig-paths` | `^4.2.0` | Résolution des alias de chemin définis dans le `tsconfig.json` |
| `prisma` | `^7.8.0` | CLI de l'ORM Prisma (migrations, introspection, génération) |
| `jest` | `^30.0.0` | Framework de test JavaScript/TypeScript |
| `ts-jest` | `^29.2.5` | Préprocesseur Jest pour TypeScript |
| `supertest` | `^7.0.0` | Bibliothèque de test d'API HTTP |
| `@types/express` | `^5.0.0` | Types TypeScript pour Express |
| `@types/jest` | `^30.0.0` | Types TypeScript pour Jest |
| `@types/node` | `^24.0.0` | Types TypeScript pour l'environnement Node.js |
| `@types/pg` | `^8.11.0` | Types TypeScript pour PostgreSQL |
| `@types/supertest` | `^7.0.0` | Types TypeScript pour Supertest |
| `eslint` | `^9.18.0` | Linter pour analyser la qualité du code |
| `typescript-eslint` | `^8.20.0` | Outils ESLint pour TypeScript |
| `@eslint/js` | `^9.18.0` | Configurations recommandées ESLint pour JavaScript |
| `@eslint/eslintrc` | `^3.2.0` | Support de l'ancien format de configuration ESLint (eslintrc) |
| `eslint-config-prettier` | `^10.0.1` | Désactive les règles ESLint qui entrent en conflit avec Prettier |
| `eslint-plugin-prettier` | `^5.2.2` | Intègre Prettier en tant que règle ESLint |
| `prettier` | `^3.4.2` | Formateur de code automatique |
| `globals` | `^17.0.0` | Liste de variables globales pour l'environnement ESLint |
| `source-map-support` | `^0.5.21` | Active le support des source maps pour les traces de pile Node.js |

---

## 3. Frontend (React + Vite)

Le frontend est construit avec **React 19**, **Vite** comme outil de build, et **Tailwind CSS 4** pour le style.

### Commande d'installation rapide
```bash
cd frontend && npm install
```

### Dépendances de Production (Dependencies)
| Package | Version | Description / Rôle |
| :--- | :--- | :--- |
| `react` | `^19.2.4` | Bibliothèque UI React |
| `react-dom` | `^19.2.4` | Rendu DOM pour React |
| `react-router-dom` | `^7.14.0` | Gestionnaire de routage pour l'application React |
| `@fontsource-variable/geist` | `^5.2.9` | Police de caractères Geist (Geist Sans & Mono) |
| `socket.io-client` | `^4.8.3` | Client WebSockets pour communiquer en temps réel avec le backend |
| `socket.io` | `^4.8.3` | Serveur WebSockets local (parfois utilisé pour des tests locaux) |
| `radix-ui` | `^1.4.3` | Primitives de composants d'interface accessibles non stylisés |
| `shadcn` | `^4.10.0` | Outils d'aide pour les composants de design system |
| `sonner` | `^2.0.7` | Bibliothèque de notifications "toast" élégantes |
| `next-themes` | `^0.4.6` | Gestionnaire de thèmes (Sombre / Clair / Système) |
| `lucide-react` | `^1.17.0` | Icônes SVG pour React |
| `class-variance-authority` | `^0.7.1` | Utilitaire pour créer des variantes de styles |
| `clsx` | `^2.1.1` | Concaténation de classes CSS conditionnelles |
| `tailwind-merge` | `^3.6.0` | Fusion intelligente des classes Tailwind CSS |
| `tw-animate-css` | `^1.4.0` | Intégration d'animations CSS fluides |

### Dépendances de Développement (DevDependencies)
| Package | Version | Description / Rôle |
| :--- | :--- | :--- |
| `vite` | `^8.0.4` | Outil de build et serveur de développement ultra-rapide |
| `@vitejs/plugin-react` | `^6.0.1` | Plugin officiel Vite pour le support de React |
| `typescript` | `~6.0.2` | Langage TypeScript |
| `tailwindcss` | `^4.3.0` | Framework CSS utilitaire pour le styling rapide |
| `@tailwindcss/postcss` | `^4.3.0` | Plugin PostCSS officiel pour Tailwind CSS v4 |
| `postcss` | `^8.5.15` | Outil de transformation du CSS avec des plugins |
| `autoprefixer` | `^10.5.0` | Ajoute automatiquement les préfixes constructeurs aux règles CSS |
| `eslint` | `^9.39.4` | Linter pour identifier les problèmes de code |
| `eslint-plugin-react-hooks` | `^7.0.1` | Règles ESLint pour valider l'utilisation des React Hooks |
| `eslint-plugin-react-refresh` | `^0.5.2` | Plugin ESLint pour supporter le Fast Refresh de React dans Vite |
| `typescript-eslint` | `^8.58.0` | Intégration de TypeScript pour ESLint |
| `@eslint/js` | `^9.39.4` | Règles ESLint prédéfinies pour JavaScript |
| `globals` | `^17.4.0` | Définitions d'environnements pour ESLint (browser, node, etc.) |
| `@types/react` | `^19.2.14` | Déclarations de types TypeScript pour React |
| `@types/react-dom` | `^19.2.3` | Déclarations de types TypeScript pour React-DOM |
| `@types/node` | `^24.12.2` | Déclarations de types TypeScript pour Node.js |
