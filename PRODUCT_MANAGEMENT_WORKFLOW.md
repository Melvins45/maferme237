# Product Management API - Complete Workflow

## Overview
Product-centric management system where **images** and **characteristics** are managed exclusively through product endpoints. This ensures data consistency and simplifies the API surface.

## Key Principles

1. **Images** - Managed only via product endpoints (create/update/delete through products)
2. **Characteristics** - Linked to products with valuations only via product endpoints
3. **ProduitCaracteristiques** - Junction table that stores `valeurCaracteristique` (the value of the characteristic for that specific product)
4. **Characteristic CRUD** - Characteristics themselves are read-only from their dedicated endpoint (GET only)

## API Structure

### Characteristics Endpoints (READ-ONLY)
```
GET    /api/caracteristiques              - List all characteristics
GET    /api/caracteristiques/:id          - Get specific characteristic
```
Used to browse available characteristics and their definitions. **Cannot create/update/delete characteristics here.**

### Products Endpoints (FULL CONTROL)
```
POST   /api/produits                      - Create product with images & characteristics
GET    /api/produits                      - List all products with related data
GET    /api/produits/:id                  - Get product with images & characteristics
PUT    /api/produits/:id                  - Update product + manage images/characteristics
DELETE /api/produits/:id                  - Delete product (cascades to images/links)
```

## Workflow Examples

### 1. Create Product with Images and Characteristics

**Endpoint:** `POST /api/produits`

```javascript
{
  "nomProduit": "Organic Tomato",
  "idCategorieProduit": 1,
  "prixClientProduit": 5.99,
  "stockProduit": 100,
  
  // Images - array of blobs
  "images": [
    "data:image/png;base64,...",
    "data:image/png;base64,..."
  ],
  
  // Characteristics - link existing or create inline
  "caracteristiquesProduit": [
    // Option 1: Link existing characteristic with valuation
    {
      "idCaracteristique": 5,
      "valeurCaracteristique": "Red"
    },
    
    // Option 2: Create new characteristic inline with valuation
    {
      "nomCaracteristique": "Origin",
      "typeValeurCaracteristique": "String",
      "uniteValeurCaracteristique": null,
      "valeurCaracteristique": "France"
    },
    
    // Option 3: Create characteristic without initial valuation
    {
      "nomCaracteristique": "Weight",
      "typeValeurCaracteristique": "Decimal",
      "uniteValeurCaracteristique": "kg"
    }
  ]
}
```

**Response:**
```javascript
{
  "message": "Produit créé avec succès",
  "produit": {
    "idProduit": 1,
    "nomProduit": "Organic Tomato",
    "categorie": { /* category data */ },
    "images": [
      {
        "idProduitImage": 1,
        "blobImage": "...",
        "estImagePrincipale": true,
        "texteAltImage": "Image 1 du produit"
      }
    ],
    "caracteristiques": [
      {
        "idCaracteristique": 5,
        "nomCaracteristique": "Color",
        "typeValeurCaracteristique": "String",
        "ProduitCaracteristiques": {
          "valeurCaracteristique": "Red"
        }
      }
    ]
  }
}
```

### 2. Update Product with Image and Characteristic Changes

**Endpoint:** `PUT /api/produits/1`

```javascript
{
  "nomProduit": "Premium Organic Tomato",
  "prixClientProduit": 6.99,
  
  // Image Management
  "images": [
    // Keep existing with no changes (don't include)
    // Update existing image
    {
      "idProduitImage": 1,
      "blobImage": "data:image/png;base64,...new image",
      "texteAltImage": "Updated image"
    },
    // Add new image
    {
      "blobImage": "data:image/png;base64,...",
      "texteAltImage": "New image",
      "estImagePrincipale": false
    },
    // Delete existing image
    {
      "idProduitImage": 2,
      "isDelete": true
    }
  ],
  
  // Characteristic Management
  "caracteristiquesProduit": [
    // Update valuation of existing link
    {
      "idCaracteristique": 5,
      "valeurCaracteristique": "Dark Red"  // Changed from "Red"
    },
    // Add new characteristic link
    {
      "idCaracteristique": 10,
      "valeurCaracteristique": "Smooth"
    },
    // Create new characteristic and link it
    {
      "nomCaracteristique": "Freshness Days",
      "typeValeurCaracteristique": "Integer",
      "uniteValeurCaracteristique": "days",
      "valeurCaracteristique": "7"
    },
    // Remove characteristic link
    {
      "idCaracteristique": 8,
      "isDelete": true
    }
  ]
}
```

### 3. Get Product with Full Data

**Endpoint:** `GET /api/produits/1`

**Response:**
```javascript
{
  "idProduit": 1,
  "nomProduit": "Premium Organic Tomato",
  "prixClientProduit": 6.99,
  
  "categorie": {
    "idCategorieProduit": 1,
    "nomCategorie": "Vegetables",
    "descriptionCategorie": "Fresh vegetables"
  },
  
  "images": [
    {
      "idProduitImage": 1,
      "blobImage": "binary data...",
      "estImagePrincipale": true,
      "texteAltImage": "Updated image"
    },
    {
      "idProduitImage": 3,
      "blobImage": "binary data...",
      "estImagePrincipale": false,
      "texteAltImage": "New image"
    }
  ],
  
  "caracteristiques": [
    {
      "idCaracteristique": 5,
      "nomCaracteristique": "Color",
      "typeValeurCaracteristique": "String",
      "uniteValeurCaracteristique": null,
      "ProduitCaracteristiques": {
        "valeurCaracteristique": "Dark Red"
      }
    },
    {
      "idCaracteristique": 10,
      "nomCaracteristique": "Texture",
      "typeValeurCaracteristique": "String",
      "ProduitCaracteristiques": {
        "valeurCaracteristique": "Smooth"
      }
    },
    {
      "idCaracteristique": 11,
      "nomCaracteristique": "Freshness Days",
      "typeValeurCaracteristique": "Integer",
      "uniteValeurCaracteristique": "days",
      "ProduitCaracteristiques": {
        "valeurCaracteristique": "7"
      }
    }
  ]
}
```

### 4. Create Characteristic Independently (via Product)

To create a standalone characteristic first (without linking to a product immediately):

**Step 1:** Create a temporary product or update an existing one with the characteristic:
```javascript
PUT /api/produits/1
{
  "caracteristiquesProduit": [
    {
      "nomCaracteristique": "Firmness",
      "typeValeurCaracteristique": "Scale",
      "uniteValeurCaracteristique": "1-10"
    }
  ]
}
```

**Step 2:** Now the characteristic exists and can be linked to other products:
```javascript
PUT /api/produits/2
{
  "caracteristiquesProduit": [
    {
      "idCaracteristique": 12,  // The one just created
      "valeurCaracteristique": "8"
    }
  ]
}
```

Or retrieve characteristics with:
```javascript
GET /api/caracteristiques
```

## Data Model

### ProduitCaracteristiques Junction Table
```sql
CREATE TABLE produitcaracteristiques (
  valeurCaracteristique VARCHAR(255) PRIMARY KEY,  -- Value for this product
  ProduitIdProduit INTEGER NOT NULL,
  idCaracteristique INTEGER NOT NULL,
  createdAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (ProduitIdProduit) REFERENCES produits(idProduit) ON DELETE CASCADE,
  FOREIGN KEY (idCaracteristique) REFERENCES caracteristiques(idCaracteristique) ON DELETE CASCADE
);
```

### Key Fields Explained
- **valeurCaracteristique**: The actual value of the characteristic **for this specific product**
  - Example: For "Color" characteristic, value might be "Red" for one product, "Yellow" for another
- **ProduitIdProduit**: Links to the product
- **idCaracteristique**: Links to the characteristic definition

## Image Management

### Blob Storage
- Images stored as `BLOB('long')` in `produitImages` table
- First image automatically becomes main image (`estImagePrincipale = true`)
- Can be overridden during update

### Field Structure
```javascript
{
  "idProduitImage": 1,           // Auto-increment
  "idProduit": 1,                // Foreign key
  "blobImage": "binary...",      // Image data
  "estImagePrincipale": true,    // Is main image
  "texteAltImage": "..."         // Alt text
}
```

## Characteristic Management

### Creation Rules
- **Producteur**: Can create characteristics (auto-assigned as creator)
- **Gestionnaire**: Can create characteristics (auto-assigned as creator)
- **Fournisseur**: Can create characteristics during product creation (if allowed)

### Linking Rules
- Link existing characteristics to products with valuations
- Create new characteristics inline when adding to products
- Update valuations without modifying the characteristic definition
- Unlink characteristics using `isDelete: true`

### Read Operations
- View all characteristics: `GET /api/caracteristiques`
- View characteristic details: `GET /api/caracteristiques/:id`
- View product-specific valuations: `GET /api/produits/:id` (included in response)

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 400 | Missing characteristic valuation | Provide `valeurCaracteristique` or leave field out |
| 404 | Characteristic not found | Verify `idCaracteristique` exists or create inline |
| 404 | Image not found | Verify `idProduitImage` exists |
| 403 | Unauthorized | Only gestionnaire or owner fournisseur can update |

## Best Practices

1. **Reuse Characteristics**: Link existing characteristics to multiple products rather than creating duplicates
2. **Valuations**: Always include `valeurCaracteristique` when linking to make product data meaningful
3. **Images**: Set `estImagePrincipale: true` for only one image per product
4. **Deletions**: Use `isDelete: true` flag rather than empty arrays
5. **Batch Operations**: Update multiple images/characteristics in single PUT request

## Migration from Old API

If characteristics were previously managed via dedicated endpoints:

1. Fetch all characteristics: `GET /api/caracteristiques`
2. For each product needing characteristic links:
   - `PUT /api/produits/:id` with `caracteristiquesProduit` array including valuations
3. Remove any standalone characteristic CRUD calls (they're now read-only)
