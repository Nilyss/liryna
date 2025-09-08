# 🔐 Règles de développement - Liryna (Frontend Sécurisé)

## Règles TypeScript/TSX
- **Aucun `any` dans le code** - Toujours typer explicitement
- **Chaque fichier TSX doit avoir un ID unique** basé sur le nom du fichier
  - Exemple: `Courrier.tsx` → `<main id="courrier">`
  - Exemple: `Footer.tsx` → `<footer id="footer">`
- **Types de sécurité**: Définir des interfaces strictes pour les réponses API
- **Error Handling**: Types union pour les erreurs (Axios | Error | unknown)

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

## 🛡️ Architecture API et Sécurité

### Pattern Sécurisé
- **Flow sécurisé**: Modèle → Service CSRF → Interceptors → Contexte → Provider → Composant
- **Types TypeScript**: Interfaces strictes avec validation de sécurité, aucun `any` autorisé
- **Gestion d'erreur**: Try/catch dans services avec type guards et sanitisation
- **État global**: Contextes React pour User et Courrier avec isolation sécurisée

### Services de Sécurité
- **CSRF Service**: `src/utils/services/csrfService.ts` - Gestion automatique des tokens
- **API Calls**: Axios avec interceptors JWT + CSRF automatiques
- **FormData**: `postFormDataRequest` pour uploads (évite conflits interceptors + sécurité)
- **Validation côté client**: Synchronisée avec validation backend
- **Error Handling**: Type guards avec messages sécurisés (pas d'exposition de données sensibles)

### Sécurité des Communications
- **Headers automatiques**: JWT + CSRF sur toutes requêtes critiques
- **Interceptors**: Gestion transparente de l'authentification et tokens
- **Gestion des erreurs 401/403**: Redirection automatique avec nettoyage session
- **Protection XSS**: Sanitisation des inputs utilisateur

## 🔐 Workflow Sécurisé Courrier Upload

### Processus de Sécurité
1. **Validation côté client**: Vérification format + taille avant upload
2. **CSRF Token**: Récupération automatique via `csrfService`
3. **FormData sécurisé**: `postFormDataRequest` avec headers sécurisés
4. **Gestion d'erreurs**: Messages utilisateur sécurisés (pas d'infos techniques)

### Configuration Upload
- **Champ fichier**: `courrier` (pas `file`) - Sync avec backend
- **Champs requis**: `direction`, `customFileName` (nom sans extension)
- **Champs optionnels**: `emitter`, `recipient`, `department`, `kind`, `priority`, `receptionDate`, `courrierDate`, `description`
- **Headers automatiques**: JWT + CSRF via interceptors
- **API Method**: `postFormDataRequest` (évite conflits interceptors + ajout headers sécurité)

### Validation et Erreurs
- **Validation pré-upload**: `validateCourrierForm` - Types fichiers, taille, champs requis
- **Error Handling**: `handleCourrierUploadError` - Messages utilisateur friendly
- **Types acceptés**: PDF, DOC, DOCX, JPEG, PNG (sync avec backend)
- **Taille max**: 50MB (sync avec backend)

## Exemples de code conforme

### 🔒 Service API Sécurisé avec CSRF
```typescript
// Service API avec protection CSRF automatique
export const postFormDataRequest = async <R>(
  url: string,
  formData: FormData,
): Promise<AxiosResponse<R>> => {
  try {
    // Récupération automatique du token CSRF
    const csrfToken = await csrfService.getToken();
    
    const token = localStorage.getItem('authToken');
    const config: Record<string, unknown> = {
      headers: {
        'X-CSRF-TOKEN': csrfToken, // Protection CSRF automatique
      }
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

### 🛡️ Service CSRF
```typescript
// src/utils/services/csrfService.ts
class CSRFService {
  private token: string | null = null;
  private tokenPromise: Promise<string> | null = null;

  async getToken(): Promise<string> {
    if (this.token) return this.token;
    if (this.tokenPromise) return this.tokenPromise;

    this.tokenPromise = this.fetchToken();
    return this.tokenPromise;
  }

  private async fetchToken(): Promise<string> {
    const response = await axios.get('/api/csrf-token');
    this.token = response.data.data.token;
    this.tokenPromise = null;
    return this.token!;
  }

  clearToken(): void {
    this.token = null;
    this.tokenPromise = null;
  }
}
```

### 🔐 Gestion d'Erreur Sécurisée avec Type Guards
```typescript
// utils/authErrorHandling.ts - Gestion centralisée avec sécurité
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Gestion des erreurs d'authentification/autorisation
    if (error.response?.status === 401) {
      // Nettoyage sécurisé de la session
      localStorage.removeItem('authToken');
      csrfService.clearToken();
      window.location.href = '/login';
      return 'Session expirée, redirection...';
    }
    
    if (error.response?.status === 403) {
      csrfService.clearToken(); // Token CSRF invalide
      return 'Accès non autorisé';
    }
    
    // Messages backend sécurisés (pas d'exposition de stack traces)
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    return `Erreur: ${error.response?.status || 'Connexion impossible'}`;
  }
  
  if (error instanceof Error) {
    // Pas d'exposition de messages techniques en production
    return process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Une erreur est survenue';
  }
  
  return 'Erreur inconnue';
};

// Utilisation sécurisée dans les composants
} catch (error: unknown) {
  const errorMessage = handleApiError(error);
  setErrorMessage(errorMessage); // State sécurisé au lieu d'alert
}
```

### 🔐 Validation Côté Client Sécurisée
```typescript
// utils/validation.ts - Validation synchronisée avec backend
export const validateFile = (file: File): string | null => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 
                       'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const maxSize = 50 * 1024 * 1024; // 50MB - sync avec backend
  
  if (!allowedTypes.includes(file.type)) {
    return 'Type de fichier non autorisé';
  }
  
  if (file.size > maxSize) {
    return 'Fichier trop volumineux (max 50MB)';
  }
  
  return null; // Valide
};

export const validateCourrierForm = (data: CourrierFormData): string | null => {
  if (!data.direction || !['entrant', 'sortant', 'interne'].includes(data.direction)) {
    return 'Direction obligatoire (entrant, sortant ou interne)';
  }
  
  if (!data.customFileName?.trim()) {
    return 'Nom de fichier obligatoire';
  }
  
  // Validation sécurisée des caractères (sync avec backend)
  const fileNameRegex = /^[a-zA-Z0-9À-ÿ\s\-_().]+$/;
  if (!fileNameRegex.test(data.customFileName)) {
    return 'Nom de fichier contient des caractères non autorisés';
  }
  
  return null;
};
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

## 🔐 Patterns de Sécurité Frontend

### Authentification Sécurisée
```typescript
// Pattern d'authentification avec nettoyage sécurisé
const logout = () => {
  localStorage.removeItem('authToken');
  csrfService.clearToken();
  // Optionnel: Nettoyer autres données sensibles du localStorage
  window.location.href = '/login';
};
```

### Protection des Routes
```typescript
// Hook de protection des routes avec redirection sécurisée
const useAuthGuard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Vérifier la validité du token (optionnel)
    // Si expired, nettoyer et rediriger
  }, [navigate]);
};
```

### Gestion des Tokens
- **Stockage actuel**: `localStorage` (⚠️ vulnérable aux XSS)
- **Amélioration recommandée**: Migration vers cookies httpOnly + SameSite
- **Rotation**: Nettoyage automatique sur erreurs 401/403
- **CSRF**: Gestion transparente via service dédié

### Validation des Inputs
- **Côté client**: Validation immédiate pour UX
- **Synchronisation**: Même règles que le backend
- **Sanitisation**: Prévention XSS sur données utilisateur
- **Messages d'erreur**: Pas d'exposition d'informations techniques

### Bonnes Pratiques Sécurité
1. **Pas de secrets côté client** (clés API, tokens de service)
2. **Validation double** (client + serveur)
3. **Messages d'erreur génériques** en production
4. **Nettoyage session** sur déconnexion/erreurs auth
5. **HTTPS uniquement** en production
6. **Pas de `console.log`** en production avec données sensibles