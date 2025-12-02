# Quick Reference - Product Management API

## Endpoints

### Read Characteristics (Reference Only)
```
GET /api/caracteristiques
GET /api/caracteristiques/:id
```

### Manage Products (Full Control)
```
POST   /api/produits              Create product with images & characteristics
GET    /api/produits              List all products  
GET    /api/produits/:id          Get product details (includes images & characteristics)
PUT    /api/produits/:id          Update product + images + characteristics
DELETE /api/produits/:id          Delete product
```

---

## Create Product with Valuations

```javascript
POST /api/produits
{
  "nomProduit": "Tomato",
  "idCategorieProduit": 1,
  "images": ["base64..."],
  "caracteristiquesProduit": [
    {
      "idCaracteristique": 5,
      "valeurCaracteristique": "Red"
    },
    {
      "nomCaracteristique": "Origin",
      "typeValeurCaracteristique": "String",
      "valeurCaracteristique": "France"
    }
  ]
}
```

---

## Update Product with Image & Characteristic Changes

```javascript
PUT /api/produits/1
{
  "prixClientProduit": 6.99,
  
  // Images
  "images": [
    { "idProduitImage": 1, "blobImage": "...", "isDelete": false },
    { "blobImage": "..." },
    { "idProduitImage": 3, "isDelete": true }
  ],
  
  // Characteristics
  "caracteristiquesProduit": [
    { "idCaracteristique": 5, "valeurCaracteristique": "Dark Red" },
    { "idCaracteristique": 10, "valeurCaracteristique": "Smooth" },
    { "nomCaracteristique": "Size", "typeValeurCaracteristique": "String", "valeurCaracteristique": "Large" },
    { "idCaracteristique": 8, "isDelete": true }
  ]
}
```

---

## Response: Get Product

```javascript
GET /api/produits/1
{
  "idProduit": 1,
  "nomProduit": "Tomato",
  "categorie": { ... },
  
  "images": [
    {
      "idProduitImage": 1,
      "blobImage": "...",
      "estImagePrincipale": true,
      "texteAltImage": "..."
    }
  ],
  
  "caracteristiques": [
    {
      "idCaracteristique": 5,
      "nomCaracteristique": "Color",
      "typeValeurCaracteristique": "String",
      "uniteValeurCaracteristique": null,
      "ProduitCaracteristiques": {
        "valeurCaracteristique": "Red"
      }
    },
    {
      "idCaracteristique": 10,
      "nomCaracteristique": "Texture",
      "typeValeurCaracteristique": "String",
      "ProduitCaracteristiques": {
        "valeurCaracteristique": "Smooth"
      }
    }
  ]
}
```

---

## Key Rules

| Operation | Method | Notes |
|-----------|--------|-------|
| View all characteristics | GET /api/caracteristiques | Read-only reference |
| View characteristic | GET /api/caracteristiques/:id | Read-only reference |
| Create characteristic | PUT /api/produits/:id | Inline in product update |
| Update characteristic | GET /api/produits/:id | View current values via product |
| Change characteristic valuation | PUT /api/produits/:id | Update `valeurCaracteristique` |
| Link characteristic | PUT /api/produits/:id | Add to `caracteristiquesProduit` array |
| Unlink characteristic | PUT /api/produits/:id | Set `isDelete: true` |
| Add image | PUT /api/produits/:id | Include `blobImage` without `idProduitImage` |
| Update image | PUT /api/produits/:id | Include `idProduitImage` + new `blobImage` |
| Delete image | PUT /api/produits/:id | Set `isDelete: true` |

---

## Request Body Reference

### Create/Update Characteristic in Product

```javascript
// Option 1: Link existing characteristic
{
  "idCaracteristique": 5,
  "valeurCaracteristique": "Red"  // The value for THIS product
}

// Option 2: Create inline
{
  "nomCaracteristique": "Color",
  "typeValeurCaracteristique": "String",
  "uniteValeurCaracteristique": null,  // Optional
  "valeurCaracteristique": "Red"       // Optional
}

// Option 3: Update valuation
{
  "idCaracteristique": 5,
  "valeurCaracteristique": "Dark Red"  // New value
}

// Option 4: Delete link
{
  "idCaracteristique": 5,
  "isDelete": true
}
```

### Image Management in Product

```javascript
// Option 1: Add new image
{
  "blobImage": "data:image/...",
  "texteAltImage": "Product photo",
  "estImagePrincipale": false
}

// Option 2: Update existing
{
  "idProduitImage": 1,
  "blobImage": "data:image/...",
  "texteAltImage": "Updated photo",
  "estImagePrincipale": true
}

// Option 3: Delete existing
{
  "idProduitImage": 3,
  "isDelete": true
}
```

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Invalid input |
| 401 | Missing/invalid token |
| 403 | Unauthorized (not gestionnaire or owner) |
| 404 | Product/characteristic/image not found |
| 500 | Server error |

---

## Database Cascade Behavior

- **Delete Product**: Automatically deletes all associated images and characteristic links
- **Delete Characteristic**: Removes links to all products (but doesn't delete products)
- **Delete Image**: Only removes that specific image

---

## Authorization

- **Create Product**: gestionnaire, fournisseur, producteur
- **Update Product**: gestionnaire (all) or owner fournisseur
- **Delete Product**: gestionnaire (all) or owner fournisseur
- **Create Characteristic**: Auto-linked to creator role (via product operations only)

---

## Examples

### Example 1: Simple Product with Color Characteristic

```javascript
POST /api/produits
{
  "nomProduit": "Apple",
  "idCategorieProduit": 1,
  "prixClientProduit": 2.50,
  "images": ["blob1"],
  "caracteristiquesProduit": [
    { "idCaracteristique": 10, "valeurCaracteristique": "Green" }
  ]
}
```

### Example 2: Add Multiple Characteristics on Update

```javascript
PUT /api/produits/1
{
  "caracteristiquesProduit": [
    { "idCaracteristique": 10, "valeurCaracteristique": "Green" },
    { "idCaracteristique": 15, "valeurCaracteristique": "150g" },
    { "nomCaracteristique": "Origin", "typeValeurCaracteristique": "String", "valeurCaracteristique": "France" }
  ]
}
```

### Example 3: Complete Update - Everything

```javascript
PUT /api/produits/1
{
  "nomProduit": "Premium Green Apple",
  "prixClientProduit": 3.50,
  "images": [
    { "idProduitImage": 1, "blobImage": "newblob", "estImagePrincipale": true },
    { "blobImage": "newblob2" }
  ],
  "caracteristiquesProduit": [
    { "idCaracteristique": 10, "valeurCaracteristique": "Dark Green" },
    { "idCaracteristique": 8, "isDelete": true },
    { "nomCaracteristique": "Taste", "typeValeurCaracteristique": "String", "valeurCaracteristique": "Sweet" }
  ]
}
```
