import React from 'react';
import { Link } from 'react-router-dom'; // <--- THIS WAS MISSING!
import { Github, Linkedin, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">

        {/* Grid Layout: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-blue-800 pb-8">

          {/* Column 1: Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold mb-4">SmartEstate<span className="text-blue-400">AI</span></h3>
            <p className="text-blue-200 text-sm leading-relaxed">
              The safest way to buy property in Zimbabwe.
              Powered by AI to detect risks and verify ownership.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition">Seller Dashboard</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
              <li><Link to="/signup" className="hover:text-white transition">Sign Up</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact Developer</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-600 transition">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-600 transition">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:your-email@example.com" className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-600 transition">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 4: Logo Area */}
          <div className="flex items-center justify-center md:justify-end">
              {/* Ensure you have a file named 'logo.png' in your 'public' folder */}
              <img
                src="/1.png"
                alt="SmartEstate AI Logo"
                className="h-28 w-auto object-contain opacity-80 hover:opacity-100 transition"
                onError={(e) => {e.target.style.display = 'none'}} // Hides image if not found so it doesn't look broken
              />
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-blue-300">
          <p>&copy; {currentYear} SmartEstate AI. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 md:mt-0">
            Designed & Developed by <span className="text-white font-bold">Roy Muzvondiwa</span>
            <Heart className="w-3 h-3 text-red-500 fill-current" />
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;