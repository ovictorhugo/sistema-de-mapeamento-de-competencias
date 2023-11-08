import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleChangeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  // Get the current language from i18n
  const currentLanguage = i18n.language;

  return (
    <div className='flex gap-4 items-center'>
      <button onClick={() => handleChangeLanguage('pt-BR')} className={`flex items-center text-sm rounded-full p-2 gap-3 font-medium text-gray-400 transition-all hover:bg-gray-50 ${currentLanguage === "pt-BR" ? 'bg-gray-100 px-4' : ''}`} >
        {currentLanguage === "pt-BR" ? 'Português' : ''}
        <div className='h-4 w-4 rounded-full bg-cover bg-center bg-no-repeat' style={{ backgroundImage: `url(https://img.freepik.com/vetores-premium/ilustracao-em-vetor-plana-brasil-bandeira-plana_24640-50672.jpg)` }}></div>
      </button>
      <button onClick={() => handleChangeLanguage('en-US')} className={`flex items-center text-sm rounded-full p-2  gap-3 font-medium  text-gray-400 transition-all hover:bg-gray-50 ${currentLanguage === "en-US" ? 'bg-gray-100 px-4' : ''}`}>
        {currentLanguage === "en-US" ? 'English' : ''}
      <div className='h-4 w-4 rounded-full bg-cover bg-center bg-no-repeat' style={{ backgroundImage: `url(https://static.mundoeducacao.uol.com.br/mundoeducacao/2022/05/bandeira-estados-unidos.jpg)` }}></div>
      </button>
    </div>
  );
}

export default LanguageSwitcher;
