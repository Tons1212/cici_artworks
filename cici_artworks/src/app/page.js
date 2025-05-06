'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../components/AuthContext';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import Image from 'next/image';

const profil = '/profil_pic.jpeg';

function Home() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState(null);
  const PROFILE_ID = '7fe73140-3c62-452d-8260-73a1b7f6868c';

  useEffect(() => {
    if (typeof window === 'undefined') return;

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
    if (!file) return;

    const localPreviewUrl = URL.createObjectURL(file);
    setProfileImage(localPreviewUrl);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        alert("Vous devez être connecté pour uploader une image.");
        return;
      }

      const userId = userData.user.id;
      const oldPath = localStorage.getItem('profileImagePath');

      if (oldPath) {
        await supabase.storage.from('user-photos').remove([oldPath]);
      }

      const filePath = `user-${userId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('user-photos').upload(filePath, file);
      if (uploadError) {
        alert('Échec de l’upload');
        return;
      }

      localStorage.setItem('profileImagePath', filePath);

      const { data: publicUrlData, error: urlError } = supabase.storage.from('user-photos').getPublicUrl(filePath);
      if (urlError || !publicUrlData?.publicUrl) {
        alert('Erreur lors de la récupération de l’URL publique');
        return;
      }

      const publicUrl = publicUrlData.publicUrl;
      setProfileImage(publicUrl);
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
  };

  return (
    <main className="home-content">
      <div className="intro-profile">
        <div className="profile-image">
          <Image
            src={profileImage || profil}
            alt="Profil"
            className="profilPic"
            width={250}
            height={250}
          />
          {user && (
            <>
              <button
                className="modify-button"
                onClick={() => document.getElementById('file-input').click()}
              >
                Modify
              </button>
              <input
                id="file-input"
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
        <Link className="button" href="/about">
          {t('header.about')}
        </Link>
        <div className="social">
          <a
            href="https://www.instagram.com/artworks.bycici/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a
            href="https://www.tiktok.com/@artgallery_cimot/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-tiktok"></i>
          </a>
        </div>
      </div>
    </main>
  );
}

export default Home;