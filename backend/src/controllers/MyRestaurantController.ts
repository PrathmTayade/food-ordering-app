import { Request, Response } from "express";
import logger from "../utils/logger";
import Restaurant from "../models/restaurant";
import { uploadImage } from "../utils/upload";
import mongoose, { now } from "mongoose";

const getMyRestaurant = async (req: Request, res: Response) => {
  logger.debug(req);
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
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
const updateMyRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({
      user: req.userId,
    });

    if (!restaurant) {
      return res.status(404).json({ message: "restaurant not found" });
    }

    restaurant.restaurantName = req.body.restaurantName;
    restaurant.city = req.body.city;
    restaurant.country = req.body.country;
    restaurant.deliveryPrice = req.body.deliveryPrice;
    restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    restaurant.cuisines = req.body.cuisines;
    restaurant.menuItems = req.body.menuItems;
    restaurant.lastUpdated = new Date();

    if (req.file) {
      const imageUrl = await uploadImage(req.file as Express.Multer.File);
      restaurant.imageUrl = imageUrl;
    }

    await restaurant.save();
    res.status(200).send(restaurant);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
export default { getMyRestaurant, createMyRestaurant, updateMyRestaurant };
