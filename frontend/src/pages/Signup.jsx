import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle, ArrowRight, Loader } from 'lucide-react';
import { API_URL } from '../config';

const Signup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        full_name: '', // Make sure your backend expects 'full_name' or 'name'
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user types
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // 1. Basic Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            setLoading(false);
            return;
        }

        try {
            // 2. Prepare Payload (Exclude confirmPassword)
            const payload = {
                email: formData.email,
                password: formData.password,
                full_name: formData.full_name
            };

            // 3. Send Request
            // NOTE: Ensure your backend endpoint is correct (/api/v1/auth/signup)
            await axios.post(`${API_URL}/api/v1/auth/signup`, payload);

            // 4. Success! Redirect to login
            alert("Account created successfully! Please log in.");
            navigate('/login');

        } catch (err) {
            console.error("Signup Error:", err);

            // 5. Smart Error Handling
            if (err.response) {
                // If the backend sends a specific error message
                const detail = err.response.data.detail;

                if (typeof detail === 'string' && detail.includes("unique")) {
                    setError("This email is already registered. Please log in.");
                } else {
                    setError(detail || "Failed to create account. Please try again.");
                }
            } else {
                setError("Network error. Check your connection.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">

                {/* Header */}
                <div className="bg-blue-900 p-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">Join SmartEstate</h2>
                    <p className="text-blue-200">Create your secure agent account</p>
                </div>

                {/* Form Container */}
                <div className="p-8">

                    {error && (
                        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-3 text-sm">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input
                                    name="full_name"
                                    type="text"
                                    required
                                    placeholder="John Doe"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="agent@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" /> Creating Account...
                                </>
                            ) : (
                                <>
                                    Create Account <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-6 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 font-bold hover:underline">
                            Sign In here
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Signup;