'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ContactForm = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    objet: '',
    message: ''
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://formspree.io/f/mvgkrbvv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus(t('contact.success') || 'Votre message a bien été envoyé !');
        setFormData({
          nom: '',
          prenom: '',
          telephone: '',
          email: '',
          objet: '',
          message: ''
        });
      } else {
        setStatus(t('contact.error') || 'Une erreur est survenue lors de l\'envoi.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setStatus(t('contact.error') || 'Une erreur est survenue lors de l\'envoi.');
    }
  };

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(''), 10000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div className="formBlock">
      <div className="contactText">
        <h2>{t('contact.title')}</h2>
        <p>{t('contact.text')}</p>
      </div>

      <div className="contactDetails">
        <div id="contactForm" className="contactItem">
          <i className="fa-solid fa-at"></i>
          <a href="mailto:cpurwanti2@gmail.com">cpurwanti2@gmail.com</a>
        </div>
      </div>

      <form className="contactForm" onSubmit={handleSubmit}>
        <div className="formGroup">
          <label htmlFor="nom">
            {t('contact.name')}
            <input
              type="text"
              name="nom"
              id="nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label htmlFor="email">
            {t('contact.mail')}
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className="formGroup">
          <label htmlFor="prenom">
            {t('contact.firstName')}
            <input
              type="text"
              name="prenom"
              id="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label htmlFor="telephone">
            {t('contact.phone')}
            <input
              type="tel"
              name="telephone"
              id="telephone"
              value={formData.telephone}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <label htmlFor="objet">
          {t('contact.object')}
          <input
            type="text"
            name="objet"
            id="objet"
            value={formData.objet}
            onChange={handleChange}
            required
          />
        </label>

        <label htmlFor="message">
          {t('contact.message')}
          <textarea
            name="message"
            id="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">{t('contact.submit')}</button>
        {status && <p>{status}</p>}
      </form>
    </div>
  );
};

export default ContactForm;