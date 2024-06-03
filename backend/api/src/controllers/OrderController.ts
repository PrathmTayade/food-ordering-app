import { Request, Response } from "express";
import Restaurant, { MenuItemType } from "../models/restaurant";
import stripe from "../config/stripe";
import logger from "../utils/logger";
import Order from "../models/order";
import Stripe from "stripe";

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

    const newOrder = new Order({
      restaurant: restaurant,
      user: req.userId,
      cartItems: checkoutSessionRequest.cartItems,
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      orderStatus: "placed",
      createdAt: new Date(),
    });

    const lineItems = createLineItemsForStripe(
      checkoutSessionRequest,
      restaurant.menuItems
    );

    const session = await createStipeSession(
      lineItems,
      newOrder._id.toString(),
      restaurant.deliveryPrice,
      restaurant._id.toString()
    );

    if (!session.url) {
      throw new Error("Session not created");
    }
    // todo implement advance resilience
    await newOrder.save();

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
    // customer_creation: "always",
    // shipping_address_collection: { allowed_countries: ["IN"] },
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Delivery",
          type: "fixed_amount",
          fixed_amount: { amount: deliveryPrice, currency: "inr" },
        },
      },
    ],
    currency: "inr",
    metadata: { orderId, restaurantId },
    success_url: `${FRONTEND_URL}/order-status?sucess=true`,
    cancel_url: `${FRONTEND_URL}/details/${restaurantId}?cancelled=true`,
  });

  return sessionData;
};

// stripe webhook

const stripWebhookHandler = async (request: Request, response: Response) => {
  const sig = request.headers["stripe-signature"] as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    logger.error(err);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const order = await Order.findById(event.data.object.metadata?.orderId);

      if (!order) {
        logger.error("Order not found");
        return response.status(404).json({ message: "Order not found" });
      }
      // udpate the order
      order.totalAmount = event.data.object.amount_total;
      order.orderStatus = "paid";

      await order.save();
      response.status(200).send();
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
};

const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate("restaurant")
      .populate("user");
    res.json(orders);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// todo update order status apis

export default { createCheckoutSession, stripWebhookHandler, getMyOrders };
