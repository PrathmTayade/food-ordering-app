import { Request, Response } from "express";
import logger from "../utils/logger";
import User from "../models/user";

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findOne({ _id: req.userId });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(currentUser);
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const createCurrentUser = async (req: Request, res: Response) => {
  logger.debug("testing pino logger", req.body);

  try {
    const { authId } = req.body;
    const existingUser = await User.findOne({ authId });

    if (existingUser) {
      return res.status(200).json({ message: "User already exists." }).send();
    }

    const newUser = new User(req.body);
    await newUser.save();
    logger.info(`User ${newUser._id} created.`);
    res.status(201).json(newUser.toObject());
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Error updating user" });
  }
};

const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const { name, addressLine1, country, city } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.addressLine1 = addressLine1;
    user.city = city;
    user.country = country;

    await user.save();
    logger.info(`User ${user._id} updated.`);
    res.send(user);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Error updating user" });
  }
};

export default { createCurrentUser, updateCurrentUser, getCurrentUser };
