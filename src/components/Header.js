import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft } from 'react-icons/fa';
import england from '../assets/royaume-uni.png';
import germany from '../assets/Germany.png';
import logo from '../assets/Logo_Cici.jpeg';
import CartDrawer from "../components/CartDrawer";
import { useAuth } from "../components/AuthContext";

function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const cartRef = useRef(null);
  const navRef = useRef(null);
  const hamburgerRef = useRef(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        navRef.current &&
        !navRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }

      if (
        isCartOpen &&
        cartRef.current &&
        !cartRef.current.contains(event.target)
      ) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, isCartOpen]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setMenuOpen(false);
  };

  return (
    <header className={location.pathname === "/" ? "header header-home" : "header header-simple"}>
      {location.pathname === "/login" && (
        <Link to="/" className="back-arrow">
          <FaArrowLeft />
        </Link>
      )}

      <div ref={hamburgerRef} className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(prev => !prev)}>
        <div></div><div></div><div></div>
      </div>

      <nav ref={navRef} className={`navLinks ${menuOpen ? "open" : ""}`}>
        <Link to="/" className="logo" onClick={(e) => { if (location.pathname === "/") { e.preventDefault(); scrollToTop(); } handleLinkClick(); }}>
          <img src={logo} alt="Logo" className="logo-img" />
        </Link>

        <div className="navLinksContainer">
          <Link to="/" onClick={(e) => { if (location.pathname === "/") { e.preventDefault(); scrollToTop(); } handleLinkClick('home'); }} className={activeLink === 'home' ? 'active' : ''}>{t('header.home')}</Link>
          <Link to="/about" onClick={() => handleLinkClick('about')}>{t('header.about')}</Link>
          <Link to="/gallery" onClick={() => handleLinkClick('gallery')}>{t('header.gallery')}</Link>
          <Link to="/contact" onClick={() => handleLinkClick('contact')}>{t('header.contact')}</Link>
          {user ? (
            <button onClick={() => { logout(); handleLinkClick(); }} className="navLinksContainer-button login-link">
              {t('header.logout')}
            </button>
          ) : (
            <Link to="/login" className="login-link" onClick={handleLinkClick}>{t('header.login')}</Link>
          )}
        </div>

        <div className="relative" ref={cartRef}>
          <button onClick={() => setIsCartOpen(prev => !prev)} className="cart">🛒</button>
          <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>

        <div className="language-switcher">
          <button onClick={() => { changeLanguage('gr'); handleLinkClick(); }}><img src={germany} alt="German" /></button>
          <button onClick={() => { changeLanguage('en'); handleLinkClick(); }}><img src={england} alt="English" /></button>
        </div>
      </nav>
    </header>
  );
}

export default Header;