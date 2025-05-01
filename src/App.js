import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import About from './components/About';
import ContactForm from './components/ContactForm';
import Header from './components/Header';
import Footer from './components/Footer';
import Gallery from './components/Gallery';
import { CartProvider } from "./components/CartContext";
import { AuthProvider } from "./components/AuthContext";
import Login from './components/Login';
import Home from './components/Home';

import './main.scss';
import './i18n';

function App() {
  useEffect(() => {
    // Empêche clic droit sur les images
    document.addEventListener('contextmenu', function (e) {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
      }
    });
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="fade-in">
            <Header /> {/* On ne passe plus token */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<ContactForm />} />
              <Route path="/login" element={<Login />} /> {/* On ne passe plus setToken */}
            </Routes>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
