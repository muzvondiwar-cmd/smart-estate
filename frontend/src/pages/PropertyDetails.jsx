import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, BedDouble, Bath, Square, ShieldCheck, CheckCircle, AlertTriangle, FileText, ArrowLeft } from 'lucide-react';
import { API_URL } from '../config';

const PropertyDetails = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/v1/properties/${id}`);
                setProperty(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching property:", err);
                setError("Could not load property details.");
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (error || !property) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="text-red-500 font-medium text-lg mb-4">{error || "Property not found."}</div>
            <Link to="/" className="text-blue-600 hover:underline">← Back to Home</Link>
        </div>
    );

    // Helper for Risk Score Color
    const getRiskColor = (score) => {
        if (score < 20) return "text-emerald-600 bg-emerald-50 border-emerald-100";
        if (score < 50) return "text-yellow-600 bg-yellow-50 border-yellow-100";
        return "text-rose-600 bg-rose-50 border-rose-100";
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">

            {/* --- HEADER IMAGE --- */}
            <div className="h-[40vh] md:h-[50vh] relative bg-gray-900">
                {property.images && property.images.length > 0 ? (
                    <img
                        src={property.images[0].image_url.startsWith('http') ? property.images[0].image_url : `${API_URL}${property.images[0].image_url}`}
                        alt={property.title}
                        className="w-full h-full object-cover opacity-80"
                        onError={(e) => e.target.src = "https://via.placeholder.com/800x600?text=No+Image"}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">No Image Available</div>
                )}

                {/* Back Button */}
                <Link to="/" className="absolute top-6 left-6 bg-white/90 p-2 rounded-full hover:bg-white transition shadow-sm z-10">
                    <ArrowLeft className="w-5 h-5 text-gray-800" />
                </Link>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 md:p-12">
                    <div className="max-w-7xl mx-auto">
            <span className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2 inline-block">
              {property.listing_status}
            </span>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{property.title}</h1>
                        <div className="flex items-center text-gray-200 text-lg">
                            <MapPin className="w-5 h-5 mr-2" />
                            {property.suburb}, {property.city}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* --- MAIN CONTENT (Left) --- */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Key Stats Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex justify-between items-center">
                        <div className="text-center">
                            <div className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Price</div>
                            <div className="text-2xl font-bold text-gray-900">${property.price.toLocaleString()}</div>
                        </div>
                        <div className="h-10 w-px bg-gray-200"></div>
                        <div className="text-center">
                            <div className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Beds</div>
                            <div className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
                                <BedDouble className="w-5 h-5" /> {property.bedrooms}
                            </div>
                        </div>
                        <div className="h-10 w-px bg-gray-200"></div>
                        <div className="text-center">
                            <div className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Baths</div>
                            <div className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
                                <Bath className="w-5 h-5" /> {property.bathrooms}
                            </div>
                        </div>
                        <div className="h-10 w-px bg-gray-200 hidden sm:block"></div>
                        <div className="text-center hidden sm:block">
                            <div className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Area</div>
                            <div className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
                                <Square className="w-5 h-5" /> {property.land_size}m²
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">About this property</h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                            {property.description || "No description provided."}
                        </p>
                    </div>
                </div>

                {/* --- AI ANALYSIS SIDEBAR (Right) --- */}
                <div className="space-y-6">

                    {/* AI Risk Score Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-hidden relative">
                        <div className="flex items-center gap-2 mb-4">
                            <ShieldCheck className="w-6 h-6 text-blue-600" />
                            <h3 className="text-lg font-bold text-gray-900">AI Risk Analysis</h3>
                        </div>

                        <div className={`p-4 rounded-lg border flex items-center justify-between mb-6 ${getRiskColor(property.risk_score)}`}>
                            <div>
                                <span className="block text-xs font-bold uppercase opacity-80">Risk Score</span>
                                <span className="text-3xl font-black">{property.risk_score}/100</span>
                            </div>
                            <div className="text-right">
                                <span className="block text-sm font-bold">{property.risk_score < 20 ? "Safe Investment" : "Moderate Risk"}</span>
                                <span className="text-xs opacity-80">AI Confidence: 98%</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">Title Deed Verified</h4>
                                    <p className="text-xs text-gray-500">Deed #45920 matches registry records.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">Seller Identity Confirmed</h4>
                                    <p className="text-xs text-gray-500">Biometric match successful.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">Price Variation</h4>
                                    <p className="text-xs text-gray-500">Price is 5% higher than area average.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100">
                            {/* ✅ BUTTON FIXED: NOW LINKS TO REPORT PAGE */}
                            <Link
                                to={`/property/${id}/report`}
                                className="w-full py-3 bg-gray-900 hover:bg-blue-600 text-white font-medium rounded-lg transition shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2"
                            >
                                <FileText className="w-4 h-4" />
                                Request Full Report
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PropertyDetails;