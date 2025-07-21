# Theed Portfolio – Johan Ledoux

Portfolio moderne développé avec **SvelteKit**

## Présentation

Ce projet est mon portfolio interactif et responsive pour présenter mes expériences, projets, compétences et avis clients. Il met en avant :
- Un design épuré et moderne
- Un curseur custom animé et interactif (desktop)
- Une timeline d’expériences dynamique
- Une section projets, avis, technos, contact
- Un mode mobile optimisé

## Fonctionnalités principales
- **Curseur custom** : cercle animé, effets sur liens/boutons, mode molette avec engrenage
- **Timeline d’expériences** : affichage horizontal sur desktop, vertical en colonne sur mobile
- **Section projets** : cartes projet, boutons personnalisés
- **Avis clients** : affichage dynamique, voir plus/moins
- **Technos** : badges technos utilisés
- **Contact** : formulaire avec validation
- **Pages légales** : mentions légales, CGU
- **Responsive** : expérience fluide sur mobile, tablette, desktop
  
## Structure des dossiers

```
src/
  app.html, app.css         # Entrée SvelteKit
  lib/
    components/             # Composants Svelte réutilisables (header, footer, Cursor, etc.)
    data/                   # Données statiques (parcours, projets, technos, avis)
    stores/                 # Stores Svelte (états globaux)
  routes/
    +page.svelte            # Page d’accueil
    legal/                  # Pages légales
    projects/               # Pages projets
    ...
static/                     # Images, icônes, favicon, manifest
```

## Personnalisation rapide
- **Données** : modifie les fichiers dans `src/lib/data/` pour changer mes expériences, projets, technos, avis…
- **Composants** : personnalise le style dans `src/lib/components/` (ex : `Cursor.svelte` pour le curseur)
- **Images/icônes** : ajoute tes images dans `static/`

## Crédits
- [SvelteKit](https://kit.svelte.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Heroicons](https://heroicons.com/)
- [Motion One](https://motion.dev/) (animations)
- [Deezer API](https://developers.deezer.com/api) (pour la page Mujika)

---

**Auteur :** Johan Ledoux

Pour toute question ou suggestion, contacte-moi sur [LinkedIn](https://www.linkedin.com/in/johanldx/) ou via le formulaire du site.
