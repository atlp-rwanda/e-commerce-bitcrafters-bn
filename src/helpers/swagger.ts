import swaggerJsdoc, { Options } from "swagger-jsdoc";

const PORT = 8080; // Assuming you have PORT defined somewhere

const swaggerOptions: Options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "My API Documentation",
      version: "1.0.0",
      description: "Documentation for My Brand Express API",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] as string[] }], //  define bearerAuth as an array of strings
  },
  apis: ["./src/routes/*.ts"], // Path to the files containing your route definitions
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;