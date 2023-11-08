import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ptBRTranslation from './translations/pt-BR.json';
import enUSTranslation from './translations/en-US.json';

// Configure i18next com o detector de idioma

i18next
  .use(LanguageDetector)
  .init({
    fallbackLng: 'pt-BR', // Idioma de fallback
    debug: true,
    resources: {
      'pt-BR': {
        translation: ptBRTranslation,
      },
      'en-US': {
        translation: enUSTranslation,
      },
      // Adicione mais idiomas conforme necessário
    },
  });



ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <I18nextProvider i18n={i18next}>
  <React.StrictMode>
    <App  />
  </React.StrictMode>
  </I18nextProvider>
)




