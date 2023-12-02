import { UserContext } from "../contexts/context";

import { useEffect, useState, useContext } from "react";
import { Header } from "./Header";
import { CalendarBlank, CaretCircleLeft, CaretCircleRight, CaretDown, File, Graph, Hash, LinkBreak, MagnifyingGlass, Quotes } from "phosphor-react";
import Carregando from "./Carregando";
import { MagazineSvg } from "./MagazineSvg";

type Magazine = {
    id: string,
    issn: string,
    jcr_link: string,
    jif: string,
    magazine: string,
    qualis: string
}

interface Props {
  program: string,
}

export function ContentMagazine(props: Props) {

    const { urlGeral, setUrlGeral } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);  
      const [filterValue, setFilterValue] = useState("");

      const { idVersao, setIdVersao } = useContext(UserContext);

      //logica versões
   
      setIdVersao("4")
  
  

    let urlMagazine = `${urlGeral}magazine?initials=&issn=`
    const [magazine, setMagazine] = useState<Magazine[]>([]);

    useEffect(() => {
        const fetchData = async () => {
          setIsLoading(true);
          try {
            const response = await fetch(urlMagazine, {
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
              setMagazine(data);
            }
          } catch (err) {
            console.log(err);
          } finally {
            setIsLoading(false);
          }
        };
        fetchData();
      }, [urlMagazine]);

      let qualisColor = {
    'A1': 'bg-[#006837]',
    'A2': 'bg-[#8FC53E]',
    'A3': 'bg-[#ACC483]',
    'A4': 'bg-[#BDC4B1]',
    'B1': 'bg-[#F15A24]',
    'B2': 'bg-[#F5831F]',
    'B3': 'bg-[#F4AD78]',
    'B4': 'bg-[#F4A992]',
    'B5': 'bg-[#F2D3BB]',
    'C': 'bg-[#EC1C22]',
    'None': 'bg-[#560B11]',
    'SQ': 'bg-[#560B11]'
}

const filteredResults = magazine.filter(prop =>
  prop.magazine.toUpperCase().includes(filterValue.toUpperCase()) ||
  prop.issn.includes(filterValue)
);


 const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 12;
  const totalPages = Math.ceil(magazine.length / resultsPerPage);

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = filteredResults.slice(indexOfFirstResult, indexOfLastResult);

    return  (
        <div className="h-screen">

<Header/>

            <div className="overflow-hidden absolute   px-6 md:px-16 w-full">
                <div className="h-screen py-20  flex items-center ">
                <div className="bg-blue-400 bg-opacity-50 backdrop-blur-sm rounded-2xl flex flex-col w-full h-full p-16 items-center justify-center">
                <div className="flex justify-center flex-col items-center mb-12">
                  <h1 className="text-white   font-light text-4xl mb-2">Pesquise <strong className="bg-green-400">o nome da revista ou ISSN</strong> para ver o Qualis e JCR</h1>
                <p className="text-white ">Para ajudar a sua pesquisa, fornecemos uma lista extensa de revistas e suas classificações.</p>

               
                </div>
                <div className="z-[999] w-full flex justify-center">
                   <div className="flex bg-white mb-6 w-[70%] items-center justify-center border-gray-300 border-[1px] rounded-xl py-4">
                        <MagnifyingGlass size={20} className={`text-gray-400 min-w-[52px] `} />
                        <input
                          type="text"
                          value={filterValue}
                          onChange={e => setFilterValue(e.target.value)}
                          placeholder="Filtrar resultados"
                          className="w-full outline-none"
                        />
                      </div>
                </div>

                <div className="animate-bounce cursor-pointer absolute bottom-16 text-white rounded-full hover:bg-blue-400 h-[38px] w-[38px] transition-all flex items-center justify-center">
                <CaretDown  size={24} className={" transition-all   "} />
              </div>

                </div>

                <div className="w-full absolute z-[-9] -top-48 left-0 "><MagazineSvg/></div>
            </div>

             <div className="pt-12">
        <h2 className="mb-4 text-3xl font-medium text-gray-400">Revistas encontradas <strong className="font-bold text-white bg-green-400">pelo título</strong></h2>
        {filterValue.length == 0 ? (<p className="text-gray-400 mb-8">Mostrando todas as revistas, digite para aparecer mais</p>) : (<p className="text-gray-400 mb-8">Mostrando todas as revistas com "{filterValue}" contido no título</p>)}
      </div>

            <div>
              {isLoading ? (
                        <div className="flex items-center justify-center w-full py-10">
                          <Carregando />
                        </div>
                      ) : (
                        <>
                          {currentResults.length === 0 ? (
                            <p className="text-center">Nenhuma revista encontrada</p>
                          ) : (
                            <div className={`mb-9 grid masonry grid-cols-1 lg:grid-cols-2 gap-6 m-[0 auto] w-full`}>
                              {currentResults.map(props => (
                                <div className="items-center group bg-white  justify-between border-solid border-gray-300 border-[1px] flex p-6 rounded-md hover:shadow-md transition ">
                                   <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center flex-1">
                                        <div className="flex flex-col justify-center">
                                        <div id="mudarCorDiv" className={`  ${qualisColor[props.qualis as keyof typeof qualisColor]} h-10 w-10 rounded-md mr-4 whitespace-nowrap flex items-center justify-center `}>
                                            <File size={28} className="text-white whitespace-nowrap  w-10" />
                                            <p className="text-[8px] text-white absolute font-bold mt-[6px]">{props.qualis}</p>

                                        </div>
                                        <p className="text-gray-400 text-[12px]  mr-4 text-center mt-2 relative">Qualis</p>
                                        </div>

                                        <div >
                                        <h4 className="text-base font-medium ">{props.magazine}</h4>
                                        <div className="flex items-center gap-2">
                                            <Hash size={16} className="text-gray-400" />
                                            <p className="text-[13px]  text-gray-500">{props.issn}</p>
                                        </div>
                                    </div>
                                    </div>

                                    
                                    <div className="flex  gap-4 items-center justify-end relative bottom-0S flex-wrap">
                                      <div className="flex gap-3">
                                          <div className=" flex gap-3 flex-wrap justify-end flex-1">
                                              <div className="qualis border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium gap-2 items-center whitespace-nowrap "><Graph size={16} className="text-gray-400" />  Qualis {props.qualis}</div>


                                              <div className="border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium gap-2 items-center"> <Quotes size={16} className="text-gray-400" /> Revista</div>

                                              {props.jif != "None" && (
                                                  <a href={`${props.jcr_link}`} target="_blank" rel="noopener noreferrer" className="border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium gap-2 items-center whitespace-nowrap "><LinkBreak size={16} className="text-gray-400" />JCR {props.jif}</a>
                                              )}
                                          </div>

                                      </div>
                                  </div>

                </div>
                                </div>
                              ))}
                            </div>
                          )}

                         <div className="w-full justify-end flex mb-6">
                        <p className="text-gray-400 font-bold">Página {currentPage} de {totalPages} </p>
                      </div>

                      <div className="mb-9 flex gap-4 w-full justify-center">
                        <button
                          className="flex items-center gap-4 bg-blue-400 text-white rounded-full px-6 py-2 justify-center hover:bg-blue-500 mb-6 font-medium transition"
                          onClick={() => {
                            setCurrentPage(currentPage - 1);
                            if (document) {
                              document.getElementById('contentPesquisador')?.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          style={{
                            backgroundColor: currentPage === 1 ? '#ccc' : '#005399',
                            opacity: currentPage === 1 ? '0.5' : '1',
                          }}
                          disabled={currentPage === 1}
                        >
                          <CaretCircleLeft size={16} className="text-white" />Anterior
                        </button>

                        <button
                          className="flex items-center gap-4 bg-blue-400 text-white rounded-full px-6 py-2 justify-center hover:bg-blue-500 mb-6 font-medium transition"
                          onClick={() => {
                            setCurrentPage(currentPage + 1);
                            if (document) {
                              document.getElementById('contentPesquisador')?.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          style={{
                            backgroundColor: indexOfLastResult >= magazine.length ? '#ccc' : '#005399',
                            opacity: indexOfLastResult >= magazine.length ? '0.5' : '1',
                          }}
                          disabled={indexOfLastResult >= magazine.length}
                        >
                          Próximo<CaretCircleRight size={16} className="text-white" />
                        </button>
                      </div>
                          
                        </>
                      )}
            </div>
            </div>
          
        </div>
    )
}