import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- PAGES WE KNOW EXIST ---
import Home from './pages/Home';
import AddProperty from './pages/AddProperty';
import PropertyDetails from './pages/PropertyDetails';
import Report from './pages/Report';

// --- COMPONENTS (Check if these exist!) ---
// If your Navbar is in a different folder, update this line.
import Navbar from './components/Navbar';

// --- OPTIONAL PAGES (Commented out to prevent crashes) ---
// If you have these files, remove the "//" to enable them.
import SellerDashboard from './pages/SellerDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Footer from './components/Footer';

function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">

                {/* Only show Navbar if it exists without crashing */}
                <Navbar />

                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/add-property" element={<AddProperty />} />
                        <Route path="/property/:id" element={<PropertyDetails />} />
                        <Route path="/property/:id/report" element={<Report />} />
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