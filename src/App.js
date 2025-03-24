import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import About from './components/About';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import Header from './components/Header';
import Portofolio from './components/Portofolio';
import Login from './components/Login'; // Import de la page Login
import './main.scss';

function App() {
  return (
    <Router>
      <div className="fade-in">
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <About />
              <Portofolio />
              <ContactForm />
              <Footer />
            </>
          } />
          <Route path="/login" element={<Login />} /> {/* Ajout de la route login */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
