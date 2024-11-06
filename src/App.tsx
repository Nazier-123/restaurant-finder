import React, { useState, useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Search, Utensils, MapPin } from 'lucide-react';
import { RestaurantCard } from './components/RestaurantCard';
import { RestaurantModal } from './components/RestaurantModal';
import { LocationErrorMessage } from './components/LocationError';
import type { Restaurant, RestaurantDetails, LocationError } from './types';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBJxKMrd_IzMojmPaNEGi4uI4Hhy8aQ6_U';

function App() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<LocationError | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantDetails | null>(null);

  const fetchPlaceDetails = async (placeId: string): Promise<RestaurantDetails | null> => {
    return new Promise((resolve) => {
      const service = new google.maps.places.PlacesService(
        document.createElement('div')
      );

      service.getDetails(
        {
          placeId,
          fields: ['formatted_phone_number', 'website', 'opening_hours', 'formatted_address', 'price_level'],
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            const restaurant = restaurants.find(r => r.placeId === placeId);
            if (!restaurant) {
              resolve(null);
              return;
            }

            resolve({
              ...restaurant,
              phoneNumber: place.formatted_phone_number,
              website: place.website,
              address: place.formatted_address,
              openingHours: place.opening_hours?.weekday_text,
              priceLevel: place.price_level,
            });
          } else {
            resolve(null);
          }
        }
      );
    });
  };

  const handleRestaurantClick = async (restaurant: Restaurant) => {
    const details = await fetchPlaceDetails(restaurant.placeId);
    if (details) {
      setSelectedRestaurant(details);
    }
  };

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: GOOGLE_MAPS_API_KEY,
          version: "weekly",
          libraries: ["places", "geometry"]
        });

        await loader.load();

        if (!navigator.geolocation) {
          setError({
            type: 'error',
            message: 'Geolocation is not supported by your browser'
          });
          setLoading(false);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const location = new google.maps.LatLng(latitude, longitude);
            
            const service = new google.maps.places.PlacesService(
              document.createElement('div')
            );

            const request = {
              location,
              radius: 5000,
              keyword: 'halal restaurant',
              type: 'restaurant',
              rankBy: google.maps.places.RankBy.RATING
            };

            service.nearbySearch(request, (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                const restaurantResults = results
                  .filter(place => place.geometry?.location)
                  .map(place => ({
                    name: place.name || '',
                    rating: place.rating || 0,
                    userRatingsTotal: place.user_ratings_total || 0,
                    vicinity: place.vicinity || '',
                    photos: place.photos,
                    placeId: place.place_id || '',
                    distance: google.maps.geometry.spherical.computeDistanceBetween(
                      location,
                      place.geometry!.location
                    )
                  }))
                  .sort((a, b) => {
                    const scoreA = (a.rating * Math.log10(a.userRatingsTotal + 1));
                    const scoreB = (b.rating * Math.log10(b.userRatingsTotal + 1));
                    return scoreB - scoreA;
                  });

                setRestaurants(restaurantResults);
                setLoading(false);
              } else {
                setError({
                  type: 'error',
                  message: 'Failed to fetch restaurants'
                });
                setLoading(false);
              }
            });
          },
          () => {
            setError({
              type: 'error',
              message: 'Unable to retrieve your location'
            });
            setLoading(false);
          }
        );
      } catch (err) {
        setError({
          type: 'error',
          message: 'Failed to initialize map services'
        });
        setLoading(false);
      }
    };

    initMap();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="gradient-bg text-white py-8 px-4 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1920&q=80')] opacity-10 bg-cover bg-center" />
        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <Utensils size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Halal Restaurant Finder</h1>
              <p className="mt-2 text-emerald-100 text-lg">Discover the best Halal restaurants near you</p>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm text-emerald-100">
            <MapPin size={16} />
            <span>Using your current location</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12 text-gray-600">
            <Search className="w-8 h-8 animate-spin" />
            <p className="text-lg">Finding the best Halal restaurants near you...</p>
          </div>
        ) : error ? (
          <LocationErrorMessage error={error} />
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Found {restaurants.length} restaurants near you
              </h2>
              <p className="text-gray-600 mt-1">Sorted by rating and popularity</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {restaurants.map((restaurant, index) => (
                <div
                  key={restaurant.placeId}
                  className="transform transition-all duration-300"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'slideUp 0.5s ease-out forwards'
                  }}
                >
                  <RestaurantCard
                    restaurant={restaurant}
                    onClick={() => handleRestaurantClick(restaurant)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {selectedRestaurant && (
        <RestaurantModal
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
        />
      )}
    </div>
  );
}

export default App;