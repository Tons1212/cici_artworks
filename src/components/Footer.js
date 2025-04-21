import React from 'react'
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();

  return (
    <div className='footer'>
      <p><i class="fa-regular fa-copyright"></i>   Copyright 2025 - Cici PURWANTI. {t("footer.rights")}</p>
    <div className='social'>
      <a href="https://www.instagram.com/artworks.bycici/" target="_blank" rel="noopener noreferrer">
        <i className="fa-brands fa-instagram"></i>
      </a>
      <a href="https://www.tiktok.com/@artgallery_cimot/" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-tiktok"></i>
      </a>
  </div>
  </div>
  )
}

export default Footer
