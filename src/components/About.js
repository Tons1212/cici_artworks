import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import selfie from '../assets/profil_pic.jpeg';
import AOS from 'aos';
import 'aos/dist/aos.css'; 

function About() {
  const { t } = useTranslation();

  useEffect(() => {
    AOS.init({
      duration: 1000, 
      offset: 200, 
    });
  }, []);

  return (
    <section id='about' className='about lines'>
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
      <h2>{t('about.title')}</h2>
      <div className='presentation'>
        <img
          data-aos='zoom-in-down'
          src={selfie}
          alt='profile Antoine GROSJAT'
        />
        <p data-aos='zoom-in-down'>
          {t('about.text')}
          <br />
          <br />
          {t('about.text1')}
        </p>
      </div>
    </section>
  );
}

export default About;

