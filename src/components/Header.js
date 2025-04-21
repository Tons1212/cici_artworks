import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft } from 'react-icons/fa';
import backgroundImg from '../assets/background.jpeg';
import bg2 from '../assets/bg2.jpeg';
import bg3 from '../assets/bg3.jpeg';
import germany from '../assets/Germany.png';
import england from '../assets/royaume-uni.png';
import logo from '../assets/Logo_Cici.jpeg';
import CartDrawer from "../components/CartDrawer";
import { useAuth } from "../components/AuthContext";

function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { token, logout } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef(null);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const backgrounds = [backgroundImg, bg2, bg3];

  // Scroll en haut
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 4000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <header className={location.pathname === "/login" ? "header-login" : ""}>
      {location.pathname === "/login" && (
        <Link to="/" className="back-arrow">
          <FaArrowLeft />
        </Link>
      )}

      {location.pathname !== "/login" &&
        backgrounds.map((bg, index) => (
          <img
            key={index}
            src={bg}
            className={`carousel-bg ${index === currentBgIndex ? 'active' : ''}`}
            alt={`background-${index}`}
          />
        ))
      }

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
          <a href="#about">{t('header.about')}</a>
          <a href="#gallery">{t('header.gallery')}</a>
          <a href="#contactForm">{t('header.contact')}</a>
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

      <div className="intro">
        <h1 className="animate__animated animate__lightSpeedInRight">
          {t('header.intro')}
        </h1>
        <p className="animate__animated animate__lightSpeedInRight">
        {t('header.intro1')}
        </p>
        <a href="#about" className="button animate__animated animate__lightSpeedInRight">
          {t('header.learnMore')}
        </a>
        <div className="social animate__animated animate__lightSpeedInRight">
          <a href="https://www.instagram.com/artworks.bycici/" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a href="https://www.tiktok.com/@artgallery_cimot/" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-tiktok"></i>
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;
