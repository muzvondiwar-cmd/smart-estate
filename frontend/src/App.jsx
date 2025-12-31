import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your pages
import Home from './pages/Home';
import AddProperty from './pages/AddProperty';
import PropertyDetails from './pages/PropertyDetails';
import Report from './pages/Report'; // <--- ✅ NEW IMPORT
import SellerDashboard from './pages/SellerDashboard'; // Assuming you have this
import Login from './pages/Login';
import Signup from './pages/Signup';

// Import Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        {/* Core Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/add-property" element={<AddProperty />} />

                        {/* Property Routes */}
                        <Route path="/property/:id" element={<PropertyDetails />} />
                        <Route path="/property/:id/report" element={<Report />} /> {/* <--- ✅ NEW ROUTE */}

                        {/* Auth & Dashboard Routes */}
                        <Route path="/dashboard" element={<SellerDashboard />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;