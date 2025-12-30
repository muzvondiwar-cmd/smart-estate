import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, BedDouble, Bath, Square, ArrowLeft, ShieldAlert, CheckCircle, XCircle, Mail, MessageCircle } from 'lucide-react';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/properties/${id}`);
        setProperty(response.data);
      } catch (error) {
        console.error("Error fetching details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading details...</div>;
  if (!property) return <div className="p-8 text-center text-red-500">Property not found.</div>;

  const getRiskColor = (score) => {
    if (score < 20) return 'text-green-600 bg-green-50 border-green-200';
    if (score < 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const mainImage = property.images && property.images.length > 0
    ? property.images[0].image_url
    : "https://images.unsplash.com/photo-1600596542815-27b88e35eabd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center w-full">

      {/* Header Image */}
      <div className="relative h-[50vh] w-full bg-gray-900">
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent"></div>
        <div className="absolute top-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/" className="inline-flex items-center gap-2 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-bold shadow hover:bg-white transition text-gray-900">
            <ArrowLeft className="w-4 h-4" /> Back to Search
            </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 -mt-24 relative z-10 pb-20">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

          <div className="grid grid-cols-1 lg:grid-cols-3">

            {/* LEFT: Details */}
            <div className="lg:col-span-2 p-8 md:p-10 border-r border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                <div>
                   <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">{property.title}</h1>
                   <div className="flex items-center text-gray-500 font-medium">
                     <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                     {property.suburb}, {property.city}
                   </div>
                </div>
                <div className="text-left md:text-right bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                  <p className="text-3xl font-bold text-blue-600">${property.price.toLocaleString()}</p>
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Asking Price</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-8 py-8 border-y border-gray-100 mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gray-100 rounded-full"><BedDouble className="w-6 h-6 text-gray-600" /></div>
                  <div><span className="block font-bold text-xl text-gray-900">{property.bedrooms}</span><span className="text-sm text-gray-500 font-medium">Bedrooms</span></div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="p-2.5 bg-gray-100 rounded-full"><Bath className="w-6 h-6 text-gray-600" /></div>
                  <div><span className="block font-bold text-xl text-gray-900">{property.bathrooms}</span><span className="text-sm text-gray-500 font-medium">Bathrooms</span></div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="p-2.5 bg-gray-100 rounded-full"><Square className="w-6 h-6 text-gray-600" /></div>
                  <div><span className="block font-bold text-xl text-gray-900">{property.land_size}</span><span className="text-sm text-gray-500 font-medium">Sq Meters</span></div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-4">Property Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line mb-10 text-lg">{property.description}</p>

              <div className={`rounded-2xl p-6 md:p-8 border-2 ${getRiskColor(property.risk_score)}`}>
                <div className="flex items-center gap-3 mb-6">
                  <ShieldAlert className="w-7 h-7" />
                  <h3 className="text-xl font-bold uppercase tracking-wide">AI Risk Assessment</h3>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-sm font-bold mb-2 uppercase tracking-wide opacity-80">
                    <span>Safety Score</span><span>{property.risk_score}/100</span>
                  </div>
                  <div className="w-full bg-black/10 rounded-full h-4 overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ease-out ${property.risk_score < 50 ? 'bg-green-600' : 'bg-red-500'}`} style={{ width: `${property.risk_score}%` }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 bg-white/60 p-4 rounded-xl border border-black/5">
                    {property.ownership_status === 'title_deed' ? <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
                    <div>
                      <p className="font-bold text-sm text-gray-900">Ownership: {property.ownership_status.replace('_', ' ').toUpperCase()}</p>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">{property.ownership_status === 'title_deed' ? "Verified Title Deeds. Lowest legal risk." : "Cession requires strict verification."}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-white/60 p-4 rounded-xl border border-black/5">
                     {property.water_source === 'municipal' ? <XCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" /> : <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />}
                     <div>
                      <p className="font-bold text-sm text-gray-900">Water: {property.water_source.toUpperCase()}</p>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">{property.water_source === 'municipal' ? "Relies on city supply. Intermittent availability." : "Independent water source improves value."}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Seller Contact (UPDATED) */}
            <div className="bg-gray-50 p-8 md:p-10 flex flex-col justify-start text-center border-l border-gray-100">
              <div className="sticky top-24">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-blue-600 shadow-inner">
                     {/* Dynamic Avatar Initials */}
                     {property.owner_email ? property.owner_email[0].toUpperCase() : "A"}
                  </div>

                  <h3 className="font-bold text-xl text-gray-900 mb-1">Seller Contact</h3>
                  <p className="text-gray-500 text-sm mb-8 font-medium truncate px-4">
                    {property.owner_email || "Contact for details"}
                  </p>

                  {/* Email Button */}
                  <a
                    href={`mailto:${property.owner_email}?subject=Inquiry about ${property.title}`}
                    className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition mb-4 shadow-lg shadow-blue-600/20 active:scale-95 transform"
                  >
                    <Mail className="w-5 h-5" /> Email Seller
                  </a>

                  {/* WhatsApp Button */}
                  <a
                    href={`https://wa.me/?text=Hi, I am interested in your property: ${property.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-white border-2 border-green-500 text-green-600 py-4 rounded-xl font-bold hover:bg-green-50 transition active:scale-95 transform"
                  >
                    <MessageCircle className="w-5 h-5" /> WhatsApp Inquiry
                  </a>

                  <div className="mt-8 pt-8 border-t border-gray-200">
                      <p className="text-xs text-gray-400 leading-relaxed">
                          Disclaimer: SmartEstate AI risk scores are estimates based on available data. Always consult a lawyer before purchasing.
                      </p>
                  </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;