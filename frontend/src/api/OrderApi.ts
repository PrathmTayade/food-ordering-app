import { API_BASE_URL } from "@/lib/utils";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type CheckoutSessionRequest = {
  restaurantId: string;
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
};

export const useCreateCheckoutSession = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createCheckoutSessionRequest = async (
    checkoutSessionRequest: CheckoutSessionRequest
  ) => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(
      `${API_BASE_URL}/order/checkout/create-checkout-session`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutSessionRequest),
      }
    );

    if (!response.ok) {
      throw new Error("Unable to create checkout session");
    }

    return response.json();
  };

  const {
    mutateAsync: createCheckoutSession,
    isPending,
    error,
    reset,
  } = useMutation({ mutationFn: createCheckoutSessionRequest });

  if (error) {
    toast.error(error.toString());
    reset();
  }

  return {
    createCheckoutSession,
    isPending,
  };
};

export default { useCreateCheckoutSession };
