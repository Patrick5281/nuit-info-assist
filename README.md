# Assistant Services Publics - IA Low-Cost

> Assistant intelligent léger (100% front-end) pour accéder facilement aux services publics numériques, même avec une faible connexion Internet.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Langues](https://img.shields.io/badge/langues-FR%20%7C%20AR-orange)

## 🎯 Objectif

Créer une IA réellement utile, accessible et adaptée aux réalités technologiques des pays ayant une faible connexion Internet, pour aider les utilisateurs à accéder aux services administratifs (documents, démarches, orientation, association, juridique).

## ✨ Fonctionnalités

- **🔍 Recherche TF-IDF** : Algorithme de recherche sémantique côté client
- **📚 FAQ embarquée** : 30+ questions/réponses par langue (FR/AR)
- **🔄 Règles intelligentes** : Fallback par mots-clés si TF-IDF échoue
- **💾 Cache offline** : Stockage localStorage pour mode hors-ligne
- **🌍 Bilingue FR/AR** : Support RTL complet pour l'arabe
- **🎮 Gamification** : Compteur de questions + badges
- **♿ Accessible** : ARIA labels, focus management
- **📱 Mobile-first** : Design responsive

## 🛠 Architecture Technique

```
src/
├── components/assistant/    # Composants UI du chatbot
│   ├── ChatMessage.tsx     # Bulles de messages
│   ├── ChatInput.tsx       # Zone de saisie
│   ├── TypingIndicator.tsx # Animation "IA réfléchit"
│   ├── StatusBar.tsx       # Statut connexion + compteur
│   ├── LanguageSwitch.tsx  # Sélecteur FR/AR
│   └── SuggestedQuestions.tsx
├── data/
│   ├── faq_fr.json         # 30 FAQ en français
│   └── faq_ar.json         # 30 FAQ en arabe
├── hooks/
│   └── useAssistant.ts     # Hook principal (state + logique)
├── lib/
│   ├── tfidf.ts            # Moteur TF-IDF + cache + règles
│   └── i18n.ts             # Traductions
└── pages/
    └── Index.tsx           # Page principale
```

## 🚀 Installation

Voir [INSTALL.md](./INSTALL.md) pour les instructions détaillées.

```bash
# Cloner le repo
git clone <URL_DU_REPO>
cd assistant-frontend

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

## 📋 Checklist de Tests

| # | Test | Résultat attendu |
|---|------|------------------|
| 1 | Poser "Comment obtenir un passeport ?" (FR) | Réponse FAQ avec confidence ≥ 0.25 |
| 2 | Poser la même question en arabe | Réponse AR correcte |
| 3 | Poser une question reformulée | TF-IDF retrouve la FAQ |
| 4 | Question avec mot-clé seul ("visa") | Réponse rule fallback (source: rule) |
| 5 | Couper Wi-Fi + reposer même question | Réponse depuis cache |
| 6 | Poser 3 questions | Badge "Expert démarches" affiché |
| 7 | Changer de langue (bouton العربية) | UI passe en RTL |

## 🧠 Justification IA Low-Cost

### Pourquoi TF-IDF ?

- **Léger** : ~2KB de code, pas de dépendance externe
- **Rapide** : Calcul instantané côté client
- **Offline** : Fonctionne sans Internet
- **Efficace** : Bonne précision pour FAQ structurées

### Pipeline de traitement

1. Vérifier cache localStorage → Si hit, retourner immédiatement
2. Tokeniser + normaliser la requête (support Unicode FR/AR)
3. Calculer TF-IDF sur la base FAQ embarquée
4. Si score ≥ 0.25 → Retourner meilleure réponse
5. Sinon → Appliquer règles mots-clés (fallback)
6. Sauvegarder en cache pour usage offline futur

### Performances

- **Temps de réponse** : < 100ms
- **Taille bundle** : < 500KB (sans modèle ONNX)
- **RAM utilisée** : < 50MB

## 📦 Structure des FAQ

```json
{
  "id": "fr-001",
  "title": "Demande de passeport",
  "question": "Comment obtenir un passeport ?",
  "keywords": ["passeport", "voyage", "document"],
  "answer": "Pour obtenir un passeport...",
  "steps": ["Étape 1", "Étape 2"],
  "link": "https://service-public.fr/...",
  "category": "documents",
  "lang": "fr"
}
```

## 🔮 Améliorations Futures

- [ ] Intégration MiniLM ONNX pour reranking sémantique
- [ ] Service Worker pour mode 100% offline
- [ ] Plus de langues (langues nationales africaines)
- [ ] Export PDF des réponses
- [ ] Historique des conversations

## 📄 Licence

MIT - Voir [LICENSE](./LICENSE)

## 🤝 Contribution

Projet développé dans le cadre de la **Nuit de l'Info**.

---

**Note** : Ce prototype utilise uniquement TF-IDF + règles. L'intégration ONNX MiniLM est documentée mais optionnelle.
