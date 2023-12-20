import { Logo } from "./Logo";
import { Link, useLocation } from "react-router-dom";
import { Ilustracao } from "./Ilustracao";
import { ArrowCircleDown, Info, Funnel, User, File, Buildings, PaperPlaneTilt, ChartLine, Question, SignIn, ListDashes, UserCirclePlus, UserCircle, BookOpen, Textbox, Share, GraduationCap, GitBranch, UserPlus } from "phosphor-react";

import logo_1 from '../assets/logo_1.png';
import logo_2 from '../assets/logo_2.png';
import logo_3 from '../assets/logo_3.png';
import logo_4 from '../assets/logo_4.png';

import { Pesquisadores } from "./Pesquisadores";
import { Publicacoes } from "./Publicacoes";


import cimatec from '../assets/cimatec.png';
import ifba from '../assets/ifba.png';

type Total = {
  organizations: string,
  publications: string,
  researcher: string
}

import profnit from '../assets/logo_profnit.png';
import Cookies from "js-cookie";
import { useContext } from "react";
import { UserContext } from "../contexts/context";
import React, { useEffect } from 'react';
import { LogoIapos } from "./LogoIapos";
import { LogoSimcc } from "./LogoSimcc";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
  }
}



export function HeaderProfnit() {
  const { idVersao, setIdVersao } = useContext(UserContext);

  useEffect(() => {
    const existingScript = document.getElementById('google-translate-api');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.id = 'google-translate-api';
      document.body.appendChild(script);
    }

    // Define the translation initialization function globally.
    window.googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };
  }, []);


  const { idGraduateProgram, setIdGraduateProgram } = useContext(UserContext);
  const { estadoSelecionado, setEstadoSelecionado } = useContext(UserContext);

  const toggleButtonOff = () => {
    setIdGraduateProgram("0");
    setEstadoSelecionado("");
  };

  const location = useLocation();

  // Verifica se a URL é "/programa-teste"
  const isProgramaTeste = location.pathname === `/programas-graduacao` || location.pathname === `/result` || location.pathname === `/result/4`;


  
  const { pesquisadoresSelecionadosGroupBarema, setPesquisadoresSelecionadosGroupBarema } = useContext(UserContext);

  return (
    <header className={` z-[9999] px-6 md:px-16 w-full mb-4 h-20 justify-between items-center flex absolute top-0`}>
      <div className=" w-full flex items-center h-12 ">
        <div className="flex gap-6 items-center h-full justify-center ">
        <Link to={"/profnit"} className="h-[30px]  " onClick={toggleButtonOff}><Logo /></Link>
         
          <div className="w-[1px] h-8 bg-gray-400"></div>
          <Link to={"https://profnit.org.br/"} target="_blank" className="h-[32px] "><img src={profnit} alt="" className=" whitespace-nowrap h-[30px]" /></Link>

        </div>

        <div className="md:flex h-full hidden  rounded-md   ml-4">
          
       {idVersao != '1' ? 
       ( <Link to={`/indicators`} className="flex items-center h-full  px-4 text-gray-400 text-sm font-bold transition  gap-2"><ChartLine size={16} className="text-gray-400" />Indicadores</Link>)
       :('')}
          <Link to={`/terms`} className="flex items-center h-full  px-4 text-gray-400 text-sm font-bold transition  gap-2"><ListDashes size={16} className="text-gray-400" />Dicionário</Link>
          <Link to={`/magazine}`} className="flex items-center h-full  px-4 text-gray-400 text-sm font-bold transition  gap-2"><BookOpen size={16} className="text-gray-400" />Revistas</Link>
          <Link to={`/barema`} className="flex items-center h-full  px-4 text-gray-400 text-sm font-bold transition  gap-2"><Textbox size={16} />Barema{ pesquisadoresSelecionadosGroupBarema != '' ? (<div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>):('')}</Link>
        
          <Link to={`/taxonomia`} className="flex items-center h-full  px-4 text-gray-400 text-sm font-bold transition  gap-2"><GitBranch size={16} className="rotate-180"/>Taxonomia</Link>
       
        </div>
      </div>

      <div className="flex gap-4">
      <div id="google_translate_element" ></div>

      {isProgramaTeste && (
        <Link
          to={`/indicators-pos`}
          className="w-fit h-10 whitespace-nowrap flex items-center gap-4 bg-blue-400 text-sm text-white rounded-xl px-4 py-2 justify-center hover:bg-blue-500 font-medium transition"
        >
          <ChartLine size={16} className="text-white" /> Indicadores da pós-graduação
        </Link>
      )}




        
        {/*<LanguageSwitcher/>*/}
        </div>
    </header>
  )
}