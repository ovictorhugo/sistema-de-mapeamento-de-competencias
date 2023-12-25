import { useContext, useEffect, useState } from "react";
import { Header } from "./Header";
import { UserContext } from "../contexts/context";
import { ArrowClockwise, BookOpen, ChartBar, ChartLine, GitBranch, GraduationCap, ListDashes, PencilSimpleLine, Plus, SquaresFour, Textbox, X } from "phosphor-react";
import { PopUpWrapper } from "./PopUpWrapper";
import bg_popup from '../assets/bg_popup.png';
import bg_conta from '../assets/bg_conta.png';
import { Link } from "react-router-dom";
import { ProfnitLogoSvg } from "./ProfnirLogoSvg";
import { getAuth, signInWithEmailAndPassword,  updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from "../lib/firebase";

export function MinhaConta() {
    const { user, setUser } = useContext(UserContext);
    const [popUpProgram, setPopUpProgram] = useState(false);
    const { idBarema, setIdBarema } = useContext(UserContext);
    const { idVersao, setIdVersao } = useContext(UserContext);
    
    setIdVersao(`4`)

    const handleSubmit = async () => {
        try {
         
          setPopUpProgram(false);
        } catch (error) {
          console.error('Erro ao enviar os dados:', error);
        }
      };

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

    return  (
        <div className="h-screen ">
            <Header/>

            <div className="py-24 px-6 md:px-16 w-full">
                <div className="flex justify-between items-center pt-8">
                <div className="flex gap-6 items-center justify-center">
                <div
      className="h-16 w-16 rounded-xl bg-contain bg-center bg-no-repeat cursor-pointer border border-gray-300"
      style={{ backgroundImage: user.photoURL == null ? (`url(${user.img_url})`):(`url(${user.photoURL})`) }}
    ></div>

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
                        className="rounded-xl bg-blue-100 bg-cover flex items-center justify-center bg-right bg-no-repeat w-full h-full mr-6"
                        style={{ backgroundImage: `url(${bg_popup})` }}
                        >
                            
                        </div>
                        </div>

                        <div className="">
                            <div className="h-full max-w-[500px] ">
                                <div className=" border-l h-full pb-[96px] overflow-y-auto elementBarra border-l-gray-300 p-12 ">
                                <div onClick={() => setPopUpProgram(false)} className={`ml-auto float-right cursor-pointer rounded-xl hover:bg-gray-100 h-[38px] w-[38px] transition-all flex items-center justify-center `}>
                        <X size={20} className={' transition-all text-gray-400'} />
                        </div>
                                <div className="flex mb-4 items-center gap-4">
                                <div
      className="h-16 w-16 rounded-xl p-2 bg-contain bg-center bg-no-repeat  border border-gray-300 flex items-end"
      style={{ backgroundImage: user.photoURL == null ? (`url(${user.img_url})`):(`url(${user.photoURL})`) }}
    >

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