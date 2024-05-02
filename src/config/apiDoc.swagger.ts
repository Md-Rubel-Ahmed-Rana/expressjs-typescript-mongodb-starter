import path from "path";
import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Express Typescript Starter API",
      version: "1.0.0",
      description: "API documentation for Express Typescript Starter",
    },
  },
  apis: [path.resolve(__dirname, "../routes/*.routes.ts")],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
