import { ArrowLeft, CaretCircleLeft, CaretCircleRight, ChartLine, FileCsv, PaperPlaneTilt, Plus, Question, Rows, SquaresFour, Trash, X } from "phosphor-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { Pesquisador } from "./Pesquisador"
import { UserContext } from '../contexts/context'

import Cookies from "js-cookie";
import { Logo } from "./Logo";

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
  abstract: string
  city: string,
  orcid: string,
  image: string,
  graduation: string,
  patent: string,
  software: string,
  brand: string,
  lattes_update: Date,
}

export function PesquisadoresGroup() {

  const [researcher, setResearcher] = useState<Research[]>([]); // Define o estado vazio no início
  const [isLoading, setIsLoading] = useState(false);

  const handleClearCookie = () => {
    Cookies.remove("itensSelecionados");
    setResearcher([]);
    console.log("LIMPADO")
  };

  // BTN MOSTRAR RESULTADOS 
  // BTN MOSTRAR RESULTADOS 
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 12;
  const totalPages = Math.ceil(researcher.length / resultsPerPage);

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;

  const currentResults = researcher.slice(indexOfFirstResult, indexOfLastResult);

  const { botaoPesquisadoresClicado, setBotaoPesquisadoresClicado } = useContext(UserContext);
  const { urlGeral, setUrlGeral } = useContext(UserContext);
  const { pesquisadoresSelecionadosGroupBarema, setPesquisadoresSelecionadosGroupBarema } = useContext(UserContext);

  const valorCookie = Cookies.get("itensSelecionadosPesquisador");
  const [itensSelecionadosPesquisador, setItensSelecionadosPesquisador] = useState(valorCookie || "");
  

  let urlTermPesquisadores = `${urlGeral}/researcherName?name=${pesquisadoresSelecionadosGroupBarema}`

  if (botaoPesquisadoresClicado) {
    urlTermPesquisadores = `${urlGeral}/researcherName?name=${pesquisadoresSelecionadosGroupBarema}`;
  }

  const [itensSelecionados, setItensSelecionados] = useState<string[]>([]);

  useEffect(() => {
    const cookieItensSelecionados = Cookies.get("itensSelecionados");
    if (cookieItensSelecionados) {
      const parsedItensSelecionados = cookieItensSelecionados.split(";");
      setItensSelecionados(parsedItensSelecionados);
    }
  }, []);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    const isChecked = event.target.checked;

    setItensSelecionados((prevSelecionados) => {
      if (isChecked) {
        return [...prevSelecionados, name];
      } else {
        return prevSelecionados.filter((item) => item !== name);
      }
    });
  };

  useEffect(() => {
    Cookies.set("itensSelecionados", itensSelecionados.join(";"), { expires: 7 });
  }, [itensSelecionados]);


 

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
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [urlTermPesquisadores]);

  console.log("Pesquisadore group" + urlTermPesquisadores)

  //block list
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
      link.download = `pesquisadores_selecionados.csv`;
      link.href = url;
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-full items-center justify-center w-full px-6 md:px-16">
      <div className={` w-full mb-4 h-20 justify-center items-center flex top-0`}>
        <div className=" w-full flex items-center h-12 ">
          <Link to={"/"} className="h-[25px] "><Logo /></Link>

          <div className="flex px-6 h-full">
            <Link to={"/discover"} className="flex items-center h-full border-y-[2px] border-[#f9f9f9] hover:border-b-blue-400 text-gray-400 text-sm font-bold transition mr-6 gap-2"><PaperPlaneTilt size={16} className="text-gray-400" />Descobrir</Link>
            <Link to={"/indicators"} className="flex items-center h-full border-y-[2px] border-[#f9f9f9] hover:border-b-blue-400 text-gray-400 text-sm font-bold transition mr-6 gap-2"> <ChartLine size={16} className="text-gray-400" />Indicadores</Link>
            <Link to={""} className="flex items-center h-full border-y-[2px] border-[#f9f9f9] hover:border-b-blue-400 text-gray-400 text-sm font-bold transition mr-6 gap-2"><Question size={16} className="text-gray-400" />Dúvidas frequentes</Link>
          </div>
        </div>
      </div>

      <div className="flex gap-4 w-full pb-8 justify-between items-center min-w-full">
        <div className="flex gap-4 items-center">
          <Link to="/" className="cursor-pointer rounded-full hover:bg-gray-100 h-[38px] w-[38px] transition-all flex items-center justify-center">
            <ArrowLeft size={24} className={" transition-all text-gray-400 "} />
          </Link>
          <p className="text-gray-400">Pesquisadores selecionados para consulta</p>
        </div>


        <div className="flex gap-4">
          <div onClick={handleClearCookie} className="cursor-pointer rounded-full hover:bg-gray-100 h-[38px] w-[38px] transition-all flex items-center justify-center">
            <Trash size={24} className={" transition-all text-gray-400"} />
          </div>

          <div className="bg-gray-300 h-[36px] w-[1px]"></div>

          <div onClick={toggleButtonOn} className={`cursor-pointer rounded-full hover:bg-gray-100 h-[38px] w-[38px] transition-all flex items-center justify-center ${isOn ? "bg-transparent" : "bg-gray-300"}`}>
            <SquaresFour size={24} className={'rotate-180 transition-all text-gray-400'} />
          </div>

          <div onClick={toggleButtonOff} className={`cursor-pointer rounded-full hover:bg-gray-100 h-[38px] w-[38px] transition-all flex items-center justify-center ${isOn ? "bg-gray-300" : "bg-transparent"}`}>
            <Rows size={24} className={'rotate-180 transition-all text-gray-400'} />
          </div>
        </div>
      </div>

      <div className={`mb-9  relative grid  gap-6  m-[0 auto] w-full ${isOn ? "lg:grid-cols-1 2xl:grid-cols-1" : "lg:grid-cols-3 2xl:grid-cols-4"}`}>
        {currentResults.map((user, index) => (
          <div key={user.id} className="group justify-end flex w-full" >

            <label className={`z-[99] absolute m-6 ml-auto hidden group-hover:flex cursor-pointer float-right items-center gap-4 ${itensSelecionados.includes(user.name) ? 'bg-red-400 hover:bg-red-500' : 'bg-blue-400 hover:bg-blue-500'} text-white rounded-full h-[38px] w-[38px] justify-center  font-medium transition`}>
              {itensSelecionados.includes(user.name) ? (
                <X size={16} className="text-white" />
              ) : (
                <Plus size={16} className="text-white" />
              )}
              <input
                type="checkbox"
                className="absolute hidden"
                name={user.name}
                checked={itensSelecionados.includes(user.name)}
                onChange={handleCheckboxChange}
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

      </div>

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
            backgroundColor: indexOfLastResult >= researcher.length ? '#ccc' : '#005399',
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
  )
}