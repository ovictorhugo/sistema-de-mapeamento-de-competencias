import { GoogleLogo, SignIn } from "phosphor-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";

import React, { useContext, useState } from 'react';

import "firebase/auth";

import { auth } from "../lib/firebase";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { UserContext } from "../contexts/context";
import { Circle } from "./Circle";
import { Circle2 } from "./Circle2";
import { AuthWrapper } from "./AuthWrapper";
import { SvgAdmin } from "./SvgAdmin";

import bg_popup from '../assets/bg_admin.png';

import { getDatabase, ref, child, get } from 'firebase/database';


export function ContentLoginAdmin() {
  // meial sneha

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {loggedIn, setLoggedIn} = useContext(UserContext);
  const history = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const handleLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setLoggedIn(true);

       // Recupere dados personalizados do usuário no Firestore
        const db = getFirestore();
        const userDocRef = doc(db, 'institution', result.user.uid);
        const snapshot = await getDoc(userDocRef);

        // Verifique se os dados personalizados existem antes de adicionar ao objeto result.user
        if (snapshot.exists()) {
          
          console.log('existe'); // Adicione este log
          const userData = snapshot.data();
          console.log('userData:', userData);
          // Adicione os dados personalizados diretamente ao objeto result.user
          result.user = {
            ...result.user,
            acronym: userData.acronym,
            img_url: userData.img_url,
            institution_id: userData.institution_id,
            name: userData.name,
            state: userData.state,
            uid: result.user.uid
            // Adicione outros campos personalizados conforme necessário
            
          };

          console.log("user",user)

          // Atualize o estado com o objeto modificado
          setUser(result.user);
        }
  
      // Save user information to local storage
      localStorage.setItem('user', JSON.stringify(result.user));

      setUser(result.user)
  
      setTimeout(() => {
        history('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };
  
  



  //

  function handleGoogleSignIn() {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user)
        setLoggedIn(true);
        setTimeout(() => {
          history('/');
        }, 1000);

        // Save user information to local storage
    localStorage.setItem('user', JSON.stringify(result.user));
      })
      .catch((error) => {
        console.log(error)
      })
  }

  



  const backgroundImages = [
   
    '/src/assets/img2.jpg',

    // Adicione mais URLs de imagens de fundo, se necessário
  ];

  const ImagesUniLogo = [
   
    '/src/assets/img2.jpg',

    // Adicione mais URLs de imagens de fundo, se necessário
  ];



  //background
  const [backgroundImage, setBackgroundImage] = useState<string>(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    return backgroundImages[randomIndex];
  });

  return (
    <div>
            <div  style={{ backgroundImage: `url(${bg_popup})` }} className=" min-h-[100vh] w-full flex bg-cover bg-center bg-no-repeat items-center flex-col justify-center top-0 left-0 z-[-999] overflow-hidden absolute" >
                
            </div> 

           

            <AuthWrapper
            title="Bem vindo(a) ao módulo administrativo"
            subtitle="Projetado para cadastrar informações sobre professores e programas de pós-graduação"
            textLink=""
            link="/signup"
            >

                
                 <div className=" flex items-center flex-col flex-1 z-[9999999999999]">

            <form className="w-full z-[9999999999999]">
              <p className="text-sm text-gray-500 mb-2">Usuário </p>
              <input
                type="email"
                name="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mb-4 border-[1px] border-gray-300 w-full h-12 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />

              <p className="text-sm text-gray-500 mb-2">Senha</p>
              <input
                type="password"
                name="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mb-4 border-[1px] border-gray-300 w-full h-12 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />

              <div onClick={handleLogin} className="whitespace-nowrap flex cursor-pointer items-center gap-4 bg-blue-400 text-white rounded-xl px-4 py-2 justify-center hover:bg-blue-500  font-medium transition w-full h-12 ml-auto">
                <SignIn size={16} className="text-white" /> Continuar
              </div>
            </form>

            <div className="flex items-center w-full justify-center my-8 gap-4 flex-1">
              <div className="w-full h-[1px] bg-gray-300 flex flex-1"></div>
              <p className="text-gray-400 bg-white text-center">Ou</p>
              <div className="w-full h-[1px] bg-gray-300 flex flex-1"></div>
            </div>

            <div className="w-full z-[9999999999999]">
            <div  onClick={handleGoogleSignIn}    className="w-full  text-blue-400 text-sm font-bold cursor-pointer h-12 p-4  border-[1px] border-solid bg-white border-gray-300 rounded-xl justify-center items-center flex outline-none  hover:bg-gray-50  gap-3  transition ">
                <GoogleLogo size={16} className="" />Fazer login com o Google
              </div>
            </div>

            <p className="font=bold text-sm text-red-400 pt-4"></p>
   
        </div>
            </AuthWrapper>

            <div className="h-screen fixed top-0 right-0 z-[9]"><SvgAdmin/></div>
        </div>
  );
}