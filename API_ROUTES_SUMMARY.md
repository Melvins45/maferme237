# API Routes Summary - maferme237

## Overview
The API is split into two main authentication flows:
- **Simple/Public Auth** (`/api/auth`) — clients, suppliers, enterprises
- **Secure/Protected Auth** (`/api/admin`) — administrators, managers, producers, delivery persons

---

## Simple Authentication Routes

### Registration

```
POST /api/auth/register
```

**Purpose:** Register a new client, supplier, or enterprise

**Request Body:**
```json
{
  "personne": {
    "nomPersonne": "string (required)",
    "prenomPersonne": "string (optional)",
    "emailPersonne": "string (required, email format)",
    "motDePassePersonne": "string (required)",
    "telephonePersonne": "string (optional)"
  },
  "client": {
    "adresseClient": "string (optional)"
  },
  "fournisseur": {},
  "entreprise": {
    "secteurActiviteEntreprise": "string (optional)"
  }
}
```

**Response (201):** Returns `personne`, role object(s), and JWT `token`

---

### Login Client

```
POST /api/auth/login/client
```

**Purpose:** Login specifically for a client

**Request Body:**
```json
{
  "emailPersonne": "string (required)",
  "motDePassePersonne": "string (required)"
}
```

**Response (200):** Returns `personne`, `client` object, and JWT `token`

**Error (403):** Client account not found

---

### Login Supplier (Fournisseur)

```
POST /api/auth/login/fournisseur
```

**Purpose:** Login specifically for a supplier

**Request Body:**
```json
{
  "emailPersonne": "string",
  "motDePassePersonne": "string"
}
```

**Response (200):** Returns `personne`, `fournisseur` object, and JWT `token`

**Error (403):** Supplier account not found

---

### Login Enterprise (Entreprise)

```
POST /api/auth/login/entreprise
```

**Purpose:** Login specifically for an enterprise

**Request Body:**
```json
{
  "emailPersonne": "string",
  "motDePassePersonne": "string"
}
```

**Response (200):** Returns `personne`, `entreprise` object, and JWT `token`

**Error (403):** Enterprise account not found

---

## Secure Authentication Routes

### Create Administrator

```
POST /api/admin/administrateurs
```

**Authorization:** Bearer token with `administrateur` role (required)

**Purpose:** Create a new administrator account

**Request Body:**
```json
{
  "personne": {
    "nomPersonne": "string (required)",
    "prenomPersonne": "string (optional)",
    "emailPersonne": "string (required)",
    "motDePassePersonne": "string (required)",
    "telephonePersonne": "string (optional)"
  },
  "administrateur": {
    "niveauAccesAdministrateur": "integer (optional, default: 1)"
  }
}
```

**Response (201):** Returns `personne`, `administrateur` object, and JWT `token`

**Error (401):** Token missing or invalid  
**Error (403):** Caller does not have `administrateur` role

---

### Create Manager (Gestionnaire)

```
POST /api/admin/gestionnaires
```

**Authorization:** Bearer token with `administrateur` role (required)

**Purpose:** Create a new manager account (only admins can create managers)

**Request Body:**
```json
{
  "personne": {
    "nomPersonne": "string (required)",
    "prenomPersonne": "string (optional)",
    "emailPersonne": "string (required)",
    "motDePassePersonne": "string (required)",
    "telephonePersonne": "string (optional)"
  },
  "gestionnaire": {
    "roleGestionnaire": "string (optional)"
  }
}
```

**Response (201):** Returns `personne`, `gestionnaire` object, and JWT `token`

**Error (401):** Token missing or invalid  
**Error (403):** Caller does not have `administrateur` role

---

### Create Producer (Producteur)

```
POST /api/admin/producteurs
```

**Authorization:** Bearer token with `gestionnaire` or `administrateur` role (required)

**Purpose:** Create a new producer account (admins and managers can create producers)

**Request Body:**
```json
{
  "personne": {
    "nomPersonne": "string (required)",
    "prenomPersonne": "string (optional)",
    "emailPersonne": "string (required)",
    "motDePassePersonne": "string (required)",
    "telephonePersonne": "string (optional)"
  },
  "producteur": {
    "specialiteProducteur": "string (optional)"
  }
}
```

**Response (201):** Returns `personne`, `producteur` object, and JWT `token`

**Error (401):** Token missing or invalid  
**Error (403):** Caller does not have `gestionnaire` or `administrateur` role

---

### Create Delivery Person (Livreur)

```
POST /api/admin/livreurs
```

**Authorization:** Bearer token with `gestionnaire` or `administrateur` role (required)

**Purpose:** Create a new delivery person account (admins and managers can create livreurs)

**Request Body:**
```json
{
  "personne": {
    "nomPersonne": "string (required)",
    "prenomPersonne": "string (optional)",
    "emailPersonne": "string (required)",
    "motDePassePersonne": "string (required)",
    "telephonePersonne": "string (optional)"
  }
}
```

**Response (201):** Returns `personne`, `livreur` object, and JWT `token`

**Error (401):** Token missing or invalid  
**Error (403):** Caller does not have `gestionnaire` or `administrateur` role

---

### Login Administrator

```
POST /api/admin/login/administrateur
```

**Purpose:** Login specifically for an administrator

**Request Body:**
```json
{
  "emailPersonne": "string (required)",
  "motDePassePersonne": "string (required)"
}
```

**Response (200):** Returns `personne`, `administrateur` object, and JWT `token`

**Error (401):** Invalid credentials  
**Error (403):** Administrator account not found

---

### Login Manager (Gestionnaire)

```
POST /api/admin/login/gestionnaire
```

**Purpose:** Login specifically for a manager

**Request Body:**
```json
{
  "emailPersonne": "string",
  "motDePassePersonne": "string"
}
```

**Response (200):** Returns `personne`, `gestionnaire` object, and JWT `token`

**Error (401):** Invalid credentials  
**Error (403):** Manager account not found

---

### Login Producer (Producteur)

```
POST /api/admin/login/producteur
```

**Purpose:** Login specifically for a producer

**Request Body:**
```json
{
  "emailPersonne": "string",
  "motDePassePersonne": "string"
}
```

**Response (200):** Returns `personne`, `producteur` object, and JWT `token`

**Error (401):** Invalid credentials  
**Error (403):** Producer account not found

---

### Login Delivery Person (Livreur)

```
POST /api/admin/livreurs/login
```

**Purpose:** Login for a delivery person

**Request Body:**
```json
{
  "emailPersonne": "string",
  "motDePassePersonne": "string"
}
```

**Response (200):** Returns `personne`, `livreur` object, and JWT `token`

**Error (401):** Invalid credentials  
**Error (403):** Livreur account not found

---

## Common Response Codes

| Code | Meaning |
|------|---------|
| 200  | Login successful |
| 201  | Resource created successfully |
| 400  | Invalid or incomplete request data |
| 401  | Missing/invalid credentials or token |
| 403  | Access denied (insufficient permissions or role not found) |
| 500  | Internal server error |

---

## Authentication Header (for protected endpoints)

```
Authorization: Bearer <JWT_TOKEN>
```

JWT tokens contain:
- `sub`: User ID (idPersonne)
- `roles`: Array of role strings (e.g., `["administrateur"]`, `["gestionnaire"]`)

---

## Quick Reference - All Endpoints

### Public Routes
| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/auth/register` | Register client/supplier/enterprise |
| POST | `/api/auth/login/client` | Login client |
| POST | `/api/auth/login/fournisseur` | Login supplier |
| POST | `/api/auth/login/entreprise` | Login enterprise |

### Admin Routes (Secured)
| Method | Route | Purpose | Required Role |
|--------|-------|---------|----------------|
| POST | `/api/admin/administrateurs` | Create admin | `administrateur` |
| POST | `/api/admin/gestionnaires` | Create manager | `administrateur` |
| POST | `/api/admin/producteurs` | Create producer | `administrateur` or `gestionnaire` |
| POST | `/api/admin/livreurs` | Create delivery person | `administrateur` or `gestionnaire` |
| POST | `/api/admin/login/administrateur` | Login admin | None |
| POST | `/api/admin/login/gestionnaire` | Login manager | None |
| POST | `/api/admin/login/producteur` | Login producer | None |
| POST | `/api/admin/livreurs/login` | Login delivery person | None |

---

## Initial Admin Bootstrap

To create the first administrator, run the seeder:

```bash
npx sequelize db:seed:all
```

This creates:
- **Email:** `nitopopm@yahoo.com`
- **Password:** `root` (bcrypt hashed)
- **Access Level:** `1`

Use these credentials to log in at `POST /api/admin/login/administrateur` and obtain a token for further admin operations.
