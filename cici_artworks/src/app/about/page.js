'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useAuth } from "../../components/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import imageCompression from 'browser-image-compression';
import Image from 'next/image';

const defaultImage1 = '/about (2).jpg';
const defaultImage2 = '/about (3).jpg';

function About() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [profileImage1, setProfileImage1] = useState(defaultImage1);
  const [profileImage2, setProfileImage2] = useState(defaultImage2);

  useEffect(() => {
    AOS.init({ duration: 1000, offset: 10 });

    const cached1 = localStorage.getItem('about_profileImage1');
    const cached2 = localStorage.getItem('about_profileImage2');

    if (cached1) setProfileImage1(cached1);
    if (cached2) setProfileImage2(cached2);

    fetchImages();
  }, []);

  const fetchImages = async () => {
    const cachedPath1 = localStorage.getItem('about_profilePath1');
    const cachedPath2 = localStorage.getItem('about_profilePath2');

    if (cachedPath1) {
      const { data } = supabase.storage.from('user-photos').getPublicUrl(cachedPath1);
      if (data?.publicUrl) {
        setProfileImage1(data.publicUrl);
        localStorage.setItem('about_profileImage1', data.publicUrl);
      }
    }

    if (cachedPath2) {
      const { data } = supabase.storage.from('user-photos').getPublicUrl(cachedPath2);
      if (data?.publicUrl) {
        setProfileImage2(data.publicUrl);
        localStorage.setItem('about_profileImage2', data.publicUrl);
      }
    }
  };

  const handleImageChange = async (e, imageNumber) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    if (imageNumber === 1) setProfileImage1(previewUrl);
    else setProfileImage2(previewUrl);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        alert("Vous devez être connecté pour uploader une image.");
        return;
      }

      const userId = userData.user.id;
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true
      });

      const filePath = `about/user-${userId}/${Date.now()}-${file.name}`;

      const oldPath = localStorage.getItem(`about_profilePath${imageNumber}`);
      if (oldPath) {
        await supabase.storage.from('user-photos').remove([oldPath]);
      }

      const { error: uploadError } = await supabase
        .storage
        .from('user-photos')
        .upload(filePath, compressedFile, { upsert: true });

      if (uploadError) {
        console.error('Erreur upload:', uploadError);
        return;
      }

      const { data: publicUrlData, error: urlError } = supabase
        .storage
        .from('user-photos')
        .getPublicUrl(filePath);

      if (urlError || !publicUrlData?.publicUrl) {
        console.error('Erreur URL publique:', urlError);
        return;
      }

      const publicUrl = publicUrlData.publicUrl;

      if (imageNumber === 1) {
        setProfileImage1(publicUrl);
        localStorage.setItem('about_profileImage1', publicUrl);
        localStorage.setItem('about_profilePath1', filePath);
      } else {
        setProfileImage2(publicUrl);
        localStorage.setItem('about_profileImage2', publicUrl);
        localStorage.setItem('about_profilePath2', filePath);
      }

    } catch (error) {
      console.error('Erreur générale :', error);
    }
  };

  return (
    <section id="about" className="about lines">
      <div className="line"></div><div className="line"></div><div className="line"></div><div className="line"></div><div className="line"></div>
      <h2>{t('about.title')}</h2>

      <div className="about-section">
        <div className="profile-image image" data-aos="zoom-in-down" style={{ position: 'relative', width: '100%', height: '400px' }}>
          <Image src={profileImage1} alt="Profile section 1" priority fill style={{ objectFit: 'cover' }} unoptimized />
          {user && (
            <>
              <button className="modify-button" onClick={() => document.getElementById('file-input-1').click()}>Modify</button>
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
          <p>{t('about.text')}<br /><br /></p>
        </div>
      </div>

      <div className="about-section reverse">
        <div className="about-text text2" data-aos="zoom-in-down">
          <p>{t('about.text1')}<br /><br />{t('about.text2')}</p>
        </div>
        <div className="profile-image image2" data-aos="zoom-in-down" style={{ position: 'relative', width: '100%', height: '400px' }}>
          <Image src={profileImage2} alt="Profile section 2" priority fill style={{ objectFit: 'cover' }} unoptimized />
          {user && (
            <>
              <button className="modify-button" onClick={() => document.getElementById('file-input-2').click()}>Modify</button>
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