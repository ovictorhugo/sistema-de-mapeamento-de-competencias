import { Logo } from "./Logo";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Ilustracao } from "./Ilustracao";
import { ArrowCircleDown, Info, Funnel,  File, Buildings, PaperPlaneTilt, ChartLine, Question, SignIn, ListDashes, UserCirclePlus, UserCircle, BookOpen, Textbox, Share, GraduationCap, GitBranch, UserPlus, SignOut, X, Gear, ChartBar, PencilSimpleLine, ArrowClockwise, Password, Plus } from "phosphor-react";

import logo_1 from '../assets/logo_1.png';
import logo_2 from '../assets/logo_2.png';
import logo_3 from '../assets/logo_3.png';
import logo_4 from '../assets/logo_4.png';
import bg_popup from '../assets/bg_pop_signup.png';

import { Pesquisadores } from "./Pesquisadores";
import { Publicacoes } from "./Publicacoes";

import { getAuth, signInWithEmailAndPassword,  updateProfile, GoogleAuthProvider, signInWithPopup, updateEmail, updatePassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth, app } from "../lib/firebase";

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';




import cimatec from '../assets/cimatec.png';
import ifba from '../assets/ifba.png';

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
import { PopUpWrapper } from "./PopUpWrapper";


declare global {
  interface Window {
    googleTranslateElementInit: () => void;
  }
}



export function Header() {
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

  const { idBarema, setIdBarema } = useContext(UserContext);

  const [popUpUser , setPopUpUser] = useState(false);

  const handlePopkBtn = () => {
    setPopUpUser(!popUpUser)
  
  };


  //////////////////////////////////////////////////////////////

  
  const popUpProgramClose = () => {
    setPopUpProgram(false)
    setPopUpProgramSenha(false)
  };


  const [name, setName] = useState('');
  const [passwordAtual, setPasswordAtual] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState(null);
  const [popUpProgram, setPopUpProgram] = useState(false);
    const [popUpProgramSenha, setPopUpProgramSenha] = useState(false);

const handlePhotoChange = (e: any) => {
const selectedPhoto = e.target.files[0];
setPhoto(selectedPhoto);
};


  useEffect(() => {
  setName(user ? user.displayName || '' : '')
  setEmail(user ? user.email || '' : '')
}, []);

//firebase



const handleSubmit = async () => {

    // Assuming you have initialized Firebase and obtained the 'auth' object
    const auth = getAuth();

    // Access the currently signed-in user
    const user = auth.currentUser;

    console.log(`user`, user)

    setPersistence(auth, browserLocalPersistence);

    const storage = getStorage(app); // Make sure 'app' is your Firebase app instance


   if(user) {
    try {
        // Update name and email
        if(name != user.displayName) {
            await updateProfile(user, { displayName: name });
        }

        if(email != user.email) {
            await updateEmail(user, email);
        }
        
    
         // Update profile picture if a new photo is selected
            if (photo) {
                // Implement logic to upload the new photo to Firebase Storage
                // and update the user's photoURL
                const storage = getStorage(app);

                const storageRef = ref(storage, `profile_pictures/${user.uid}`);
                await uploadBytes(storageRef, photo);

                // Get the download URL after the upload is complete
                const photoURL = await getDownloadURL(storageRef);

                // Update user profile with the new photoURL
                await updateProfile(user, { photoURL });
            }

            // Update password if popUpProgramSenha is true
            if (popUpProgramSenha && password == confPassword && password.length >= 8 ) {
                // Implement logic to update the user's password
                const credential = await signInWithEmailAndPassword(auth, user.email, passwordAtual);
        
              // Update the user's password
              await updatePassword(credential.user, password);

            }
      

        setPopUpProgram(false);

    
        // Handle successful update, e.g., show a success message or redirect
        console.log('Account updated successfully!');
      } catch (error) {
        // Handle errors, e.g., show an error message
        console.error('Update error:', error);
      }
   }
  };

  return (
    <header className={` z-[9999] px-6 md:px-16 w-full mb-4 h-20 justify-between items-center flex absolute top-0`}>
      <div className=" w-full flex items-center h-12 ">
        <div className="flex gap-6 items-center h-full justify-center ">
        {idVersao === '1' || idVersao === ''  ? (
             <Link to={"/"} className="h-[30px]  " onClick={toggleButtonOff}><LogoIapos /></Link>
          ) : (idVersao === '2') ? (
            <Link to={"/profnit"} className="h-[30px]  " onClick={toggleButtonOff}><Logo /></Link>
          ) : (idVersao == '4') ? (
            <Link to={"/"} className="h-[30px]  " onClick={toggleButtonOff}><LogoSimcc /></Link>
          ) : (
           ''
          )}
         
          <div className="w-[1px] h-8 bg-gray-400"></div>
          {idVersao === '1' || idVersao === ''  ? (
            <Link to={"https://www.senaicimatec.com.br/"} target="_blank" className="h-[32px] "><img src={cimatec} alt="" className=" whitespace-nowrap h-[30px]" /></Link>
          ) : (idVersao === "2") ? (
            <Link to={"https://profnit.org.br/"} target="_blank" className="h-[32px] "><img src={profnit} alt="" className=" whitespace-nowrap h-[30px]" /></Link>
          ) : (idVersao === "3") ?(
            <Link to={"https://profnit.org.br/"} target="_blank" className="h-[32px] "><img src={ifba} alt="" className=" whitespace-nowrap h-[30px]" /></Link>
          ) : (idVersao == '4') ? (
            <Link to={""} target="_blank" className=" whitespace-nowrap "><img src={logo_4} alt="" className="whitespace-nowrap flex flex-1 h-[30px]" /></Link>
          ): ('')}

        </div>

        <div className="md:flex h-full hidden  rounded-md   ml-4">
          
       {idVersao != '1' ? 
       ( <Link to={`/indicators`} className="flex items-center h-full  px-4 text-gray-400 text-sm font-bold transition  gap-2"><ChartLine size={16} className="text-gray-400" />Indicadores</Link>)
       :('')}
          <Link to={`/terms`} className="flex items-center h-full  px-4 text-gray-400 text-sm font-bold transition  gap-2"><ListDashes size={16} className="text-gray-400" />Dicionário</Link>
          <Link to={`/magazine`} className="flex items-center h-full  px-4 text-gray-400 text-sm font-bold transition  gap-2"><BookOpen size={16} className="text-gray-400" />Revistas</Link>
          <Link to={`/barema`}  onClick={() => setIdBarema("")} className="flex items-center h-full  px-4 text-gray-400 text-sm font-bold transition  gap-2"><Textbox size={16} />Barema{ pesquisadoresSelecionadosGroupBarema != '' ? (<div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>):('')}</Link>
          <Link to={`/programas-graduacao`} className="flex items-center h-full  px-4 text-gray-400 text-sm font-bold transition  gap-2"><GraduationCap size={16} />Pós-gradução</Link>
          <Link to={`/taxonomia`} className="flex items-center h-full  px-4 text-gray-400 text-sm font-bold transition  gap-2"><GitBranch size={16} className="rotate-180"/>Taxonomia</Link>
       
        </div>
      </div>

      <div className="flex gap-4">
      <div id="google_translate_element" ></div>

      {isProgramaTeste && (
        <Link
          to={`/indicators-pos`}
          className="w-fit h-10 whitespace-nowrap flex items-center gap-4  text-sm text-blue-400 rounded-xl px-4 py-2 justify-center hover:bg-gray-50 font-medium transition"
        >
          <ChartBar size={16} className="" /> Indicadores da pós-graduação
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
<div className="flex group justify-end items-center z-[9]">
  {user.photoURL || user.img_url ? (
    <div
      onClick={handlePopkBtn}
      className="h-10 w-10 rounded-xl bg-cover bg-center bg-no-repeat cursor-pointer border border-gray-300"
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

    <div className="top-[-40px] px-4 w-full relative items-center flex flex-col z-[9999999999999999999]">
    {user.photoURL || user.img_url ? (
    <div
    className={`whitespace-nowrap  bg-cover bg-center bg-no-repeat h-20 w-20 bg-white rounded-xl border-4 border-white  relative `}
    style={{ backgroundImage: user.photoURL == null ? (`url(${user.img_url})`):(`url(${user.photoURL})`) }}
  ></div>
  ) : (
    <div
      onClick={handlePopkBtn}
      className="h-20 w-20 rounded-xl bg-gray-50 text-gray-500 cursor-pointer flex items-center justify-center"
    >
      <UserCircle size={24} className="" />
    </div>
  )}


      <div className="w-full relative flex items-center flex-col top-[15px]">
        <h4 className={`text-lg font-medium  `}>{user.displayName}{user.name}</h4>
        <p className="text-[14px]  w-full whitespace-normal h-6 text-center text-gray-500 truncate mt-2 mb-4">
          {user.email}
        </p>

        {user.state != `admin` ? (
          <div className="w-full">
          <Link to={'/minha-conta'}    className="w-full mb-2  text-gray-400 text-sm font-medium cursor-pointer h-10 p-4 rounded-xl bg-white border-gray-300  items-center flex outline-none  hover:bg-gray-50  gap-3  transition ">
                  <Gear size={16} className="" />Minha conta
                </Link>
  
                <Link to={'/minhas-taxonomias'}    className="w-full mb-2  text-gray-400 text-sm font-medium cursor-pointer h-10 p-4 rounded-xl bg-white border-gray-300  items-center flex outline-none  hover:bg-gray-50  gap-3  transition ">
                  <GitBranch size={16} className="rotate-180" />Minhas taxonomias
                </Link>
  
                <Link to={'/meus-baremas'}    className="w-full  text-gray-400 text-sm font-medium cursor-pointer h-10 p-4 rounded-xl bg-white border-gray-300  items-center flex outline-none  hover:bg-gray-50  gap-3  transition ">
                  <Textbox size={16} className="" />Meus baremas
                </Link>
          </div>
        ): (``)}

        <div className="h-[1px] w-full my-4 bg-gray-300"></div>

        <div onClick={() => setPopUpProgram(true)} className="w-full mb-2  text-blue-400 text-sm font-medium cursor-pointer h-10 p-4  border-[1px] border-solid bg-white border-gray-300 rounded-xl justify-center items-center flex outline-none  hover:bg-gray-50  gap-3  transition ">
                <PencilSimpleLine size={16} className="" />Editar dados
              </div>

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

{popUpProgram ? (
                <PopUpWrapper
                title="Print ('Bem-vindo/a')"
                subtitle="Novo usuário?"
                textLink="Criar conta"
                link="/signup"
                >
                    <div className="w-full h-full flex">
                        <div className=" flex flex-1 p-6">
                        <div
                        className="rounded-xl bg-blue-400 bg-cover flex items-center p-12 bg-right bg-no-repeat w-full h-full mr-6"
                        style={{ backgroundImage: `url(${bg_popup})` }}
                        >
                             <h1 className="text-white font-medium text-4xl">Atualizar <br/> cadastro</h1>
                        </div>
                        </div>

                        <div className="">
                            <div className="h-full max-w-[500px] w-[500px] ">
                                <div className=" border-l h-full pb-[96px] overflow-y-auto elementBarra border-l-gray-300 p-12 ">
                                <div onClick={() => popUpProgramClose()} className={`ml-auto float-right cursor-pointer rounded-xl hover:bg-gray-100 h-[38px] w-[38px] transition-all flex items-center justify-center `}>
                        <X size={20} className={' transition-all text-gray-400'} />
                        </div>
                                <div className="flex mb-4 items-center gap-4">
                               
                               
                                {user.photoURL || user.img_url ? (
                     <div className="h-16 w-16 rounded-xl p-2 bg-cover bg-center bg-no-repeat  border border-gray-300 flex items-end" style={{ backgroundImage: user.photoURL == null ? (`url(${user.img_url})`):(`url(${user.photoURL})`) }}>

                     <label  htmlFor="photo" className=" h-6 w-6 rounded-md bg-gray-50 flex items-center justify-center ml-auto right-0 mt-auto relative bottom-0 cursor-pointer">
                     <Plus size={16} className="text-gray-400" />
                     <input
                                 type="file"
                                 accept="image/*"
                                 name="photo"
                                 id="photo"
                                 onChange={handlePhotoChange}
                                 className=""
                                 hidden
                               />
                     </label>
                         </div>
                ):(
                    <div className="h-16 w-16 items-center flex p-2 text-gray-400 justify-center rounded-xl bg-gray-50  ">
                    <UserCircle size={24} className="absolute" />

                    <label  htmlFor="photo" className=" h-6 w-6 rounded-md bg-gray-300 flex items-center justify-center ml-auto right-0 mt-auto relative bottom-0 cursor-pointer">
                     <Plus size={16} className="text-gray-400" />
                     <input
                                 type="file"
                                 accept="image/*"
                                 name="photo"
                                 id="photo"
                                 onChange={handlePhotoChange}
                                 className=""
                                 hidden
                               />
                     </label>
                  </div>
                )} 
                
               

<div>
<h3 className="max-w-[250px] font-medium text-2xl  text-gray-400">{user.displayName}</h3>
<p className="text-gray-400 text-sm">{user.email}</p>
</div>
                                </div>
                               
                               <div className="mt-8">
                               <p className="text-sm text-gray-500 mb-2">Nome completo</p>
                                <input
                                    type="text"
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                
                                    required
                                    className="mb-6 flex-1 border-[1px] border-gray-300 w-full h-12 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />
                               

                               <p className="text-sm text-gray-500 mb-2">Alterar email</p>
                                <input
                                    type="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                
                                    required
                                    className="mb-6 flex-1 border-[1px] border-gray-300 w-full h-12 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />
                               
                            {popUpProgramSenha == false ? (
                                <div   onClick={() => setPopUpProgramSenha(true)} className="w-full mb-2  text-blue-400 text-sm font-medium cursor-pointer h-12 p-4  border-[1px] border-solid bg-white border-gray-300 rounded-xl justify-center items-center flex outline-none  hover:bg-gray-50  gap-3  transition ">
                                <Password size={16} className="" />Editar senha
                              </div>
                            ): (
                                <div>
                                <p className="text-sm text-gray-500 mb-2">Senha atual</p>
                                <input
                                    type="text"
                                    onChange={(e) => setPasswordAtual(e.target.value)}
                                    value={passwordAtual}
                                
                                    required
                                    className="mb-6 flex-1 border-[1px] border-gray-300 w-full h-12 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />
                               

                               <div className="grid grid-cols-2 gap-4">
          <div>
          <p className="text-sm text-gray-500 mb-2">Nova senha</p>
              <input
                type="password"
                name="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mb-4 border-[1px] border-gray-300 w-full h-12 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />

          </div>

<div>
<p className="text-sm text-gray-500 mb-2">Confirmar nova senha</p>
              <input
                type="password"
                name="password"
                id="password"
                onChange={(e) => setConfPassword(e.target.value)}
                required
                className="mb-4 border-[1px] border-gray-300 w-full h-12 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />

</div>
             </div>
                                </div>
                            )}
                               </div>
                                  

                                   
                                </div>

                                <div className="flex border-l  border-l-gray-300 gap-6 px-12 py-6 bg-white top-[-96px] z-[99] right-0 relative">
                            <div onClick={handleSubmit} className="whitespace-nowrap flex cursor-pointer items-center gap-4 bg-blue-400 text-white rounded-xl px-4 py-2 justify-center hover:bg-blue-500  font-medium transition flex-1 h-12 ml-auto">
                                <ArrowClockwise size={16} className="text-white" /> Atualizar conta
                            </div>

      
                            </div>

                            </div>
                        </div>
                    </div>

                </PopUpWrapper>
            ):(
                ``
            )}

        
        {/*<LanguageSwitcher/>*/}
        </div>


       
    </header>
  )
}