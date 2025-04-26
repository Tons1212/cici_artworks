import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useAuth } from "../components/AuthContext";

function About() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState(localStorage.getItem('profileImage') || ''); // Récupère l'image du localStorage

  useEffect(() => {
    AOS.init({
      duration: 1000,
      offset: 10,
    });
  }, []);

  // Fonction pour changer l'image de profil
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        // Sauvegarder l'image dans le localStorage
        localStorage.setItem('profileImage', reader.result);
        setProfileImage(reader.result); // Mettre à jour l'image affichée
      };

      // Lire le fichier comme URL de données
      reader.readAsDataURL(file);
    }
  };

  return (
    <section id="about" className='about lines'>
      <div className="line"></div>
      <div className="line"></div>
      <div className="line"></div>
      <div className="line"></div>
      <div className="line"></div>
      <h2>{t('about.title')}</h2>
      <div className='presentation'>
        <div className="img-wrapper" data-aos='zoom-in-down'>
          <img
            src={profileImage || 'path/to/default/image.jpeg'} // Afficher l'image de profil ou l'image par défaut
            alt='profile Cici_Artworks'
            className="profile-image"
          />
          {user && (
            <button
              className="modify-button"
              onClick={() => document.getElementById('file-input').click()} // Simule un clic sur l'input file
            >
              Modify
            </button>
          )}
          {/* Champ de sélection de fichier invisible */}
          {user && (
            <input
              id="file-input"
              type="file"
              style={{ display: 'none' }}
              onChange={handleImageChange}
              accept="image/*"
            />
          )}
        </div>

        <p data-aos='zoom-in-down'>
          {t('about.text')}
          <br />
          <br />
          {t('about.text1')}
          <br />
          <br />
          {t('about.text2')}
        </p>
      </div>
    </section>
  );
}

export default About;
