import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Sparkles } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';

const Listings = () => {
  const [properties, setProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState(null);

  const fetchProperties = async (query = '') => {
    setLoading(true);
    setAiExplanation(null);
    try {
      // We send the query as a URL parameter: ?query=value
      const url = `http://localhost:8000/api/v1/properties/search?query=${encodeURIComponent(query)}`;
      const response = await axios.post(url);
      setProperties(response.data);

      // Simple logic to show a badge if we actually searched for something
      if (query) {
        setAiExplanation("Search results updated.");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load (empty search = show all)
  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties(searchQuery);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO SECTION */}
      <div className="bg-slate-900 text-white py-16 px-4 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-blue-200 text-sm font-medium mb-6 border border-white/10">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Risk Analysis</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
            Find Real Estate in Zimbabwe <br/> Without the <span className="text-blue-400">Risk.</span>
          </h1>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
            <div className="relative flex items-center bg-white rounded-full shadow-2xl p-2">
              <Search className="w-6 h-6 text-gray-400 ml-4" />
              <input
                type="text"
                className="w-full p-4 text-gray-900 placeholder-gray-400 outline-none bg-transparent text-lg"
                placeholder="Describe your dream home..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/25"
              >
                {loading ? 'Analyzing...' : 'Search'}
              </button>
            </div>
          </form>

          {aiExplanation && (
             <div className="mt-6 inline-block bg-blue-900/50 border border-blue-500/30 px-6 py-2 rounded-lg">
                <p className="text-sm text-blue-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  {aiExplanation}
                </p>
             </div>
          )}
        </div>
      </div>

      {/* RESULTS SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Listings</h2>
          <span className="text-gray-500 text-sm">{properties.length} properties found</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[1,2,3].map(i => (
                <div key={i} className="h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
             ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}

        {!loading && properties.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
                <button onClick={() => fetchProperties()} className="mt-4 text-blue-600 font-medium">Clear Filters</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Listings;