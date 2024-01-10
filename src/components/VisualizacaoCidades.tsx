import { Header } from "./Header";
import bg_cidades from '../assets/bg_cities.png';
import bg_cidades2 from '../assets/bg_cities2.png';
import { useContext, useEffect, useState } from "react";
import { Pesquisador } from "./Pesquisador";
import { ArrowSquareOut, Buildings, CaretCircleLeft, CaretCircleRight, CaretDown, CaretUp, Eye, EyeSlash, FileCsv, MapPin, Plus, Trash, UserList, X } from "phosphor-react";
import { UserContext } from "../contexts/context";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import Carregando from "./Carregando";
import brazilStatesGeoJSON from './ba_state.json'; 
import unorm from 'unorm';

import Highcharts from 'highcharts';
import Highmaps from 'highcharts/highmaps';
import HighchartsAccessibility from 'highcharts/modules/accessibility';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsOfflineExporting from 'highcharts/modules/offline-exporting';
import { Link } from "react-router-dom";

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
    institution: string,
    researcher_name: string
  }

  type Cities = {
    id: string
    name: string
  }

  

export function VisualizacaoCidades() {
    const [researcher, setResearcher] = useState<Research[]>([]);
    const [researcherCity, setResearcherCity] = useState<Research[]>([]);
    const [cities, setCities] = useState<Cities[]>([]);
    const { urlGeral, setUrlGeral } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    const [listaCidades, setListaCidades] = useState(false);
    const [mapaEstado, setMapaEstado] = useState(false);
    const { estadoSelecionado, setEstadoSelecionado } = useContext(UserContext);
    const { cidadeSelecionada, setCidadeSelecionada } = useContext(UserContext);

    let urlTermPesquisadores = `${urlGeral}researcher?terms=educacao&university=&type=ARTICLE&graduate_program_id=`;

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
      }, [urlTermPesquisadores]);

      const randomIndex = Math.floor(Math.random() * researcher.length);

      const randomResearcher = researcher[randomIndex];

      const [currentPage, setCurrentPage] = useState(1);

      let urlTermPesquisadoresCity = `${urlGeral}ResearcherData/ByCity`;

     if(cidadeSelecionada !== "") {
      urlTermPesquisadoresCity = `${urlGeral}ResearcherData/ByCity?city=${cidadeSelecionada}`;
     }

    useEffect(() => {
        const fetchData = async () => {
          setIsLoading(true);
          try {
            const response = await fetch(urlTermPesquisadoresCity, {
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
              setResearcherCity(data)
              setCurrentPage(1);
            }
          } catch (err) {
            console.log(err);
          } finally {
            setIsLoading(false);
          }
        };
        fetchData();
      }, [urlTermPesquisadoresCity]);

      let urlCities = `${urlGeral}ResearcherData/City`;

      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(urlCities, {
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
      
            setCities(data);
          } catch (err) {
            console.log(err);
          }
        };
      
        fetchData();
      }, [urlCities]);
      
      

      const resultsPerPage = 12;

      const indexOfLastResult = currentPage * resultsPerPage;
      const indexOfFirstResult = indexOfLastResult - resultsPerPage;
      const totalPages = Math.ceil(researcherCity.length / resultsPerPage);


      const currentResults = researcherCity.slice(indexOfFirstResult, indexOfLastResult);

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


localStorage.setItem('pesquisadoresSelecionadosGroupBarema', JSON.stringify(pesquisadoresSelecionadosGroupBarema));
 

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
    const csvData = convertJsonToCsv(researcherCity);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `pesquisadores_${cidadeSelecionada}.csv`;
    link.href = url;
    link.click();
  } catch (error) {
    console.error(error);
  }
};

const { totalPesquisadores, setTotalPesquisadores } = useContext(UserContext);
  //TOTAL DE PESQUISADORES
  const quantidadeTotalDePesquisadores = researcherCity.length;
  setTotalPesquisadores(quantidadeTotalDePesquisadores.toString())



  // mapaaaaaaaaaaaaaaaaaaaaa

    // UseEffect para inicializar o gráfico quando o componente for montado
    useEffect(() => {
      // Assumindo que você já tenha os dados dos programas de pós-graduação em graduatePrograms
  
  // Crie um objeto para armazenar a contagem de programas por estado
  const cityProgramCount: Record<string, number> = {};
    researcherCity.forEach((program) => {
      const city = program.city;
      if (cityProgramCount[city]) {
        cityProgramCount[city] += 1;
      } else {
        cityProgramCount[city] = 1;
      }
    });
  
  // Agora você pode criar o array brazilStateData com base na contagem
  const brazilCityData = Object.entries(cityProgramCount).map(([city, count]) => ({
    name: city.toString(),
    value: parseFloat(String(count)) || 0,
  }));
  
  
      // Inicialize o gráfico
      const chart = Highmaps.mapChart( {
        chart: {
          renderTo: 'containerone',
          map: brazilStatesGeoJSON,
          backgroundColor: 'transparent',
       
          
       
        },
        title: {
          text: '',
        },
        credits: {
          enabled: false,
        },
       
        
     
        legend: {
          enabled: false, // Defina esta propriedade como false para remover a legenda
        },
        colorAxis: {
          tickPixelInterval: 100,
        },
        series: [
          {
            type: 'map',
            data: brazilCityData,
            keys: ['name', 'value'],
            joinBy: 'name',
            
         
            // Habilitar drilldown para estados
            allowPointSelect: false,
            cursor: 'pointer',
         
            point: {
              events: {
                // Lidar com o evento de clique para os estados
                click: function () {
                  const city = (this.options as { name: string })['name'];
  
                  // Implementar lógica de zoom ou drilldown aqui
  
                  if (cityProgramCount[city] === 1) {
                    
                    // Procurar pelo programa de pós-graduação com o estado correspondente e obter o ID
                    const programWithState = researcherCity.find(program => program.city === city);
                    if (programWithState) {
                  
                      const programId = programWithState.id;
                      console.log('aq porra')
                      // Definir o ID do programa selecionado em selectedGraduateProgramId
                   
                    }
                  }
  
                  setEstadoSelecionado(city);
  
                
                 
                  console.log(`Estado clicado: ${city}`);
                  // Dar zoom no estado clicado
                 
                },
              },
  
              
            },
          
          },
        ],
      });
  
  
      // Limpar o gráfico quando o componente for desmontado
      return () => {
        chart.destroy();
      };
    }, [researcherCity]); 

    const handleCidade = (termo: any) => {
      setCidadeSelecionada(termo)
      setListaCidades(false)
 
    };

    return  (
        <div>
         <Header/>

        {mapaEstado ? (``):(
           <div className="absolute right-32 top-[200px] w-[400px] z-[-999] scale-75">
      
           <div  className=" group justify-end flex w-full transition-all" >

<label
  
   className={`z-[99] absolute m-6 ml-auto hidden group-hover:flex cursor-pointer float-right items-center gap-4 bg-blue-400 hover:bg-blue-500 text-white rounded-xl h-[38px] w-[38px] justify-center  font-medium transition`}
 >
   <Plus size={16} className="text-white" />
   <input
     type="checkbox"
     className="absolute hidden"

    
   />
 </label>

             <div className="relative w-full">
             {randomResearcher ? (
 <Pesquisador
   among={randomResearcher.among}
   articles={randomResearcher.articles}
   book={randomResearcher.book}
   book_chapters={randomResearcher.book_chapters}
   id={randomResearcher.id}
   name={randomResearcher.name}
   university={randomResearcher.university}
   lattes_id={randomResearcher.lattes_id}
   area={randomResearcher.area}
   abstract={randomResearcher.abstract}
   lattes_10_id={randomResearcher.lattes_10_id}
   city={randomResearcher.city}
   orcid={randomResearcher.orcid}
   image={randomResearcher.image}
   graduation={randomResearcher.graduation}
   patent={randomResearcher.patent}
   software={randomResearcher.software}
   brand={randomResearcher.brand}
   lattes_update={randomResearcher.lattes_update}
 />
) : (
 ``
)}
             </div>
           </div>
       
  </div>
        )}
         <div style={{ backgroundImage: `${mapaEstado  && cidadeSelecionada == "" ? (`url(${bg_cidades2})`):(`url(${bg_cidades})`)}` }} className={` ${mapaEstado ? (``): (`items-center `)} items-center  justify-center w-full px-16 pt-24 flex flex-col  h-screen bg-cover bg-no-repeat bg-bottom`}>
        <div className={` ${mapaEstado && cidadeSelecionada == "" ? (``): (`items-center `)}   justify-center  w-full flex flex-col`}>
        <h1 className={` ${mapaEstado && cidadeSelecionada == "" ? (`text-4xl max-w-[600px] `): (`text-5xl text-center max-w-[800px]`)} z-[999]  mb-4 font-medium  `}>Pesquise os <strong className="bg-red-400 text-white font-normal">
         dados e pesquisadores
        </strong>{" "}
        com o filtro por cidade
      </h1>
          <p className={`  ${mapaEstado && cidadeSelecionada == "" ? (`max-w-[620px] `): (` text-center max-w-[700px]`)} mb-6 z-[999]   text-lg text-gray-400`}>Veja os dados de produção de energia e comércio associados com a produção dos pesquisadores </p>
       
        <div className="flex gap-4 z-[999] w-fit items-center text-gray-400 ">
          <div>
          <div onClick={() => setListaCidades(!listaCidades)} className='w-fit h-12 border border-gray-300  hover:bg-gray-50 transition-all cursor-pointer rounded-xl flex items-center justify-between bg-white'>
                  
                  <div className='flex w-full px-4 items-center gap-6 justify-between'>
                 <div className='flex items-center gap-4'>
                     <MapPin size={16} className="text-gray-400" />
                     <p className='text-gray-400 text-sm font-medium whitespace-nowrap'>{cidadeSelecionada == "" ? (`Lista de cidades`):(cidadeSelecionada)}</p>
                 </div>
 
                 <div  className={`cursor-pointer  transition-all flex items-center justify-center `}>
                         {listaCidades ? (
                          <CaretUp size={16} className={' text-gray-400'} />
                         ): (
                          <CaretDown size={16} className={' text-gray-400'} />
                         )}
                         </div>
                 </div>
 
                  </div>

                  {(listaCidades && cities.length > 0) && (
                    <div className="mt-4 absolute max-h-[250px]  bg-white flex flex-col  gap-2 z-[999] p-4 border border-gray-300 rounded-xl ">
                    <div className="flex gap-3 flex-col overflow-y-auto elementBarra pr-2">
                    {isLoading? (
                       ``
                      ):(
                       cities.map((termo, index) => (
                         <div onClick={() => handleCidade(termo.name)} className="text-xs gap-4 cursor-pointer h-10 min-h-[40px] font-bold transition-all rounded-xl items-center px-4 hover:bg-gray-50 flex justify-between text-gray-400">
                           <div className="flex items-center gap-3">
                           
                           {termo.name}

                           </div>

                         
                         </div>
                        ))
                      )}
                    </div>
                   </div>
                  )}
          </div>

          {cidadeSelecionada !== "" && (
           <div onClick={() => setCidadeSelecionada("")} className='flex h-12 w-12 justify-center items-center cursor-pointer z-[9]  hover:bg-gray-50  transition-all border border-gray-300 rounded-xl'>
           <div className='flex items-center '>
               <Trash size={16} className="text-gray-400" />
               
           </div>
           </div>
         )}

        <div className={`${cidadeSelecionada == "" ? (`flex`): (`hidden`)} gap-3 items-center`}>
        ou você pode

<div onClick={() => setMapaEstado(!mapaEstado)} className='w-fit h-12 border border-gray-300  hover:bg-gray-50 transition-all cursor-pointer rounded-xl flex items-center justify-between bg-white'>
        
        <div className='flex w-full px-4 items-center gap-6 justify-between'>
       <div className='flex items-center gap-4'>
       <div  className={`cursor-pointer  transition-all flex items-center justify-center `}>
               {mapaEstado ? (
                <EyeSlash size={16} className={' text-gray-400'} />
               ): (
                <Eye size={16} className={' text-gray-400'} />
               )}
               </div>
           <p className='text-gray-400 text-sm font-medium whitespace-nowrap'>{mapaEstado == false ? (`Mostrar mapa`):(`Esconder mapa`)}</p>
       </div>

      
       </div>

        </div>
        </div>
        </div>
        </div>

        <div className="w-full h-screen justify-center max-h-screen overflow-y-hidden  overflow-hidden flex items-center absolute top-0 "><div className={` absolute w-[140%] h-[130%] left-[-20px] ${mapaEstado && cidadeSelecionada == "" ? (`flex`):(`hidden`)}`} id="containerone" /></div>
         
      
         
       {mapaEstado && cidadeSelecionada == "" ? (
         <div className="absolute flex-col right-0 pr-16 items-center justify-start flex">

          {estadoSelecionado !== "" && (
            <div className="bg-white w-[350px] justify-between flex mb-4 border boder-gray-300 rounded-xl backdrop-blur-sm bg-opacity-70 p-6">
            <div className="flex gap-3  items-center text-gray-400">
            <MapPin size={16} className="" /> {estadoSelecionado}
            </div>
            
            <div className="flex gap-3  items-center">
            <div  onClick={() => setCidadeSelecionada(estadoSelecionado)} className={`   z-[9]  top-6 flex cursor-pointer items-center gap-4 bg-blue-400 hover:bg-blue-500 text-white rounded-md h-[32px] w-[32px] justify-center  font-medium transition right-20  `}>
               <Eye size={16} className="text-white" />
               </div>
            
            <div  onClick={() => setEstadoSelecionado('')}  className={`   z-[9]  top-6 flex cursor-pointer items-center gap-4 bg-blue-400 hover:bg-blue-500 text-white rounded-md h-[32px] w-[32px] justify-center  font-medium transition right-20  `}>
               <X size={16} className="text-white" />
               </div>
            </div>
                      </div>
          )}

         <div className="flex flex-col gap-3 max-h-[470px] overflow-y-auto w-auto elementBarra overflow-x-hidden ">
           {researcherCity.map(props => {
            if (unorm.nfkd(props.city).replace(/[^\w\s]/gi, '').toLowerCase() === unorm.nfkd(estadoSelecionado).replace(/[^\w\s]/gi, '').toLowerCase()) {
                 return (
                   <div key={props.id}  className="bg-white w-[350px] group  flex hover:shadow-md transition-all  border boder-gray-300 rounded-xl backdrop-blur-sm bg-opacity-70   ">
   
   
   
   
   <div className="p-6 h-full w-full justify-between  flex-1 flex flex-col">
   <div className={`flex  flex-col w-full relative `}>
   <h4 className={`text-base text-gray-500 mb-2  font-bold `}>{props.researcher_name}</h4>
   <div className="flex items-center gap-2 overflow-hidden truncate mb-2">
   {props.image == "None" ? (
    <Buildings size={16} className="text-gray-500" />
   ) : (
    <img src={props.image} alt="" className="h-6" />
   
   )}
   <p className="text-[12px]  w-full whitespace-normal text-gray-500 truncate">{props.institution}</p>
   </div>
   </div>
   
   <div className="flex justify-between items-center gap-3">
   <div></div>
   
   
   
   <div className="flex gap-3">
   <Link to={`/researcher/4/${props.id}`} target="_blank" className={`   z-[9]  top-6 hidden group-hover:flex cursor-pointer items-center gap-4 bg-blue-400 hover:bg-blue-500 text-white rounded-md h-[32px] w-[32px] justify-center  font-medium transition right-20  `}>
   <ArrowSquareOut size={16} className="text-white" />
   </Link>
   
   <label className={` ${pesquisadoresSelecionadosGroupBarema.includes(props.name) ? 'bg-red-400 hover:bg-red-500' : 'bg-blue-400 hover:bg-blue-500'}  z-[9]  top-6 hidden group-hover:flex cursor-pointer items-center gap-4 bg-blue-400 hover:bg-blue-500 text-white rounded-md h-[32px] w-[32px] justify-center  font-medium transition right-20 `}>
   {pesquisadoresSelecionadosGroupBarema.includes(props.name) ? (
   <X size={16} className="text-white" />
   ) : (
   <Plus size={16} className="text-white" />
   )}
   
   <input
   type="checkbox"
   className="absolute hidden"
   name={props.name}
   checked={itensSelecionados.includes(props.name)}
   onChange={() => handleCheckboxChange(props)}
   />
   </label>
   </div>
   
   <div className="border-[1px] bg-white h-8 border-gray-300 py-2 flex group-hover:hidden px-4 text-gray-400 rounded-md text-xs font-medium gap-2 items-center"><MapPin size={12} className="" /> {props.city}</div>
   
   
   </div>
   </div>
   
   { props.area.split(';').slice(0, 1).map((value: any, index:any) => (
   <div
     key={index}
     className={` w-2 rounded-r-lg text-white items-center ${value.includes('CIENCIAS AGRARIAS') ? 'bg-red-400' : value.includes('CIENCIAS EXATAS E DA TERRA') ? 'bg-green-400' : value.includes('CIENCIAS DA SAUDE') ? 'bg-[#20BDBE]' : value.includes('CIENCIAS HUMANAS') ? 'bg-[#F5831F]' : value.includes('CIENCIAS BIOLOGICAS') ? 'bg-[#EB008B]' : value.includes('ENGENHARIAS') ? 'bg-[#FCB712]' : value.includes('CIENCIAS SOCIAIS APLICADAS') ? 'bg-[#009245]' : value.includes('LINGUISTICA LETRAS E ARTES') ? 'bg-[#A67C52]' : value.includes('OUTROS') ? 'bg-[#1B1464]' : 'bg-gray-400'} `}></div>
 ))}
   
   
   </div>
                 )
                       }
               })}
         </div>
     
         </div>
       ):(
        ``
       )}
         
         
         
         
         
         
         </div>

        {cidadeSelecionada == "" ? (
          ``
        ):(
           <div className="min-h-screen w-full px-16 py-16">

<div className="flex gap-4 items-center w-full">
        <div className="">
        <h1 className="text-left max-w-[350px] min-w-[350px]  font-medium text-3xl ">
           Visão geral de <strong className="bg-red-400 text-white font-medium">{cidadeSelecionada}</strong>
        </h1>
        <p className={`text-sm text-gray-400 mt-2`}>Informações referentes as instituições e pesquisadores da cidade</p>
        </div>

        <div className=" h-24 flex items-center justify-center  gap-4">
        <div className="h-24 w-24 flex items-center  ">
       
        </div>

      <p className="text-sm text-gray-400  flex-1">Porcentagem de pesquisadores das universidades estaduais em relação ao estado</p>
        </div>

        <div className="grid grid-cols-4 gap-4 w-full">

            <div className="flex flex-col w-full items-end">
                <p className="text-gray-400">Total de pesquisadores</p>
                <h3 className="text-6xl font-medium">{totalPesquisadores}</h3>
            </div>

            <div className="flex flex-col w-full items-end">
                <p className="text-gray-400">Total de instituições</p>
                <h3 className="text-6xl font-medium"></h3>
            </div>

            <div className="flex flex-col w-full items-end">
                <p className="text-gray-400">Total de patentes</p>
                <h3 className="text-6xl font-medium"></h3>
            </div>

           
        </div>
        </div>









           <div className="flex gap-4 py-8">
              <UserList size={24} className="text-gray-400" />
              <p className="text-gray-400">Pesquisadores de {cidadeSelecionada}</p>
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
                className={`mb-9 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 m-[0 auto] w-full `}
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

                    <div className="relative w-full ">
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

        <div className="w-full gap-1 flex p-6 border-[1px] border-gray-300 rounded-2xl mb-9">
            <p className="text-gray-400">Foram encontrados <strong className="font-bold text-blue-400">{totalPesquisadores}</strong> pesquisadores em <strong className="font-bold text-blue-400">{cidadeSelecionada}</strong></p>


              <div>
                <p className="text-gray-400">
                
                </p>
              </div>
            

          </div>

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
        )}
        </div>
    )
}