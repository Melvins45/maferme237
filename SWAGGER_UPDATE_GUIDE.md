# Guide de Mise à Jour Swagger

## ⚠️ IMPORTANT - À FAIRE À CHAQUE MODIFICATION

**Lors de chaque modification de model, controller ou routes, VOUS DEVEZ mettre à jour la documentation Swagger correspondante.**

## Nomenclature Standardisée

### Tags Swagger
Tous les tags doivent être cohérents et en **FRANÇAIS** :

```javascript
/**
 * @swagger
 * tags:
 *   name: Produits
 *   description: Gestion des produits
 */
```

### Descriptions et Réponses
- **Français** : Descriptions, messages d'erreur, descriptions de champs
- **Anglais** : Seulement dans les noms de propriétés JSON

### Format Standard

```javascript
/**
 * @swagger
 * /endpoint:
 *   http_method:
 *     summary: Courte description en français
 *     tags: [NomDuTag]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Description détaillée en français
 *       - Point 1
 *       - Point 2
 *     requestBody: (si POST/PUT)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - champObligatoire
 *             properties:
 *               nomChamp:
 *                 type: string
 *                 description: Description du champ
 *     parameters: (si GET avec paramètres)
 *       - in: path
 *         name: idChamp
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Succès avec description
 *         content:
 *           application/json:
 *             schema: {...}
 *       400:
 *         description: Données manquantes ou invalides
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé - raison spécifique
 *       404:
 *         description: Ressource non trouvée
 *       500:
 *         description: Erreur serveur
 */
```

## Checklist pour Chaque Modification

### Quand vous créez une route :
- [ ] Swagger summary existe
- [ ] Swagger tags exist et cohérents
- [ ] Description détaillée en français
- [ ] Tous les paramètres documentés
- [ ] RequestBody schéma correct
- [ ] Réponses 200, 400, 401, 403, 404, 500 documentées
- [ ] Messages d'erreur en français

### Quand vous modifiez un controller :
- [ ] Vérifiez que la Swagger des routes correspondantes est à jour
- [ ] Si le schéma de réponse change, mettez à jour le schema Swagger
- [ ] Vérifiez les codes d'erreur possibles
- [ ] Mettez à jour les descriptions si la logique a changé

### Quand vous modifiez un model :
- [ ] Ajoutez le schema Swagger dans `swagger.js` si nouveau
- [ ] Mettez à jour le schema existant si des champs changent
- [ ] Documentez les champs required et nullable
- [ ] Mettez à jour toutes les routes qui utilisent ce model

## Codes HTTP Standards

| Code | Utilisation | Description |
|------|-----------|-----------|
| 200 | GET, PUT, DELETE | Succès |
| 201 | POST | Création réussie |
| 400 | POST, PUT | Données manquantes ou invalides |
| 401 | Tous | Token manquant ou invalide |
| 403 | Tous | Accès refusé (permissions insuffisantes) |
| 404 | GET, PUT, DELETE | Ressource non trouvée |
| 500 | Tous | Erreur serveur |

## Messages d'Erreur Standardisés

- `"Token manquant ou invalide"` - Pour 401
- `"Accès refusé - [raison spécifique]"` - Pour 403
- `"[Ressource] non trouvée"` - Pour 404
- `"Données manquantes ou invalides"` - Pour 400
- `"Erreur serveur"` - Pour 500

## Exemple Complet

### routes/produitRoutes.js

```javascript
/**
 * @swagger
 * /produits:
 *   post:
 *     summary: Créer un nouveau produit avec images et caractéristiques
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Créer un produit selon le rôle de l'utilisateur :
 *       - Gestionnaires : produit directement vérifié
 *       - Fournisseurs : produit en attente de vérification
 *       - Producteurs : produit en attente de vérification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nomProduit
 *               - idCategorieProduit
 *             properties:
 *               nomProduit:
 *                 type: string
 *                 description: Nom du produit
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 *       400:
 *         description: Données manquantes ou invalides
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé - seul gestionnaire, fournisseur ou producteur peut créer
 *       500:
 *         description: Erreur serveur
 */
```

## Outils Utiles

- Swagger Editor : https://editor.swagger.io/
- Valider votre Swagger : Visitez `http://localhost:5000/api-docs`

## À Vérifier Avant Chaque Commit

```bash
# Vérifiez que le Swagger se charge sans erreur
curl http://localhost:5000/api-docs

# Vérifiez les annotations Swagger en cherchant :
# - Pas de * @ missing
# - Tags cohérents
# - Descriptions en français
```

---

**Rappel** : Une API bien documentée c'est une API facile à utiliser et maintenir !
