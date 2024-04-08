import { Request, Response } from "express";
import Restaurant, { MenuItemType } from "../models/restaurant";
import Stripe from "stripe";
import stripe from "../config/stripe";
import logger from "../utils/logger";

const FRONTEND_URL = process.env.FRONTEND_URL as string;

type CheckoutSessionRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    city: string;
  };
  restaurantId: string;
};
const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;

    const restaurant = await Restaurant.findById(
      checkoutSessionRequest.restaurantId
    );

    if (!restaurant) {
      throw new Error("Restaurant not found");

      // return res.status(404).json({ message: "Restaurant not found" });
    }

    const lineItems = createLineItemsForStripe(
      checkoutSessionRequest,
      restaurant.menuItems
    );

    const session = await createStipeSession(
      lineItems,
    //  todo fix
      "neworderID",
      restaurant.deliveryPrice,
      restaurant._id.toString()
    );

    if (!session.url) {
      throw new Error("Session not created");
    }

    //   await newOrder.save()

    res.json({ url: session.url }).status(200);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createLineItemsForStripe = (
  checkoutSessionReques: CheckoutSessionRequest,
  menuItems: MenuItemType[]
) => {
  const lineItems = checkoutSessionReques.cartItems.map((cartItem) => {
    const menuItem = menuItems.find(
      (item) => item._id.toString() === cartItem.menuItemId.toString()
    );
    if (!menuItem) {
      throw new Error("MenuItem not found ");
    }

    const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: "inr",
        product_data: {
          name: cartItem.name,
        },
        unit_amount: menuItem.price,
      },
      quantity: parseInt(cartItem.quantity),
    };
    return line_item;
  });
  return lineItems;
};

const createStipeSession = async (
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  orderId: string,
  deliveryPrice: number,
  restaurantId: string
) => {
  const sessionData = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Delivery",
          type: "fixed_amount",
          fixed_amount: { amount: deliveryPrice, currency: "inr" },
        },
      },
    ],
    metadata: { orderId, restaurantId },
    success_url: `${FRONTEND_URL}/order-status?sucess=true`,
    cancel_url: `${FRONTEND_URL}/details/${restaurantId}?cancelled=true`,
  });

  return sessionData;
};




export default { createCheckoutSession };
