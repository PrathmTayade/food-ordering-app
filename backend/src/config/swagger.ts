import { Application } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Food ordering app",
      description:
        "API endpoints for a food ordering app documented on swagger",
      contact: {
        name: "Prathamesh Tayade",
        email: "prathmtayade30@gmail.com",
        url: "https://github.com/PrathmTayade",
      },
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:7000/",
        description: "Local server",
      },
      {
        url: "example.com/api",
        description: "Live server",
      },
    ],
  },
  // looks for configuration in specified directories 
  apis: ["**/routes/**/*.ts", "**/routes/**/*.js"],
};
const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Application) {
  // Swagger Page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // Documentation in JSON format
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}
export default swaggerDocs;
