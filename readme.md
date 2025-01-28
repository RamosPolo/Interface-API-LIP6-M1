# Interface API LIP6 - M1

Une interface moderne pour interagir avec l'API du LIP6, permettant de gérer des documents et d'avoir des conversations avec un assistant IA basé sur le RAG (Retrieval-Augmented Generation).

## Fonctionnalités

- 💬 Interface de chat interactive avec l'assistant
- 📁 Gestion des documents (upload de fichiers ZIP)
- ⚙️ Configuration des paramètres RAG
- 📝 Historique des conversations
- 🌓 Support du mode sombre/clair
- 📱 Interface responsive (mobile & desktop)

## Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn

## Installation

1. Clonez le repository :
```bash
git clone https://github.com/votre-username/interface-api-lip6-m1.git
cd interface-api-lip6-m1
```

2. Installez les dépendances :
```bash
npm install
# ou
yarn install
```

3. Créez un fichier `.env` à la racine du projet :
```env
VITE_API_URL=https://api.example.com
```

## Démarrage du projet

Pour lancer le projet en mode développement :
```bash
npm run dev
# ou
yarn dev
```

L'application sera accessible à l'adresse : `http://localhost:5173`

## Structure du projet

```
src/
├── components/          # Composants réutilisables
│   └── ui/             # Composants d'interface utilisateur
├── pages/              # Pages de l'application
├── assets/             # Ressources statiques
└── App.jsx            # Composant principal

```

## Technologies utilisées

- React 18
- Vite
- Tailwind CSS
- Lucide Icons
- shadcn/ui

## API Endpoints

L'application communique avec les endpoints suivants :

- POST `/endpoint` : Envoie une requête à l'assistant
- GET `/rag-status` : Récupère l'état du RAG
- POST `/upload` : Upload de documents

## Personnalisation

### Thème

Le thème peut être personnalisé en modifiant les variables CSS dans `index.css` :

```css
:root {
  --primary: #6366f1;
  --primary-hover: #4f46e5;
  /* ... autres variables ... */
}
```

## Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Commitez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## Support

Pour toute question ou problème, veuillez ouvrir une issue sur le repository GitHub.

