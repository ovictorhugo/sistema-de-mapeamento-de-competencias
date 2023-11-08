import { Logo } from "./Logo";
import { Link } from "react-router-dom";
import { Ilustracao } from "./Ilustracao";
import { ArrowCircleDown, Info, Funnel, User, File, Buildings, PaperPlaneTilt, ChartLine, Question, SignIn, ListDashes, UserCirclePlus, UserCircle, BookOpen, Textbox, Share } from "phosphor-react";

import logo_1 from '../assets/logo_1.png';
import logo_2 from '../assets/logo_2.png';
import logo_3 from '../assets/logo_3.png';
import logo_4 from '../assets/logo_4.png';

import { Pesquisadores } from "./Pesquisadores";
import { Publicacoes } from "./Publicacoes";

import LanguageSwitcher from './LanguageSwitcher';

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



export function Header() {
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


  
  const { pesquisadoresSelecionadosGroupBarema, setPesquisadoresSelecionadosGroupBarema } = useContext(UserContext);

  return (
    <header className={` z-[9999999] px-6 md:px-16 w-full mb-4 h-20 justify-between items-center flex absolute top-0`}>
      <div className=" w-full flex items-center h-12 ">
        <div className="flex gap-6 items-center h-full justify-center ">
        {idVersao === '1' || idVersao === ''  ? (
             <Link to={"/1"} className="h-[30px]  " onClick={toggleButtonOff}><LogoIapos /></Link>
          ) : (idVersao === '2') ? (
            <Link to={"/2"} className="h-[30px]  " onClick={toggleButtonOff}><Logo /></Link>
          ) : (idVersao == '4') ? (
            <Link to={"/4"} className="h-[30px]  " onClick={toggleButtonOff}><LogoSimcc /></Link>
          ) : (
           ''
          )}
         
          <div className="w-[1px] h-8 bg-gray-400"></div>
          {idVersao === '1' || idVersao === ''  ? (
            <Link to={"https://www.senaicimatec.com.br/"} target="_blank" className="h-[32px] "><img src={cimatec} alt="" className="h-[30px]" /></Link>
          ) : (idVersao === "2") ? (
            <Link to={"https://profnit.org.br/"} target="_blank" className="h-[32px] "><img src={profnit} alt="" className="h-[30px]" /></Link>
          ) : (idVersao === "3") ?(
            <Link to={"https://profnit.org.br/"} target="_blank" className="h-[32px] "><img src={ifba} alt="" className="h-[30px]" /></Link>
          ) : (idVersao == '4') ? (
            <Link to={"https://profnit.org.br/"} target="_blank" className=" "><img src={logo_4} alt="" className="h-[38px]" /></Link>
          ): ('')}

        </div>

        <div className="md:flex h-full hidden  rounded-md   ml-4">
          
       {idVersao != '1' ? 
       ( <Link to={`/indicators${idVersao}`} className="flex items-center h-full  px-4 text-gray-400 text-sm font-bold transition  gap-2"><ChartLine size={16} className="text-gray-400" />Indicadores</Link>)
       :('')}
          <Link to={`/terms/${idVersao}`} className="flex items-center h-full  px-4 text-gray-400 text-sm font-bold transition  gap-2"><ListDashes size={16} className="text-gray-400" />Dicionário</Link>
          <Link to={`/magazine/${idVersao}`} className="flex items-center h-full  px-4 text-gray-400 text-sm font-bold transition  gap-2"><BookOpen size={16} className="text-gray-400" />Revistas</Link>
          <Link to={`/barema/${idVersao}`} className="flex items-center h-full  px-4 text-gray-400 text-sm font-bold transition  gap-2"><Textbox size={16} />Barema{ pesquisadoresSelecionadosGroupBarema != '' ? (<div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>):('')}</Link>
       
        </div>
      </div>

      <div className="flex gap-4">
        <div id="google_translate_element" ></div>
        {/*<LanguageSwitcher/>*/}
        </div>
    </header>
  )
}