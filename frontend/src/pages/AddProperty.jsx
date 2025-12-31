import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Upload, Check, AlertCircle, Loader } from 'lucide-react';
import { API_URL } from '../config';

const AddProperty = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imageStatus, setImageStatus] = useState('idle'); // idle, uploading, success, error

    // Form Data State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        city: 'Harare',
        suburb: '',
        bedrooms: '',
        bathrooms: '',
        land_size: '',
        listing_status: 'For Sale',
        property_type: 'Residential',
        images: [] // We will store the uploaded image URL here
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- 1. HANDLE IMAGE UPLOAD ---
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImageStatus('uploading');
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            // This matches the endpoint we added to properties.py
            const response = await axios.post(`${API_URL}/api/v1/properties/upload`, uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Save the returned URL to our form data
            setFormData(prev => ({
                ...prev,
                images: [{ image_url: response.data.url }]
            }));
            setImageStatus('success');
        } catch (err) {
            console.error("Upload failed:", err);
            setImageStatus('error');
            alert("Failed to upload image. Please try again.");
        }
    };

    // --- 2. SUBMIT FORM ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Ensure numbers are actually numbers
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                bedrooms: parseInt(formData.bedrooms),
                bathrooms: parseInt(formData.bathrooms),
                land_size: parseInt(formData.land_size),
            };

            await axios.post(`${API_URL}/api/v1/properties/`, payload);
            navigate('/'); // Go back home on success
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || 'Failed to post property. Check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Add New Property</h2>
                    <button onClick={() => navigate('/')} className="text-sm text-gray-500 hover:text-gray-900">Cancel</button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 text-sm">
                            <AlertCircle className="w-4 h-4" /> {error}
                        </div>
                    )}

                    {/* Image Upload Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Property Image</label>
                        <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                            imageStatus === 'success' ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-400'
                        }`}>

                            {imageStatus === 'uploading' ? (
                                <div className="flex flex-col items-center text-blue-600">
                                    <Loader className="w-8 h-8 animate-spin mb-2" />
                                    <span className="text-sm font-medium">Uploading...</span>
                                </div>
                            ) : imageStatus === 'success' ? (
                                <div className="flex flex-col items-center text-green-600">
                                    <Check className="w-8 h-8 mb-2" />
                                    <span className="text-sm font-medium">Image Uploaded Successfully!</span>
                                </div>
                            ) : (
                                <div className="relative">
                                    <input type="file" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                                    <div className="flex flex-col items-center text-gray-500">
                                        <Upload className="w-8 h-8 mb-2" />
                                        <span className="text-sm">Click to upload main photo</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input name="title" placeholder="Property Title (e.g. Sunset Villa)" required onChange={handleChange} className="w-full p-3 border rounded-lg" />
                        <input name="price" type="number" placeholder="Price ($)" required onChange={handleChange} className="w-full p-3 border rounded-lg" />
                    </div>

                    <textarea name="description" placeholder="Description..." rows="3" onChange={handleChange} className="w-full p-3 border rounded-lg" />

                    {/* Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input name="suburb" placeholder="Suburb (e.g. Borrowdale)" required onChange={handleChange} className="w-full p-3 border rounded-lg" />
                        <input name="city" placeholder="City" value={formData.city} onChange={handleChange} className="w-full p-3 border rounded-lg bg-gray-50" />
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-3 gap-4">
                        <input name="bedrooms" type="number" placeholder="Beds" required onChange={handleChange} className="w-full p-3 border rounded-lg" />
                        <input name="bathrooms" type="number" placeholder="Baths" required onChange={handleChange} className="w-full p-3 border rounded-lg" />
                        <input name="land_size" type="number" placeholder="Size (m²)" required onChange={handleChange} className="w-full p-3 border rounded-lg" />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || imageStatus === 'uploading'}
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : 'Post Property'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProperty;