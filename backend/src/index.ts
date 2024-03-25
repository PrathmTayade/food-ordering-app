import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import UserRoute from "./routes/UserRoute";
import MyRestaurantRoute from "./routes/MyRestaurantRoute";
import RestaurantRoute from "./routes/RestaurantRoute";
import logger from "./utils/logger";
import { v2 as cloudinary } from "cloudinary";
import { notFound } from "./handlers/errorHandler";
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
app.use(cors());

app.get("/health", async (req: Request, res: Response) => {
  logger.info("health check successfull");
  res.send({ message: "health OK!" });
});

app.use("/api/user", UserRoute);

app.use("/api/my/restaurant", MyRestaurantRoute);

app.use("/api/restaurant", RestaurantRoute);

// handle not found apis
// todo? maybe add 404 page html
// res.sendfile(path.join(__dirname, 'public', '404.html'))
app.use(notFound);

app.listen(process.env.PORT || 7000, () => {
  console.log("Your server available at http://localhost:7000");
});
