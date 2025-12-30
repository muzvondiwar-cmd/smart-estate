import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Home, Trash2, Edit, AlertCircle } from 'lucide-react';

const SellerDashboard = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchMyProperties = async () => {
      try {
        console.log("🕵️ DASHBOARD DEBUG: Sending Token:", token);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const response = await axios.get('http://localhost:8000/api/v1/properties/mine/listings', config);
        setProperties(response.data);
        setError(null);
      } catch (err) {
        console.error("❌ Dashboard Error:", err);
        if (err.response && err.response.status === 401) {
            setError("Session expired. Please logout and login again.");
        } else {
            setError("Failed to load properties.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyProperties();
  }, [token, navigate]);

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
        await axios.delete(`http://localhost:8000/api/v1/properties/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        // Remove from list immediately
        setProperties(properties.filter(p => p.id !== id));
    } catch (err) {
        alert("Failed to delete property");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading your dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-500">Manage your listings and view status.</p>
          </div>
          <div className="flex gap-4">
            <Link
                to="/add-property"
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
            >
                <Plus className="w-5 h-5" /> Add New Listing
            </Link>
          </div>
        </div>

        {/* Error Message Display */}
        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 mb-6 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
                {error.includes("Session") && (
                    <button onClick={logout} className="underline font-bold ml-2">Log Out Now</button>
                )}
            </div>
        )}

        {/* Empty State */}
        {!loading && properties.length === 0 && !error && (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Home className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Properties Yet</h3>
                <p className="text-gray-500 mb-6">You haven't listed any properties yet.</p>
                <Link to="/add-property" className="text-blue-600 font-bold hover:underline">Create your first listing</Link>
            </div>
        )}

        {/* Properties Grid */}
        <div className="grid grid-cols-1 gap-4">
            {properties.map((property) => (
                <div key={property.id} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                            {property.images && property.images.length > 0 ? (
                                <img src={property.images[0].image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                                    <Home className="w-6 h-6" />
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">{property.title}</h3>
                            <p className="text-sm text-gray-500">{property.suburb}, {property.city}</p>
                            <p className="text-blue-600 font-bold mt-1">${property.price.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                            property.risk_score < 20 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                            Risk Score: {property.risk_score}
                        </span>

                        <div className="flex-grow md:flex-grow-0"></div>

                        {/* EDIT BUTTON (Now linked correctly) */}
                        <Link
                            to={`/edit-property/${property.id}`}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                            <Edit className="w-5 h-5" />
                        </Link>

                        {/* DELETE BUTTON */}
                        <button
                            onClick={() => handleDelete(property.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>

                </div>
            ))}
        </div>

      </div>
    </div>
  );
};

export default SellerDashboard;