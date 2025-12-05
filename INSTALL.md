# Guide d'Installation

## Prérequis

- Node.js 18+ (recommandé : 20.x)
- npm 9+ ou yarn 1.22+
- Navigateur moderne (Chrome, Firefox, Safari, Edge)

## Installation Rapide

### 1. Cloner le repository

bash
git clone https://github.com/Patrick5281/nuit-info-assist.git
cd nuit-info-assist

### 2. Installer les dépendances

bash
npm install

### 3. Lancer en mode développement

bash
npm run dev

L'application sera accessible sur `http://localhost:8080`

### 4. Build production

bash
npm run build

Les fichiers seront générés dans le dossier `dist/`

## Serveur Statique Simple

Pour tester sans Node.js (pure frontend) :

bash
# Avec Python 3
cd dist
python -m http.server 8000

# Ou avec Python 2
python -m SimpleHTTPServer 8000

Accéder à `http://localhost:8000`

## Test Mode Offline

1. Ouvrir l'application dans le navigateur
2. Poser quelques questions pour pré-remplir le cache
3. Ouvrir DevTools (F12) → Network → cocher "Offline"
4. Reposer les mêmes questions → Les réponses viennent du cache

## Structure des Fichiers de Données

Les FAQ sont dans `src/data/` :

src/data/
├── faq_fr.json   # 30 questions en français
└── faq_ar.json   # 30 questions en arabe

### Ajouter une nouvelle FAQ

json
{
  "id": "fr-031",
  "title": "Titre court",
  "question": "Question complète ?",
  "keywords": ["mot1", "mot2", "mot3"],
  "answer": "Réponse détaillée...",
  "steps": [
    "Étape 1...",
    "Étape 2..."
  ],
  "link": "https://site-officiel.gouv.fr/...",
  "category": "documents",
  "lang": "fr"
}

Catégories disponibles :
- `documents` - Passeport, CNI, etc.
- `etat-civil` - Naissance, mariage, décès
- `transport` - Permis, carte grise
- `fiscal` - Impôts
- `emploi` - Pôle emploi, URSSAF
- `association` - Création d'association
- `immigration` - Visa, titre de séjour
- `justice` - Casier judiciaire, aide juridictionnelle
- `social` - CAF, RSA, APL
- `sante` - Carte Vitale, Ameli
- `education` - Inscription scolaire
- `citoyennete` - Vote, nationalité
- `demarches` - Changement d'adresse

## Configuration du Cache

Dans `src/lib/tfidf.ts` :

typescript
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 jours

Modifier cette valeur pour ajuster la durée de vie du cache.

## Seuil de Confiance TF-IDF

Dans `src/hooks/useAssistant.ts` :

typescript
const CONFIDENCE_THRESHOLD = 0.25;

- Augmenter (ex: 0.35) → Plus strict, moins de faux positifs
- Diminuer (ex: 0.15) → Plus permissif, plus de résultats

## Intégration ONNX (Optionnel)

L'intégration MiniLM ONNX permet d'améliorer la pertinence des réponses.

### Télécharger le modèle

1. Télécharger `all-MiniLM-L6-v2` quantifié ONNX depuis Hugging Face
2. Placer dans `public/onnx/model.onnx`
3. Décommenter le code ONNX dans `useAssistant.ts`

**Note** : Cette fonctionnalité est optionnelle et augmente la taille du bundle (~40MB).

## Personnalisation du Design

Les styles sont dans :
- `src/index.css` - Variables CSS (couleurs, animations)
- `tailwind.config.ts` - Configuration Tailwind

## Déploiement

### Netlify

bash
npm run build
# Déployer le dossier dist/

### Vercel

bash
vercel --prod


### GitHub Pages

bash
npm run build
# Configurer GitHub Pages sur la branche gh-pages

## Résolution de Problèmes

### "Module not found"

bash
rm -rf node_modules
npm install

### Erreur de build TypeScript

bash
npm run lint


### Cache corrompu

Ouvrir DevTools → Application → Local Storage → Supprimer les clés `assistant_cache::*`

