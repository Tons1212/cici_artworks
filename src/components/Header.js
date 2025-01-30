import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import backgroundImg from '../assets/mohammad-rahmani-8qEB0fTe9Vw-unsplash.webp';
import france from '../assets/france.png';
import england from '../assets/royaume-uni.png';

function Header() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  }

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
      !hamburger.contains(event.target)
    ) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
      }
    };
    
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', handleClick);
      document.addEventListener('click', handleClickOutside)
      return () => {
        hamburger.removeEventListener('click', handleClick);
        document.removeEventListener('click', handleClickOutside)
      };
    }
  }, []);
  return (
    <header id='home'>
      <img className='background' src={backgroundImg} alt='editeur de code sur pc portable'/>
      <div class="hamburger" id="hamburger">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <nav className='navLinks animate__animated animate__lightSpeedInLeft' id='navLinks'>
      <div className="navLinksContainer">
        <a href='#home'>{t('header.home')}</a>
        <a href='#about'>{t('header.about')}</a>
        <a href='#skills'>{t('header.skills')}</a>
        <a href='#portfolio'>{t('header.portfolio')}</a>
        <a href='#contactForm'>{t('header.contact')}</a>
      </div>
      <div className='language-switcher'>
        <button onClick={() => changeLanguage('fr')}>
          <img src={france} alt='Français' />
        </button>
        <button onClick={() => changeLanguage('en')}>
          <img src={england} alt='English' />
        </button>
      </div>
      </nav>
      <div className='intro'>
        <h1 className='animate__animated animate__lightSpeedInRight'>
        {t('header.intro')}<span className='wave'>👋</span><br />
        {t('header.intro1')}</h1>
        <p className='animate__animated animate__lightSpeedInRight'>{t('header.jobTitle')}</p>
        <a href='#about' className='button animate__animated animate__lightSpeedInRight'>{t('header.learnMore')}</a>
      </div>
      <div className='social animate__animated animate__lightSpeedInRight'>
        <a href='https://github.com/Tons1212' target='_blank' rel='noreferrer' ><i class="fa-brands fa-github"></i></a>
        <a href='mailto:tons.gr@gmail.com'><i class="fa-solid fa-at"></i></a>
        <a href='https://www.linkedin.com/in/antoine-grosjat-4a0860329/' target='_blank' rel='noreferrer'><i class="fa-brands fa-linkedin"></i></a>
      </div>  
    </header>
  )
}

export default Header
