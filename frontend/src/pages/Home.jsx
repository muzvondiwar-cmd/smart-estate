import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, MapPin, BedDouble, Bath, Square, Home as HomeIcon, AlertTriangle } from 'lucide-react';
import { API_URL } from '../config'; // <--- IMPORTANT: Reads your config file

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch properties from the Backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        console.log("Fetching from:", `${API_URL}/api/v1/properties`); // Debug log
        const response = await axios.get(`${API_URL}/api/v1/properties`);
        setProperties(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError('Failed to load properties. Please check your connection.');
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Filter properties based on search
  const filteredProperties = properties.filter((property) =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.suburb.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12">

      {/* --- HERO SECTION --- */}
      <div className="bg-white border-b border-gray-200 pt-16 pb-12 px-4 mb-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">

          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            AI-Verified Real Estate
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Invest with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500">Confidence.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            The first marketplace in Zimbabwe that uses Artificial Intelligence to
            detect fraud, verify title deeds, and score investment risk in real-time.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mt-8 relative">
            <input
              type="text"
              placeholder="Search by suburb, city, or property type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
            <Search className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>

      {/* --- LISTINGS GRID --- */}
      <div className="max-w-7xl mx-auto px-4">

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <div key={property.id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">

              {/* Image Area */}
              <div className="h-56 bg-gray-100 relative overflow-hidden">
                 {/* Try to show first image, else fallback */}
                 {property.images && property.images.length > 0 ? (
                    <img
                      src={`${API_URL}${property.images[0].image_url}`}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300?text=No+Image"; // Fallback if link breaks
                      }}
                    />
                 ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50">
                      <HomeIcon className="w-10 h-10 mb-2 opacity-30" />
                      <span className="text-xs font-medium uppercase tracking-widest">No Photos</span>
                    </div>
                 )}

                 {/* Status Tag */}
                 <div className="absolute top-3 left-3">
                    <span className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-gray-800 shadow-sm border border-gray-100">
                       {property.listing_status}
                    </span>
                 </div>

                 {/* Risk Badge */}
                 <div className={`absolute top-3 right-3 px-2 py-1 rounded flex items-center gap-1 shadow-sm border ${
                      property.risk_score < 20 ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                      property.risk_score < 50 ? 'bg-yellow-50 border-yellow-100 text-yellow-700' :
                      'bg-rose-50 border-rose-100 text-rose-700'
                   }`}>
                     <div className={`w-1.5 h-1.5 rounded-full ${
                        property.risk_score < 20 ? 'bg-emerald-500' : property.risk_score < 50 ? 'bg-yellow-500' : 'bg-rose-500'
                     }`}></div>
                     <span className="text-[10px] font-bold uppercase tracking-wide">Risk: {property.risk_score}</span>
                 </div>
              </div>

              {/* Details Area */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="mb-4">
                   <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-1 group-hover:text-blue-600 transition-colors">
                     {property.title}
                   </h3>
                   <p className="text-2xl font-bold text-gray-900 tracking-tight mt-1">
                     ${property.price.toLocaleString()}
                   </p>
                   <div className="flex items-center text-gray-500 text-sm mt-1">
                      <MapPin className="w-3.5 h-3.5 mr-1" />
                      <span className="truncate">{property.suburb}, {property.city}</span>
                   </div>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-3 py-4 border-t border-gray-100 mt-auto">
                  <div className="flex flex-col items-start">
                      <div className="flex items-center gap-1 text-gray-400 mb-0.5">
                         <BedDouble className="w-4 h-4" />
                         <span className="text-xs font-medium uppercase">Beds</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{property.bedrooms}</span>
                  </div>
                  <div className="flex flex-col items-start border-l border-gray-100 pl-3">
                      <div className="flex items-center gap-1 text-gray-400 mb-0.5">
                         <Bath className="w-4 h-4" />
                         <span className="text-xs font-medium uppercase">Baths</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{property.bathrooms}</span>
                  </div>
                  <div className="flex flex-col items-start border-l border-gray-100 pl-3">
                      <div className="flex items-center gap-1 text-gray-400 mb-0.5">
                         <Square className="w-4 h-4" />
                         <span className="text-xs font-medium uppercase">Area</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{property.land_size}m²</span>
                  </div>
                </div>

                {/* Button */}
                <Link to={`/property/${property.id}`} className="mt-4 w-full block text-center bg-gray-900 hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition-all duration-300 text-sm">
                    View Analysis
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && filteredProperties.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No properties found matching "{searchTerm}"</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;