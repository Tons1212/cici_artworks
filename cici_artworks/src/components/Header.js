"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft } from 'react-icons/fa';
import Image from 'next/image';

import CartDrawer from "../components/CartDrawer";
import { useAuth } from "../components/AuthContext";

function Header() {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const { user, logout } = useAuth() || {};
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
    <header className={pathname === "/" ? "header header-home" : "header header-simple"}>
      {pathname === "/login" && (
        <Link href="/" className="back-arrow">
          <FaArrowLeft />
        </Link>
      )}

      <div ref={hamburgerRef} className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(prev => !prev)}>
        <div></div><div></div><div></div>
      </div>

      <nav ref={navRef} className={`navLinks ${menuOpen ? "open" : ""}`}>
        <Link href="/" className="logo" onClick={(e) => { if (pathname === "/") { e.preventDefault(); scrollToTop(); } handleLinkClick(); }}>
          <Image src="/Logo_Cici.jpeg" alt="Logo" width={120} height={60} className="logo-img" />
        </Link>

        <div className="navLinksContainer">
          <Link href="/" onClick={(e) => { if (pathname === "/") { e.preventDefault(); scrollToTop(); } handleLinkClick('home'); }} className={activeLink === 'home' ? 'active' : ''}>{t('header.home')}</Link>
          <Link href="/about" onClick={() => handleLinkClick('about')}>{t('header.about')}</Link>
          <Link href="/gallery" onClick={() => handleLinkClick('gallery')}>{t('header.gallery')}</Link>
          <Link href="/contact" onClick={() => handleLinkClick('contact')}>{t('header.contact')}</Link>
          {user ? (
            <button onClick={() => { logout(); handleLinkClick(); }} className="navLinksContainer-button login-link">
              {t('header.logout')}
            </button>
          ) : (
            <Link href="/login" className="login-link" onClick={() => handleLinkClick()}>{t('header.login')}</Link>
          )}
        </div>

        <div className="relative" ref={cartRef}>
          <button onClick={() => setIsCartOpen(prev => !prev)} className="cart">🛒</button>
          <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>

        <div className="language-switcher">
          <button onClick={() => { changeLanguage('gr'); handleLinkClick(); }}>
            <Image src="/Germany.png" alt="German" width={30} height={20} />
          </button>
          <button onClick={() => { changeLanguage('en'); handleLinkClick(); }}>
            <Image src="/royaume-uni.png" alt="English" width={30} height={20} />
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;