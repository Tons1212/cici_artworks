'use client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from '../locales/en/translation.json';
import translationGR from '../locales/gr/translation.json';

// Les ressources de traduction pour les langues disponibles
const resources = {
  en: {
    translation: translationEN
  },
  gr: {
    translation: translationGR
  }
};

i18n
  .use(initReactI18next) 
  .init({
    resources,
    lng: 'en', // Langue par défaut (Anglais)
    fallbackLng: 'en', // Si la langue souhaitée n'est pas disponible, on utilise l'anglais
    interpolation: {
      escapeValue: false // Pas d'échappement des valeurs pour éviter les attaques XSS
    }
  });

export default i18n;