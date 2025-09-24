import express from "express";
import type { Request, Response } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { SwaggerOptions } from "./config/swagger.config.ts";

dotenv.config();

const port = process.env.PORT || 3000;
const swaggerSpec = swaggerJsdoc(SwaggerOptions);

const app = express();
app.use(express.json());
app.use(morgan("combined"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req: Request, res: Response) => {
  res.send("Provolo Server!");
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
