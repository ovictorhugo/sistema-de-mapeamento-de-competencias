import { CaretLeft, CaretRight, House, Plus, SquaresFour, Trash, Users, UsersFour, UsersThree, X } from "phosphor-react";
import { ChatContent } from "../components/ChatContent";
import { PopUpWrapper } from "./PopUpWrapper";
import { useState } from "react";

import bg_popup from '../assets/bg_popup.png';
import { Link } from "react-router-dom";

import { getFirestore, doc, getDoc, collection, addDoc } from 'firebase/firestore';

export function Dashboard() {

    const [name, setName] = useState('');
    const [modality, setModality] = useState('');
    const [type, setType] = useState('');
    const [ranking, setRanking] = useState('');
    const [area, setArea] = useState('');
    const [descricao, setDescricao] = useState('');

    const [popUpProgram, setPopUpProgram] = useState(false);

    const handleClickAdicionarBtn = () => {
        if(name != `` && modality != `` && type != ``) {
            setPopUpProgram(true)
        }
   
      };

      const [menu , setMenu] = useState(false);

      const handleMenuBtn = () => {
        setMenu(!menu)
      }

      const isDashboard = location.pathname === `/dashboard`
      const isPesquisadores = location.pathname === `dashboard/pesquisadores`


      //submit

      const handleSubmit = async () => {
        try {
          // Aqui você pode adicionar a lógica para tratar os tipos de programa selecionados
          // programTypes é um array com os tipos selecionados
      
          // Crie um objeto com os dados do formulário
          const formData = {
            name,
            modality,
            type,
         
            ranking,
            area,
            descricao,
          };
      
          // Submeta os dados para o Firestore
          const db = getFirestore();
          const programRef = collection(db, 'graduate_program');
          await addDoc(programRef, formData);
      
          // Limpe os campos do formulário após a submissão
          setName('');
          setModality('');
          setType('');
          setRanking('');
          setArea('');
          setDescricao('');
      
          // Feche o pop-up ou faça qualquer outra ação necessária
          setPopUpProgram(false);
        } catch (error) {
          console.error('Erro ao enviar os dados:', error);
        }
      };
      

    return  (
        <div className="h-screen w-full pr-6 md:pr-16">

<div className='h-[80px] items-center justify-center flex fixed top-0 left-0 z-[999999] w-16'>
                <div onClick={() => handleMenuBtn()} className="cursor-pointer  h-10 w-10 rounded-xl bg-gray-100 items-center justify-center flex hover:bg-gray-300  transition-all">
                    {menu ? (
                      <CaretLeft size={16} className="text-gray-500" />
                    ): (
                      <CaretRight size={16} className="text-gray-500" />
                    )}
                  </div>
                </div>
          <div className="pt-20 flex h-full">
          <div className={`h-full flex  flex-col ${menu ? (`w-auto mr-6 pl-4`):(`w-16 items-center`)}`}>
                <Link to={`/dashboard`} className={`mb-5 h-10  gap-4 ${menu ? (`w-full px-4`):(`w-10 justify-center `)} ${isDashboard ? (`bg-blue-400 hover:bg-blue-500 text-white`):(`text-gray-400 bg-gray-100 hover:bg-gray-300`)} rounded-xl items-center flex  cursor-pointer transition-all text-sm font-medium`}>
                  <SquaresFour size={16} className="t" /> {menu ? (`Dashboard`):(``)}
                </Link>

                <Link to={`/dashboard/pesquisadores`} className={`mb-5 h-10  gap-4 ${menu ? (`w-full px-4`):(`w-10 justify-center`)} ${isPesquisadores ? (`bg-blue-400 hover:bg-blue-500 text-white`):(`text-gray-400 bg-gray-50 hover:bg-gray-100`)} rounded-xl items-center  flex  cursor-pointer transition-all text-sm font-medium`}>
                  <UsersThree size={16} className="t" /> {menu ? (`Todos os pesquisadores`):(``)}
                </Link>
          </div>

            <div className="flex flex-1 mr-6">
            <div className="flex gap-6 w-full h-fit items-center">
            <h1 className="z-[999999] text-4xl  font-medium max-w-[400px] ">
            Bem vindo(a) ao Módulo <strong className="bg-red-400 text-white font-normal"> administrativo </strong>{" "}
        </h1>
                <div className="grid grid-cols-2 gap-6 w-full">
                    <div className="border h-32 border-gray-300 rounded-2xl w-full justify-center px-6 flex flex-col items-end">
                    <p className="text-gray-400">Total de docentes</p>
                <h3 className="text-6xl font-medium">100</h3>
                    </div>
                    <div className="border h-32 border-gray-300 rounded-2xl w-full justify-center px-6 flex flex-col items-end">
                    <p className="text-gray-400 text-right">Total de  pós-graduação</p>
                <h3 className="text-6xl font-medium">100</h3>
                    </div>
                   
                </div>
            </div>
            </div>
            <div className="h-full max-w-[500px] ">
                <div className="rounded-xl border border-gray-300 p-12 ">
                <h3 className="max-w-[250px] font-medium text-2xl mb-4 text-gray-400">Cadastrar programa de <strong className="bg-blue-400 text-white hover:bg-blue-500 transition duration-500 font-medium">pós-graduação</strong></h3>
                    <p className="  text-gray-400 mb-8">
                        Adicione as informações básicas do programa de pós-graduação como o corpo docente envolvido, classificação, descrição e localidade 
                    </p>

                    <form className="w-full ">
              <p className="text-sm text-gray-500 mb-2">Nome do programa</p>
              <input
                type="text"
                value={name.toUpperCase()}
                onChange={(e) => setName(e.target.value)}
             
               
                required
                className="mb-4 border-[1px] border-gray-300 w-full h-12 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />

              <div className="flex gap-6">
                <div>
                <p className="text-sm text-gray-500 mb-2">Modalidade</p>
                <input
                    type="text"
                    onChange={(e) => setModality(e.target.value)}
                        value={modality.toUpperCase()}
                
                    required
                    className="mb-6 border-[1px] border-gray-300 w-full h-12 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />
                </div>

                <div>
                <p className="text-sm text-gray-500 mb-2">Cidade</p>
                <input
                    type="text"
                    onChange={(e) => setType(e.target.value)}
                        value={type.toUpperCase()}
                
                    required
                    className="mb-6 border-[1px] border-gray-300 w-full h-12 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />
                </div>
              </div>
           
              <div className="flex gap-6">
              <div onClick={() => handleClickAdicionarBtn()} className="whitespace-nowrap flex cursor-pointer items-center gap-4 bg-blue-400 text-white rounded-xl px-4 py-2 justify-center hover:bg-blue-500  font-medium transition flex-1 h-12 ml-auto">
                <Plus size={16} className="text-white" /> Adicionar
              </div>

              <div className="h-12 w-12 border transition-all cursor-pointer border-gray-300 text-blue-400 rounded-xl flex items-center whitespace-nowrap justify-center hover:bg-gray-50">
                <Trash size={16} className="" />
                <input type="reset" value=""/>
              </div>
              </div>
            </form>
                </div>
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
                            <div className="whitespace-nowrap w-fit flex cursor-pointer items-center gap-4 bg-blue-400 text-white rounded-xl px-4 py-2 justify-center hover:bg-blue-500  font-medium transition  h-12 ">
                                <Plus size={16} className="text-white" /> Importar csv
                            </div>
                        </div>
                        </div>

                        <div className="">
                            <div className="h-full max-w-[500px] ">
                                <div className=" border-l h-full pb-[96px] overflow-y-auto elementBarra border-l-gray-300 p-12 ">
                                <div onClick={() => setPopUpProgram(false)} className={`ml-auto float-right cursor-pointer rounded-xl hover:bg-gray-100 h-[38px] w-[38px] transition-all flex items-center justify-center `}>
                        <X size={20} className={'rotate-180 transition-all text-gray-400'} />
                        </div>
                                
                                <h3 className="max-w-[250px] font-medium text-2xl mb-4 text-gray-400">Cadastrar programa de <strong className="bg-blue-400 text-white hover:bg-blue-500 transition duration-500 font-medium">pós-graduação</strong></h3>
                                    <p className="  text-gray-400 mb-8">
                                        Adicione as informações básicas do programa de pós-graduação como o corpo docente envolvido, classificação, descrição e localidade 
                                    </p>

                                    <form className="w-full ">
                            <p className="text-sm text-gray-500 mb-2">Nome do programa</p>
                            <input
                                type="text"
                                onChange={(e) => setName(e.target.value)}
                                value={name.toUpperCase()}
                            
                                required
                                className="mb-6 border-[1px] border-gray-300 w-full h-12 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />

                            <div className="flex gap-6">
                                <div>
                                <p className="text-sm text-gray-500 mb-2">Modalidade</p>
                                <input
                                    type="text"
                                    onChange={(e) => setModality(e.target.value)}
                                    value={modality.toUpperCase()}
                                
                                    required
                                    className="mb-6 border-[1px] border-gray-300 w-full h-12 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />
                                </div>

                                <div>
                                <p className="text-sm text-gray-500 mb-2">Cidade</p>
                                <input
                                    type="text"
                                    onChange={(e) => setType(e.target.value)}
                                    value={type.toUpperCase()}
                                
                                    required
                                    className="mb-6 border-[1px] border-gray-300 w-full h-12 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />
                                </div>
                            </div>

                            <div className=" w-full h-[1px] bg-gray-300 my-2"></div>


                            <p className="text-sm text-gray-500 mb-2">Tipo do programa</p>
                            
                            <div className="flex gap-4 mb-6">
                            <input type="checkbox" id="vehicle1" name="vehicle1" value="DOUTORADO"/>
                            <label htmlFor="vehicle1"> DOUTORADO</label>
                            <input type="checkbox" id="vehicle2" name="vehicle2" value="MESTRADO"/>
                            <label htmlFor="vehicle2"> MESTRADO</label>
                            </div>

                            <div className="flex gap-6">
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Ranking</p>
                                <input
                                    type="number"
                                    onChange={(e) => setRanking(e.target.value)}
                                    value={ranking.toUpperCase()}
                                
                                    required
                                    className="mb-6 border-[1px] border-gray-300 w-12 h-12 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />
                                </div>
                                
                                <div className="w-full">
                                <p className="text-sm text-gray-500 mb-2">Área</p>
                                <input
                                    type="text"
                                    onChange={(e) => setArea(e.target.value)}
                                    value={area.toUpperCase()}
                                
                                    required
                                    className="mb-6 flex-1 border-[1px] border-gray-300 w-full h-12 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />
                                </div>

            

                               
                            </div>

                            <p className="text-sm text-gray-500 mb-2">Descrição (não obrigatório)*</p>
                                <textarea
                                   
                                    onChange={(e) => setDescricao(e.target.value)}
                                    value={descricao}
                                
                                    required
                                    className="mb-6 flex-1 border-[1px] border-gray-300 w-full h-32 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />

                            </form>
                                </div>

                                <div className="flex border-l  border-l-gray-300 gap-6 px-12 py-6 bg-white top-[-96px] z-[99] right-0 relative">
                            <div onClick={handleSubmit} className="whitespace-nowrap flex cursor-pointer items-center gap-4 bg-blue-400 text-white rounded-xl px-4 py-2 justify-center hover:bg-blue-500  font-medium transition flex-1 h-12 ml-auto">
                                <Plus size={16} className="text-white" /> Adicionar
                            </div>

                            <div className="h-12 w-12 border transition-all cursor-pointer border-gray-300 text-blue-400 rounded-xl flex items-center whitespace-nowrap justify-center hover:bg-gray-50">
                                <Trash size={16} className="" />
                                <input type="reset" value=""/>
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