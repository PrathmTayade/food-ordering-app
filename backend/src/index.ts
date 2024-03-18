import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => console.log("Connection to Database successfull"));

const app = express();
app.use(express.json());
app.use(cors());

app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "health OK!" });
});

app.listen(process.env.PORT || 7000, () => {
  console.log("Your server available at http://localhost:7000");
});
