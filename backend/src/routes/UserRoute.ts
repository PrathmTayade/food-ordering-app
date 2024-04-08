import { Router } from "express";
import UserController from "../controllers/UserController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateUserRequest } from "../middleware/validation";

const router = Router();

// uses jwt middleware to check for auth

/** GET Methods */
/**
 * @openapi
 * '/api/user/':
 *  get:
 *     tags:
 *     - User Controller
 *     summary: Get a user by userId
 *     parameters:
 *      - userId: User id
 *        in: path
 *        description: id of the user
 *        required: true
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get("/", jwtCheck, jwtParse, UserController.getCurrentUser);

/** POST Methods */
/**
 * @openapi
 * '/api/user/':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Create a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - authId
 *            properties:
 *              authId:
 *                type: string
 *                default: johndoe
 *     responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.post("/", jwtCheck, UserController.createCurrentUser);

router.put(
  "/",
  jwtCheck,
  jwtParse,
  validateUserRequest,
  UserController.updateCurrentUser
);

export default router;
