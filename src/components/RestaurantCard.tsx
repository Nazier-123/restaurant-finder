import React from 'react';
import { Star, MapPin, Users } from 'lucide-react';
import type { Restaurant } from '../types';

interface Props {
  restaurant: Restaurant;
  onClick: () => void;
}

export function RestaurantCard({ restaurant, onClick }: Props) {
  const photoUrl = restaurant.photos?.[0]?.getUrl();
  
  return (
    <div 
      className="group bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-xl font-bold text-white">{restaurant.name}</h3>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <MapPin size={16} className="text-emerald-500" />
          <span className="text-sm">{restaurant.vicinity}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-500" />
            <span className="font-medium">{restaurant.rating}</span>
            <span className="text-gray-400 mx-1">•</span>
            <div className="flex items-center gap-1">
              <Users size={14} className="text-blue-500" />
              <span className="text-sm text-gray-600">{restaurant.userRatingsTotal}</span>
            </div>
          </div>
          {restaurant.distance && (
            <div className="text-sm font-medium text-emerald-600">
              {(restaurant.distance / 1000).toFixed(1)} km
            </div>
          )}
        </div>
      </div>
    </div>
  );
}