import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Home, BarChart2, AlertTriangle, CheckCircle, Trash2, Eye, ImageOff } from 'lucide-react';
import { API_URL } from '../config';

const SellerDashboard = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyProperties = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/v1/properties/`);
                // Ensure response is an array before setting
                if (Array.isArray(response.data)) {
                    setProperties(response.data);
                } else {
                    setProperties([]);
                    console.error("API did not return a list:", response.data);
                }
            } catch (err) {
                console.error("Dashboard Error:", err);
                setError("Could not load your listings.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyProperties();
    }, []);

    const handleDelete = async (id) => {
        if(!window.confirm("Are you sure you want to delete this listing?")) return;
        try {
            // In a real app, send DELETE request here
            setProperties(properties.filter(p => p.id !== id));
            alert("Property deleted locally (Demo).");
        } catch (err) {
            alert("Failed to delete.");
        }
    };

    // Safe Image Helper (Prevents Crashes)
    const getThumbnail = (property) => {
        if (!property.images || property.images.length === 0) return null;
        const imgUrl = property.images[0]?.image_url;
        if (!imgUrl) return null;
        return imgUrl.startsWith('http') ? imgUrl : `${API_URL}${imgUrl}`;
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
                        <p className="text-gray-500 mt-1">Manage your listings and view AI insights.</p>
                    </div>
                    <Link
                        to="/add-property"
                        className="mt-4 md:mt-0 flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-900/20"
                    >
                        <Plus className="w-5 h-5" /> Add New Listing
                    </Link>
                </div>

                {/* --- STATS OVERVIEW --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Home className="w-6 h-6"/></div>
                            <div>
                                <p className="text-sm text-gray-500 font-bold uppercase">Total Listings</p>
                                <p className="text-2xl font-black text-gray-900">{properties.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle className="w-6 h-6"/></div>
                            <div>
                                <p className="text-sm text-gray-500 font-bold uppercase">Verified Safe</p>
                                <p className="text-2xl font-black text-gray-900">
                                    {properties.filter(p => (p.risk_score || 0) < 30).length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><AlertTriangle className="w-6 h-6"/></div>
                            <div>
                                <p className="text-sm text-gray-500 font-bold uppercase">Action Required</p>
                                <p className="text-2xl font-black text-gray-900">
                                    {properties.filter(p => (p.risk_score || 0) >= 50).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- LISTINGS TABLE --- */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-800">Your Properties</h2>
                    </div>

                    {error ? (
                        <div className="p-8 text-center text-red-500">{error}</div>
                    ) : properties.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">
                            <Home className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>No properties listed yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Property</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">AI Risk Score</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {properties.map((property) => (
                                    <tr key={property.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">
                                                    {getThumbnail(property) ? (
                                                        <img src={getThumbnail(property)} className="w-full h-full object-cover" alt="Property" />
                                                    ) : (
                                                        <ImageOff className="w-5 h-5 text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{property.title}</div>
                                                    <div className="text-xs text-gray-500">{property.suburb}, {property.city}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">${property.price.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                          {property.listing_status}
                        </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`flex items-center gap-2 font-bold ${(property.risk_score || 0) < 30 ? 'text-emerald-600' : 'text-orange-600'}`}>
                                                <BarChart2 className="w-4 h-4" />
                                                {property.risk_score || 0}/100
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => navigate(`/property/${property.id}`)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition" title="View">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(property.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition" title="Delete">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;