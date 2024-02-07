import { GoogleLogo, SignIn } from "phosphor-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";

import React, { useContext, useState } from 'react';

import "firebase/auth";

import { auth } from "../lib/firebase";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { UserContext } from "../contexts/context";
import { Circle } from "./Circle";
import { Circle2 } from "./Circle2";
import { AuthWrapper } from "./AuthWrapper";
import { SvgLogin } from "./SvgLogin";

import { User as FirebaseAuthUser} from 'firebase/auth'

interface User extends FirebaseAuthUser {
  img_url: string;
  state: string;
  name: string
  email: string
  institution_id: string
}



export function ContentLogin() {
  // meial sneha

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {loggedIn, setLoggedIn} = useContext(UserContext);
  const history = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const handleLogin = async () => {
    try {
     if(email.length != 0 && password.length != 0 && password.length >= 8 ) {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setLoggedIn(true);
  
      // Save user information to local storage
      localStorage.setItem('user', JSON.stringify(result.user));

      const userData: User = {
        ...result.user,
        img_url: '', // Set to the appropriate default value or leave it empty if you don't have a default
        state: '',
        name: '',
        email: result.user.email || '',
        institution_id: '',
      };

      setUser(userData);
  
      setTimeout(() => {
        history('/');
      }, 0);
     }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };
  
  
  
  console.log(loggedIn)


  //

  function handleGoogleSignIn() {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        const userData: User = {
          ...result.user,
          img_url: '', // Set to the appropriate default value or leave it empty if you don't have a default
          state: '',
          name:  '',
          email: result.user.email || '',
          institution_id: '',
        };
  
        setUser(userData);
        setLoggedIn(true);
        setTimeout(() => {
          history('/');
        }, 0);

        // Save user information to local storage
    localStorage.setItem('user', JSON.stringify(result.user));
      })
      .catch((error) => {
        console.log(error)
      })
  }

  console.log("user",user)



  const backgroundImages = [
   
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
            <div className=" min-h-[100vh] bg-blue-400 w-full flex bg-cover bg-center bg-no-repeat items-center flex-col justify-center top-0 left-0 z-[-999] overflow-hidden absolute" style={{ backgroundImage: `url(${backgroundImage})` }}>
                
            </div> 

            <div className="h-[100vh] bg-[#000] w-full absolute top-0 left-0 opacity-20"></div>

            <AuthWrapper
            title="Print ('Bem-vindo/a')"
            subtitle="Novo usuário?"
            textLink="Criar conta"
            link="/signup"
            >
                 <div className=" flex items-center flex-col flex-1 ">

            <form className="w-full ">
              <p className="text-sm text-gray-500 mb-2">Endereço de email</p>
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

            <div className="w-full">
            <div  onClick={handleGoogleSignIn}    className="w-full  text-blue-400 text-sm font-bold cursor-pointer h-12 p-4  border-[1px] border-solid bg-white border-gray-300 rounded-xl justify-center items-center flex outline-none  hover:bg-gray-50  gap-3  transition ">
                <GoogleLogo size={16} className="" />Fazer login com o Google
              </div>
            </div>

            <p className="font=bold text-sm text-red-400 pt-4"></p>
   
        </div>
            </AuthWrapper>

            <div className="h-screen fixed top-0 left-0 z-[9]"><SvgLogin></SvgLogin></div>
        </div>
  );
}