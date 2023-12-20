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




export function ContentSignUp() {
  // meial sneha

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {loggedIn, setLoggedIn} = useContext(UserContext);
  const history = useNavigate();
  const { user, setUser } = useContext(UserContext);


  const [createUserWithEmailAndPassword, userw, loading, error] =
  useCreateUserWithEmailAndPassword(auth);

function handleSignOut(e: any) {
  e.preventDefault();
  createUserWithEmailAndPassword(email, password);
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
        }, 1000);

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
            <div className=" min-h-[100vh] bg-yellow-400 w-full flex bg-cover bg-center bg-no-repeat items-center flex-col justify-center top-0 left-0 z-[-999] overflow-hidden absolute" style={{ backgroundImage: `url(${backgroundImage})` }}>
                
            </div> 

            <div className="h-[100vh] bg-[#000] w-full absolute top-0 left-0 opacity-30"></div>

            <AuthWrapper
            title="Print ('Bem-vindo')"
            subtitle="Já possui uma conta?"
            textLink="Faca login"
            link="/signup"
            >
                 <div className=" flex items-center flex-col flex-1 ">

            <form className="w-full ">
              <p className="text-sm text-gray-500 mb-2">Endereço de email</p>
              <input
                type="text"
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
              <div  onClick={handleGoogleSignIn}    className="w-full hover:border-blue-400 hover:text-blue-400 text-sm font-bold cursor-pointer h-12 p-4 text-gray-400 border-[1px] border-solid bg-white border-gray-300 rounded-xl justify-center items-center flex outline-none  hover:bg-blue-100 focus:border-blue-400 gap-3  transition focus:bg-blue-100">
                <GoogleLogo size={16} className="" />Fazer login com o Google
              </div>
            </div>

            <p className="font=bold text-sm text-red-400 pt-4"></p>
   
        </div>
            </AuthWrapper>
        </div>
  );
}