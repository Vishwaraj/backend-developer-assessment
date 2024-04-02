import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import "../task-1/auth.js";
import "../task-2/task.js";

// Define Swagger options
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Documentation for API endpoints",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: "Development server",
      },
      {
        url: `https://backend-developer-assessment.onrender.com`,
        description: "Production server",
      },
    ],
  },
  apis: ["tasks/task-1/auth.js", "tasks/task-2/task.js"], // Include both Task 1 and Task 2 files
};

// Initialize Swagger-jsdoc
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Initialize Swagger UI
export const initializeSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
