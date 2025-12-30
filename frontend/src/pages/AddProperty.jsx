import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Upload, DollarSign, MapPin, Home, AlertTriangle, CheckCircle } from 'lucide-react';

const AddProperty = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 1. SECURITY: Kick out users who aren't logged in
  useEffect(() => {
    if (!token) {
      alert("You must be logged in to post a property.");
      navigate('/login');
    }
  }, [token, navigate]);

  // Form State
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
    property_type: 'House',
    listing_status: 'For Sale',
    ownership_status: 'title_deed',
    water_source: 'municipal',
    electricity_status: 'good'
  });

  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` } // <--- This sends your ID badge
      };

      // 2. SAFE MATH: Convert text to numbers, use 0 if empty
      const payload = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : 0,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : 0,
        bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : 0,
        land_size: formData.land_size ? parseInt(formData.land_size) : 0,
      };

      console.log("📤 Sending Payload:", payload);

      // Step A: Create the House
      const response = await axios.post('http://localhost:8000/api/v1/properties/', payload, config);
      const newPropertyId = response.data.id;

      // Step B: Upload the Image (if selected)
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('file', imageFile);

        await axios.post(
          `http://localhost:8000/api/v1/properties/${newPropertyId}/images`,
          imageFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      // Step C: Done!
      navigate('/dashboard');

    } catch (error) {
      console.error("❌ Error creating property:", error);

      // 3. ERROR REPORTING: Show the exact reason if available
      if (error.response && error.response.status === 401) {
        alert("Your session has expired. Please log out and log in again.");
        navigate('/login');
      } else if (error.response && error.response.data) {
        alert(`Failed: ${JSON.stringify(error.response.data.detail)}`);
      } else {
        alert("Failed to create property. Check console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">List a New Property</h1>
          <p className="text-gray-500 mt-2">Fill in the details below. Our AI will automatically calculate the Risk Score.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">

          <div className="p-8 space-y-8">

            {/* SECTION 1: Basic Info */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-600" /> Basic Details
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
                  <input type="text" name="title" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Modern 4-Bed House in Highlands" onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea name="description" required rows="4" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Describe the key features..." onChange={handleChange}></textarea>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* SECTION 2: Location & Price */}
            <div>
               <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" /> Location & Price
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input type="number" name="price" required className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0.00" onChange={handleChange} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Suburb</label>
                  <input type="text" name="suburb" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Borrowdale" onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address / Street</label>
                  <input type="text" name="location" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 12 Crowhill Road" onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <select name="city" className="w-full p-3 border border-gray-300 rounded-lg bg-white" onChange={handleChange}>
                    <option value="Harare">Harare</option>
                    <option value="Bulawayo">Bulawayo</option>
                    <option value="Mutare">Mutare</option>
                    <option value="Gweru">Gweru</option>
                  </select>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* SECTION 3: Specs */}
            <div>
               <h3 className="text-lg font-bold text-gray-900 mb-4">Property Specs</h3>
               <div className="grid grid-cols-3 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                    <input type="number" name="bedrooms" required className="w-full p-3 border border-gray-300 rounded-lg" onChange={handleChange} />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                    <input type="number" step="0.5" name="bathrooms" required className="w-full p-3 border border-gray-300 rounded-lg" onChange={handleChange} />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Land Size (m²)</label>
                    <input type="number" name="land_size" required className="w-full p-3 border border-gray-300 rounded-lg" onChange={handleChange} />
                 </div>
               </div>
            </div>

            {/* SECTION 4: Risk Factors */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
               <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                 <AlertTriangle className="w-5 h-5" /> Risk Factors
               </h3>
               <p className="text-sm text-blue-700 mb-4">These settings will determine the AI Risk Score shown to buyers.</p>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">Ownership Status</label>
                   <select name="ownership_status" className="w-full p-3 border border-gray-300 rounded-lg bg-white" onChange={handleChange}>
                     <option value="title_deed">✅ Title Deeds (Safest)</option>
                     <option value="sectional_title">⚠️ Sectional Title</option>
                     <option value="cession_council">⚠️ Council Cession</option>
                     <option value="cession_developer">⛔ Developer Cession (Risky)</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">Water Source</label>
                   <select name="water_source" className="w-full p-3 border border-gray-300 rounded-lg bg-white" onChange={handleChange}>
                     <option value="municipal">❌ Municipal Only (High Risk)</option>
                     <option value="borehole">✅ Borehole (Value Add)</option>
                     <option value="well">⚠️ Well</option>
                   </select>
                 </div>
               </div>
            </div>

            {/* SECTION 5: Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Photo</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {imageFile ? (
                  <div className="text-green-600 flex flex-col items-center">
                    <CheckCircle className="w-8 h-8 mb-2" />
                    <p className="font-bold">{imageFile.name}</p>
                  </div>
                ) : (
                  <div className="text-gray-400 flex flex-col items-center">
                    <Upload className="w-8 h-8 mb-2" />
                    <p>Click to upload property image</p>
                    <p className="text-xs mt-1">JPG, PNG up to 5MB</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Submit Button */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 flex items-center gap-2"
            >
              {loading ? 'Processing...' : 'Post Listing'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddProperty;