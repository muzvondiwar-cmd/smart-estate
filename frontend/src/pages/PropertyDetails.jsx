import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, BedDouble, Bath, Square, ShieldCheck, CheckCircle, AlertTriangle, FileText, ArrowLeft, Phone, Mail, Send, X, Calendar, User } from 'lucide-react';
import { API_URL } from '../config';

// --- DUMMY DATA (Must match Home.jsx) ---
const DUMMY_PROPERTIES = [
    {
        id: 'dummy-1',
        title: 'Modern Villa in Borrowdale Brooke',
        description: "Experience the epitome of luxury living in this stunning modern villa located in the prestigious Borrowdale Brooke Golf Estate. Featuring open-plan living areas, a state-of-the-art kitchen, and a landscaped garden with a pool. The property comes with full solar backup and a borehole.",
        price: 450000,
        location: 'Borrowdale Brooke, Harare',
        city: 'Harare',
        suburb: 'Borrowdale Brooke',
        bedrooms: 5,
        bathrooms: 4,
        land_size: 2000,
        risk_score: 12,
        image_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
        listing_status: 'For Sale',
        owner: { full_name: "Sarah Jenkins", email: "sarah.j@example.com" }
    },
    {
        id: 'dummy-2',
        title: 'Luxury Apartment in Avondale',
        description: "A secure, lock-up-and-go apartment perfect for young professionals or investors. Located within walking distance to Avondale Shopping Centre. Features modern finishes, 24-hour security, and undercover parking.",
        price: 120000,
        location: 'Avondale, Harare',
        city: 'Harare',
        suburb: 'Avondale',
        bedrooms: 2,
        bathrooms: 2,
        land_size: 150,
        risk_score: 8,
        image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        listing_status: 'For Sale',
        owner: { full_name: "Tinashe Moyo", email: "t.moyo@example.com" }
    },
    {
        id: 'dummy-3',
        title: 'Family Home in Bulawayo',
        description: "Solid family home set on an acre of flat land. Needs some modernization but offers great potential. Close to schools and hospitals. Title deeds available for verification.",
        price: 85000,
        location: 'Hillside, Bulawayo',
        city: 'Bulawayo',
        suburb: 'Hillside',
        bedrooms: 4,
        bathrooms: 2,
        land_size: 1200,
        risk_score: 45,
        image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
        listing_status: 'For Sale',
        owner: { full_name: "David Smith", email: "d.smith@example.com" }
    },
    {
        id: 'dummy-4',
        title: 'Sunset Penthouse',
        description: "Breathtaking views from this top-floor penthouse. Exclusive elevator access, rooftop terrace, and premium fittings throughout. A rare find in the market.",
        price: 280000,
        location: 'Newlands, Harare',
        city: 'Harare',
        suburb: 'Newlands',
        bedrooms: 3,
        bathrooms: 3,
        land_size: 300,
        risk_score: 5,
        image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        listing_status: 'For Sale',
        owner: { full_name: "Grace Chiwenga", email: "grace.c@example.com" }
    },

    {
        id: 'dummy-6',
        title: 'Extended Core House in Budiriro',
        description: "A neat 4-roomed core house in Budiriro 5. Fully walled and gated. There is ample space for further extensions. The property is currently under Council Cession, ready for title surveys. Great starter home.",
        price: 35000,
        location: 'Budiriro 5, Harare',
        city: 'Harare',
        suburb: 'Budiriro',
        bedrooms: 4,
        bathrooms: 1,
        land_size: 300,
        risk_score: 42,
        image_url: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=1200&q=80',
        listing_status: 'For Sale',
        owner: { full_name: "Mr. Phiri", email: "phiri.invest@example.com" }
    },
    {
        id: 'dummy-7',
        title: 'Investment Property in Highfield',
        description: "High-yield investment opportunity in Western Triangle. Main house features 4 bedrooms, plus a separate 3-roomed cottage currently tenanted. Close to Gwanzura Stadium and transport hubs. Needs some cosmetic renovations.",
        price: 45000,
        location: 'Western Triangle, Highfield',
        city: 'Harare',
        suburb: 'Highfield',
        bedrooms: 7,
        bathrooms: 2,
        land_size: 200,
        risk_score: 65,
        image_url: 'https://images.unsplash.com/photo-1599809275671-b5942cabc7ad?auto=format&fit=crop&w=1200&q=80',
        listing_status: 'For Sale',
        owner: { full_name: "Mai Tawanda", email: "mait@example.com" }
    }
];

const PropertyDetails = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal State
    const [showContactModal, setShowContactModal] = useState(false);
    const [contactStatus, setContactStatus] = useState('idle');

    useEffect(() => {
        const fetchProperty = async () => {
            // 1. Check if it's a Dummy ID
            if (id.startsWith('dummy-')) {
                const found = DUMMY_PROPERTIES.find(p => p.id === id);
                if (found) {
                    setProperty(found);
                    setLoading(false);
                    return;
                }
            }

            // 2. If not dummy, fetch from API
            try {
                const response = await axios.get(`${API_URL}/api/v1/properties/${id}`);
                const data = response.data;

                // Fix image URL for API data
                const imgUrl = data.images && data.images.length > 0
                    ? (data.images[0].image_url.startsWith('http') ? data.images[0].image_url : `${API_URL}${data.images[0].image_url}`)
                    : null;

                setProperty({ ...data, image_url: imgUrl });
                setLoading(false);
            } catch (err) {
                console.error("Error fetching property:", err);
                setError("Could not load property details.");
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    const handleContactSubmit = (e) => {
        e.preventDefault();
        setContactStatus('sending');
        // Simulate network delay
        setTimeout(() => {
            setContactStatus('success');
            setTimeout(() => setShowContactModal(false), 2000);
        }, 1500);
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
    );

    if (error || !property) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="text-red-500 font-medium text-lg mb-4">{error || "Property not found."}</div>
            <Link to="/" className="text-blue-600 hover:underline">← Back to Home</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-12">

            {/* --- HERO IMAGE HEADER --- */}
            <div className="relative h-[50vh] bg-gray-900">
                {property.image_url ? (
                    <img
                        src={property.image_url}
                        alt={property.title}
                        className="w-full h-full object-cover opacity-80"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">No Image Available</div>
                )}

                {/* Navigation & Overlay Info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
                    <div className="max-w-7xl mx-auto px-4 h-full flex flex-col justify-between py-6">
                        <Link to="/" className="w-fit bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/40 transition text-white">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>

                        <div className="text-white pb-6">
                <span className="bg-blue-600 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-3 inline-block">
                  {property.listing_status}
                </span>
                            <h1 className="text-3xl md:text-5xl font-bold mb-2">{property.title}</h1>
                            <div className="flex items-center text-gray-300 text-lg">
                                <MapPin className="w-5 h-5 mr-2" />
                                {property.location || `${property.suburb}, ${property.city}`}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* --- MAIN CONTENT (Left Column) --- */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Key Stats Bar */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-wrap justify-between items-center gap-4">
                        <div>
                            <div className="text-gray-400 text-xs font-bold uppercase tracking-wider">Price</div>
                            <div className="text-3xl font-black text-gray-900">${property.price.toLocaleString()}</div>
                        </div>
                        <div className="h-10 w-px bg-gray-100 hidden sm:block"></div>
                        <div className="flex gap-6 md:gap-12">
                            <div className="text-center">
                                <div className="text-gray-400 text-xs font-bold uppercase mb-1">Beds</div>
                                <div className="text-xl font-bold flex items-center gap-2"><BedDouble className="w-5 h-5"/> {property.bedrooms}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-gray-400 text-xs font-bold uppercase mb-1">Baths</div>
                                <div className="text-xl font-bold flex items-center gap-2"><Bath className="w-5 h-5"/> {property.bathrooms}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-gray-400 text-xs font-bold uppercase mb-1">Size</div>
                                <div className="text-xl font-bold flex items-center gap-2"><Square className="w-5 h-5"/> {property.land_size}m²</div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">About this property</h3>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            {property.description || "No description provided for this property."}
                        </p>

                        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg"><CheckCircle className="w-4 h-4 text-blue-500"/> Title Deeds</div>
                            <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg"><CheckCircle className="w-4 h-4 text-blue-500"/> Borehole</div>
                            <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg"><CheckCircle className="w-4 h-4 text-blue-500"/> Solar Power</div>
                            <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg"><CheckCircle className="w-4 h-4 text-blue-500"/> Walled & Gated</div>
                        </div>
                    </div>

                </div>

                {/* --- SIDEBAR (Right Column) --- */}
                <div className="space-y-6">

                    {/* AI Risk Analysis Card */}
                    <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-4 flex items-center justify-between text-white">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5" />
                                <span className="font-bold">AI Risk Analysis</span>
                            </div>
                            <span className="text-xs bg-white/20 px-2 py-1 rounded">Confidence: 98%</span>
                        </div>

                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <div className="text-4xl font-black text-gray-900">{property.risk_score}<span className="text-lg text-gray-400 font-normal">/100</span></div>
                                    <div className={`text-sm font-bold ${property.risk_score < 30 ? 'text-emerald-600' : 'text-orange-600'}`}>
                                        {property.risk_score < 30 ? 'Low Risk Investment' : 'Moderate Risk Detected'}
                                    </div>
                                </div>
                                <div className={`h-16 w-16 rounded-full border-4 flex items-center justify-center ${property.risk_score < 30 ? 'border-emerald-100 text-emerald-600 bg-emerald-50' : 'border-orange-100 text-orange-600 bg-orange-50'}`}>
                                    <ShieldCheck className="w-8 h-8" />
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900">Legal Ownership Verified</h4>
                                        <p className="text-xs text-gray-500">Matches Deeds Registry records.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900">Seller Identity Confirmed</h4>
                                        <p className="text-xs text-gray-500">Biometric ID match successful.</p>
                                    </div>
                                </div>
                                {property.risk_score > 30 && (
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900">Price Deviation</h4>
                                            <p className="text-xs text-gray-500">Price is 15% lower than average.</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link to={`/property/${id}/report`} className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-3 rounded-lg transition">
                                <FileText className="w-4 h-4 inline-block mr-2" /> View Full Report
                            </Link>
                        </div>
                    </div>

                    {/* Contact Agent Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Interested in this property?</h3>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl">
                                {property.owner?.full_name ? property.owner.full_name[0] : 'A'}
                            </div>
                            <div>
                                <div className="font-bold text-gray-900">{property.owner?.full_name || "Verified Agent"}</div>
                                <div className="text-xs text-gray-500 flex items-center gap-1"><CheckCircle className="w-3 h-3 text-emerald-500"/> Identity Verified</div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowContactModal(true)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-md flex items-center justify-center gap-2 mb-3"
                        >
                            <Mail className="w-4 h-4" /> Send Message
                        </button>
                        <button className="w-full bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-lg transition flex items-center justify-center gap-2">
                            <Phone className="w-4 h-4" /> Show Phone Number
                        </button>
                    </div>

                </div>
            </div>

            {/* --- CONTACT MODAL --- */}
            {showContactModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setShowContactModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>

                        <div className="bg-blue-900 p-6 text-white">
                            <h3 className="text-xl font-bold">Contact Agent</h3>
                            <p className="text-blue-200 text-sm mt-1">Inquire about {property.title}</p>
                        </div>

                        <div className="p-6">
                            {contactStatus === 'success' ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8" /></div>
                                    <h4 className="text-xl font-bold text-gray-900">Message Sent!</h4>
                                    <p className="text-gray-500 mt-2">The agent will contact you shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleContactSubmit} className="space-y-4">
                                    <input required className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500" placeholder="Your Name" />
                                    <input required className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500" placeholder="Phone Number" />
                                    <textarea required rows="3" className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500" placeholder="I am interested in this property..." defaultValue={`Hi, I'm interested in ${property.title}. Please contact me.`}></textarea>
                                    <button type="submit" disabled={contactStatus === 'sending'} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                                        {contactStatus === 'sending' ? 'Sending...' : <><Send className="w-4 h-4" /> Send Inquiry</>}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default PropertyDetails;