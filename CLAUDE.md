# Règles de développement - What a tool

## Règles TypeScript/TSX
- **Aucun `any` dans le code** - Toujours typer explicitement
- **Chaque fichier TSX doit avoir un ID unique** basé sur le nom du fichier
  - Exemple: `Courrier.tsx` → `<main id="courrier">`
  - Exemple: `Footer.tsx` → `<footer id="footer">`

## Règles SCSS
- **Chaque fichier TSX doit être encapsulé avec un fichier .scss**
- **Maximum 3 niveaux de nesting en SCSS**
- **Le SCSS doit toujours utiliser l'ID de son fichier TSX** pour éviter la propagation
  - Exemple: `courrier.scss` → `#courrier { ... }`
  - Exemple: `footer.scss` → `#footer { ... }`
- **Aucun `@import`** - Uniquement `@use` (import est déprécié)
- **Aucun CSS Grid** - Uniquement Flexbox
- **Éviter margin-top/bottom/left/right** - Privilégier `gap` sur les containers
- **Approche Mobile First** - Développer pour smartphone d'abord
  - Responsive = tablette et desktop (min-width breakpoints)
- **Dimensions** :
  - **Blocks/layouts** : Privilégier `em` au lieu de `px` 
  - **Bordures et radius** : Toujours utiliser `px` (border, border-radius, etc.)
- **Utiliser dvh/dvw** au lieu de vh/vw (plus moderne)
- **Footer invisible par défaut** - Apparaît uniquement au scroll
  - Header + SubNav (si existe) + Main = 100dvh minimum
  - Footer poussé en bas, visible seulement au scroll

## Approche Mobile First
- **Développement principal**: Smartphone (375px base)
- **Responsive**: Tablette (`@media (min-width: $tabletWidth)`) et Desktop (`@media (min-width: $desktopWidth)`)
- **Layout**: Flexbox uniquement, pas de Grid
- **Espacements**: `gap` sur containers, éviter margins directionnelles

## Colorimétrie par section
- **Section Web Dev**: Colorimétrie orange (utiliser les variables `$webdev*`)
  - `$webdevPrimary`, `$webdevSecondary`, `$webdevGradient`, etc.
- **Section Utils**: Colorimétrie vert d'eau (utiliser les variables `$utils*`)
  - `$utilsPrimary`, `$utilsSecondary`, `$utilsGradient`, etc.

## Structure des fichiers
```
components/
├── componentName/
│   ├── ComponentName.tsx (avec id="componentName")
│   └── componentName.scss (avec #componentName { @use })
```

## Variables SCSS à utiliser
- Couleurs: Toujours utiliser les variables définies dans `variables.scss`
- Responsive: Utiliser `$mobileWidth`, `$tabletWidth`, `$desktopWidth`, etc.
- Animations: Utiliser `$transitionFast`, `$transitionMedium`, etc.

## Architecture API et État
- **Pattern API**: Modèle → Service → Contexte → Provider → Composant
- **Types TypeScript**: Interfaces strictes, aucun `any` autorisé
- **Gestion d'erreur**: Try/catch dans services, propagation vers composants avec type guards
- **État global**: Contextes React pour User et Courrier
- **API Calls**: Axios avec interceptors JWT automatiques
- **FormData**: Utiliser `postFormDataRequest` pour uploads de fichiers (évite les problèmes d'interceptors)
- **Validation**: Extraire la logique de validation dans des utilitaires séparés
- **Error Handling**: Centraliser la gestion d'erreurs dans des utilitaires réutilisables

## Workflow Courrier Upload
- **Champ fichier**: `courrier` (pas `file`)
- **Champs requis**: `direction`, `customFileName` (nom sans extension)
- **Champs optionnels**: `emitter`, `recipient`, `department`, `kind`, `priority`, `receptionDate`, `courrierDate`, `description`
- **API Method**: `postFormDataRequest` pour éviter les problèmes d'interceptors Axios avec FormData
- **Validation**: Utiliser `validateCourrierForm` avant soumission
- **Error Handling**: Utiliser `handleCourrierUploadError` pour messages d'erreur utilisateur

## Exemples de code conforme

### Upload de fichier avec FormData
```typescript
// Service API
export const postFormDataRequest = async <R>(
  url: string,
  formData: FormData,
): Promise<AxiosResponse<R>> => {
  try {
    const token = localStorage.getItem('authToken');
    const config: Record<string, unknown> = {
      headers: {}
    };
    if (token) {
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
    return await axios.post<R>(url, formData, config);
  } catch (error) {
    console.error("Erreur in postFormDataRequest:", error);
    throw error;
  }
};
```

### Gestion d'erreur avec type guards
```typescript
// utils/errorHandling.ts
export const handleCourrierUploadError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    return `Erreur HTTP: ${error.response?.status || 'inconnue'}`;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Erreur inconnue lors de l\'upload';
};

// Dans le composant
} catch (error: unknown) {
  const errorMessage = handleCourrierUploadError(error);
  alert(errorMessage);
}
```

### SCSS Mobile First avec dimensions en em et dvh
```scss
@use "../../utils/styles/variables" as vars;
@use "../../utils/styles/mixins" as mixins;

#component {
  @include mixins.fullViewport; // Header + SubNav + Main = 100dvh
  
  // Styles mobile d'abord
  display: flex;
  flex-direction: column;
  gap: 1em; // Em au lieu de rem/px
  padding: 1em 0.5em; // Em pour les dimensions
  
  .container {
    display: flex;
    gap: 0.5em; // Au lieu de margins
    min-height: 10em; // Em au lieu de px
  }

  // Responsive tablette
  @media (min-width: vars.$tabletWidth) {
    flex-direction: row;
    gap: 2em;
    padding: 2em 1em;
  }

  // Responsive desktop  
  @media (min-width: vars.$desktopWidth) {
    gap: 3em;
  }
}
```

### Structure de hauteur recommandée
```scss
// Header fixe
#header {
  height: 6dvh; // ~60px en dvh
  position: fixed;
  top: 0;
}

// SubNav (optionnel)
#subNav {
  height: 4dvh; // ~40px en dvh  
  position: fixed;
  top: 6dvh; // Sous le header
}

// Main adaptable
#main {
  @include mixins.fullViewport; // Prend l'espace restant
  padding-top: 6dvh; // Ou 10dvh si subNav
}

// Footer invisible par défaut
#footer {
  // Poussé en bas, visible au scroll seulement
}
```