import express from "express";
import bodyParser from "body-parser";
import task1Auth from "./tasks/task-1/auth.js";
import task2 from "./tasks/task-2/task.js";
import { initializeSwagger } from "./tasks/task-3/swagger.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Initialize authentication routes for each task
task1Auth.initializeAuthRoutes(app);
task2.initializeTask2Routes(app);
// Add more tasks as needed

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

initializeSwagger(app);
