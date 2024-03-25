import { Request, Response } from "express";
import logger from "../utils/logger";
import Restaurant from "../models/restaurant";
import { uploadImage } from "../utils/upload";
import mongoose, { now } from "mongoose";

const getMyRestaurant = async () => {
  logger.debug("getMyRestaurant");
};

const createMyRestaurant = async (req: Request, res: Response) => {
  try {
    // create my restaurent

    const {} = req.body;

    const existingRestaurant = await Restaurant.findOne({ user: req.userId });

    if (existingRestaurant) {
      return res.status(409).json({ message: "Restaurant already exists" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No image provided" });
    }

    const imageUrl = await uploadImage(req.file);

    const restaurant = new Restaurant(req.body);

    restaurant.imageUrl = imageUrl;
    restaurant.user = new mongoose.Types.ObjectId(req.userId);
    restaurant.lastUpdated = new Date();

    await restaurant.save();

    res.status(201).send(restaurant);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default { getMyRestaurant, createMyRestaurant };
