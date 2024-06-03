import express from "express";
import UserRoute from "./UserRoute";
import MyRestaurantRoute from "./MyRestaurantRoute";
import RestaurantRoute from "./RestaurantRoute";
import OrderRoute from "./OrderRoute";

const apiRouter = express.Router();

apiRouter.use("/user", UserRoute);

apiRouter.use("/my/restaurant", MyRestaurantRoute);

apiRouter.use("/restaurant", RestaurantRoute);

apiRouter.use("/order", OrderRoute);

export default apiRouter;
