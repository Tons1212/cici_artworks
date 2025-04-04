import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import About from './components/About';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import Header from './components/Header';
import Gallery from './components/Gallery';
import Login from './components/Login'; // Import de la page Login
import './main.scss';

function App() {
  // eslint-disable-next-line no-unused-vars
  const [token, setToken] = useState(localStorage.getItem("token")); // Ajout du state pour le token

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      <div className="fade-in">
        <Header token={token} setToken={setToken} />
        <Routes>
          <Route path="/" element={
            <>
              <About />
              <Gallery />
              <ContactForm />
              <Footer />
            </>
          } />
          <Route path="/login" element={<Login setToken={setToken} />} /> {/* Passe setToken en prop */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
