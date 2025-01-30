import React, { useEffect } from 'react';
import html from '../assets/HTML5_0_0.jpg';
import css from '../assets/css3.jpg';
import javascript from '../assets/javascript.jpg';
import react from '../assets/react.jpg';
import sass from '../assets/png-clipart-sass.png';
import node from '../assets/nodejs-image.jpg';
import mysql from '../assets/mysql.png';
import mongodb from '../assets/mongoDB.png';
import github from '../assets/github-logo.jpg';
import { useTranslation } from 'react-i18next';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import des styles de AOS

function Skills() {
  const { t } = useTranslation();

  useEffect(() => {
    AOS.init({ duration: 1000, once: false }); // Initialisation de AOS
  }, []);

  return (
    <div id='skills' className='skills'>
      <h2>{t('skills.title')}</h2>

      <h3>{t('skills.front')}</h3>
      <div className='logos'>
        <img
          src={html}
          alt='logo HTML'
          data-aos='zoom-in'
          data-aos-delay='100'
        />
        <img
          src={css}
          alt='logo CSS'
          data-aos='zoom-in'
          data-aos-delay='200'
        />
        <img
          src={javascript}
          alt='logo Javascript'
          data-aos='zoom-in'
          data-aos-delay='300'
        />
        <img
          src={react}
          alt='logo React'
          data-aos='zoom-in'
          data-aos-delay='400'
        />
        <img
          src={sass}
          alt='logo SASS'
          data-aos='zoom-in'
          data-aos-delay='500'
        />
      </div>

      <h3>{t('skills.back')}</h3>
      <div className='logos'>
        <img
          src={node}
          alt='logo Node'
          data-aos='zoom-in'
          data-aos-delay='100'
        />
        <img
          src={mysql}
          alt='logo MySQL'
          data-aos='zoom-in'
          data-aos-delay='200'
        />
        <img
          src={github}
          alt='logo Github'
          data-aos='zoom-in'
          data-aos-delay='300'
        />
        <img
          src={mongodb}
          alt='logo MongoDB'
          data-aos='zoom-in'
          data-aos-delay='400'
        />
      </div>
    </div>
  );
}

export default Skills;
