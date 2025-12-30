import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, MapPin, BedDouble, Bath, Square, ArrowRight, Home as HomeIcon } from 'lucide-react';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Fetch properties on load
  useEffect(() => {
    fetchProperties();
  }, []);

  // Helper function to fetch data
  const fetchProperties = async (query = '') => {
    setLoading(true);
    try {
      // Use the search endpoint (POST request as defined in backend)
      const url = query
        ? `http://localhost:8000/api/v1/properties/search?query=${query}`
        : 'http://localhost:8000/api/v1/properties/search';

      const response = await axios.post(url);
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Search Form Submit
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties(searchQuery);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* --- HERO SECTION --- */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Find Your Dream Home in Zimbabwe
          </h1>
          <p className="text-xl text-blue-100 mb-8 font-light">
            The only platform with AI-Powered Risk Analysis for safe property buying.
          </p>

          <form onSubmit={handleSearch} className="flex p-2 bg-white rounded-full shadow-2xl max-w-2xl mx-auto transition-transform hover:scale-[1.01]">
            <input
              type="text"
              placeholder="e.g., '3 bedroom house in Borrowdale under 150k'"
              className="flex-grow px-6 py-3 rounded-l-full text-gray-900 outline-none placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition flex items-center gap-2 shadow-md"
            >
              <Search className="w-5 h-5" /> <span className="hidden sm:inline">Search</span>
            </button>
          </form>
        </div>
      </div>

      {/* --- LISTINGS GRID --- */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Latest Listings</h2>
            <span className="text-gray-500 text-sm">{properties.length} properties found</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p>Scanning properties...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 group flex flex-col h-full">

                {/* Image Section */}
                <div className="h-64 bg-gray-200 relative overflow-hidden">
                   {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0].image_url}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                      />
                   ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
                        <HomeIcon className="w-12 h-12 mb-2 opacity-20" />
                        <span className="text-sm">No Photos</span>
                      </div>
                   )}

                   {/* Status Badge */}
                   <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold shadow-sm uppercase tracking-wide text-gray-700">
                     {property.listing_status}
                   </div>

                   {/* Risk Score Badge */}
                   <div className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1 ${
                        property.risk_score < 20 ? 'bg-green-100 text-green-700' :
                        property.risk_score < 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                     }`}>
                       Risk Score: {property.risk_score}
                   </div>
                </div>

                {/* Details Section */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-4">
                     <p className="text-blue-600 font-extrabold text-2xl mb-1">${property.price.toLocaleString()}</p>
                     <h3 className="font-bold text-gray-900 text-lg line-clamp-1" title={property.title}>{property.title}</h3>
                  </div>

                  <div className="flex items-center text-gray-500 text-sm mb-6">
                    <MapPin className="w-4 h-4 mr-1 text-gray-400" /> {property.suburb}, {property.city}
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-4 mb-6">
                    <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-lg">
                        <BedDouble className="w-5 h-5 text-gray-400 mb-1" />
                        <span className="text-sm font-bold text-gray-700">{property.bedrooms} Beds</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-lg">
                        <Bath className="w-5 h-5 text-gray-400 mb-1" />
                        <span className="text-sm font-bold text-gray-700">{property.bathrooms} Baths</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-lg">
                        <Square className="w-5 h-5 text-gray-400 mb-1" />
                        <span className="text-sm font-bold text-gray-700">{property.land_size}m²</span>
                    </div>
                  </div>

                  {/* Button */}
                  <div className="mt-auto">
                    <Link to={`/property/${property.id}`} className="block w-full text-center bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg">
                        View Full Analysis <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && properties.length === 0 && (
            <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No properties found matching your search.</p>
                <button
                    onClick={() => {setSearchQuery(''); fetchProperties('');}}
                    className="mt-4 text-blue-600 font-bold hover:underline"
                >
                    Clear Search
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Home;