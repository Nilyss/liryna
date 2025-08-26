# WhatATool

Une application React moderne pour organiser et accéder à vos outils de développement et utilitaires du quotidien.

## 🎯 Description

**WhatATool** est une plateforme web qui centralise vos outils de développement et utilitaires personnels dans une interface moderne et intuitive. L'application est organisée en deux sections principales :

- **🧡 Web Développement** : Outils et ressources pour le développement web
- **💙 Utilitaires** : Applications utilitaires pour la gestion quotidienne

## ✨ Fonctionnalités

### Navigation Moderne
- **Design Mobile-First** avec navigation responsive
- **Menu hamburger** avec overlay pour mobile
- **Couleurs thématiques** par section (orange pour Web Dev, vert d'eau pour Utils)
- **Navigation contextuelle** avec sous-applications
- **Animations fluides** avec AOS (Animate On Scroll)

### Système d'Authentification
- Connexion et inscription sécurisées
- Gestion des sessions utilisateur
- Interface utilisateur personnalisée

### Architecture Modulaire
- **Sous-applications** intégrées dans chaque section
- **Gestion des courriers** (première sous-app dans Utils)
- Structure extensible pour ajouter facilement de nouvelles fonctionnalités

## 🚀 Technologies

### Frontend
- **React 18** avec hooks
- **TypeScript** pour la robustesse du code
- **Vite** pour le bundling et le développement rapide
- **React Router** pour la navigation
- **Sass/SCSS** pour les styles avancés

### Bibliothèques UI/UX
- **React Icons** pour les icônes
- **AOS (Animate On Scroll)** pour les animations
- Design system personnalisé avec variables CSS

### Styling
- **Architecture SCSS** modulaire
- **Variables thématiques** pour les couleurs
- **Mixins** pour les styles réutilisables
- **Design responsive** avec breakpoints définis

## 📁 Structure du Projet

```
src/
├── components/
│   ├── navBar/           # Navigation principale
│   ├── authForm/         # Formulaires d'authentification
│   └── footer/           # Pied de page
├── views/
│   ├── home/             # Page d'accueil
│   ├── authPage/         # Page d'authentification
│   ├── webDevelopment/   # Section Web Dev
│   ├── utils/            # Section Utilitaires
│   └── courriers/        # Sous-app Gestion des courriers
├── utils/
│   ├── styles/           # Variables, mixins SCSS globaux
│   ├── middleware/       # Middleware d'authentification
│   └── services/         # Services API
└── context/              # Contextes React (utilisateur, etc.)
```

## 🎨 Design System

### Couleurs
- **Web Dev** : Palette orange/corail (#ff6b47, #ff8a65)
- **Utils** : Palette vert d'eau (#26d0ce, #4dd0e1)
- **Neutrals** : Gris modernes pour les textes et backgrounds

### Typographie
- **Ubuntu** comme police principale
- Hiérarchie claire avec tailles responsives
- Contraste optimisé pour la lisibilité

### Animations
- Transitions fluides avec `cubic-bezier`
- Animations d'entrée avec AOS
- Micro-interactions sur les éléments interactifs

## 🛠️ Installation et Développement

### Prérequis
- Node.js (version 18+)
- npm ou yarn

### Installation
```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build
```

### Scripts Disponibles
- `npm run dev` : Serveur de développement avec HMR
- `npm run build` : Build optimisé pour la production  
- `npm run lint` : Linting du code avec ESLint
- `npm run preview` : Prévisualisation du build de production

## 🔧 Configuration

### Customisation des Couleurs
Les couleurs sont définies dans `src/utils/styles/variables.scss` :
```scss
// Section Web Dev
$webdevPrimary: #ff6b47;
$webdevSecondary: #ff8a65;

// Section Utils  
$utilsPrimary: #26d0ce;
$utilsSecondary: #4dd0e1;
```

---

**WhatATool** - Centralisez et organisez tous vos outils en un seul endroit ! 🛠️