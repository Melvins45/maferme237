// swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "maferme237 API",
      version: "1.0.0",
      description: "Documentation de l'API pour maferme237",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        PersonneCreate: {
          type: "object",
          properties: {
            nomPersonne: { type: "string" },
            prenomPersonne: { type: "string" },
            emailPersonne: { type: "string", format: "email" },
            motDePassePersonne: { type: "string" },
            telephonePersonne: { type: "string" }
          }
        },
        PersonnePublic: {
          type: "object",
          properties: {
            idPersonne: { type: "integer" },
            nom: { type: "string" },
            prenomPersonne: { type: "string" },
            emailPersonne: { type: "string", format: "email" },
            telephonePersonne: { type: "string" },
            dateCreationCompte: { type: "string", format: "date-time" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        Client: {
          type: "object",
          properties: {
            idClient: { type: "integer" },
            adresseClient: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        Fournisseur: {
          type: "object",
          properties: {
            idFournisseur: { type: "integer" },
            noteClientFournisseur: { type: "number" },
            noteEntrepriseFournisseur: { type: "number" },
            verifieFournisseur: { type: "boolean" },
            historiqueProduits: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        Entreprise: {
          type: "object",
          properties: {
            idEntreprise: { type: "integer" },
            secteurActiviteEntreprise: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        Administrateur: {
          type: "object",
          properties: {
            idAdministrateur: { type: "integer" },
            niveauAccesAdministrateur: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        Gestionnaire: {
          type: "object",
          properties: {
            idGestionnaire: { type: "integer" },
            roleGestionnaire: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        Producteur: {
          type: "object",
          properties: {
            idProducteur: { type: "integer" },
            idCategorieProduit: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        Livreur: {
          type: "object",
          properties: {
            idLivreur: { type: "integer" },
            createdBy: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        Caracteristique: {
          type: "object",
          properties: {
            idCaracteristique: { type: "integer" },
            nomCaracteristique: { type: "string" },
            typeValeurCaracteristique: { type: "string" },
            uniteValeurCaracteristique: { type: "string", nullable: true },
            idFournisseur: { type: "integer", nullable: true },
            idProducteur: { type: "integer", nullable: true },
            idGestionnaire: { type: "integer", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            fournisseur: { $ref: "#/components/schemas/Fournisseur" },
            producteur: { $ref: "#/components/schemas/Producteur" },
            gestionnaire: { $ref: "#/components/schemas/Gestionnaire" }
          }
        },
        ProduitCaracteristiqueAssociation: {
          type: "object",
          properties: {
            idCaracteristique: { type: "integer" },
            nomCaracteristique: { type: "string" },
            typeValeurCaracteristique: { type: "string" },
            uniteValeurCaracteristique: { type: "string", nullable: true },
            produitcaracteristiques: {
              type: "object",
              properties: {
                valeurCaracteristique: { type: "string", nullable: true }
              }
            }
          }
        },
        ProduitImage: {
          type: "object",
          properties: {
            idProduitImage: { type: "integer" },
            blobImage: { type: "string", format: "binary" },
            estImagePrincipale: { type: "boolean" },
            texteAltImage: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        Produit: {
          type: "object",
          properties: {
            idProduit: { type: "integer" },
            nomProduit: { type: "string" },
            descriptionProduit: { type: "string", nullable: true },
            prixFournisseurClientProduit: { type: "integer", nullable: true },
            prixFournisseurEntrepriseProduit: { type: "integer", nullable: true },
            prixFournisseurProduit: { type: "number", nullable: true },
            comissionClientProduit: { type: "integer", nullable: true },
            comissionEntrepriseProduit: { type: "integer", nullable: true },
            stockProduit: { type: "integer" },
            stockFournisseurProduit: { type: "integer" },
            quantiteMinProduitEntreprise: { type: "integer", nullable: true },
            quantiteMinProduitClient: { type: "integer", nullable: true },
            statutVerificationProduit: { type: "string" },
            statutProductionProduit: { type: "string" },
            idCategorieProduit: { type: "integer" },
            idFournisseur: { type: "integer", nullable: true },
            idGestionnaire: { type: "integer", nullable: true },
            categorie: { $ref: "#/components/schemas/CategorieProduit" },
            images: {
              type: "array",
              items: { $ref: "#/components/schemas/ProduitImage" }
            },
            caracteristiques: {
              type: "array",
              items: { $ref: "#/components/schemas/ProduitCaracteristiqueAssociation" }
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        CategorieProduit: {
          type: "object",
          properties: {
            idCategorieProduit: { type: "integer" },
            nomCategorie: { type: "string" },
            descriptionCategorie: { type: "string", nullable: true }
          }
        },
        AuthResponse: {
          type: "object",
          properties: {
            personne: { $ref: "#/components/schemas/PersonnePublic" },
            token: { type: "string" },
            administrateur: { $ref: "#/components/schemas/Administrateur" },
            gestionnaire: { $ref: "#/components/schemas/Gestionnaire" },
            producteur: { $ref: "#/components/schemas/Producteur" },
            livreur: { $ref: "#/components/schemas/Livreur" },
            client: { $ref: "#/components/schemas/Client" },
            fournisseur: { $ref: "#/components/schemas/Fournisseur" },
            entreprise: { $ref: "#/components/schemas/Entreprise" }
          }
        },
        LoginRequest: {
          type: "object",
          required: ["emailPersonne", "motDePassePersonne"],
          properties: {
            emailPersonne: { type: "string", format: "email" },
            motDePassePersonne: { type: "string" }
          }
        }
      }
    },
  },
  apis: ["./routes/*.js"], // où tu mets tes annotations
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
