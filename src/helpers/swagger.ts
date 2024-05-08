import swaggerJsdoc, { Options } from 'swagger-jsdoc'

const port = process.env.PORT || 8000 // Assuming you have PORT defined somewhere

const swaggerOptions: Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'My API Documentation',
      version: '1.0.0',
      description: 'Documentation for E-Commerce API',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Local Server',
      },
      {
        url: `https://e-commerce-bitcrafters-bn-1mpf.onrender.com`,
        description: 'Deployed Server',
      },
      {
        url: `/`,
        description: 'For pull requests',
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] as string[] }], //  define bearerAuth as an array of strings
  },
  apis: ['./src/docs/*.ts'], // Path to the files containing your route definitions
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)

export default swaggerSpec
