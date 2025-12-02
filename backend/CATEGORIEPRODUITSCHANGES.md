# Migrations et Modifications - Table CategorieProduits

## Date: 2 Décembre 2025

### Résumé des Changements

Deux migrations ont été créées pour mettre à jour la table `CategorieProduits` :

1. ✅ Renommer `dateCreationCategorie` → `dateCreationCategorieProduit`
2. ✅ Retirer `idAdministrateur` et ses relations

### Détails des Migrations

#### Migration 1: Renommer la colonne de date
**Fichier**: `20251202000001-rename-dateCreationCategorie-to-dateCreationCategorieProduit.js`

```javascript
// Renomme la colonne pour cohérence de nommage
dateCreationCategorie → dateCreationCategorieProduit
```

**Raison**: Cohérence avec le reste du schéma qui utilise `nomCategorieProduit`, `descriptionCategorieProduit`, etc.

---

#### Migration 2: Retirer idAdministrateur
**Fichier**: `20251202000002-remove-idAdministrateur-from-CategorieProduits.js`

- Supprime la contrainte de clé étrangère vers `Administrateurs`
- Supprime la colonne `idAdministrateur`
- Les administrateurs n'affichent pas de catégories créées par eux-mêmes

**Raison**: Les administrateurs ont accès à toutes les ressources par définition, pas besoin de tracker les créateurs administrateurs.

---

### Changements du Modèle

**Fichier**: `models/categorieproduits.js`

**Avant**:
```javascript
// Relations incluaient les administrateurs
CategorieProduits.belongsTo(models.Administrateurs, {
  foreignKey: 'idAdministrateur',
  as: 'administrateurCreateur'
});

// Colonnes incluaient
dateCreationCategorie
idAdministrateur
```

**Après**:
```javascript
// Relations: Seulement fournisseur, producteur et gestionnaire
CategorieProduits.belongsTo(models.Fournisseurs, {...});
CategorieProduits.belongsTo(models.Producteurs, {...});
CategorieProduits.belongsTo(models.Gestionnaires, {...});

// Colonnes
dateCreationCategorieProduit
// idAdministrateur → SUPPRIMÉ
```

---

### Changements du Contrôleur

**Fichier**: `controllers/categoriesController.js`

**Mises à Jour**:
- Tous les usages de `nomCategorie` → `nomCategorieProduit`
- Tous les usages de `descriptionCategorie` → `descriptionCategorieProduit`
- Utilisation des utilitaires centralisés: `extractBearer` et `ensureRoles` depuis `utils/tokenUtils.js`

**Endpoints**:
- `POST /categories` - Crée une catégorie
- `GET /categories` - Liste toutes les catégories
- `GET /categories/{idCategorieProduit}` - Obtient une catégorie
- `PUT /categories/{idCategorieProduit}` - Met à jour une catégorie
- `DELETE /categories/{idCategorieProduit}` - Supprime une catégorie

---

### Changements Swagger/Documentation

**Fichier**: `routes/categoriesRoutes.js`

**Mises à jour**:
- ✅ Noms de champs alignés: `nomCategorieProduit`, `descriptionCategorieProduit`, `dateCreationCategorieProduit`
- ✅ Paramètres de requête mis à jour dans tous les endpoints
- ✅ Réponses documentées avec les bons noms de champs
- ✅ Suppression de toute référence à `idAdministrateur` et `administrateurCreateur`
- ✅ Description de l'endpoint PUT précise que les fournisseurs peuvent aussi modifier leurs propres catégories

---

### Propriétés de la Table CategorieProduits

| Colonne | Type | Nullable | Notes |
|---------|------|----------|-------|
| idCategorieProduit | INTEGER | NON | PRIMARY KEY, AUTO INCREMENT |
| nomCategorieProduit | VARCHAR(255) | NON | Requis |
| descriptionCategorieProduit | TEXT | OUI | Optionnel |
| dateCreationCategorieProduit | DATETIME | NON | DEFAULT: NOW |
| idFournisseur | INTEGER | OUI | FK: Fournisseurs |
| idProducteur | INTEGER | OUI | FK: Producteurs |
| idGestionnaire | INTEGER | OUI | FK: Gestionnaires |
| createdAt | DATETIME | NON | Sequelize timestamp |
| updatedAt | DATETIME | NON | Sequelize timestamp |

---

### Rôles Autorisés par Endpoint

#### GET /categories
- ✅ Tous (public)

#### GET /categories/{id}
- ✅ Tous (public)

#### POST /categories (Créer)
- ✅ Producteurs
- ✅ Gestionnaires
- ✅ Fournisseurs

#### PUT /categories/{id} (Modifier)
- ✅ Gestionnaires (toutes les catégories)
- ✅ Producteurs (leurs propres catégories)
- ✅ Fournisseurs (leurs propres catégories)

#### DELETE /categories/{id} (Supprimer)
- ✅ Gestionnaires uniquement

---

### Exécution des Migrations

```bash
# Pour appliquer les migrations
npm run migrate

# Pour revenir en arrière
npm run migrate:undo:all
```

---

### Notes Importantes

1. ⚠️ Les migrations doivent être exécutées dans l'ordre correct
2. ⚠️ Après les migrations, le serveur doit être redémarré
3. ✅ Les tests Swagger doivent être relancés après deployment
4. ✅ Aucune donnée existante n'est perdue (renommage de colonne seulement)
5. ✅ La suppression de `idAdministrateur` est sûre car les administrateurs n'utilisaient pas cette colonne

---

**Dernière mise à jour**: 2 Décembre 2025
**Statut**: ✅ Prêt pour déploiement
