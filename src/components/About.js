import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useAuth } from "../components/AuthContext";
import { supabase } from "../supabaseClient";  // Import du client Supabase
import defaultImage1 from '../assets/about (2).jpg'; // Mets ici ton image par défaut 1
import defaultImage2 from '../assets/about (3).jpg'; // Mets ici ton image par défaut 2

function About() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [profileImage1, setProfileImage1] = useState(defaultImage1);
  const [profileImage2, setProfileImage2] = useState(defaultImage2);

  useEffect(() => {
    AOS.init({ duration: 1000, offset: 10 });
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data: image1 } = await supabase.storage.from('user-photos').getPublicUrl('about/profile1.jpg');
    const { data: image2 } = await supabase.storage.from('user-photos').getPublicUrl('about/profile2.jpg');

    if (image1?.publicUrl) setProfileImage1(image1.publicUrl);
    if (image2?.publicUrl) setProfileImage2(image2.publicUrl);
  };

  const handleImageChange = async (e, imageNumber) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error("Utilisateur non connecté ou erreur :", userError);
        alert("Vous devez être connecté pour uploader une image.");
        return;
      }

      const fileName = imageNumber === 1 ? 'about/profile1.jpg' : 'about/profile2.jpg';
      const { error: uploadError } = await supabase.storage
        .from('user-photos') // bucket 'user-photos'
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (uploadError) {
        console.error('Upload failed', uploadError);
        alert('Upload failed');
        return;
      }

      // Récupérer l'URL publique après upload
      const { data: publicUrlData, error: urlError } = await supabase
        .storage
        .from('user-photos')
        .getPublicUrl(fileName);

      if (urlError) {
        console.error('Error getting public URL:', urlError);
        alert('Error getting public URL');
      } else {
        if (imageNumber === 1) setProfileImage1(publicUrlData.publicUrl);
        else setProfileImage2(publicUrlData.publicUrl);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <section id="about" className="about lines">
      <div className="line"></div>
      <div className="line"></div>
      <div className="line"></div>
      <div className="line"></div>
      <div className="line"></div>
      <h2>{t('about.title')}</h2>

      {/* Première section : image gauche, texte droite */}
      <div className="about-section">
        <div className="profile-image image" data-aos="zoom-in-down">
          <img src={profileImage1} alt="Profile section 1" />
          {user && (
            <>
              <button className="modify-button" onClick={() => document.getElementById('file-input-1').click()}>
                Modify
              </button>
              <input
                id="file-input-1"
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => handleImageChange(e, 1)}
                accept="image/*"
              />
            </>
          )}
        </div>
        <div className="about-text text" data-aos="zoom-in-down">
          <p>
            {t('about.text')}
            <br /><br />
          </p>
        </div>
      </div>

      {/* Deuxième section inversée : texte gauche, image droite */}
      <div className="about-section reverse">
        <div className="about-text text2" data-aos="zoom-in-down">
          <p>
            {t('about.text1')}
            <br /><br />
            {t('about.text2')}
          </p>
        </div>
        <div className="profile-image image2" data-aos="zoom-in-down">
          <img src={profileImage2} alt="Profile section 2" />
          {user && (
            <>
              <button className="modify-button" onClick={() => document.getElementById('file-input-2').click()}>
                Modify
              </button>
              <input
                id="file-input-2"
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => handleImageChange(e, 2)}
                accept="image/*"
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default About;