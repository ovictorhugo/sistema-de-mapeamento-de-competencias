import { Logo } from "./Logo";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Ilustracao } from "./Ilustracao";
import { ArrowCircleDown, Info, Funnel,  File, Buildings, PaperPlaneTilt, ChartLine, Question, SignIn, ListDashes, UserCirclePlus, UserCircle, BookOpen, Textbox, Share, GraduationCap, GitBranch, UserPlus, SignOut } from "phosphor-react";

import logo_1 from '../assets/logo_1.png';
import logo_2 from '../assets/logo_2.png';
import logo_3 from '../assets/logo_3.png';
import logo_4 from '../assets/logo_4.png';

import { Pesquisadores } from "./Pesquisadores";
import { Publicacoes } from "./Publicacoes";

import { auth } from "../lib/firebase";


import cimatec from '../assets/cimatec.png';
import ifba from '../assets/ifba.png';
import {GoogleAuthProvider, signInWithPopup, User} from 'firebase/auth'

type Total = {
  organizations: string,
  publications: string,
  researcher: string
}

import profnit from '../assets/logo_profnit.png';
import Cookies from "js-cookie";
import { useContext, useState } from "react";
import { UserContext } from "../contexts/context";
import React, { useEffect } from 'react';
import { LogoIapos } from "./LogoIapos";
import { LogoSimcc } from "./LogoSimcc";
import { LogoWhite } from "./LogoWhite";


declare global {
  interface Window {
    googleTranslateElementInit: () => void;
  }
}



export function HeaderBarema() {
  const { idVersao, setIdVersao } = useContext(UserContext);
  const {loggedIn, setLoggedIn} = useContext(UserContext);

  const { botaoPatentesClicado, setBotaoPatentesClicado } = useContext(UserContext);
    const { botaoPesquisadoresClicado, setBotaoPesquisadoresClicado } = useContext(UserContext);
    const { botaoTermosClicado, setBotaoTermosClicado } = useContext(UserContext);
    const { botaoResumoClicado, setBotaoResumoClicado } = useContext(UserContext);
    const { botaoAreasClicado, setBotaoAreasClicado } = useContext(UserContext);
    const { botaoLivrosCapitulosClicado, setBotaoLivrosCapitulosClicado } = useContext(UserContext);
    const { botaoEventosClicado, setBotaoEventosClicado } = useContext(UserContext);

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

    setBotaoPesquisadoresClicado(false);
      setBotaoPatentesClicado(false)
      setBotaoTermosClicado(true);
      setBotaoAreasClicado(false);
      setBotaoResumoClicado(false)
      setBotaoEventosClicado(false)
      setBotaoLivrosCapitulosClicado(false)
  };

  const location = useLocation();

  // Verifica se a URL é "/programa-teste"
  const isProgramaTeste = location.pathname === `/programas-graduacao` || location.pathname === `/result` || location.pathname === `/result` || location.pathname === `/indicators-pos`;


  
  const { pesquisadoresSelecionadosGroupBarema, setPesquisadoresSelecionadosGroupBarema } = useContext(UserContext);


  //sair da conta
  const { user, setUser } = useContext(UserContext);
  const history = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setLoggedIn(false);
      setUser({} as User); // Assuming you have a setUser function to update the user context

     // Remove user information from local storage
    localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };



  const [popUpUser , setPopUpUser] = useState(false);

  const handlePopkBtn = () => {
    setPopUpUser(!popUpUser)
   

  };

  return (
    <header className={`   w-full mb-4 h-20 justify-between items-center flex relative  z-[999]`}>
      <div className=" w-full flex items-center h-12 ">
        <div className="flex gap-6 items-center h-full justify-center ">
        {idVersao === '1' || idVersao === ''  ? (
             <Link to={"/"} className="h-[30px]  " onClick={toggleButtonOff}><LogoIapos /></Link>
          ) : (idVersao === '2') ? (
            <Link to={"/"} className="h-[30px]  " onClick={toggleButtonOff}><Logo /></Link>
          ) : (idVersao == '4') ? (
            <Link to={"/"} className="h-[30px]  " onClick={toggleButtonOff}><LogoWhite /></Link>
          ) : (
           ''
          )}
         
          <div className="w-[1px] h-8 bg-white"></div>
          {idVersao === '1' || idVersao === ''  ? (
            <Link to={"https://www.senaicimatec.com.br/"} target="_blank" className="h-[32px] "><img src={cimatec} alt="" className=" whitespace-nowrap h-[30px]" /></Link>
          ) : (idVersao === "2") ? (
            <Link to={"https://profnit.org.br/"} target="_blank" className="h-[32px] "><img src={profnit} alt="" className=" whitespace-nowrap h-[30px]" /></Link>
          ) : (idVersao === "3") ?(
            <Link to={"https://profnit.org.br/"} target="_blank" className="h-[32px] "><img src={ifba} alt="" className=" whitespace-nowrap h-[30px]" /></Link>
          ) : (idVersao == '4') ? (
            <Link to={""} target="_blank" className=" whitespace-nowrap "><img src={logo_4} alt="" className="whitespace-nowrap flex flex-1 h-[38px]" /></Link>
          ): ('')}

        </div>

        <div className="md:flex h-full hidden  rounded-md   ml-4">
          
       {idVersao != '1' ? 
       ( <Link to={`/indicators`} className="flex items-center h-full  px-4 text-white text-sm font-bold transition  gap-2"><ChartLine size={16} className="" />Indicadores</Link>)
       :('')}
          <Link to={`/terms`} className="flex items-center h-full  px-4 text-white text-sm font-bold transition  gap-2"><ListDashes size={16} className="" />Dicionário</Link>
          <Link to={`/magazine`} className="flex items-center h-full  px-4 text-white text-sm font-bold transition  gap-2"><BookOpen size={16} className="" />Revistas</Link>
          <Link to={`/barema`} className="flex items-center h-full  px-4 text-white text-sm font-bold transition  gap-2"><Textbox size={16} />Barema{ pesquisadoresSelecionadosGroupBarema != '' ? (<div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>):('')}</Link>
          <Link to={`/programas-graduacao`} className="flex items-center h-full  px-4 text-white text-sm font-bold transition  gap-2"><GraduationCap size={16} />Pós-gradução</Link>
          <Link to={`/taxonomia`} className="flex items-center h-full  px-4 text-white text-sm font-bold transition  gap-2"><GitBranch size={16} className="rotate-180"/>Taxonomia</Link>
       
        </div>
      </div>

      <div className="flex gap-4">
      <div id="google_translate_element" ></div>

      {isProgramaTeste && (
        <Link
          to={`/indicators-pos`}
          className="w-fit h-10 whitespace-nowrap flex items-center gap-4  text-sm text-blue-400 rounded-xl px-4 py-2 justify-center hover:bg-gray-50 font-medium transition"
        >
          <ChartLine size={16} className="" /> Indicadores da pós-graduação
        </Link>
      )}

{loggedIn === false ? (
        <div className="flex gap-4">
<Link
          to={`/signup`}
          className="w-fit h-10 whitespace-nowrap flex items-center gap-4  text-sm text-blue-400 rounded-xl px-4 py-2 justify-center hover:bg-gray-50 font-medium transition"
        >
          <UserPlus size={16} className="" /> Criar conta
        </Link>


<Link to={`/login`} className="w-fit cursor-pointer h-10 whitespace-nowrap flex items-center gap-4 bg-blue-400 text-white rounded-xl px-4 py-2 justify-center hover:bg-blue-500 text-sm font-medium transition">
                
                          <SignIn size={16} className="text-white" />
                       Fazer login
                    </Link>
        </div>
      ): (
<div className="flex group justify-end items-center">
  {user.photoURL || user.img_url ? (
    <div
      onClick={handlePopkBtn}
      className="h-10 w-10 rounded-xl bg-contain bg-center bg-no-repeat cursor-pointer border border-gray-300"
      style={{ backgroundImage: user.photoURL == null ? (`url(${user.img_url})`):(`url(${user.photoURL})`) }}
    ></div>
  ) : (
    <div
      onClick={handlePopkBtn}
      className="h-10 w-10 rounded-xl bg-gray-50 text-gray-500 cursor-pointer flex items-center justify-center"
    >
      <UserCircle size={16} className="" />
    </div>
  )}

  <div className="absolute top-[60px] pt-[20px] hidden group-hover:flex transition-all">
  <div
    className={`border-gray-300 flex-col bg-white border items-center rounded-xl w-[350px]  z-[9999999999999999999999999999999999999] right-16 transition-all shadow-xl h-auto `}
  >
    <div
      className={`bg-cover bg-top bg-no-repeat backdrop-blur-md backdrop-brightness-150 h-28 bg-gray-400 rounded-t-xl w-full`}
      style={{ backgroundImage: user.photoURL == null ? (`url(${user.img_url})`):(`url(${user.photoURL})`) }}
    >
      <div
        className={`bg-[#000000] bg-opacity-30 absolute backdrop-blur-sm w-full h-full rounded-t-xl`}
      ></div>
    </div>

    <div className="top-[-40px] px-4 w-full relative items-center flex flex-col z-[9999]">
      <div
        className={`whitespace-nowrap  bg-cover bg-center bg-no-repeat h-20 w-20 bg-white rounded-xl border-4 border-white  relative `}
        style={{ backgroundImage: user.photoURL == null ? (`url(${user.img_url})`):(`url(${user.photoURL})`) }}
      ></div>

      <div className="w-full relative flex items-center flex-col top-[15px]">
        <h4 className={`text-lg font-medium  `}>{user.displayName}{user.name}</h4>
        <p className="text-[14px]  w-full whitespace-normal h-6 text-center text-gray-500 truncate mt-2 mb-4">
          {user.email}
        </p>

        <Link to={'/meus-baremas'}    className="w-full mb-2  text-blue-400 text-sm font-medium cursor-pointer h-10 p-4  border-[1px] border-solid bg-white border-gray-300 rounded-xl justify-center items-center flex outline-none  hover:bg-gray-50  gap-3  transition ">
                <Textbox size={16} className="" />Meus baremas
              </Link>

        <div
          onClick={handleLogout}
          className="w-full relative top-[6px] cursor-pointer h-10 whitespace-nowrap flex items-center gap-4 bg-blue-400 text-white rounded-xl px-4 py-2 justify-center hover:bg-blue-500 text-sm font-medium transition"
        >
          <SignOut size={16} className="text-white" />
          Encerrar sessão
        </div>
      </div>
    </div>
  </div>
  </div>
</div>
      )}



        
        {/*<LanguageSwitcher/>*/}
        </div>
    </header>
  )
}