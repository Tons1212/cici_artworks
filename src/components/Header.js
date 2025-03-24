import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft } from 'react-icons/fa'; // Import de l'icône flèche
import backgroundImg from '../assets/background.jpeg';
import france from '../assets/Germany.png';
import england from '../assets/royaume-uni.png';

function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation(); // Récupère la route actuelle

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
      {/* Flèche de retour affichée uniquement sur la page login */}
      {location.pathname === "/login" && (
        <Link to="/" className="back-arrow">
          <FaArrowLeft />
        </Link>
      )}

      {location.pathname !== "/login" && ( 
        <img className="background" src={backgroundImg} alt="background" />
      )}
      
      <div className="hamburger" id="hamburger">
        <div></div>
        <div></div>
        <div></div>
      </div>

      <nav className="navLinks" id="navLinks">
        <div className="navLinksContainer">
          <Link to="/">{t('header.home')}</Link>
          <Link to="/about">{t('header.about')}</Link>
          <Link to="/skills">{t('header.skills')}</Link>
          <Link to="/portfolio">{t('header.portfolio')}</Link>
          <Link to="/contact">{t('header.contact')}</Link>
          <Link to="/login" className="login-link">{t('header.login')}</Link>
        </div>
        <div className="language-switcher">
          <button onClick={() => changeLanguage('fr')}>
            <img src={france} alt="Français" />
          </button>
          <button onClick={() => changeLanguage('en')}>
            <img src={england} alt="English" />
          </button>
        </div>
      </nav>
      
      {location.pathname === "/" && (
        <div className="intro">
          <h1 className="animate__animated animate__lightSpeedInRight">
            {t('header.intro')}<span className="wave">👋</span><br />
            {t('header.intro1')}
          </h1>
          <p className="animate__animated animate__lightSpeedInRight">
            {t('header.jobTitle')}
          </p>
          <a href="#about" className="button animate__animated animate__lightSpeedInRight">
            {t('header.learnMore')}
          </a>
          <div className="social animate__animated animate__lightSpeedInRight">
            <a href="https://www.instagram.com/artworks.bycici/" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-instagram"></i>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
