export const SwaggerOptions = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Provolo API",
      version: "1.0",
      description: "This is the Provolo backend API server",
      license: {
        name: "Apache 2.0",
        url: "http://www.apache.org/licenses/LICENSE-2.0.html",
      },
    },
    servers: [
      {
        url: "https://provolo-backend.onrender.com",
      },
      {
        url: "http://localhost:8000",
      },
    ],
    basePath: "/",
    schemes: ["https", "http"],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: 'Type "Bearer" followed by a space and JWT token.',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
};
