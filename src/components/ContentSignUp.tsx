import { GoogleLogo, SignIn } from "phosphor-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";

import React, { useContext, useState } from 'react';

import "firebase/auth";

import { auth } from "../lib/firebase";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { UserContext } from "../contexts/context";
import { Circle } from "./Circle";
import { Circle2 } from "./Circle2";
import { AuthWrapper } from "./AuthWrapper";
import { SvgSignup } from "./SvgSignup";




export function ContentSignUp() {
  // meial sneha
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const {loggedIn, setLoggedIn} = useContext(UserContext);
  const history = useNavigate();
  const { user, setUser } = useContext(UserContext);


  const [createUserWithEmailAndPassword, userw, loading, error] =
  useCreateUserWithEmailAndPassword(auth);

  const handleSignOut = async (e: any) => {
  try {

    if( password == confPassword && password.length >= 8 && email.length != 0 && name.length != 0) {
      e.preventDefault();
      createUserWithEmailAndPassword(email, password);
   
      setTimeout(() => {
        history('/login');
      }, 0);
    }

    else return <div>Revise sua senha</div>
   
  } catch (error) {
   console.error('Authentication error:', error);
  }
  
}

if (loading) {
  return <p>carregando...</p>;
}



  const backgroundImages = [
   
    '/src/assets/img2.jpg',

    // Adicione mais URLs de imagens de fundo, se necessário
  ];


  function handleGoogleSignIn() {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user)
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
            title="Crie já sua conta"
            subtitle="Já possui uma conta?"
            textLink="Faca login"
            link="/login"
            >
                 <div className=" flex items-center flex-col flex-1 ">

            <form className="w-full ">

            <p className="text-sm text-gray-500 mb-2">Nome completo</p>
              <input
                type="text"
                name="email"
                id="email"
                onChange={(e) => setName(e.target.value)}
                required
                className="mb-4 border-[1px] border-gray-300 w-full h-12 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />


              <p className="text-sm text-gray-500 mb-2">Endereço de email</p>
              <input
                type="text"
                name="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mb-4 border-[1px] border-gray-300 w-full h-12 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />

             <div className="grid grid-cols-2 gap-4">
          <div>
          <p className="text-sm text-gray-500 mb-2">Senha</p>
              <input
                type="password"
                name="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mb-4 border-[1px] border-gray-300 w-full h-12 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />

          </div>

<div>
<p className="text-sm text-gray-500 mb-2">Confirmar senha</p>
              <input
                type="password"
                name="password"
                id="password"
                onChange={(e) => setConfPassword(e.target.value)}
                required
                className="mb-4 border-[1px] border-gray-300 w-full h-12 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />

</div>
             </div>
              <div onClick={handleSignOut} className="whitespace-nowrap flex cursor-pointer items-center gap-4 bg-blue-400 text-white rounded-xl px-4 py-2 justify-center hover:bg-blue-500  font-medium transition w-full h-12 ml-auto">
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

            <p className="font=bold text-sm text-red-400 pt-4"> {password.length > 0 && password.length < 8 ? (`A senha precisa ter no mínimo 8 caracteres`): confPassword.length >= 8 && password.length >= 8 && (password != confPassword) ? (`As senhas devem ser iguais`):(``)}</p>
   
        </div>
            </AuthWrapper>

            <div className="h-screen fixed top-0 left-0 z-[9]"><SvgSignup/></div>
        </div>
  );
}