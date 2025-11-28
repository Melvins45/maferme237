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
  },
  apis: ["./routes/*.js"], // où tu mets tes annotations
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
