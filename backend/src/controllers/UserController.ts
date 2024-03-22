import { Request, Response } from "express";
import logger from "../utils/logger";
import User from "../models/user";

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

    res.status(201).json(newUser.toObject());
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Error updating user" });
  }
};

export default { createCurrentUser };
