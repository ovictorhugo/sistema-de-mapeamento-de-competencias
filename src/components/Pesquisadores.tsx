import { Pesquisador } from "./Pesquisador"
import { useEffect, useState, useContext } from "react";
import { UserContext } from '../contexts/context'
import { Link } from "react-router-dom";
import { CaretCircleLeft, CaretCircleRight, CaretDown, FileArrowDown, FileCsv, GitBranch, ListNumbers, Plus, Rows, SquaresFour, UserList, X } from "phosphor-react";
import Carregando from "./Carregando";

import Cookies from "js-cookie";

import { useLocation } from 'react-router-dom';


type Research = {
  among: number,
  articles: number,
  book: number,
  book_chapters: number,
  id: string,
  name: string,
  university: string,
  lattes_id: string,
  area: string,
  lattes_10_id: string,
  abstract: string,
  city: string,
  orcid: string,
  image: string
  graduation: string,
  patent: string,
  software: string,
  brand: string,
  lattes_update: Date,
}



export function Pesquisadores() {
  const [isLoading, setIsLoading] = useState(false);
  const { urlTermExport, setUrlTermExport } = useContext(UserContext);
  const { totalPesquisadores, setTotalPesquisadores } = useContext(UserContext);
  const { urlGeral, setUrlGeral } = useContext(UserContext);

  const { valoresSelecionadosExport, setValoresSelecionadosExport } = useContext(UserContext);
  const { valorDigitadoPesquisaDireta, setValorDigitadoPesquisaDireta } = useContext(UserContext);

  //btns da página search

  const { botaoPesquisadoresClicado, setBotaoPesquisadoresClicado } = useContext(UserContext);
  const { botaoPatentesClicado, setBotaoPatentesClicado } = useContext(UserContext);
  const { botaoTermosClicado, setBotaoTermosClicado } = useContext(UserContext);
  const { botaoResumoClicado, setBotaoResumoClicado } = useContext(UserContext);
  const { botaoAreasClicado, setBotaoAreasClicado } = useContext(UserContext);

  const [researcher, setResearcher] = useState<Research[]>([]); // Define o estado vazio no início


  let urlTermPesquisadores = ``;


  // BTN MOSTRAR RESULTADOS 
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 12;

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const totalPages = Math.ceil(researcher.length / resultsPerPage);




  const currentResults = researcher.slice(indexOfFirstResult, indexOfLastResult);


  //dropdown


  // habilitar/ desabilitar div
  const [isVisible, setIsVisible] = useState(true);

  //TOTAL DE PESQUISADORES
  const quantidadeTotalDePesquisadores = researcher.length;
  setTotalPesquisadores(quantidadeTotalDePesquisadores.toString())



  const { intituicoesSelecionadasCheckbox, setIntituicoesSelecionadasCheckbox } = useContext(UserContext)
  const { idGraduateProgram, setIdGraduateProgram } = useContext(UserContext)
  //fetch

  if (botaoPesquisadoresClicado) {
    urlTermPesquisadores = `${urlGeral}/researcherName?name=${valoresSelecionadosExport}`;
  }

  if (botaoPesquisadoresClicado && valoresSelecionadosExport == "") {
    let valorDigitadoPesquisaDiretaPesquisadores = valorDigitadoPesquisaDireta.replace(/;/g, '%20')
    urlTermPesquisadores = `${urlGeral}/researcherName?name=${valorDigitadoPesquisaDireta}`;
  }

  if (botaoPatentesClicado) {
    urlTermPesquisadores = `${urlGeral}/researcherPatent?term=${valoresSelecionadosExport}&graduate_program_id=${idGraduateProgram}&university=${intituicoesSelecionadasCheckbox}`;
  }

  if (botaoPatentesClicado && valoresSelecionadosExport == "") {
    let valorDigitadoPesquisaDiretaPesquisadores = valorDigitadoPesquisaDireta.replace(/;/g, '%20')
    urlTermPesquisadores = `${urlGeral}/researcherPatent?term=${valorDigitadoPesquisaDireta}&graduate_program_id=${idGraduateProgram}&university=${intituicoesSelecionadasCheckbox}`;
  }

  if (botaoTermosClicado) {
    urlTermPesquisadores = `${urlGeral}researcher?terms=${valoresSelecionadosExport}&university=${intituicoesSelecionadasCheckbox}&type=ARTICLE&graduate_program_id=${idGraduateProgram}`
  }

  if (botaoTermosClicado && valoresSelecionadosExport == "") {
    urlTermPesquisadores = `${urlGeral}researcher?terms=${valorDigitadoPesquisaDireta}&university=${intituicoesSelecionadasCheckbox}&type=ARTICLE&graduate_program_id=${idGraduateProgram}`;
  }

  if (botaoResumoClicado) {
    urlTermPesquisadores = `${urlGeral}researcher?terms=${valoresSelecionadosExport}&university=${intituicoesSelecionadasCheckbox}&type=ABSTRACT&graduate_program_id=${idGraduateProgram}`
  }

  if (botaoResumoClicado && valoresSelecionadosExport == "") {
    urlTermPesquisadores = `${urlGeral}researcher?terms=${valorDigitadoPesquisaDireta}&university=${intituicoesSelecionadasCheckbox}&type=ABSTRACT&graduate_program_id=${idGraduateProgram}`;
  }

  if (botaoAreasClicado) {
    urlTermPesquisadores = `${urlGeral}/researcherArea_specialty?area_specialty=${valoresSelecionadosExport}&university=${intituicoesSelecionadasCheckbox}&graduate_program_id=${idGraduateProgram}`;
  }

  if (botaoAreasClicado && valoresSelecionadosExport == "") {
    let valorDigitadoPesquisaDiretaPesquisadores = valorDigitadoPesquisaDireta.replace(/;/g, '%20')
    urlTermPesquisadores = `${urlGeral}/researcherArea_specialty?area_specialty=${valorDigitadoPesquisaDiretaPesquisadores}&university=${intituicoesSelecionadasCheckbox}&graduate_program_id=${idGraduateProgram}`;
  }


console.log(urlTermPesquisadores)

  const location = useLocation();

  useEffect(() => {
    // Redefinir a variável sempre que a localização (página) mudar
    setResearcher([]);
  }, [location]);


  const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(urlTermPesquisadores, {
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
          setCurrentPage(1);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [urlTermPesquisadores]);




  //AHHHHHH




  const [itensSelecionados, setItensSelecionados] = useState<string[]>([]);
  const { pesquisadoresSelecionadosGroupBarema, setPesquisadoresSelecionadosGroupBarema } = useContext(UserContext);

  const handleCheckboxChange = (user: { name: string }) => {
    if (itensSelecionados.includes(user.name)) {
      setItensSelecionados(prevSelecionados =>
        prevSelecionados.filter(selectedItem => selectedItem !== user.name)
      );
    } else {
      setItensSelecionados(prevSelecionados => [...prevSelecionados, user.name]);
    }
  };

  useEffect(() => {
    setPesquisadoresSelecionadosGroupBarema(itensSelecionados.join(';'));
  }, [itensSelecionados]);



  
console.log(pesquisadoresSelecionadosGroupBarema)
 

  
 


  //resetr pesquisa
  if (valoresSelecionadosExport != "") {
    setValorDigitadoPesquisaDireta('')
  }


  // visualização por bloco e lista 

  //on/off


  const { isOn, setIsOn } = useContext(UserContext)

  const toggleButtonOn = () => {
    setIsOn(false);
  };

  const toggleButtonOff = () => {
    setIsOn(true);
  };

  //btn json

  const [jsonData, setJsonData] = useState<any[]>([]);
  const [downloadReady, setDownloadReady] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(urlTermPesquisadores, {
          mode: 'cors',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600',
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        setJsonData(data);
        setDownloadReady(true);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [urlTermPesquisadores]);

  const convertJsonToCsv = (json: any[]): string => {
    const items = json;
    const replacer = (key: string, value: any) => (value === null ? '' : value); // Handle null values
    const header = Object.keys(items[0]);
    const csv = [
      '\uFEFF' + header.join(';'), // Add BOM and CSV header
      ...items.map((item) =>
        header.map((fieldName) => JSON.stringify(item[fieldName], replacer)).join(';')
      ) // CSV data
    ].join('\r\n');

    return csv;
  };

  const handleDownloadJson = async () => {
    try {
      const csvData = convertJsonToCsv(jsonData);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `pesquisadores${valoresSelecionadosExport}${valorDigitadoPesquisaDireta}.csv`;
      link.href = url;
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  // Função para exibir o PopUp

  const { isPopUpVisible, setIsPopUpVisible } = useContext(UserContext);

  const handleOpenPopUp = () => {
    setIsPopUpVisible(true);
  };


  return (
    <div className="flex flex-col m-[0 auto] min-w-full  flex justify-center items-center">

      <div className="   m-[0 auto] w-full ">


        {botaoPesquisadoresClicado || botaoAreasClicado || botaoResumoClicado || botaoPatentesClicado ? (
          <div></div>
        ) : (
          <div className="flex gap-4 w-full pb-8 justify-between items-center min-w-full">
            <div className="flex gap-4">
              <ListNumbers size={24} className="text-gray-400" />
              <p className="text-gray-400">Pesquisadores mais relevantes por ordem de ocorrências</p>
            </div>

            <div onClick={() => setIsVisible(!isVisible)} className="cursor-pointer rounded-full hover:bg-gray-100 h-[38px] w-[38px] transition-all flex items-center justify-center">
              <CaretDown size={24} className={isVisible ? "rotate-180 transition-all text-gray-400" : "text-gray-400 transition-all"} />
            </div>

          </div>
        )}



        {botaoPesquisadoresClicado || botaoAreasClicado || botaoResumoClicado || botaoPatentesClicado ? (
          <div></div>
        ) : (
          isVisible && (
            <div>
              {isLoading ? (
                <div className="flex items-center justify-center w-full py-10">
                  <Carregando />
                </div>
              ) : (
                <div className="mb-9  m-[0 auto] w-full">
                  <ul className="gap-4 flex-wrap flex w-full items-end">
                    {researcher
                      .slice(0, 10)
                      .sort((a, b) => b.among - a.among)
                      .map((user, index, arr) => {
                        const maxFontSize = 300;
                        const minFontSize = 150;
                        const distinctAmongValues = [...new Set(arr.map(user => user.among))];
                        const distinctAmongCount = distinctAmongValues.length;
                        const fontSize =
                          maxFontSize -
                          ((maxFontSize - minFontSize) / (distinctAmongCount - 1)) *
                          distinctAmongValues.indexOf(user.among);

                        return (
                          <li key={user.id} className="list-none list-item w-min">
                            <a
                              href={`https://lattes.cnpq.br/${user.lattes_id}`}
                              target="_blank"
                              className="inline-flex whitespace-nowrap"
                            >
                              <h3
                                className="items-center p-3 px-6 flex min-h-[20px] gap-4 font-bold rounded-md text-blue-400 bg-white hover:shadow-md transition border-[1px] border-gray-300 border-solid"
                                style={{ fontSize: `${fontSize}%` }}
                              >
                                {user.name}
                                <div className="border-[1px] bg-blue-400 border-blue-400 py-2 flex px-3 text-white rounded-md text-[10px] font-bold">
                                  {user.among} ocorrências
                                </div>
                              </h3>
                            </a>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              )}
            </div>
          )
        )}



        <div className="flex gap-4 w-full pb-8 justify-between items-center min-w-full">
          <div className="flex gap-4">
            <UserList size={24} className="text-gray-400" />
            <p className="text-gray-400">Pesquisadores por detalhamento</p>
          </div>

          <div className="flex gap-4">
            <div onClick={toggleButtonOn} className={`cursor-pointer rounded-full hover:bg-gray-100 h-[38px] w-[38px] transition-all flex items-center justify-center ${isOn ? "bg-transparent" : "bg-gray-300"}`}>
              <SquaresFour size={24} className={'rotate-180 transition-all text-gray-400'} />
            </div>

            <div onClick={toggleButtonOff} className={`cursor-pointer rounded-full hover:bg-gray-100 h-[38px] w-[38px] transition-all flex items-center justify-center ${isOn ? "bg-gray-300" : "bg-transparent"}`}>
              <Rows size={24} className={'rotate-180 transition-all text-gray-400'} />
            </div>
          </div>
        </div>

        <div className=" ">
          <div>
            {isLoading ? (
              <div className="flex items-center justify-center w-full py-10">
                <Carregando />
              </div>
            ) : (
              <div
                id="contentPesquisador"
                className={`mb-9 grid grid-cols-1 md:grid-cols-2 gap-6 m-[0 auto] w-full ${isOn ? "lg:grid-cols-1 2xl:grid-cols-1" : "lg:grid-cols-3 2xl:grid-cols-4"
                  }`}
              >
                {currentResults.map((user, index) => (
                  <div key={user.id} className=" group justify-end flex w-full transition-all" >

<label
          key={index}
          className={`z-[99] absolute m-6 ml-auto hidden group-hover:flex cursor-pointer float-right items-center gap-4 ${pesquisadoresSelecionadosGroupBarema.includes(user.name) ? 'bg-red-400 hover:bg-red-500' : 'bg-blue-400 hover:bg-blue-500'} text-white rounded-xl h-[38px] w-[38px] justify-center  font-medium transition`}
        >
          {pesquisadoresSelecionadosGroupBarema.includes(user.name) ? (
            <X size={16} className="text-white" />
          ) : (
            <Plus size={16} className="text-white" />
          )}
          <input
            type="checkbox"
            className="absolute hidden"
            name={user.name}
            checked={itensSelecionados.includes(user.name)}
            onChange={() => handleCheckboxChange(user)}
          />
        </label>

                    <div className="relative w-full">
                      <Pesquisador
                        among={user.among}
                        articles={user.articles}
                        book={user.book}
                        book_chapters={user.book_chapters}
                        id={user.id}
                        name={user.name}
                        university={user.university}
                        lattes_id={user.lattes_id}
                        area={user.area}
                        abstract={user.abstract}
                        lattes_10_id={user.lattes_10_id}
                        city={user.city}
                        orcid={user.orcid}
                        image={user.image}
                        graduation={user.graduation}
                        patent={user.patent}
                        software={user.software}
                        brand={user.brand}
                        lattes_update={user.lattes_update}
                      />
                    </div>
                  </div>
                ))}
                {currentResults.length === 0 && <div className="flex items-center w-full">Não foi encontrado nenhum pesquisador</div>}
              </div>
            )}
          </div>


        </div>

        {valoresSelecionadosExport || valorDigitadoPesquisaDireta ? (
          <div className="w-full gap-1 flex p-6 border-[1px] border-gray-300 rounded-md mb-9">
            <p className="text-gray-400">Foram encontrados <strong className="font-bold text-blue-400">{totalPesquisadores}</strong> pesquisadores para <strong className="font-bold text-blue-400">{valorDigitadoPesquisaDireta.replace(/;/g, ' ')}{decodeURIComponent(valoresSelecionadosExport.replace(/;/g, ' ou ')).split('%20').join(' ')}</strong></p>


            {botaoPesquisadoresClicado ? (
              null
            ) : (
              <div>
                <p className="text-gray-400">
                  {botaoResumoClicado ? "em resumos" : (botaoAreasClicado ? "em áreas" : botaoPatentesClicado ? "em patentes" : "em artigos")}
                </p>
              </div>
            )}

          </div>
        ) : (
          <head></head>
        )}

        <div className="w-full justify-end flex mb-6">
          <p className="text-gray-400 font-bold">Página {currentPage} de {totalPages} </p>
        </div>

        <div className="mb-9 flex gap-4 w-full justify-center">
          <button
            className="flex items-center gap-4 bg-blue-400 text-white rounded-xl px-6 py-2 justify-center hover:bg-blue-500 mb-6 font-medium transition"
            onClick={() => {
              setCurrentPage(currentPage - 1);
              if (document) {
                document.getElementById('contentPesquisador')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            style={{
              backgroundColor: currentPage === 1 ? '#ccc' : '#173DFF',
              opacity: currentPage === 1 ? '0.5' : '1',
            }}
            disabled={currentPage === 1}
          >
            <CaretCircleLeft size={16} className="text-white" />Anterior
          </button>

          <button
            className="flex items-center gap-4 bg-blue-400 text-white rounded-xl px-6 py-2 justify-center hover:bg-blue-500 mb-6 font-medium transition"
            onClick={() => {
              setCurrentPage(currentPage + 1);
              if (document) {
                document.getElementById('contentPesquisador')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            style={{
              backgroundColor: indexOfLastResult >= researcher.length ? '#ccc' : '#173DFF',
              opacity: indexOfLastResult >= researcher.length ? '0.5' : '1',
            }}
            disabled={indexOfLastResult >= researcher.length}
          >
            Próximo<CaretCircleRight size={16} className="text-white" />
          </button>
        </div>

        <div className="mb-9">

          <button onClick={handleDownloadJson} className="flex items-center gap-4 bg-blue-400 text-white rounded-full px-6 py-2 ml-auto justify-center hover:bg-blue-500 mb-6 font-medium transition"><FileCsv size={16} className="text-white" />Download CSV</button>

        </div>
      </div>


    </div>
  )
}