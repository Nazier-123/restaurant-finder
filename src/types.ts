export interface Restaurant {
  name: string;
  rating: number;
  userRatingsTotal: number;
  vicinity: string;
  photos?: google.maps.places.PlacePhoto[];
  placeId: string;
  distance?: number;
}

export interface RestaurantDetails extends Restaurant {
  phoneNumber?: string;
  website?: string;
  address?: string;
  openingHours?: string[];
  priceLevel?: number;
}

export interface LocationError {
  message: string;
  type: 'error' | 'warning';
}