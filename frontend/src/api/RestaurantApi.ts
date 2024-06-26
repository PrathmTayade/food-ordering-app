import { Restaurant, RestaurantSearchResponse, SearchState } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/utils";

export const useGetRestaurant = (restaurantId?: string) => {
  const getRestaurantByIdRequest = async (): Promise<Restaurant> => {
    const response = await fetch(`${API_BASE_URL}/restaurant/${restaurantId}`);

    if (!response.ok) {
      throw new Error("Failed to get restaurant");
    }

    return response.json();
  };

  const { data: restaurant, isPending: isLoading } = useQuery({
    queryKey: ["fetchRestaurant"],
    queryFn: getRestaurantByIdRequest,
    enabled: !!restaurantId,
  });

  return { restaurant, isLoading };
};

export const useSearchRestaurants = (
  searchState: SearchState,
  city?: string
) => {
  const createSearchRequest = async (): Promise<RestaurantSearchResponse> => {
    const params = new URLSearchParams();
    params.set("searchQuery", searchState.searchQuery);
    params.set("page", searchState.page.toString());
    params.set("selectedCuisines", searchState.selectedCuisines.join(","));
    params.set("sortOption", searchState.sortOption);

    const response = await fetch(
      `${API_BASE_URL}/restaurant/search/${city}?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to get restaurant");
    }

    return response.json();
  };

  const { data: results, isPending: isLoading } = useQuery({
    queryKey: ["searchRestaurants", searchState],
    queryFn: createSearchRequest,
    enabled: !!city,
  });

  return {
    results,
    isLoading,
  };
};
