# ✅ Swagger Documentation Checklist

## À Faire à CHAQUE Modification de Code

### 1️⃣ Avant de Modifier Routes, Controllers ou Models

- [ ] Ouvrir le fichier de routes correspondant
- [ ] Vérifier la documentation Swagger actuelle
- [ ] Noter les changements que vous allez faire

### 2️⃣ Après Modification du Controller

- [ ] Vérifier que les codes de réponse sont exacts (200, 201, 400, 401, 403, 404, 500)
- [ ] Mettre à jour les descriptions Swagger si la logique a changé
- [ ] Vérifier que les schémas de réponse correspondent

### 3️⃣ Après Modification des Routes

- [ ] Mettre à jour les annotations Swagger
- [ ] Vérifier que tous les paramètres sont documentés
- [ ] Vérifier que le requestBody schema est exact
- [ ] Vérifier tous les codes d'erreur possibles

### 4️⃣ Après Modification d'un Model

- [ ] Ajouter/modifier le schema dans `swagger.js` si nécessaire
- [ ] Documenter les champs required et nullable
- [ ] Mettre à jour toutes les routes qui utilisent ce model
- [ ] Vérifier les références croisées ($ref)

### 5️⃣ Avant de Commit

```bash
# Vérifier que Swagger se charge sans erreur
curl http://localhost:5000/api-docs

# Regarder dans la console du serveur
npm start
```

## 🌍 Conventions Linguistiques

### 📝 À TOUJOURS Faire en Français
- Tags (`tags: [Clients]`)
- Summary (`summary: "Obtenir tous les clients"`)
- Description (`description: |`)
- Messages d'erreur (`description: "Token manquant ou invalide"`)
- Noms de paramètres dans les descriptions
- Descriptions de champs dans requestBody

### 🔧 À TOUJOURS Faire en Anglais
- Noms de propriétés JSON (`idClient`, `nomPersonne`)
- Types (`type: string`, `format: email`)
- Noms d'en-têtes HTTP

### ❌ JAMAIS Mélanger

```javascript
// ❌ MAUVAIS
summary: "Get clients" // anglais au lieu du français
description: "Récupère les données avec idClient" // mélange

// ✅ BON
summary: "Obtenir tous les clients"
description: "Récupère tous les clients avec leurs idClient respectifs"
```

## 🔍 Format de Documentation

### Minimum pour chaque endpoint

```javascript
/**
 * @swagger
 * /chemin:
 *   methode:
 *     summary: Description courte
 *     tags: [TagFrancais]
 *     security:
 *       - bearerAuth: []  // Si authentification requise
 *     description: |
 *       Description détaillée
 *     parameters:  // Si paramètres
 *       - in: path
 *         name: param
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:  // Si POST/PUT
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - champObligatoire
 *             properties:
 *               champObligatoire:
 *                 type: string
 *                 description: Description du champ
 *     responses:
 *       201:  // ou 200 selon le cas
 *         description: Succès
 *       400:
 *         description: Données manquantes ou invalides
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé - [raison]
 *       404:
 *         description: [Ressource] non trouvée
 *       500:
 *         description: Erreur serveur
 */
```

## 🎯 Codes HTTP Standardisés

| Méthode | Code | Cas d'Usage |
|---------|------|-----------|
| POST | 201 | Création réussie |
| GET | 200 | Récupération réussie |
| PUT | 200 | Modification réussie |
| DELETE | 200 | Suppression réussie |
| Tout | 400 | Données invalides |
| Tout | 401 | Token manquant/invalide |
| Tout | 403 | Permissions insuffisantes |
| Tout | 404 | Ressource non trouvée |
| Tout | 500 | Erreur serveur |

## 💡 Messages d'Erreur Standardisés

```javascript
// 400 - Validation
"Données manquantes ou invalides"
"[Champ] est obligatoire"

// 401 - Authentification
"Token manquant ou invalide"

// 403 - Autorisation
"Accès refusé - seul [rôle] peut [action]"
"Accès refusé - [raison spécifique]"

// 404 - Non trouvé
"[Ressource] non trouvé(e)"
"[Ressource] non trouvée"

// 500 - Serveur
"Erreur serveur"
```

## 📋 Fichiers à Vérifier/Mettre à Jour

### Routes
- [ ] `routes/clientRoutes.js`
- [ ] `routes/produitRoutes.js`
- [ ] `routes/caracteristiquesRoutes.js`
- [ ] `routes/fournisseurRoutes.js`
- [ ] `routes/entreprisesRoutes.js`
- [ ] `routes/administrateurRoutes.js`
- [ ] `routes/gestionnaireRoutes.js`
- [ ] `routes/producteurRoutes.js`
- [ ] `routes/livreurRoutes.js`
- [ ] `routes/authRoutes.js`
- [ ] `routes/authAdminRoutes.js`

### Schemas
- [ ] `swagger.js` - schemas centralisés

## 🚀 Workflow Recommandé

1. **Modifier le code** (controller/route/model)
2. **Relire votre code**
3. **Mettre à jour Swagger IMMÉDIATEMENT**
4. **Redémarrer le serveur** : `npm start`
5. **Visiter** : `http://localhost:5000/api-docs`
6. **Vérifier** que la documentation Swagger se charge correctement
7. **Tester** l'endpoint dans Swagger UI
8. **Commit** uniquement si Swagger est à jour

## ⚠️ Pièges Courants

### 1. Oublier de traduire en français
```javascript
// ❌ MAUVAIS
summary: "Get all products"

// ✅ BON
summary: "Obtenir tous les produits"
```

### 2. Mauvais code HTTP
```javascript
// ❌ MAUVAIS
post:
  responses:
    200:  // POST devrait retourner 201

// ✅ BON
post:
  responses:
    201:  // Création réussie
```

### 3. Schema $ref incorrect
```javascript
// ❌ MAUVAIS
$ref: '#/schemas/Client'

// ✅ BON
$ref: '#/components/schemas/Client'
```

### 4. Oublier security
```javascript
// ❌ MAUVAIS - endpoint protégé sans security
put:
  # Pas de security mais authenticate dans le code

// ✅ BON
put:
  security:
    - bearerAuth: []
```

### 5. Paramètres manquants
```javascript
// ❌ MAUVAIS
router.delete("/:idClient", ...);
// Mais pas documenté dans Swagger

// ✅ BON
/**
 * @swagger
 * /clients/{idClient}:
 *   delete:
 *     parameters:
 *       - in: path
 *         name: idClient
 *         required: true
 *         schema:
 *           type: integer
```

## 🔗 Ressources Utiles

- Swagger Editor: https://editor.swagger.io/
- Documentation locale: `http://localhost:5000/api-docs`
- Fichier guide: `SWAGGER_UPDATE_GUIDE.md`

## 🎓 Exemples Complets

### Exemple 1: GET avec paramètre

```javascript
/**
 * @swagger
 * /clients/{idClient}:
 *   get:
 *     summary: Obtenir un client par son ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: idClient
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du client
 *     responses:
 *       200:
 *         description: Client trouvé
 *       404:
 *         description: Client non trouvé
 */
router.get("/:idClient", clientController.getClient);
```

### Exemple 2: POST avec body

```javascript
/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Créer un nouveau client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nomPersonne
 *               - adresseClient
 *             properties:
 *               nomPersonne:
 *                 type: string
 *               adresseClient:
 *                 type: string
 *     responses:
 *       201:
 *         description: Client créé avec succès
 *       400:
 *         description: Données manquantes ou invalides
 *       403:
 *         description: Accès refusé
 */
router.post("/", authenticate, clientController.createClient);
```

---

**Dernière mise à jour**: 02 Décembre 2025

⚡ **Rappel Important**: La documentation Swagger est aussi importante que le code lui-même. Une API mal documentée est une API inutile !
