import { Router } from "express";
import multer from "multer";
import MyRestaurantController from "../controllers/MyRestaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyRestaurantRequest } from "../middleware/validation";

const router = Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5mb
  },
});

// api
router.get("/", MyRestaurantController.getMyRestaurant);

router.post(
  "/",
  jwtCheck,
  jwtParse,
  upload.single("imageFile"),
  validateMyRestaurantRequest,
  MyRestaurantController.createMyRestaurant
);

export default router;
