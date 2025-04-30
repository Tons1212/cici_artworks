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
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const cartRef = useRef(null);
  const navRef = useRef(null);
  const hamburgerRef = useRef(null);


  const isHome = location.pathname === "/";

  // ID fixe pour la ligne de profil unique
  const PROFILE_ID = '7fe73140-3c62-452d-8260-73a1b7f6868c'; // remplace par une vraie valeur UUID si existante

  useEffect(() => {
    const cachedUrl = localStorage.getItem('profileImageUrl');
  if (cachedUrl) {
    setProfileImage(cachedUrl);
  }
    const fetchProfileImage = async () => {
      const { data, error } = await supabase
        .from('artist_profile')
        .select('profile_image_url')
        .eq('id', PROFILE_ID)
        .maybeSingle();

      if (data?.profile_image_url) {
        setProfileImage(data.profile_image_url);
        localStorage.setItem('profileImageUrl', data.profile_image_url);
      } else {
        console.error("Erreur ou image manquante :", error);
      }
    };

    fetchProfileImage();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const localPreviewUrl = URL.createObjectURL(file);
      setProfileImage(localPreviewUrl);
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) {
          alert("Vous devez être connecté pour uploader une image.");
          return;
        }

        const userId = userData.user.id;
        const filePath = `user-${userId}/${Date.now()}-${file.name}`;

        const { error } = await supabase
          .storage
          .from('user-photos')
          .upload(filePath, file, { upsert: true });

        if (error) {
          console.error('Upload failed', error);
          alert('Échec de l’upload');
          return;
        }

        const { data: publicUrlData, error: urlError } = supabase
          .storage
          .from('user-photos')
          .getPublicUrl(filePath);

        if (urlError || !publicUrlData?.publicUrl) {
          console.error('Erreur URL publique:', urlError);
          alert('Erreur lors de la récupération de l’URL publique');
          return;
        }

        const publicUrl = publicUrlData.publicUrl;
      setProfileImage(publicUrl);

      // ⬇️ Ici : on enregistre dans le localStorage
      localStorage.setItem('profileImageUrl', publicUrl);

      const { error: updateError } = await supabase
        .from('artist_profile')
        .update({ profile_image_url: publicUrl })
        .eq('id', PROFILE_ID);

      if (updateError) {
        console.error('Erreur mise à jour BDD:', updateError);
      }
    } catch (error) {
      console.error('Erreur générale :', error);
    }
  }
};

  // Scroll en haut
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
    <header className={isHome ? "header header-home" : "header header-simple"}>
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
          <Link to="/about" onClick={handleLinkClick}>{t('header.about')}</Link>
          <Link to="/gallery" onClick={handleLinkClick}>{t('header.gallery')}</Link>
          <Link to="/contact" onClick={handleLinkClick}>{t('header.contact')}</Link>
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

      {isHome && (
        <>
          <div className="intro-profile">
            <div className="profile-image">
              <img src={profileImage || profil} alt="Profil" />
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
              <a href="https://www.instagram.com/artworks.bycici/" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-instagram"></i></a>
              <a href="https://www.tiktok.com/@artgallery_cimot/" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-tiktok"></i></a>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

export default Header;
