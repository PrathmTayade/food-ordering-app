import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import "dotenv/config";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import { notFound } from "./handlers/errorHandler";
import ApiRoutes from "./routes";
import swaggerDocs from "./config/swagger";

mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => console.log("Connection to Database successfull"));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(express.static("public"));

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
