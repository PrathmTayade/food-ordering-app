import { Router } from "express";
import UserController from "../controllers/UserController";

const router = Router();

router.post("/create", UserController.createCurrentUser);

export default router;
