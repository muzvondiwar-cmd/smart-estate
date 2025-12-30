import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, BedDouble, Bath, ShieldCheck, AlertTriangle } from 'lucide-react';

const PropertyCard = ({ property }) => {

  // Dynamic Risk Badge Logic
  const getRiskBadge = (score) => {
    if (score < 20) {
      return (
        <span className="flex items-center gap-1 bg-green-500/10 text-green-700 px-2 py-1 rounded-md text-xs font-bold border border-green-200">
          <ShieldCheck className="w-3 h-3" /> Safe ({score}%)
        </span>
      );
    }
    if (score < 50) {
      return (
        <span className="flex items-center gap-1 bg-yellow-500/10 text-yellow-700 px-2 py-1 rounded-md text-xs font-bold border border-yellow-200">
          <AlertTriangle className="w-3 h-3" /> Medium Risk ({score}%)
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 bg-red-500/10 text-red-700 px-2 py-1 rounded-md text-xs font-bold border border-red-200">
        <AlertTriangle className="w-3 h-3" /> High Risk ({score}%)
      </span>
    );
  };

  // Safe image fallback: Use the first uploaded image, or a placeholder if none exist
  const imageUrl = property.images && property.images.length > 0
    ? property.images[0].image_url
    : "https://images.unsplash.com/photo-1600596542815-27b88e35eabd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  return (
    <Link to={`/properties/${property.id}`} className="block group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer">

      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={imageUrl}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm uppercase tracking-wide">
          {property.property_type}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
           <p className="text-white font-bold text-xl">${property.price.toLocaleString()}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-900 text-lg line-clamp-1 group-hover:text-blue-600 transition">
            {property.title}
          </h3>
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
          <MapPin className="w-4 h-4" />
          {property.suburb}, {property.city}
        </div>

        {/* Specs Grid */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-1.5">
            <BedDouble className="w-4 h-4 text-blue-500" />
            <span className="font-semibold">{property.bedrooms}</span> Beds
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-blue-500" />
            <span className="font-semibold">{property.bathrooms}</span> Bath
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-50">
           <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
             {property.ownership_status.replace('_', ' ')}
           </span>
           {getRiskBadge(property.risk_score)}
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;