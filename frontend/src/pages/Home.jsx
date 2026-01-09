import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, MapPin, BedDouble, Bath, Square, ArrowRight, ShieldCheck, Zap, Lock } from 'lucide-react';
import { API_URL } from '../config';

// --- 🏡 HIGH-QUALITY DUMMY DATA ---
const DUMMY_PROPERTIES = [
    {
        id: 'dummy-1',
        title: 'Modern Villa in Borrowdale Brooke',
        price: 450000,
        location: 'Borrowdale Brooke, Harare',
        bedrooms: 5,
        bathrooms: 4,
        land_size: 2000,
        risk_score: 12, // Safe
        image_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
        listing_status: 'For Sale'
    },
    {
        id: 'dummy-2',
        title: 'Luxury Apartment in Avondale',
        price: 120000,
        location: 'Avondale, Harare',
        bedrooms: 2,
        bathrooms: 2,
        land_size: 150,
        risk_score: 8, // Very Safe
        image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
        listing_status: 'For Sale'
    },
    {
        id: 'dummy-3',
        title: 'Family Home in Bulawayo',
        price: 85000,
        location: 'Hillside, Bulawayo',
        bedrooms: 4,
        bathrooms: 2,
        land_size: 1200,
        risk_score: 45, // Moderate Risk (Educational)
        image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
        listing_status: 'For Sale'
    },
    {
        id: 'dummy-4',
        title: 'Sunset Penthouse',
        price: 280000,
        location: 'Newlands, Harare',
        bedrooms: 3,
        bathrooms: 3,
        land_size: 300,
        risk_score: 5, // Extremely Safe
        image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        listing_status: 'For Sale'
    },
    // Add these to the existing DUMMY_PROPERTIES array:

    {
        id: 'dummy-6',
        title: 'Extended Core House in Budiriro',
        price: 35000,
        location: 'Budiriro 5, Harare',
        bedrooms: 4,
        bathrooms: 1,
        land_size: 300,
        risk_score: 42, // Moderate Risk (Cession issues)
        image_url: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=800&q=80',
        listing_status: 'For Sale'
    },
    {
        id: 'dummy-7',
        title: 'Investment Property in Highfield',
        price: 45000,
        location: 'Western Triangle, Highfield',
        bedrooms: 7,
        bathrooms: 2, // Main house + cottage
        land_size: 200,
        risk_score: 65, // High Risk (Deceased Estate / Old Title)
        image_url: 'https://images.unsplash.com/photo-1599809275671-b5942cabc7ad?auto=format&fit=crop&w=800&q=80',
        listing_status: 'For Sale'
    }
];

const Home = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                // Try to fetch real data
                const response = await axios.get(`${API_URL}/api/v1/properties/`);

                // Combine Real Data + Dummy Data
                // (We map over real data to ensure image URLs are correct)
                const realProperties = response.data.map(p => ({
                    ...p,
                    image_url: p.images && p.images.length > 0
                        ? (p.images[0].image_url.startsWith('http') ? p.images[0].image_url : `${API_URL}${p.images[0].image_url}`)
                        : 'https://via.placeholder.com/800x600?text=No+Image'
                }));

                setProperties([...realProperties, ...DUMMY_PROPERTIES]);
            } catch (err) {
                console.warn("Backend offline or empty, showing dummy data only.");
                setProperties(DUMMY_PROPERTIES);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    // Filter Logic
    const filteredProperties = properties.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">

            {/* --- 1. HERO SECTION --- */}
            <div className="relative bg-blue-900 h-[500px] flex items-center justify-center text-center px-4 overflow-hidden">
                {/* Abstract Background Elements */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent"></div>

                <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <span className="bg-blue-500/20 text-blue-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-blue-400/30">
            Zimbabwe's First AI Real Estate Platform
          </span>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                        Find Your Dream Home, <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Without the Risk.</span>
                    </h1>
                    <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                        SmartEstate AI analyzes market data and title deeds to verify every listing, giving you a safety score before you view.
                    </p>

                    {/* Search Bar */}
                    <div className="bg-white p-2 rounded-full shadow-2xl max-w-xl mx-auto flex items-center transform translate-y-4">
                        <div className="pl-4 text-gray-400"><Search className="w-5 h-5"/></div>
                        <input
                            type="text"
                            placeholder="Search by city, suburb, or price..."
                            className="flex-grow p-3 outline-none text-gray-700 font-medium placeholder-gray-400 bg-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold transition">
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* --- 2. FEATURES STRIP --- */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><ShieldCheck className="w-8 h-8"/></div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">AI Due Diligence</h3>
                            <p className="text-sm text-gray-500 mt-1">Every property gets an automated risk score based on price and legal data.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600"><Zap className="w-8 h-8"/></div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">Instant Verification</h3>
                            <p className="text-sm text-gray-500 mt-1">No more waiting. Get preliminary title deed checks in seconds, not weeks.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-purple-50 rounded-lg text-purple-600"><Lock className="w-8 h-8"/></div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">Secure & Transparent</h3>
                            <p className="text-sm text-gray-500 mt-1">We verify agent identities to prevent fraud and double-selling scams.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 3. PROPERTY LISTINGS --- */}
            <div className="max-w-7xl mx-auto py-16 px-4">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Featured Listings</h2>
                        <p className="text-gray-500 mt-2">Explore verified properties with low risk scores.</p>
                    </div>
                    <button className="hidden md:flex items-center gap-2 text-blue-600 font-bold hover:underline">
                        View All <ArrowRight className="w-4 h-4"/>
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredProperties.map((property) => (
                            <Link to={`/property/${property.id}`} key={property.id} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition duration-300">

                                {/* Image Area */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={property.image_url}
                                        alt={property.title}
                                        className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                                    />
                                    {/* Risk Badge */}
                                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                                        property.risk_score < 20 ? 'bg-emerald-500 text-white' :
                                            property.risk_score < 50 ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
                                    }`}>
                                        Risk: {property.risk_score}/100
                                    </div>

                                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                                        {property.listing_status}
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{property.title}</h3>
                                    </div>

                                    <div className="flex items-center text-gray-500 text-sm mb-4">
                                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                        {property.location}
                                    </div>

                                    <div className="flex items-center justify-between text-gray-500 text-xs py-3 border-t border-gray-100">
                                        <div className="flex items-center gap-1"><BedDouble className="w-4 h-4"/> {property.bedrooms} Beds</div>
                                        <div className="flex items-center gap-1"><Bath className="w-4 h-4"/> {property.bathrooms} Baths</div>
                                        <div className="flex items-center gap-1"><Square className="w-4 h-4"/> {property.land_size}m²</div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-black text-blue-900">
                      ${property.price.toLocaleString()}
                    </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;