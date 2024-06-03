import { NextFunction, Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { decode, JwtPayload } from "jsonwebtoken";
import logger from "../utils/logger";
import User from "../models/user";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      authId: string;
    }
  }
}

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASEURL,
  tokenSigningAlg: "RS256",
});

export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.sendStatus(401); // Unauthorized
  }

  // Bearer lshdflshdjkhvjkshdjkvh34h5k3h54jkh
  const token = authorization.split(" ")[1];

  try {
    const decoded = decode(token) as JwtPayload;

    const authId = decoded.sub;

    const user = await User.findOne({ authId });

    if (!user) {
      return res.sendStatus(401); // Unauthorized
    }
    req.authId = authId as string;
    req.userId = user._id.toString();

    next(); // Continue to the next middleware or route handler.
  } catch (error) {
    logger.error(error);
    return res.sendStatus(401); // Unauthorized
  }
};
