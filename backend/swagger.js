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
            niveauAccesAdministrateur: { type: "string" },
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
            specialiteProducteur: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        Livreur: {
          type: "object",
          properties: {
            idLivreur: { type: "integer" },
            licenceLivreur: { type: "string" },
            vehiculeLivreur: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
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
