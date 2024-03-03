import { ArrowClockwise, BookmarkSimple, CaretLeft, CaretRight, CheckCircle, Eye, EyeClosed, EyeSlash, FileCsv, GraduationCap, House, MagnifyingGlass, MapPin, Plus, SquaresFour, Star, Trash, UserCircle, UserMinus, UserPlus, Users, UsersFour, UsersThree, X } from "phosphor-react";
import { ChatContent } from "../components/ChatContent";
import { PopUpWrapper } from "./PopUpWrapper";
import { useContext, useEffect, useState } from "react";
import Papa from 'papaparse';

import bg_popup from '../assets/bg_popup.png';
import { Link } from "react-router-dom";

import { getFirestore, doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { UserContext } from "../contexts/context";
import { v4 as uuidv4 } from 'uuid'; // Import the uuid library

interface Program {
    graduate_program_id: string
    code: string
    name: string
    area: string
    modality: string
    type: string
    rating: string
    institution_id: string
    description: string
    url_image: string
    city:string
    visible: boolean
  }

  interface PesquisadorProps {
    name: string
    lattes_id: string
    researcher_id: string
    institution_id: string
  }


export function DashboardPesquisadores() {
    const { user, setUser } = useContext(UserContext);

    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [modality, setModality] = useState('');
    const [type, setType] = useState('');
    const [ranking, setRanking] = useState('');
    const [area, setArea] = useState('');
    const [code, setCode] = useState('');
    const [descricao, setDescricao] = useState('');

    const [nomePesquisador, setNomePesquisador] = useState('');
    const [lattesID, setLattesID] = useState('');

    const [popUpProgram, setPopUpProgram] = useState(false);
    const [popUpProgramEdit, setPopUpProgramEdit] = useState(false);
    const { urlGeral, setUrlGeral } = useContext(UserContext);

    const [researcher, setResearcher] = useState<PesquisadorProps[]>([]);
    const [program, setProgram] = useState<Program[]>([]);

    const [popUpSuccess, setPopUpSuccess] = useState(false);

    const handleCheckboxChange = (event:any) => {
        // Check if the checkbox is checked
        // If checked, update the 'type' state with the checkbox value
        // If unchecked, update the 'type' state to an empty string or any other default value
        setType(event.target.checked ? event.target.value : '');
      };


    const handleClickAdicionarBtn = () => {
        if(name != `` && modality != `` && city != ``) {
            setPopUpProgram(true)
        }
   
      };

      const [menu , setMenu] = useState(false);

      const handleMenuBtn = () => {
        setMenu(!menu)
      }

      const isDashboard = location.pathname === `/dashboard`
      const isPesquisadores = location.pathname === `/dashboard/pesquisadores`


      //submit

      const handleFileUpload = async (e: any) => {
        const file = e.target.files[0];
      
        if (file) {
          try {
            const result = await parseFile(file);
      
            // Aqui você pode manipular os dados parseados antes de enviar para o servidor
            const parsedData = result.data;
      
            console.log(parsedData);
      
            const docId = uuidv4();
      
            const dataJson = parsedData.map((item: any) => ({
              researcher_id: docId,
              name: item.name,
              lattes_id: item.lattes_id,
              institution_id: user.institution_id,
            }));
      
            console.log(dataJson);
      
            const urlProgram = `http://200.128.66.226:5000/` + '/Researcher/Insert';
      
            const fetchData = async () => {
              try {
                const response = await fetch(urlProgram, {
                  method: 'POST',
                  headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Max-Age': '3600',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(dataJson),
                });
      
                if (response.ok) {
                  setLattesID('');
                  setNomePesquisador('');
                  console.log('Dados enviados com sucesso!');
                } else {
                  console.error('Erro ao enviar dados para o servidor.');
                }
              } catch (err) {
                console.log(err);
              }
            };
      
            fetchData();
          } catch (error) {
            console.error('Erro ao processar a requisição:', error);
          }
        }
      };
      
      // Função separada para tratar a lógica de análise do arquivo CSV
      const parseFile = (file: File): Promise<any> => {
        return new Promise((resolve, reject) => {
          Papa.parse(file, {
            complete: (result: any) => {
              resolve(result);
            },
            header: true,
            skipEmptyLines: true,
            delimiter: ';',
            encoding: 'UTF-8',
          });
        });
      };

      const handleSubmit = async () => {

        const docId = uuidv4();

        try {
          const data = [
            {
                graduate_program_id: docId,
                code: code,
                name: name.toUpperCase(),
                area: area.toUpperCase(),
                modality: modality.toUpperCase(),
                type: type.toUpperCase(),
                rating: ranking.toUpperCase(),
                institution_id: user.institution_id,
                description: descricao,
                url_image: user.img_url,
                city: city,
                visible: false
              }
          ]

          let urlProgram = `http://200.128.66.226:5000/` + '/GraduateProgramRest/Insert'

          console.log(data)

          const fetchData = async () => {
          
            try {
              const response = await fetch(urlProgram, {
                mode: 'cors',
                method: 'POST',
                headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'POST',
                  'Access-Control-Allow-Headers': 'Content-Type',
                  'Access-Control-Max-Age': '3600',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
              });

              if (response.ok) {
                setPopUpProgram(false)
                setTimeout(() => {
                    setPopUpSuccess(true);
            
                    // Hide the popup after 5 seconds
                    setTimeout(() => {
                      setPopUpSuccess(false);
                    }, 5000);
                }, 0);
                console.log('Dados enviados com sucesso!');
              } else {
                console.error('Erro ao enviar dados para o servidor.');
              }
              
            } catch (err) {
              console.log(err);
            } 
          };
          fetchData();
    
          
        } catch (error) {
          console.error('Erro ao processar a requisição:', error);
        }
      };

      const handleSubmitPesquisador = async () => {

        const docId = uuidv4();

        try {
          const data = [
            {
                researcher_id: docId,
                name: nomePesquisador,
                lattes_id: lattesID,
                institution_id: user.institution_id,
              }
          ]

          console.log(data)

          let urlProgram = `http://200.128.66.226:5000/` + '/ResearcherRest/Insert'

          const fetchData = async () => {
          
            try {
              const response = await fetch(urlProgram, {
                mode: 'cors',
                method: 'POST',
                headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'POST',
                  'Access-Control-Allow-Headers': 'Content-Type',
                  'Access-Control-Max-Age': '3600',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
              });

              if (response.ok) {
                setLattesID('')
               
                setNomePesquisador('')
                console.log('Dados enviados com sucesso!');
              } else {
                console.error('Erro ao enviar dados para o servidor.');
              }
              
            } catch (err) {
              console.log(err);
            } 
          };
          fetchData();
    
          
        } catch (error) {
          console.error('Erro ao processar a requisição:', error);
        }
      };


      /////////////////////////

      let urlGetResearcher =  `http://200.128.66.226:5000/` + `ResearcherRest/Query?institution_id=${user.institution_id}`

      useEffect(() => {
          const fetchData = async () => {
           
            try {
              const response = await fetch(urlGetResearcher, {
                mode: 'cors',
                headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'GET',
                  'Access-Control-Allow-Headers': 'Content-Type',
                  'Access-Control-Max-Age': '3600',
                  'Content-Type': 'text/plain'
                }
              });
              const data = await response.json();
              if (data) {
                setResearcher(data);
             
              }
            } catch (err) {
              console.log(err);
            } finally {
           
            }
          };
          fetchData();
        }, [urlGetResearcher, handleSubmitPesquisador]);
  
        console.log(researcher)
  
        let urlGetProgram=  `http://200.128.66.226:5000/` + `GraduateProgramRest/Query?institution_id=${user.institution_id}`
  
      useEffect(() => {
          const fetchData = async () => {
           
            try {
              const response = await fetch(urlGetProgram, {
                mode: 'cors',
                headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'GET',
                  'Access-Control-Allow-Headers': 'Content-Type',
                  'Access-Control-Max-Age': '3600',
                  'Content-Type': 'text/plain'
                }
              });
              const data = await response.json();
              if (data) {
                  setProgram(data);
             
              }
            } catch (err) {
              console.log(err);
            } finally {
           
            }
          };
          fetchData();
        }, [urlGetProgram, handleSubmit]);

        const [popUpVisibilities, setPopUpVisibilities] = useState<boolean[]>([]);

        const handleOpenPopUp = (index: number, props: any) => {
          const newVisibilities = [...popUpVisibilities];
          newVisibilities[index] = true;
          setPopUpVisibilities(newVisibilities);
          setName(props.name);
          setCity(props.city)
          setModality(props.modality);
          setType(props.type)
          setRanking(props.rating)
          setArea(props.area)
          setCode(props.code)
          setDescricao(props.description)
        };

        const handleClosePopUp = (index: any) => {
          const newVisibilities = [...popUpVisibilities];
          newVisibilities[index] = false;
          setPopUpVisibilities(newVisibilities);
          setName(``);
          setCity(``)
          setModality(``);
          setType(``)
          setRanking(``)
          setArea(``)
          setCode(``)
          setDescricao(``)
        };

        const handleDeleteProgram = (index:any, id: any) => {

          let urlDeleteProgram =  `http://200.128.66.226:5000/` + `GraduateProgramRest/Delete?graduate_program_id=${id}`
          const fetchData = async () => {
           
            try {
              const response = await fetch(urlDeleteProgram, {
                mode: 'cors',
                method: 'DELETE',
                headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'DELETE',
                  'Access-Control-Allow-Headers': 'Content-Type',
                  'Access-Control-Max-Age': '3600',
                  'Content-Type': 'text/plain'
                }
              });
              if (response.ok) {
                setPopUpProgram(false)
                setTimeout(() => {
                    setPopUpSuccess(true);
            
                    // Hide the popup after 5 seconds
                    setTimeout(() => {
                      setPopUpSuccess(false);
                    }, 5000);
                }, 0);
                console.log('Dados deletados com sucesso!');
              }
            } catch (err) {
              console.log(err);
            } 
          };
          fetchData();

          handleClosePopUp(index)
        };

        const handleDeleteResearcher = (index:any, id: any) => {

          let urlDeleteProgram =  `http://200.128.66.226:5000/` + `ResearcherRest/Delete?researcher_id=${id}`
          const fetchData = async () => {
           
            try {
              const response = await fetch(urlDeleteProgram, {
                mode: 'cors',
                method: 'DELETE',
                headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'DELETE',
                  'Access-Control-Allow-Headers': 'Content-Type',
                  'Access-Control-Max-Age': '3600',
                  'Content-Type': 'text/plain'
                }
              });
              if (response.ok) {
                setPopUpProgram(false)
                setTimeout(() => {
                    setPopUpSuccess(true);
            
                    // Hide the popup after 5 seconds
                    setTimeout(() => {
                      setPopUpSuccess(false);
                    }, 5000);
                }, 0);
                console.log('Dados deletados com sucesso!');
              }
            } catch (err) {
              console.log(err);
            } 
          };
          
          fetchData()

        };

        const handleVisibleProgram = (index:any, id: any) => {

          let urlVisibleProgram =  `http://200.128.66.226:5000/` + `GraduateProgramRest/Update?graduate_program_id=${id}`
          const fetchData = async () => {
           
            try {
              const response = await fetch(urlVisibleProgram, {
                mode: 'cors',
                method: 'POST',
                headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'POST',
                  'Access-Control-Allow-Headers': 'Content-Type',
                  'Access-Control-Max-Age': '3600',
                  'Content-Type': 'text/plain'
                }
              });
              if (response.ok) {
                setPopUpProgram(false)
                setTimeout(() => {
                    setPopUpSuccess(true);
            
                    // Hide the popup after 5 seconds
                    setTimeout(() => {
                      setPopUpSuccess(false);
                    }, 5000);
                }, 0);
                console.log('Dados visibilidade com sucesso!');
              }
            } catch (err) {
              console.log(err);
            } 
          };
          fetchData();

      
        };


        
        const handleChangeProgram = (index:any, props: any) => {

          try {
            const data = [
              {
                  graduate_program_id: props.graduate_program_id,
                  code: code,
                  name: name.toUpperCase(),
                  area: area.toUpperCase(),
                  modality: modality.toUpperCase(),
                  type: type.toUpperCase(),
                  rating: ranking.toUpperCase(),
                  institution_id: props.institution_id,
                  description: descricao,
                  url_image: user.img_url,
                  city: city,
                  visible: false
                }
            ]
  
            let urlProgramFix = `http://200.128.66.226:5000/` + '/GraduateProgramRest/Fix'
  
            console.log(data)
  
            const fetchData = async () => {
            
              try {
                const response = await fetch(urlProgramFix, {
                  mode: 'cors',
                  method: 'POST',
                  headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Max-Age': '3600',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(data),
                });
  
                if (response.ok) {
                  setPopUpProgram(false)
                  setTimeout(() => {
                      setPopUpSuccess(true);
              
                      // Hide the popup after 5 seconds
                      setTimeout(() => {
                        setPopUpSuccess(false);
                      }, 5000);
                  }, 0);
                  console.log('Dados enviados com sucesso!');
                } else {
                  console.error('Erro ao enviar dados para o servidor.');
                }
                
              } catch (err) {
                console.log(err);
              } 
            };
            fetchData();
      
            
          } catch (error) {
            console.error('Erro ao processar a requisição:', error);
          }

      
        };

        const [filterValue, setFilterValue] = useState("");
        const filteredResults = researcher.filter(props =>
          props.name.toUpperCase().includes(filterValue.toUpperCase())
        );
      

    return  (
        <div className="h-screen max-h-screen overflow-y-hidden w-full pr-6 md:pr-16">

<div className='h-[80px] items-center justify-center flex fixed top-0 left-0 z-[999999] w-16'>
                <div onClick={() => handleMenuBtn()} className="cursor-pointer  h-10 w-10 rounded-xl bg-gray-100 items-center justify-center flex hover:bg-gray-300  transition-all">
                    {menu ? (
                      <CaretLeft size={16} className="text-gray-500" />
                    ): (
                      <CaretRight size={16} className="text-gray-500" />
                    )}
                  </div>
                </div>
          <div className="pt-20 flex h-full pb-12">
          <div className={`h-full flex  flex-col ${menu ? (`w-auto mr-6 pl-4`):(`w-16 items-center`)}`}>
                <Link to={`/dashboard`} className={`mb-5 h-10  gap-4 ${menu ? (`w-full px-4`):(`w-10 justify-center `)} ${isDashboard ? (`bg-blue-400 hover:bg-blue-500 text-white`):(`text-gray-400 bg-gray-100 hover:bg-gray-300`)} rounded-xl items-center flex  cursor-pointer transition-all text-sm font-medium`}>
                  <SquaresFour size={16} className="t" /> {menu ? (`Dashboard`):(``)}
                </Link>

                <Link to={`/dashboard/pesquisadores`} className={`mb-5 h-10  gap-4 ${menu ? (`w-full px-4`):(`w-10 justify-center`)} ${isPesquisadores ? (`bg-blue-400 hover:bg-blue-500 text-white`):(`text-gray-400 bg-gray-50 hover:bg-gray-100`)} rounded-xl items-center  flex  cursor-pointer transition-all text-sm font-medium`}>
                  <UsersThree size={16} className="t" /> {menu ? (`Todos os pesquisadores`):(``)}
                </Link>
          </div>

            <div className="flex flex-1 flex-col">
            
        

            <div  style={{ backgroundImage: `url(${bg_popup})` }} className="rounded-2xl bg-cover bg-center bg-no-repeat border p-6 gap-6 border-gray-300 h-64 min-h-[256px] flex items-center justify-center w-full">
            <h3 className=" font-medium text-2xl  text-gray-400"><strong className="bg-blue-400 text-white hover:bg-blue-500 transition duration-500 font-medium">Vincule</strong> os pesquisadores à sua instituição de ensino</h3>
                        <div className="flex gap-6 items-end">
                        <div>
                        <p className="text-sm text-gray-500 mb-2">Nome completo</p>
                <input
                    type="text"
                    onChange={(e) => setNomePesquisador(e.target.value)}
                        value={nomePesquisador}
                
                    required
                    className=" border-[1px] border-gray-300 w-full h-12 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />
                        </div>

                        <div>
                        <p className="text-sm text-gray-500 mb-2">Lattes Id</p>
                <input
                    type="text"
                    onChange={(e) => setLattesID(e.target.value)}
                        value={lattesID}
                
                    required
                    className=" border-[1px] border-gray-300 w-full h-12 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />
                        </div>

                        <div onClick={() => handleSubmitPesquisador()} className="whitespace-nowrap flex cursor-pointer items-center gap-4 bg-blue-400 text-white rounded-xl px-4 py-2 justify-center hover:bg-blue-500  font-medium transition flex-1 h-12 ml-auto">
                <Plus size={16} className="text-white" /> Adicionar
              </div>

              <label  htmlFor="fileInput" onChange={handleFileUpload}  className="h-12 w-12 min-w-[48px] border transition-all cursor-pointer border-gray-300 text-blue-400 rounded-xl flex items-center whitespace-nowrap justify-center hover:bg-gray-50">
              <input onChange={handleFileUpload} id="fileInput" type="file" accept=".csv"  hidden />
                <FileCsv size={16} className="" />
              </label>
                        </div>
            <div>

            </div>
            </div>


            <div className="mt-6 h-full ">
            <div className='flex gap-6  w-full h-full '>
       <div className='w-full h-full'>

       <div className="flex mb-6 items-center justify-center border-gray-300 border-[1px] rounded-xl py-4">
                        <MagnifyingGlass size={20} className={`text-gray-400 min-w-[52px] `} />
                        <input
                          type="text"
                          value={filterValue}
                          onChange={e => setFilterValue(e.target.value)}
                          placeholder="Filtrar resultados"
                          className="w-full outline-none"
                        />
                      </div>

       <div className=" overflow-y-auto max-h-fit h-full elementBarra pr-2">
       {filteredResults.slice(0, 10).map((props, index) => {
          return(
            <div className="flex justify-between items-center py-4 border-b border-b-gray-300 group">
                <div className="flex gap-3 items-center">
                <div
    
            className="h-10 w-10 rounded-xl bg-gray-50 text-gray-500 cursor-pointer flex items-center justify-center"
            >
            <UserCircle size={16} className="" />
            </div>

        <h5 className="font-medium text-gray-500">{props.name}</h5>
            </div>

            <div className="text-gray-400 text-sm group-hover:hidden flex">{props.lattes_id}</div>

            <div onClick={() => handleDeleteResearcher(index, props.researcher_id)} className="cursor-pointer transition-all group-hover:flex hidden  w-[34px] h-[34px] justify-center text-blue-400 border border-gray-300 hover:bg-gray-50 rounded-md text-xs font-bold gap-2 items-center">
                        <Trash size={16} className="textwhite" />
                      
                      </div>
            </div>
          )
        })}
       </div>
       </div>

      
      </div>
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
                                value={name}
                            
                                required
                                className="mb-6 border-[1px] border-gray-300 w-full h-12 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />

                            <div className="flex gap-6">
                                <div>
                                <p className="text-sm text-gray-500 mb-2">Modalidade</p>
                                <input
                                    type="text"
                                    onChange={(e) => setModality(e.target.value)}
                                    value={modality}
                                
                                    required
                                    className="mb-6 border-[1px] border-gray-300 w-full h-12 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />
                                </div>

                                <div>
                                <p className="text-sm text-gray-500 mb-2">Cidade</p>
                                <input
                                    type="text"
                                    onChange={(e) => setCity(e.target.value)}
                                    value={city}
                                
                                    required
                                    className="mb-6 border-[1px] border-gray-300 w-full h-12 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />
                                </div>
                            </div>

                            <div className=" w-full h-[1px] bg-gray-300 my-2"></div>


                            <p className="text-sm text-gray-500 mb-2 mt-8">Tipo do programa</p>
                            
                            <div className="flex gap-4 mb-6">
                            <input type="checkbox" id="vehicle1" name="vehicle1" value="DOUTORADO " checked={type === 'DOUTORADO'} onChange={handleCheckboxChange}/>
                            <label htmlFor="vehicle1"> DOUTORADO</label>
                            <input type="checkbox" id="vehicle2" name="vehicle2" value="MESTRADO" checked={type === 'MESTRADO'} onChange={handleCheckboxChange}/>
                            <label htmlFor="vehicle2"> MESTRADO</label>
                            </div>

                            <div className="flex gap-6">
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Ranking</p>
                                <input
                                    type="number"
                                    onChange={(e) => setRanking(e.target.value)}
                                    value={ranking}
                                
                                    required
                                    className="mb-6 border-[1px] border-gray-300 w-12 h-12 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />
                                </div>
                                
                                <div className="w-full">
                                <p className="text-sm text-gray-500 mb-2">Área</p>
                                <input
                                    type="text"
                                    onChange={(e) => setArea(e.target.value)}
                                    value={area}
                                
                                    required
                                    className="mb-6 flex-1 border-[1px] border-gray-300 w-full h-12 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />
                                </div>

            

                               
                            </div>

                            <p className="text-sm text-gray-500 mb-2">Código do programa (Sucupira)</p>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
             
               
                required
                className="mb-4 border-[1px] border-gray-300 w-full h-12 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />


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

{popUpSuccess && (
        <div className="fixed right-16 bottom-16 z-[99999999999999] ">
        <div className=" rounded-xl bg-white border shadow-md border-gray-300 p-6 flex items-center justify-center gap-4">
          <div><CheckCircle size={32} className={' text-green-400'} /></div>
          <div>Programa de pós-graduação enviado com sucesso!</div>
        </div>
    </div>
      )}


{popUpSuccess && (
        <div className="fixed right-16 bottom-16 z-[99999999999999] ">
        <div className=" rounded-xl bg-white border shadow-md border-gray-300 p-6 flex items-center justify-center gap-4">
          <div><UserPlus size={32} className={' text-green-400'} /></div>
          <div>Pesquisador(es) enviado(s) com sucesso!</div>
        </div>
    </div>
      )}

{popUpSuccess && (
        <div className="fixed right-16 bottom-16 z-[99999999999999] ">
        <div className=" rounded-xl bg-white border shadow-md border-gray-300 p-6 flex items-center justify-center gap-4">
          <div><UserMinus size={32} className={' text-red-400'} /></div>
          <div>Pesquisador deletado</div>
        </div>
    </div>
      )}
          
        </div>
    )
}