import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import About from './components/About';
import ContactForm from './components/ContactForm';
import Header from './components/Header';
import Footer from './components/Footer';
import Gallery from './components/Gallery';
import { CartProvider } from "./components/CartContext";
import { AuthProvider } from "./components/AuthContext";
import Login from './components/Login'; // Import de la page Login
import './main.scss';
import './i18n';

function App() {
  const [token, setToken] = useState(localStorage.getItem("token")); // Ajout du state pour le token

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        {/* Utilisation de BrowserRouter avec basename pour GitHub Pages */}
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="fade-in">
            <Header token={token} setToken={setToken} />
            <Routes>
              <Route path="/about" element={<About />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<ContactForm />} />
              <Route path="/login" element={<Login setToken={setToken} />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
