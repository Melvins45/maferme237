In frontend/src

src/
│
├── assets/           # Images, icônes, styles globaux
│   ├── images/
│   └── styles/
│
├── components/       # Composants réutilisables (boutons, formulaires, cartes…)
│   ├── Button.jsx
│   ├── Navbar.jsx
│   └── ...
│
├── pages/            # Pages principales (routes)
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   └── ...
│
├── layouts/          # Layouts (structure globale : header/footer/sidebar)
│   ├── MainLayout.jsx
│   └── AuthLayout.jsx
│
├── hooks/            # Custom hooks (useAuth, useFetch…)
│   └── useAuth.js
│
├── context/          # Context API (UserContext, ThemeContext…)
│   └── UserContext.jsx
│
├── services/         # API calls, logique métier
│   └── api.js
│
├── utils/            # Fonctions utilitaires (formatage, helpers…)
│   └── formatDate.js
│
├── App.jsx           # Point d’entrée de ton app
├── index.js          # Bootstrap ReactDOM
└── routes.js         # Définition des routes (optionnel)

Pages
src/
 └── pages/
      ├── Accueil.jsx
      │
      ├── Auth/
      │    ├── Connexion.jsx
      │    └── Inscription.jsx
      │
      ├── Clients/
      │    ├── Dashboard.jsx
      │    ├── Precommandes.jsx
      │    ├── Souhaits.jsx
      │    ├── Livraisons.jsx
      │    └── PointsLivraison.jsx
      │
      ├── Entreprises/
      │    ├── Dashboard.jsx
      │    ├── PrecommandesEntreprise.jsx
      │    ├── SouhaitsEntreprise.jsx
      │    └── PointsLivraisonEntreprise.jsx
      │
      ├── Fournisseurs/
      │    ├── Dashboard.jsx
      │    ├── ProduitsFournisseur.jsx
      │    ├── SouhaitsFournisseur.jsx
      │    └── EtapesProductionFournisseur.jsx
      │
      ├── Gestionnaires/
      │    ├── Dashboard.jsx
      │    ├── GestionProduits.jsx
      │    ├── GestionPrecommandes.jsx
      │    ├── GestionSouhaits.jsx
      │    ├── GestionLivraisons.jsx
      │    └── GestionPaiements.jsx
      │
      ├── Producteurs/
      │    ├── Dashboard.jsx
      │    └── EtapesProductionProducteur.jsx
      │
      ├── Administrateurs/
      │    ├── Dashboard.jsx
      │    ├── GestionGestionnaires.jsx
      │    └── GestionProducteurs.jsx
      │
      ├── Livreurs/
      │    ├── Dashboard.jsx
      │    ├── MesLivraisons.jsx
      │    └── PaiementsLivreur.jsx
      │
      ├── Produits/
      │    ├── ListeProduits.jsx
      │    ├── DetailProduit.jsx
      │    ├── Caracteristiques.jsx
      │    └── EtapesProduction.jsx
      │
      ├── Paiements/
      │    ├── PaiementsPrecommandes.jsx
      │    └── PaiementsLivraisons.jsx
      │
      └── Erreur404.jsx
