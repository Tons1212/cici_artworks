import React from 'react';
import About from './components/About';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import Header from './components/Header';
import Portofolio from './components/Portofolio';
import './main.scss';

function App() {
  return (
    <div className="fade-in">
      <Header />
      <About />
      <Portofolio />
      <ContactForm />
      <Footer />
    </div>
  );
}

export default App;



