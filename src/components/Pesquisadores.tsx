import { Pesquisador } from "./Pesquisador"
import { useEffect, useState, useContext, useRef } from "react";
import { UserContext } from '../contexts/context'
import { Link } from "react-router-dom";
import { ArrowSquareOut, CaretCircleLeft, CaretCircleRight, CaretDown, FileArrowDown, FileCsv, GitBranch, ListNumbers, MapPin, MapTrifold, Plus, Rows, SquaresFour, Target, UserList, X } from "phosphor-react";
import Carregando from "./Carregando";

import Cookies from "js-cookie";

import { useLocation } from 'react-router-dom';
import { PopUp } from "./PopUp";

import municipios from './municipios.json';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Tooltip } from 'react-leaflet';
import unorm from 'unorm';
import "leaflet/dist/leaflet.css"



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

type CityData = {
  nome: string;
  latitude: number;
  longitude: number;
  pesquisadores: number;
  professores: string[];
  lattes_10_id: string,
};



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
  const { botaoLivrosCapitulosClicado, setBotaoLivrosCapitulosClicado } = useContext(UserContext);
    const { botaoEventosClicado, setBotaoEventosClicado } = useContext(UserContext);

  const [researcher, setResearcher] = useState<Research[]>([]); // Define o estado vazio no início


  let urlTermPesquisadores = ``;


  // BTN MOSTRAR RESULTADOS 
  const [currentPage, setCurrentPage] = useState(1);


  //dropdown


  // habilitar/ desabilitar div
  const [isVisible, setIsVisible] = useState(true);
  const [isVisibleMap, setIsVisibleMap] = useState(true);

  //TOTAL DE PESQUISADORES
  const quantidadeTotalDePesquisadores = researcher.length;
  setTotalPesquisadores(quantidadeTotalDePesquisadores.toString())



  const { intituicoesSelecionadasCheckbox, setIntituicoesSelecionadasCheckbox } = useContext(UserContext)
  const { idGraduateProgram, setIdGraduateProgram } = useContext(UserContext)
  //fetch

  if (botaoPesquisadoresClicado) {
    urlTermPesquisadores = `${urlGeral}/researcherName?name=${valoresSelecionadosExport}${valorDigitadoPesquisaDireta}`;
  }


  if (botaoPatentesClicado) {
    urlTermPesquisadores = `${urlGeral}/researcherPatent?term=${valoresSelecionadosExport}${valorDigitadoPesquisaDireta}&graduate_program_id=${idGraduateProgram}&university=${intituicoesSelecionadasCheckbox}`;
  }


  if (botaoTermosClicado) {
    urlTermPesquisadores = `${urlGeral}researcher?terms=${valoresSelecionadosExport}${valorDigitadoPesquisaDireta}&university=${intituicoesSelecionadasCheckbox}&type=ARTICLE&graduate_program_id=${idGraduateProgram}`
  }


  if (botaoResumoClicado) {
    urlTermPesquisadores = `${urlGeral}researcher?terms=${valoresSelecionadosExport}${valorDigitadoPesquisaDireta}&university=${intituicoesSelecionadasCheckbox}&type=ABSTRACT&graduate_program_id=${idGraduateProgram}`
  }

  

  if (botaoEventosClicado) {
    urlTermPesquisadores = `${urlGeral}researcherParticipationEvent?term=${valoresSelecionadosExport}${valorDigitadoPesquisaDireta}&university=${intituicoesSelecionadasCheckbox}`
  }



  if (botaoLivrosCapitulosClicado) {
    urlTermPesquisadores = `${urlGeral}researcherBook?term=${valoresSelecionadosExport}${valorDigitadoPesquisaDireta}&university=${intituicoesSelecionadasCheckbox}&type=BOOK`
  }


  if (botaoAreasClicado) {
    urlTermPesquisadores = `${urlGeral}/researcherArea_specialty?area_specialty=${valoresSelecionadosExport}${valorDigitadoPesquisaDireta}&university=${intituicoesSelecionadasCheckbox}&graduate_program_id=${idGraduateProgram}`;
  }

 
  console.log('urlTermPesquisadores', urlTermPesquisadores)


console.log(urlTermPesquisadores)
 console.log('intituicoesSelecionadasCheckbox',intituicoesSelecionadasCheckbox)

  const location = useLocation();

  useEffect(() => {
    // Redefinir a variável sempre que a localização (página) mudar
    setResearcher([]);
  }, [location]);

  //contar cidade 
  const [cityCounts, setCityCounts] = useState<{ [city: string]: number }>({});
  const [jsonData, setJsonData] = useState<any[]>([]);

  const [cityData, setCityData] = useState<CityData[]>([]);

  const defaultLatitude = Number(-13.29);
  const defaultLongitude =  Number(-41.71);
  const [defaultZoom, setDefaultZoom] = useState(5.5);

  const [positionInit, setPositionInit ] = useState({lat: -13.29, lng: -41.71 })
  const mapRef = useRef(null);
  const handleCenterMap = () => {
    setPositionInit({lat: -13.29, lng: -41.71 })
    setDefaultZoom(5.5)

    mapRef.current.flyTo([defaultLatitude, defaultLongitude], defaultZoom, {
      duration: 1, // Animation duration in seconds
      easeLinearity: 0.5, // Animation easing, adjust as needed
    });
  };


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
          setJsonData(data);

          // Contar a quantidade de pesquisadores por cidade
          const counts: { [city: string]: number } = {};
          const cityProfessors: { [city: string]: string[] } = {}; // Armazena os nomes dos professores por cidade
          const cityLattess1Ids: { [city: string]: string } = {};

          const normalizedData = data.map((research: any) => ({
            ...research,
            city: normalizeCityName(research.city),
          }));

          normalizedData.forEach((research: any) => {
            const city = research.city;
            const codigoUf = municipios.find(
              (municipio: any) => normalizeCityName(municipio.nome) === city
            )?.codigo_uf;

            if (codigoUf === 29) {
              counts[city] = (counts[city] || 0) + 1;

              // Adiciona o nome do professor à lista da cidade
              if (!cityProfessors[city]) {
                cityProfessors[city] = [];
              }
              cityProfessors[city].push(research.name);

              // Adiciona o lattess_1_id à lista da cidade
              if (!cityLattess1Ids[city]) {
                cityLattess1Ids[city] = research.lattes_10_id;
              }
            }
          });

          const updatedCityData: CityData[] = [];
          municipios.forEach((municipio: any) => {
            const cityName = normalizeCityName(municipio.nome);
            const pesquisadores = counts[cityName] || 0;

            if (pesquisadores > 0 && municipio.codigo_uf === 29) {
              updatedCityData.push({
                nome: municipio.nome,
                latitude: municipio.latitude,
                longitude: municipio.longitude,
                pesquisadores: pesquisadores,
                professores: cityProfessors[cityName] || [], // Adiciona a lista de professores
                lattes_10_id: cityLattess1Ids[cityName] || '',
              });
            }
          });

          setCityData(updatedCityData);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [urlTermPesquisadores]);

  console.log('cityCounts',cityData);

  const normalizeCityName = (cityName: string) => {
    // Normaliza o nome da cidade (ex: "Ilhéus" -> "Ilheus")
    return cityName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const {filtroAreas, setFiltroAreas} = useContext(UserContext)
  
  
  const resultsPerPage = 12;

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const totalPages = Math.ceil(researcher.length / resultsPerPage);
  let filteredResults;
  const filtroAreasArray = filtroAreas.split(';').map(area => area.trim());;
  
  

  // Verifica se o filtro de áreas não está vazio
  if (filtroAreas.trim() !== '') {
    // Split nas áreas apenas se o filtro não estiver vazio
    
    filteredResults = researcher.filter(user => {
      // Verifica se a área do usuário é uma string não vazia e está presente no array de áreas filtradas
      return typeof user.area === 'string' && user.area.trim() !== '' && filtroAreasArray.includes(user.area.trim());
    });
    
  } else {
    // Se filtroAreas estiver vazio, retorna todos os pesquisadores
    filteredResults = researcher;
  }

  console.log('filteredResults', filteredResults)


const currentResults = filteredResults.slice(indexOfFirstResult, indexOfLastResult);




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
 

localStorage.setItem('pesquisadoresSelecionadosGroupBarema', JSON.stringify(pesquisadoresSelecionadosGroupBarema));
 


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
      link.download = `pesquisadores_${valoresSelecionadosExport}${valorDigitadoPesquisaDireta}.csv`;
      link.href = url;
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  const { valoresSelecionadosPopUp, setValoresSelecionadosPopUp } = useContext(UserContext)
  const { idVersao, setIdVersao } = useContext(UserContext);

  // Função para exibir o PopUp


  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  // outras variáveis de estado necessárias

  const { EstadoFiltro, setEstadoFiltro } = useContext(UserContext);
  // Outros códigos do componente

  // Função para exibir o PopUp
  const [popUpVisibilities, setPopUpVisibilities] = useState([]);

  const [popUpVisibilitiesMap, setPopUpVisibilitiesMap] = useState([]);

  const handleOpenPopUp = (index: any) => {
    const newVisibilities = [...popUpVisibilities];
    newVisibilities[index] = true;
    setPopUpVisibilities(newVisibilities);
    setEstadoFiltro(false);
    setIsPopUpVisible(true);
  };

  const handleOpenPopUpMap = (index: any) => {
    const newVisibilities = [...popUpVisibilitiesMap];
    newVisibilities[index] = true;
    setPopUpVisibilitiesMap(newVisibilities);
    setEstadoFiltro(false);
    setIsPopUpVisible(true);
  };
  
  const handleClosePopUp = (index: any) => {
    const newVisibilities = [...popUpVisibilities];
    newVisibilities[index] = false;
    setPopUpVisibilities(newVisibilities);
    setEstadoFiltro(false);
    setIsPopUpVisible(false);
    setValoresSelecionadosPopUp(valoresSelecionadosExport);
  };

  const handleClosePopUpMap = (index: any) => {
    const newVisibilities = [...popUpVisibilitiesMap];
    newVisibilities[index] = false;
    setPopUpVisibilitiesMap(newVisibilities);
    setEstadoFiltro(false);
    setIsPopUpVisible(false);
    setValoresSelecionadosPopUp(valoresSelecionadosExport);
  };
  


  let linkTo = `/researcher/`;

  if (botaoAreasClicado && valoresSelecionadosExport != "") {
    linkTo = `/researcher/${idVersao}//${valoresSelecionadosExport}/areas`;
  } else if (botaoTermosClicado && valoresSelecionadosExport != "") {
    linkTo = `/researcher/${idVersao}//${valoresSelecionadosExport}/terms`;
  } else if (botaoResumoClicado && valoresSelecionadosExport != "") {
    linkTo = `/researcher/${idVersao}//${valoresSelecionadosExport}/abstract`;
  } else {
    // Define um valor padrão caso nenhuma variável corresponda
    linkTo = `/researcher/${idVersao}/`;
  }



  //mapaaa

  const [popUpVisibleMap, setPopUpVisibleMap] = useState({});

  let id_pesquisador = ""
  const handleBtnCsv = () => {

    try {
    let urlPublicacoesPorPesquisador = `${urlGeral}bibliographic_production_researcher?terms=${valoresSelecionadosPopUp}&researcher_id=${id_pesquisador}&type=ARTICLE&qualis=&year=1900`;



    const [jsonData, setJsonData] = useState<any[]>([]);

  
    
      const fetchData = async () => {
        try {
          const response = await fetch(urlPublicacoesPorPesquisador, {
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
          
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchData();
   
  
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
  
  
        const csvData = convertJsonToCsv(jsonData);
        const blob = new Blob([csvData], { type: 'text/csv;charset=windows-1252;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${id_pesquisador}.csv`;
        link.href = url;
        link.click();

      } catch (error) {
        console.error('Error:', error);
      }
    
    
   console.log(`id_pesquisador`,id_pesquisador)

  };
  

  const [mapFocused, setMapFocused] = useState(false);

  return (
    <div className="flex flex-col m-[0 auto] min-w-full  flex justify-center items-center">

      <div className="   m-[0 auto] w-full ">


        {botaoPesquisadoresClicado || botaoAreasClicado || botaoResumoClicado  ? (
          <div></div>
        ) : (
          <div className="flex gap-4 w-full pb-8 justify-between items-center min-w-full">
            <div className="flex gap-4">
              <ListNumbers size={24} className="text-gray-400" />
              <p className="text-gray-400">Pesquisadores mais relevantes por ordem de ocorrências</p>
            </div>

            <div onClick={() => setIsVisible(!isVisible)} className="cursor-pointer rounded-xl hover:bg-gray-100 h-[38px] w-[38px] transition-all flex items-center justify-center">
              <CaretDown size={24} className={isVisible ? "rotate-180 transition-all text-gray-400" : "text-gray-400 transition-all"} />
            </div>

          </div>
        )}



        {botaoPesquisadoresClicado || botaoAreasClicado || botaoResumoClicado  ? (
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
                    {filteredResults
                      .slice(0, 10)
                      .sort((a, b) => b.among - a.among)
                      .map((user, index, arr) => {
                        const maxFontSize = 200;
                        const minFontSize = 100;
                         id_pesquisador = user.id;
                        const distinctAmongValues = [...new Set(arr.map(user => user.among))];
                        const distinctAmongCount = distinctAmongValues.length;
                        const fontSize =
                          maxFontSize -
                          ((maxFontSize - minFontSize) / (distinctAmongCount - 1)) *
                          distinctAmongValues.indexOf(user.among);

                          
                        return (
                          <div>
                            <li key={user.id} className="list-none list-item w-min">
                            <div
                             onClick={() => handleOpenPopUp(index)}
                              className="inline-flex whitespace-nowrap cursor-pointer"
                            >
                              <h3
                                className="items-center p-3 px-6 flex min-h-[20px] gap-4 font-bold rounded-2xl text-blue-400 bg-white hover:shadow-md transition border-[1px] border-gray-300 border-solid"
                                style={{ fontSize: `${fontSize}%` }}
                              >
                                {user.name}
                                <div className="border-[1px] bg-blue-400 border-blue-400 py-2 flex px-3 text-white rounded-lg text-[10px] font-bold">
                                  {user.among} ocorrências
                                </div>
                              </h3>
                            </div>
                          </li>

                          {popUpVisibilities[index] && (
  <div key={user.id} className={"elementPesquisador flex justify-center transition-all fixed top-0 right-0 pb-24 w-full h-screen bg-[#000] z-[99999] bg-opacity-75 pt-20 overflow-y-auto overflow-x-hidden "}>

    <div className="w-screen h-screen absolute top-0 left-0 " onClick={() => handleClosePopUp(index)} ></div>
    <PopUp
      isPopUpVisible={isPopUpVisible}
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

    <div className=" pt-20 flex flex-col fixed items-center h-screen right-0 top-0 w-32 z-[9999999]">

      <div className="mb-6 flex flex-col justify-center items-center">
        <div onClick={() => handleClosePopUp(index)} className="mb-2 h-12 w-12 rounded-2xl bg-white items-center justify-center flex hover:bg-gray-100 cursor-pointer transition-all">
          <X size={16} className="text-gray-500" />
        </div>
        <p className="text-[12px] text-white">Fechar</p>
      </div>



      <div className="mb-6 flex flex-col justify-center items-center">
        <div onClick={handleBtnCsv} className="mb-2 h-12 w-12 rounded-2xl bg-white items-center justify-center flex hover:bg-gray-100 cursor-pointer transition-all">
          <FileCsv size={16} className="text-gray-500" />
        </div>

        <p className="text-[12px] text-white"> CSV publicações</p>
      </div>

      <div className="mb-6 flex flex-col justify-center items-center">
        <label key={index} className={`mb-2 h-12 w-12 rounded-2xl ${pesquisadoresSelecionadosGroupBarema.includes(user.name) ? 'bg-red-400 hover:bg-red-500 text-white' : 'text-gray-500 bg-white hover:bg-gray-50'} items-center justify-center flex hover:bg-gray-100 cursor-pointer transition-all`}>
        {pesquisadoresSelecionadosGroupBarema.includes(user.name) ? (
            <X size={16} className="" />
          ) : (
            <Plus size={16} className="" />
          )}

<input
            type="checkbox"
            className="absolute hidden"
            name={user.name}
            checked={itensSelecionados.includes(user.name)}
            onChange={() => handleCheckboxChange(user)}
          />
        </label>

        <p className="text-[12px] text-white"> {pesquisadoresSelecionadosGroupBarema.includes(user.name) ? (`Remover`): (`Adicionar`)}</p>
      </div>

      <div className="mb-6 flex flex-col justify-center items-center">
        <Link to={linkTo} target="_blank" className="mb-2 h-12 w-12 rounded-2xl bg-blue-400 items-center justify-center flex hover:bg-blue-500 cursor-pointer transition-all">
          <ArrowSquareOut size={16} className="text-white" />
        </Link>

        <p className="text-[12px] text-white"> Mais info</p>
      </div>

      
    </div>
  </div>
)}
                          </div>
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
              <MapTrifold size={24} className="text-gray-400" />
              <p className="text-gray-400">Pesquisadores por cidade</p>
            </div>

            <div className="flex gap-4">

            <div onClick={handleCenterMap} className=" cursor-pointer rounded-xl hover:bg-gray-100 h-[38px] w-[38px] transition-all flex items-center justify-center">
                            <Target size={24} className="text-gray-400 transition-all" />
                          </div>

                          <div className="bg-gray-300 h-[36px] w-[1px]"></div>

            <div onClick={() => setIsVisibleMap(!isVisibleMap)} className="cursor-pointer rounded-xl hover:bg-gray-100 h-[38px] w-[38px] transition-all flex items-center justify-center">
              <CaretDown size={24} className={isVisibleMap ? "rotate-180 transition-all text-gray-400" : "text-gray-400 transition-all"} />
            </div>
            </div>

          </div>


{isVisibleMap ? (
  <div>
  {isLoading ? (
    <div className="flex items-center justify-center w-full py-10">
    <Carregando />
  </div>
  ) : (
    <div onClick={() => setMapFocused(true)} className="h-[500px] rounded-2xl mb-8">
      <MapContainer 
      ref={mapRef} 
      center={positionInit} 
      style={{ fontFamily: 'Ubuntu, sans-serif' }} 
      zoom={defaultZoom} 
      scrollWheelZoom={false}
      
     
      
      className="w-full h-full rounded-2xl">
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />

  {cityData.map((city) => (
    <CircleMarker
      center={[city.latitude, city.longitude]}
      key={city.nome}
      radius={Math.sqrt(city.pesquisadores) * 4}
      fillColor="#173DFF"
      fillOpacity={0.5}
      color="blue"
      style={`outline: "none"`}
    >
      
      <Tooltip>{city.pesquisadores}</Tooltip>
      <text x="0" y="0" dy=".3em" style={{ fontSize: '10px', textAnchor: 'middle', fill: 'white' }}>{city.pesquisadores}</text>

      <Popup >
        <div className="p-1 pb-4">
        <div className="text-base text-medium flex gap-2 items-center"><MapPin size={16} className="text-gray-500" />{city.nome}</div>
        <div className="flex flex-col max-h-[250px] overflow-y-auto elementBarra">
        {researcher.map((user, index) => {

const normalizedUserCity = unorm.nfd(user.city.toUpperCase()).replace(/[\u0300-\u036f]/g, "");
const normalizedCityNome = unorm.nfd(city.nome.toUpperCase()).replace(/[\u0300-\u036f]/g, "");
          if (normalizedUserCity === normalizedCityNome) {
            return (
              <div className="">
                <div onClick={() => handleOpenPopUpMap(index)} className="hover:bg-gray-50 transition-all  p-2 cursor-pointer border w-full flex gap-4 items-center border-gray-300 rounded-md mt-4" key={user.name}>
                 <div className={`whitespace-nowrap  bg-cover bg-center bg-no-repeat h-6 w-6 bg-white rounded-md  relative `} style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${user.lattes_10_id}) ` }}>
                  </div>
                <div className="flex-1 m-0">{user.name}</div>
              </div>

 
              </div>
            );
          }
          return null; // Add this to handle cases where the condition is not met
        })}
        </div>
        </div>
      </Popup>
    </CircleMarker>
  ))}
</MapContainer>

    </div>
  )}
</div>
):(``)}

{researcher.map((user, index) => {
       
            return (
              <div>
             

              {popUpVisibilitiesMap[index] && (
  <div key={user.id} className={"elementPesquisador flex justify-center transition-all fixed top-0 right-0 pb-24 w-full h-screen bg-[#000] z-[999999] bg-opacity-75 pt-20 overflow-y-auto overflow-x-hidden "}>

    <div className="w-screen h-screen fixed top-0 left-0 " onClick={() => handleClosePopUp(index)} ></div>
    <PopUp
      isPopUpVisible={isPopUpVisible}
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

    <div className=" pt-20 flex flex-col fixed items-center h-screen right-0 top-0 w-32 z-[9999999]">

      <div className="mb-6 flex flex-col justify-center items-center">
        <div onClick={() => handleClosePopUpMap(index)} className="mb-2 h-12 w-12 rounded-2xl bg-white items-center justify-center flex hover:bg-gray-100 cursor-pointer transition-all">
          <X size={16} className="text-gray-500" />
        </div>
        <p className="text-[12px] text-white">Fechar</p>
      </div>



      <div className="mb-6 flex flex-col justify-center items-center">
        <div onClick={handleBtnCsv} className="mb-2 h-12 w-12 rounded-2xl bg-white items-center justify-center flex hover:bg-gray-100 cursor-pointer transition-all">
          <FileCsv size={16} className="text-gray-500" />
        </div>

        <p className="text-[12px] text-white"> CSV publicações</p>
      </div>

      <div className="mb-6 flex flex-col justify-center items-center">
        <label key={index} className={`mb-2 h-12 w-12 rounded-2xl ${pesquisadoresSelecionadosGroupBarema.includes(user.name) ? 'bg-red-400 hover:bg-red-500 text-white' : 'text-gray-500 bg-white hover:bg-gray-50'} items-center justify-center flex hover:bg-gray-100 cursor-pointer transition-all`}>
        {pesquisadoresSelecionadosGroupBarema.includes(user.name) ? (
            <X size={16} className="" />
          ) : (
            <Plus size={16} className="" />
          )}

<input
            type="checkbox"
            className="absolute hidden"
            name={user.name}
            checked={itensSelecionados.includes(user.name)}
            onChange={() => handleCheckboxChange(user)}
          />
        </label>

        <p className="text-[12px] text-white"> {pesquisadoresSelecionadosGroupBarema.includes(user.name) ? (`Remover`): (`Adicionar`)}</p>
      </div>

      <div className="mb-6 flex flex-col justify-center items-center">
        <Link to={linkTo} target="_blank" className="mb-2 h-12 w-12 rounded-2xl bg-blue-400 items-center justify-center flex hover:bg-blue-500 cursor-pointer transition-all">
          <ArrowSquareOut size={16} className="text-white" />
        </Link>

        <p className="text-[12px] text-white"> Mais info</p>
      </div>

      
    </div>
  </div>
)}
              </div>
            );
          
          return null; // Add this to handle cases where the condition is not met
        })}





        <div className="flex gap-4 w-full pb-8 justify-between items-center min-w-full">
          <div className="flex gap-4">
            <UserList size={24} className="text-gray-400" />
            <p className="text-gray-400">Pesquisadores por detalhamento</p>
          </div>

          <div className="flex gap-4">
            <div onClick={toggleButtonOn} className={`cursor-pointer rounded-xl hover:bg-gray-100 h-[38px] w-[38px] transition-all flex items-center justify-center ${isOn ? "bg-transparent" : "bg-gray-300"}`}>
              <SquaresFour size={24} className={'rotate-180 transition-all text-gray-400'} />
            </div>

            <div onClick={toggleButtonOff} className={`cursor-pointer rounded-xl hover:bg-gray-100 h-[38px] w-[38px] transition-all flex items-center justify-center ${isOn ? "bg-gray-300" : "bg-transparent"}`}>
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
          <div className="w-full gap-1 flex p-6 border-[1px] border-gray-300 rounded-2xl mb-9">
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

          <button onClick={handleDownloadJson} className="flex items-center gap-4 bg-blue-400 text-white rounded-xl px-6 py-2 ml-auto justify-center hover:bg-blue-500 mb-6 font-medium transition"><FileCsv size={16} className="text-white" />Download CSV</button>

        </div>

        
      </div>


    </div>
  )
}