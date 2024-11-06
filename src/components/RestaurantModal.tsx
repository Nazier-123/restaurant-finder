import React from 'react';
import { X, Phone, Globe, Clock, MapPin, Star, Users } from 'lucide-react';
import type { RestaurantDetails } from '../types';
import { useScrollLock } from '../hooks/useScrollLock';

interface Props {
  restaurant: RestaurantDetails;
  onClose: () => void;
}

export function RestaurantModal({ restaurant, onClose }: Props) {
  useScrollLock(true);
  
  const photoUrl = restaurant.photos?.[0]?.getUrl();
  
  const priceLevel = restaurant.priceLevel 
    ? Array(restaurant.priceLevel).fill('$').join('')
    : 'N/A';

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 modal-overlay" onClick={onClose}>
      <div 
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto modal-content"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative">
          <div className="h-72 w-full">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-3xl font-bold mb-2">{restaurant.name}</h2>
            <div className="flex items-center gap-3 text-white/90">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-medium">{restaurant.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-5 h-5 text-blue-400" />
                <span>{restaurant.userRatingsTotal} reviews</span>
              </div>
              <span className="text-emerald-400 font-medium">{priceLevel}</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <MapPin className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Address</h3>
              <p className="text-gray-600">{restaurant.address || restaurant.vicinity}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {restaurant.phoneNumber && (
              <a 
                href={`tel:${restaurant.phoneNumber}`}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Phone className="w-5 h-5 text-blue-500" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Phone</h3>
                  <p className="text-blue-600">{restaurant.phoneNumber}</p>
                </div>
              </a>
            )}

            {restaurant.website && (
              <a 
                href={restaurant.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Globe className="w-5 h-5 text-purple-500" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Website</h3>
                  <p className="text-purple-600">Visit Website</p>
                </div>
              </a>
            )}
          </div>

          {restaurant.openingHours && (
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Opening Hours</h3>
                <ul className="space-y-1 text-gray-600">
                  {restaurant.openingHours.map((hours, index) => (
                    <li key={index} className="text-sm">{hours}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {restaurant.distance && (
            <div className="flex justify-end">
              <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                {(restaurant.distance / 1000).toFixed(1)} km away
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}