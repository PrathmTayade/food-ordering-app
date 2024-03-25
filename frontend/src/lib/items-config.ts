import { OrderStatus, OrderStatusInfo } from "./types";

export const cuisineList = [
  "American",
  "BBQ",
  "Breakfast",
  "Burgers",
  "Cafe",
  "Chinese",
  "Desserts",
  "French",
  "Greek",
  "Healthy",
  "Indian",
  "Italian",
  "Japanese",
  "Mexican",
  "Noodles",
  "Organic",
  "Pasta",
  "Pizza",
  "Salads",
  "Seafood",
  "Spanish",
  "Steak",
  "Sushi",
  "Vegan",
];


export const ORDER_STATUS: OrderStatusInfo[] = [
  { label: "Placed", value: OrderStatus.placed, progressValue: 0 },
  {
    label: "Awaiting Restaurant Confirmation",
    value: OrderStatus.paid,
    progressValue: 25,
  },
  { label: "In Progress", value: OrderStatus.inProgress, progressValue: 50 },
  {
    label: "Out for Delivery",
    value: OrderStatus.outForDelivery,
    progressValue: 75,
  },
  { label: "Delivered", value: OrderStatus.delivered, progressValue: 100 },
];
