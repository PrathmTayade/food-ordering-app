import cors from "cors";
import "dotenv/config";
import express, { Request, Response } from "express";
import morgan from "morgan";
import { notFound } from "./handlers/errorHandler";
import ApiRoutes from "./routes";
import swaggerDocs from "./config/swagger";
import connectDB from "./config/db";
import connectCloudinary from "./config/cloudinary";

// Database connection
connectDB();

// Cloudinary connection
connectCloudinary();

// Express
const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.static("public"));

// raw data  for stripe webhook
app.use("/api/order/checkout/webhook", express.raw({ type: "*/*" }));

app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Food ordering api: PrathmTayade");
});
// health check
app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "health OK!", status: 200 });
});

// Api routes
app.use("/api", ApiRoutes);

// Api docs
swaggerDocs(app);

// 404 error handler
app.use(notFound);

app.listen(process.env.PORT || 7000, () => {
  console.log("Your server available at http://localhost:7000");
});
