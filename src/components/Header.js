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
import { supabase } from "../supabaseClient";  // Assure-toi d'importer supabaseClient

function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef(null);
  const isHome = location.pathname === "/";
  const [profileImage, setProfileImage] = useState(profil); // Valeur par défaut

  // Fonction pour gérer le changement d'image
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();

if (userError || !userData?.user) {
  console.error("Utilisateur non connecté ou erreur :", userError);
  alert("Vous devez être connecté pour uploader une image.");
  return;
}

const userId = userData.user.id;
const filePath = `user-${userId}/${Date.now()}-${file.name}`;

        
        // Upload de l'image dans le bucket de Supabase
        const { data, error } = await supabase.storage
          .from('user-photos') // Assure-toi que le bucket 'user-photos' est bien configuré
          .upload(filePath, file);
  
        if (error) {
          console.error('Upload failed', error);
          alert('Upload failed');
          return; // Si l'upload échoue, on quitte la fonction
        }
  
        // Vérification de la réponse de l'upload
        if (data) {
          console.log('Upload data:', data); // Pour voir ce qui est retourné
          // Obtenir l'URL publique de l'image
          const { data: publicUrlData, error: urlError } = supabase
            .storage
            .from('user-photos')
            .getPublicUrl(filePath);
  
          if (urlError) {
            console.error('Error getting public URL:', urlError);
            alert('Error getting public URL');
          } else {
            // Mise à jour de l'URL de l'image de profil
            setProfileImage(publicUrlData.publicUrl);
          }
        } else {
          console.error('No data returned from upload');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

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
        <Link to="/" className="logo" onClick={(e) => { if (location.pathname === "/") { e.preventDefault(); scrollToTop(); } }}>
          <img src={logo} alt="Logo" className="logo-img" />
        </Link>

        <div className="navLinksContainer">
          <Link to="/" onClick={(e) => { if (location.pathname === "/") { e.preventDefault(); scrollToTop(); } }}>{t('header.home')}</Link>
          <Link to="/about">{t('header.about')}</Link>
          <Link to="/gallery">{t('header.gallery')}</Link>
          <Link to="/contact">{t('header.contact')}</Link>
          {user ? (
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
              <img src={profileImage} alt="Profil" />
              {user && (
                <>
                  <button className="modify-button" onClick={() => document.getElementById('header-file-input').click()}>
                    Modify
                  </button>
                  <input
                    id="header-file-input"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </>
              )}
            </div>
            <div className="profile-content">
              <h1>{t('header.intro')}</h1>
              <p>{t('header.intro1')}</p>
            </div>
          </div>

          <div className="cta-social">
            <Link className='button' to="/about">{t('header.about')}</Link>
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
