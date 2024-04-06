import express from "express";
import UserRoute from "./UserRoute";
import MyRestaurantRoute from "./MyRestaurantRoute";
import RestaurantRoute from "./RestaurantRoute";

const apiRouter = express.Router();

apiRouter.use("/user", UserRoute);

apiRouter.use("/my/restaurant", MyRestaurantRoute);

apiRouter.use("/restaurant", RestaurantRoute);

export default apiRouter;
