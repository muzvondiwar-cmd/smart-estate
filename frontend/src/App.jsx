import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import AddProperty from './pages/AddProperty';
import PropertyDetails from './pages/PropertyDetails';
import Report from './pages/Report';
import SellerDashboard from './pages/SellerDashboard';
// import Login from './pages/Login'; // Uncomment if you have these
// import Signup from './pages/Signup';

import Navbar from './components/Navbar';
// import Footer from './components/Footer';

function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">

                {/* Navbar sits on top */}
                <Navbar />

                {/* ✅ GLOBAL FIX: added 'pt-20' here.
            This pushes ALL page content down so the Navbar doesn't cover it.
        */}
                <main className="flex-grow pt-20">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/add-property" element={<AddProperty />} />
                        <Route path="/property/:id" element={<PropertyDetails />} />
                        <Route path="/property/:id/report" element={<Report />} />
                        <Route path="/dashboard" element={<SellerDashboard />} />

                        {/* <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} /> */}
                    </Routes>
                </main>

                {/* <Footer /> */}
            </div>
        </Router>
    );
}

export default App;