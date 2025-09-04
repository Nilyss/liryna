# 🔧 Résolution de problèmes PWA

## Problème : Erreurs Service Worker en développement

### Symptômes :
- `Failed to convert value to 'Response'`
- `GET http://localhost:5173/src/main.tsx net::ERR_FAILED`
- `FetchEvent resulted in a network error`

### Cause :
Le Service Worker interfère avec le serveur de développement Vite (Hot Module Replacement).

### Solution :

#### 1. Nettoyer le Service Worker existant

Ouvrez la console du navigateur (F12) et exécutez :

```javascript
// Nettoyer tous les Service Workers et caches
(async function cleanupPWA() {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
      console.log('✅ Service Worker désinstallé');
    }
    
    const cacheNames = await caches.keys();
    for (const cacheName of cacheNames) {
      await caches.delete(cacheName);
      console.log('✅ Cache supprimé:', cacheName);
    }
    
    console.log('🔄 Rechargement de la page...');
    window.location.reload();
  }
})();
```

#### 2. Ou utiliser le script de nettoyage

1. Ouvrir `http://localhost:5173/unregister-sw.js` dans le navigateur
2. Le script se lance automatiquement
3. Recharger la page après nettoyage

### Vérification :

Dans Chrome DevTools :
1. **Application** → **Service Workers** : Doit être vide
2. **Application** → **Storage** → **Clear storage** : Cliquer "Clear site data"

## Configuration PWA par environnement

### Mode Développement (`npm run dev`)
- ❌ Service Worker désactivé
- ❌ Mise en cache désactivée  
- ❌ Installation PWA limitée
- ✅ Interface PWA status visible (debug)
- ✅ Hooks PWA fonctionnels (monitoring uniquement)

### Mode Production (`npm run build + npm run preview`)
- ✅ Service Worker actif
- ✅ Mise en cache complète
- ✅ Installation PWA disponible
- ✅ Mode offline fonctionnel
- ✅ Toutes les fonctionnalités PWA

## Problèmes courants et solutions

### 1. "PWA ne s'installe pas"
**Causes possibles :**
- HTTPS requis (sauf localhost)
- Manifeste invalide
- Service Worker non enregistré
- Icons manquantes

**Solutions :**
```bash
# Vérifier le manifeste
curl http://localhost:4173/manifest.json

# Audit PWA avec Lighthouse
# Chrome DevTools → Lighthouse → PWA
```

### 2. "Mode offline ne fonctionne pas"
**Vérifier :**
```javascript
// Dans la console
navigator.serviceWorker.getRegistration().then(reg => 
  console.log('SW State:', reg?.active?.state)
);

// Vérifier les caches
caches.keys().then(names => 
  console.log('Caches:', names)
);
```

### 3. "Mises à jour PWA ne s'appliquent pas"
**Solution :**
```javascript
// Forcer la mise à jour
navigator.serviceWorker.getRegistration().then(reg => {
  if (reg) {
    reg.update().then(() => window.location.reload());
  }
});
```

### 4. "Icons PWA incorrectes"
**Vérifier :**
- Fichiers présents dans `/public/`
- Tailles correctes : 16x16, 32x32, 192x192, 512x512
- Format PNG recommandé
- Paths corrects dans `manifest.json`

## Debug avancé

### Chrome DevTools

1. **Application → Service Workers**
   - État du SW
   - Logs et erreurs
   - Update/Unregister

2. **Application → Storage**
   - Cache Storage : voir le cache
   - IndexedDB : données offline
   - Local Storage : paramètres

3. **Network → Service Worker**
   - Requêtes interceptées
   - Stratégies de cache
   - Fallbacks offline

4. **Lighthouse → PWA**
   - Audit complet PWA
   - Suggestions d'amélioration
   - Score de performance

### Firefox DevTools

1. **Application → Service Workers**
2. **Storage → Cache Storage**
3. **about:serviceworkers** (URL directe)

## Scripts utiles

### Vérifier l'état PWA
```javascript
// Statut complet PWA
(function checkPWAStatus() {
  console.log('🔍 PWA Status Check:');
  console.log('Service Worker:', 'serviceWorker' in navigator);
  console.log('Cache API:', 'caches' in window);
  console.log('Push Manager:', 'PushManager' in window);
  console.log('Notifications:', 'Notification' in window);
  console.log('Display Mode:', window.matchMedia('(display-mode: standalone)').matches ? 'Standalone' : 'Browser');
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then(reg => {
      console.log('SW Registered:', !!reg);
      if (reg) console.log('SW State:', reg.active?.state);
    });
  }
  
  if ('caches' in window) {
    caches.keys().then(names => {
      console.log('Cache Names:', names);
    });
  }
})();
```

### Test d'installation PWA
```javascript
// Simuler l'événement d'installation
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('✅ PWA installable detected');
  // Stocker l'événement pour usage ultérieur
  window.deferredPrompt = e;
});
```

## Bonnes pratiques

### Développement
1. Utiliser `npm run dev` pour développement (SW désactivé)
2. Tester PWA avec `npm run build && npm run preview`
3. Nettoyer SW/cache entre les tests
4. Utiliser Lighthouse pour les audits

### Production
1. Tester sur HTTPS
2. Vérifier sur mobile réel
3. Monitorer les Core Web Vitals
4. Mettre à jour régulièrement le cache

### Debug
1. Toujours ouvrir DevTools sur onglet PWA
2. Vérifier logs dans console SW
3. Tester mode offline manuellement
4. Valider avec différents navigateurs

---

## Support

Pour plus d'aide :
- [MDN Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [PWA Builder](https://www.pwabuilder.com/)
- [Lighthouse PWA](https://web.dev/lighthouse-pwa/)