import { useContext, useEffect, useState } from "react";
import { Header } from "./Header";
import { UserContext } from "../contexts/context";
import { ArrowClockwise, BookOpen, ChartBar, ChartLine, GitBranch, GraduationCap, ListDashes, Password, PencilSimpleLine, Plus, SquaresFour, Textbox, UserCircle, X } from "phosphor-react";
import { PopUpWrapper } from "./PopUpWrapper";
import bg_popup from '../assets/bg_pop_signup.png';
import bg_conta from '../assets/bg_conta.png';
import { Link } from "react-router-dom";
import { ProfnitLogoSvg } from "./ProfnirLogoSvg";
import { getAuth, signInWithEmailAndPassword,  updateProfile, GoogleAuthProvider, signInWithPopup, updateEmail, updatePassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth, app } from "../lib/firebase";

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { GridHome } from "./GridHome";


export function MinhaConta() {
    const { user, setUser } = useContext(UserContext);
    const [popUpProgram, setPopUpProgram] = useState(false);
    const [popUpProgramSenha, setPopUpProgramSenha] = useState(false);
    const { idBarema, setIdBarema } = useContext(UserContext);
    const { idVersao, setIdVersao } = useContext(UserContext);

    

    const popUpProgramClose = () => {
        setPopUpProgram(false)
        setPopUpProgramSenha(false)
      };
    
    
    
    setIdVersao(`4`)

      // forms

      const [name, setName] = useState('');
      const [passwordAtual, setPasswordAtual] = useState('');
      const [password, setPassword] = useState('');
      const [confPassword, setConfPassword] = useState('');
      const [email, setEmail] = useState('');
      const [photo, setPhoto] = useState(null);

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

    return  (
        <div className="h-screen ">
            <Header/>

            <div className="py-24 px-6 md:px-16 w-full">
                <div className="flex justify-between items-center pt-8">
                <div className="flex gap-6 items-center justify-center">
                {user.photoURL || user.img_url ? (
                    <div
                    className="h-16 w-16 rounded-xl bg-cover bg-center bg-no-repeat  border border-gray-300"
                    style={{ backgroundImage: user.photoURL == null ? (`url(${user.img_url})`):(`url(${user.photoURL})`) }}
                  ></div>
                ):(
                    <div className="h-16 w-16 items-center flex text-gray-400 justify-center rounded-xl bg-gray-50  ">
                    <UserCircle size={24} className="" />

                  </div>
                )}

                <h1 className="text-left max-w-[400px] font-medium text-3xl ">Olá, <strong className="bg-blue-400 text-white font-medium"> bem vindo</strong> à sua conta, {user.displayName}
                    </h1>
                </div>

                    <div
          onClick={() => setPopUpProgram(true)}
          className="w-fit relative cursor-pointer h-10 whitespace-nowrap flex items-center gap-4 bg-blue-400 text-white rounded-xl px-4 py-2 justify-center hover:bg-blue-500 text-sm font-medium transition"
        >
          <PencilSimpleLine size={16} className="text-white" />
          Editar dados
        </div>
                </div>

                <div style={{ backgroundImage: `url(${bg_conta})` }} className="border p-8 bg-cover bg-right bg-no-repeat  border-gray-300 w-full rounded-2xl my-8 h-[300px]">

                </div>


                <div className="flex gap-4 text-gray-400 items-center mb-4">
              <SquaresFour size={24} className=" " />
              <p className="text-bold ">Todas as páginas</p>
            </div>

            <div className="flex flex-wrap gap-8 items-start">
                <Link to={'/indicators'} className="flex flex-col gap-3 items-center justify-center">
                    <div className="rounded-2xl border border-gray-300 h-20 w-20 flex items-center justify-center transition-all hover:bg-gray-50">
                    <ChartLine size={24} className=" text-blue-400" />
                    </div>
                    <p className="text-gray-400 font-medium text-sm ">Indicadores</p>
                </Link>

                <Link to={'/terms'} className="flex flex-col gap-3 items-center justify-center">
                    <div className="rounded-2xl border border-gray-300 h-20 w-20 flex items-center justify-center transition-all hover:bg-gray-50">
                    <ListDashes size={24} className=" text-blue-400" />
                    </div>
                    <p className="text-gray-400 font-medium text-sm ">Dicionário</p>
                </Link>

                <Link to={'/magazine'} className="flex flex-col gap-3 items-center justify-center">
                    <div className="rounded-2xl border border-gray-300 h-20 w-20 flex items-center justify-center transition-all hover:bg-gray-50">
                    <BookOpen size={24} className=" text-blue-400" />
                    </div>
                    <p className="text-gray-400 font-medium text-sm ">Revistas</p>
                </Link>

                <Link onClick={() => setIdBarema("")} to={'/barema'} className="flex flex-col gap-3 items-center justify-center">
                    <div className="rounded-2xl border border-gray-300 h-20 w-20 flex items-center justify-center transition-all hover:bg-gray-50">
                    <Textbox size={24} className=" text-blue-400" />
                    </div>
                    <p className="text-gray-400 font-medium text-sm ">Barema</p>
                </Link>

                <Link to={'/programas-graduacao'} className="flex flex-col gap-3 items-center justify-center">
                    <div className="rounded-2xl border border-gray-300 h-20 w-20 flex items-center justify-center transition-all hover:bg-gray-50">
                    <GraduationCap size={24} className=" text-blue-400" />
                    </div>
                    <p className="text-gray-400 font-medium text-sm ">Pós-gradução</p>
                </Link>

                <Link to={'/taxonomia'} className="flex flex-col gap-3 items-center justify-center">
                    <div className="rounded-2xl border border-gray-300 h-20 w-20 flex items-center justify-center transition-all hover:bg-gray-50">
                    <GitBranch size={24} className=" text-blue-400 rotate-180" />
                    </div>
                    <p className="text-gray-400 font-medium text-sm ">Taxonomia</p>
                </Link>

                <Link to={'/indicators-pos'} className="flex flex-col gap-3 items-center justify-center">
                    <div className="rounded-2xl border border-gray-300 h-20 w-20 flex items-center justify-center transition-all hover:bg-gray-50">
                    <ChartBar size={24} className=" text-blue-400 " />
                    </div>
                    <p className="text-gray-400 font-medium text-sm text-center">Indicadores <br/>pós-graduação</p>
                </Link>

                <Link to={'/profnit'} className="flex flex-col gap-3 items-center justify-center">
                    <div className="rounded-2xl border border-gray-300 h-20 w-20 flex items-center justify-center transition-all hover:bg-gray-50">
                    <div className="h-6">
                        <ProfnitLogoSvg/>
                    </div>
                    </div>
                    <p className="text-gray-400 font-medium text-sm text-center">Profnit</p>
                </Link>
            </div>

            <div className="mt-8">
                <GridHome/>
            </div>
            </div>


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
        </div>
    )
}