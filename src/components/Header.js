import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft } from 'react-icons/fa';
import england from '../assets/royaume-uni.png';
import germany from '../assets/Germany.png';
import profil from '../assets/profil_pic.jpeg';
import logo from '../assets/Logo_Cici.jpeg';
import CartDrawer from "../components/CartDrawer";
import { useAuth } from "../components/AuthContext";

function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { token, logout } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef(null);
  const isHome = location.pathname === "/";

  
  // Scroll en haut
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isCartOpen && cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCartOpen]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    const handleClick = () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('open');
    };

    const handleClickOutside = (event) => {
      if (navLinks.classList.contains('open') &&
        !navLinks.contains(event.target) &&
        !hamburger.contains(event.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
      }
    };

    if (hamburger && navLinks) {
      hamburger.addEventListener('click', handleClick);
      document.addEventListener('click', handleClickOutside);
      return () => {
        hamburger.removeEventListener('click', handleClick);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, []);

  return (
    <header className={isHome ? "header header-home" : "header header-simple"}>
      {location.pathname === "/login" && (
        <Link to="/" className="back-arrow">
          <FaArrowLeft />
        </Link>
      )}


      <div className="hamburger" id="hamburger">
        <div></div>
        <div></div>
        <div></div>
      </div>

      <nav className="navLinks" id="navLinks">
        <Link
          to="/"
          className="logo"
          onClick={(e) => {
            if (location.pathname === "/") {
              e.preventDefault();
              scrollToTop();
            }
          }}
        >
          <img src={logo} alt="Logo" className="logo-img" />
        </Link>

        <div className="navLinksContainer">
          <Link
            to="/"
            onClick={(e) => {
              if (location.pathname === "/") {
                e.preventDefault();
                scrollToTop();
              }
            }}
          >
            {t('header.home')}
          </Link>
          <Link to="/about">{t('header.about')}</Link>
          <Link to="/gallery">{t('header.gallery')}</Link>
          <Link to="/contact">{t('header.contact')}</Link>
          {token ? (
            <button onClick={logout} className="navLinksContainer-button login-link">
              {t('header.logout')}
            </button>
          ) : (
            <Link to="/login" className="login-link">{t('header.login')}</Link>
          )}
        </div>

        <div className="relative" ref={cartRef}>
          <button onClick={() => setIsCartOpen((prev) => !prev)} className="cart">
            🛒
          </button>
          <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>

        <div className="language-switcher">
          <button onClick={() => changeLanguage('fr')}>
            <img src={germany} alt="German" />
          </button>
          <button onClick={() => changeLanguage('en')}>
            <img src={england} alt="English" />
          </button>
        </div>
      </nav>

      {isHome && (
  <>
    <div className="intro-profile">
      <div className="profile-image">
        <img src={profil} alt="Profil" />
      </div>
      <div className="profile-content">
        <h1>{t('header.intro')}</h1>
        <p>{t('header.intro1')}</p>
      </div>
    </div>

    <div className="cta-social"> {/* ✅ ici, séparé */}
    <Link className='button' to="/about">{t('header.about')}</Link>
      {/* <a href="#about" className="button">{t('header.learnMore')}</a> */}
      <div className="social">
        <a href="https://www.instagram.com/artworks.bycici/" target="_blank" rel="noopener noreferrer">
          <i className="fa-brands fa-instagram"></i>
        </a>
        <a href="https://www.tiktok.com/@artgallery_cimot/" target="_blank" rel="noopener noreferrer">
          <i className="fa-brands fa-tiktok"></i>
        </a>
      </div>
    </div>
  </>
)}


    </header>
  );
}

export default Header;
