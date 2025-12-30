import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Save, MapPin, Home, AlertTriangle } from 'lucide-react';

const EditProperty = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '', description: '', price: '', location: '', city: 'Harare',
    suburb: '', bedrooms: '', bathrooms: '', land_size: '',
    property_type: 'House', listing_status: 'For Sale',
    ownership_status: 'title_deed', water_source: 'municipal', electricity_status: 'good'
  });

  // 1. Fetch Existing Data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/properties/${id}`);
        setFormData(response.data);
      } catch (error) {
        alert("Error loading property details.");
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Send Update
      await axios.put(`http://localhost:8000/api/v1/properties/${id}`, formData, config);

      alert("Property Updated Successfully!");
      navigate('/dashboard');
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update property.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Home className="text-blue-600" /> Edit Property
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="font-bold">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-3 border rounded-lg" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="font-bold">Price ($)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-3 border rounded-lg" />
                </div>
                <div>
                    <label className="font-bold">Suburb</label>
                    <input type="text" name="suburb" value={formData.suburb} onChange={handleChange} className="w-full p-3 border rounded-lg" />
                </div>
            </div>

            <div>
                <label className="font-bold">Description</label>
                <textarea name="description" rows="4" value={formData.description} onChange={handleChange} className="w-full p-3 border rounded-lg"></textarea>
            </div>

            {/* Risk Factors (Important for editing risk score) */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Update Risk Factors</h3>
                <div className="grid grid-cols-2 gap-4">
                    <select name="ownership_status" value={formData.ownership_status} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="title_deed">Title Deeds</option>
                        <option value="cession_council">Council Cession</option>
                        <option value="cession_developer">Developer Cession</option>
                    </select>
                    <select name="water_source" value={formData.water_source} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="municipal">Municipal Water</option>
                        <option value="borehole">Borehole</option>
                    </select>
                </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2">
                <Save className="w-5 h-5" /> Save Changes
            </button>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;