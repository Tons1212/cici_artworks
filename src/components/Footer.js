import React from 'react'
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();

  return (
    <div className='footer'>
      <p><i class="fa-regular fa-copyright"></i>   Copyright 2024 - Antoine GROSJAT. {t("footer.rights")}</p>
    <div className='social'>
    <a href='https://github.com/Tons1212' target='_blank' rel='noreferrer'><i class="fa-brands fa-github"></i></a>
    <a href='mailto:tons.gr@gmail.com'><i class="fa-solid fa-at"></i></a>
    <a href='https://www.linkedin.com/in/antoine-grosjat-4a0860329/' target='_blank' rel='noreferrer'><i class="fa-brands fa-linkedin"></i></a>
  </div>
  </div>
  )
}

export default Footer
