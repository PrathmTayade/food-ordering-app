export type User = {
  _id: string;
  email: string;
  name: string;
  addressLine1: string;
  city: string;
  country: string;
};

export type Restaurant = {
  _id: string;
  user: string;
  restaurantName: string;
  city: string;
  country: string;
  deliveryPrice: number;
  estimatedDeliveryTime: number;
  cuisines: string[];
  menuItems: MenuItem[];
  imageUrl: string;
  lastUpdated: string;
};

export type MenuItem = {
  _id: string;
  name: string;
  price: number;
};
// export type OrderStatus =
//   | "placed"
//   | "paid"
//   | "inProgress"
//   | "outForDelivery"
//   | "delivered";

export enum OrderStatus {
  placed = "placed",
  paid = "paid",
  inProgress = "inProgress",
  outForDelivery = "outForDelivery",
  delivered = "delivered",
}
export type Order = {
  _id: string;
  restaurant: Restaurant;
  user: User;
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    name: string;
    addressLine1: string;
    city: string;
    email: string;
  };
  totalAmount: number;
  orderStatus: OrderStatus;
  createdAt: string;
  restaurantId: string;
};

export type OrderStatusInfo = {
  label: string;
  value: OrderStatus;
  progressValue: number;
};

export type SearchState = {
  searchQuery: string;
  page: number;
  selectedCuisines: string[];
  sortOption: string;
};

export type RestaurantSearchResponse = {
  data: Restaurant[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};
