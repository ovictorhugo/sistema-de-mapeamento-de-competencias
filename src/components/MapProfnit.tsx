import React, { useContext, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { UserContext } from "../contexts/context";
import { ArrowCircleUp, ArrowRight, BookOpen, BookmarkSimple, Buildings, Copyright, CursorText, File, Funnel, GraduationCap, IdentificationCard, Lightbulb, ListDashes, MagnifyingGlass, MapPin, Star, TextAlignLeft, Textbox, User, X, YoutubeLogo } from "phosphor-react";
import { Link, useNavigate } from "react-router-dom";
import { Circle } from "./Circle";
import DropdownMultiSelect from "./DropdownMultiSelect";
import { SvgLines } from "./SvgLines";

import logo_1 from '../assets/logo_1.png';
import logo_2 from '../assets/logo_2.png';
import logo_3 from '../assets/logo_3.png';
import logo_4 from '../assets/logo_4.png';
import logo_5 from '../assets/logo_5.png';
import BrasilMap from "./BrasilMap";

interface PalavrasChaves {
  term: string;
  among: number;
}


import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import drilldown from 'highcharts/modules/drilldown'
import HC_wordcloud from 'highcharts/modules/wordcloud';

import { PesquisaGeral } from "./PesquisaGeral";
import SearchInicio from "./SearchInicio";
import { Header } from "./Header";
import Search from "./Search";
import { VisaoPrograma } from "./VisaoPrograma";
import { HomeInicial } from "./HomeInicial";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Pesquisadores } from "./Pesquisadores";
import { Publicacoes } from "./Publicacoes";
import { Instituicoes } from "./Instituicoes";
import { DadosGerais } from "./DadosGerais";
import { LogoIapos } from "./LogoIapos";
import { Logo } from "./Logo";
import { LogoSimcc } from "./LogoSimcc";
import { PesquisadoresTaxinomia } from "./PesquisadoresTaxonomia";
import { Filter } from "./Filter";
import footer from '../assets/footer.png';
import { PopUpWrapper } from "./PopUpWrapper";


interface GraduateProgram {
  area: string;
  code: string;
  graduate_program_id: string;
  modality: string;
  name: string;
  rating: string;
  type: string;
  city: string
  state: string
  instituicao: string
  url_image: string
  region: string
  sigla: string
  latitude: string
  longitude: string
}

interface Props {
  id: string
}

interface ResearcherId {
  lattes_10_id: string
  lattes: string
  name: string
}

interface GraphNode extends GraduateProgram {
  x: number | undefined;
  y: number | undefined;
}

interface GraphLink {
  source: string;
  target: string;
}

interface Graph {
  nodes: GraphNode[];
  links: GraphLink[];
}

interface Post {
  frequency: string
  term: string
  checked: boolean
  area_expertise: string
  area_specialty: string
}

export function MapProfnit(props: Props) {
  const { urlGeral, setUrlGeral } = useContext(UserContext);
  const { estadoSelecionado, setEstadoSelecionado } = useContext(UserContext);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [graduatePrograms, setGraduatePrograms] = useState<GraduateProgram[]>([]);
  const [selectedGraduateProgramId, setSelectedGraduateProgramId] = useState<string | null>(null);
  const [isSimulationRunning, setIsSimulationRunning] = useState<boolean>(true);

  const { idGraduateProgram, setIdGraduateProgram } = useContext(UserContext);

   //btns da página search

   const { botaoPesquisadoresClicado, setBotaoPesquisadoresClicado } = useContext(UserContext);
   const { botaoPatentesClicado, setBotaoPatentesClicado } = useContext(UserContext);
   const { botaoTermosClicado, setBotaoTermosClicado } = useContext(UserContext);
   const { botaoResumoClicado, setBotaoResumoClicado } = useContext(UserContext);
   const { botaoAreasClicado, setBotaoAreasClicado } = useContext(UserContext);
   const { botaoTaxonomiaClicado, setBotaoTaxonomiaClicado } = useContext(UserContext);
   const { botaoLivrosCapitulosClicado, setBotaoLivrosCapitulosClicado } = useContext(UserContext);
   const { botaoEventosClicado, setBotaoEventosClicado } = useContext(UserContext);
   const {loggedIn, setLoggedIn} = useContext(UserContext);
   const { totalPublicacoes, setTotalPublicacoes } = useContext(UserContext);
   const { totalPesquisadores, setTotalPesquisadores } = useContext(UserContext);
   const { totalInstituicoes, setTotalInstituicoes } = useContext(UserContext);
   const handleClickTabs = () => {
    setTotalPesquisadores('')
    setTotalPublicacoes('')
    setTotalInstituicoes('')
  };
  const [selectedTab, setSelectedTab] = useState(0);

   //btn grupo pesquisadores
   const [expanded, setExpanded] = useState(false);
   const history = useNavigate();
   const { valoresSelecionadosExport, setValoresSelecionadosExport } = useContext(UserContext);
   const { valorDigitadoPesquisaDireta, setValorDigitadoPesquisaDireta } = useContext(UserContext);
  
   useEffect(() => {
   if(valoresSelecionadosExport != '' || valorDigitadoPesquisaDireta != "") {
    setSelectedTab(0)
   }

  }, [valoresSelecionadosExport]);

  const { idVersao, setIdVersao } = useContext(UserContext);
  setIdVersao("4")



console.log('idversao',idVersao)
  

  

  function handleClick(name: string) {
    setIdGraduateProgram(name);
    
  }
  const [valueInstPesquisa, setValueInstPesquisa] = useState('')
  function handleClickPesquisa(name: string, id: string) {
    setIdGraduateProgram(id);
    setFilterValue(name)
    setValueInstPesquisa(name)
    
  }

  //
  const [showButton, setShowButton] = useState(false);

  const handleScroll = () => {
    if (window.pageYOffset > 300) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const handleClickt = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  //stick search
  const [isSticky, setIsSticky] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  function handleScrollSearch() {
    const element = ref.current!;
    const { top } = element.getBoundingClientRect();
    if (top <= 0) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  }

  // adiciona um event listener para detectar o scroll da página e chama a função "handleScroll"
  useEffect(() => {
    window.addEventListener('scroll', handleScrollSearch);
    return () => {
      window.removeEventListener('scroll', handleScrollSearch);
    };
  }, []);

  const [chart, setChart] = useState(null);

  const urlGraduateProgram = `${urlGeral}/graduate_program_profnit?id=${props.id}`;

 


  //OUTRA LÓGICAAAA
 

  const toggleButtonOff = () => {
    setIdGraduateProgram("0");
    setEstadoSelecionado("");
  };

  const toggleButtonOffState = () => {
    setEstadoSelecionado("");
  };


  //pesquisa

  const [filterValue, setFilterValue] = useState("");
  const filteredResults = graduatePrograms.filter(props =>
    props.name.toUpperCase().includes(filterValue.toUpperCase()) ||
    props.instituicao.toUpperCase().includes(filterValue.toUpperCase())
  );

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleFilterChange(filterValue)
    }
  };


   //
   const [isOpen, setIsOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);
   const [selectedOptions, setSelectedOptions] = useState<string[]>([]);



   
  //idGraduateProgram
  function handleFilterChange(newValue: string) {
    setFilterValue(newValue);
  
    // Inicialize idGraduateProgram como 0 ou outro valor padrão
    let matchedId = '0';
  
    // Verificar se filterValue corresponde a props.name ou props.instituicao em qualquer programa
    graduatePrograms.forEach((program) => {
      if (
        program.name.toUpperCase().includes(newValue.toUpperCase()) ||
        program.instituicao.toUpperCase().includes(newValue.toUpperCase())
      ) {
        matchedId = String(program.graduate_program_id); // Converte o id para string
      
      }
    });
  
    // Definir idGraduateProgram com o id correspondente (ou '0' se não houver correspondência)
    setIdGraduateProgram(matchedId);
  }


  //imagens pesquisadores do iapos
  const urlResearcherImage = urlGeral + 'researcher_image'
  const [ResearcherImage, setResearcherImage] = useState<ResearcherId[]>([])

  useEffect(() => {

    fetch(urlResearcherImage, {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '3600',
        'Content-Type': 'text/plain'

      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const newData = data.map((post: Post) => ({
          ...post,
          term: post.term
        }));
       
        setResearcherImage(newData);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [urlResearcherImage]);


    // palavras chaves

   

    const [words, setWords] = useState<PalavrasChaves[]>([]);

    const [isLoading, setIsLoading] = useState(false);
  
    let urlPalavrasChaves = `${urlGeral}lists_word_researcher?graduate_program_id=&researcher_id=`
    let clickedWord =""
    const handleWordClick = (event: any) => {
      if (event.point && event.point.name) {
         clickedWord = event.point.name;
        setValoresSelecionadosExport(clickedWord);
        setValorDigitadoPesquisaDireta(clickedWord)
        setBotaoTermosClicado(true);
      }
    };

  
  
    useEffect(() => {
      console.log(`Palavra clicada: `, valoresSelecionadosExport);
      // Adicione qualquer lógica adicional que você deseja executar quando a palavra é clicada
    }, [valoresSelecionadosExport]);


    
  
    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(urlPalavrasChaves, {
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
            setWords(data);
          }
        } catch (err) {
          console.log(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }, [urlPalavrasChaves]);
  
    const options = {
      chart: {
        backgroundColor: 'transparent',
        height: '300px',
        display: 'flex',
        position: 'relative'
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: false, // Remove a opção de menu para baixar o gráfico
      },
      series: [
        {
          type: 'wordcloud',
          data: words.map((word) => ({
            name: word.term,
            weight: word.among,
          })),
          events: {
            click: handleWordClick, // Adiciona o manipulador de eventos para clique em palavras
          },
  
          style: {
            fontFamily: 'Ubuntu, sans-serif',
          },
        },
      ],
      title: {
        text: '',
      },

      
      plotOptions: {
        wordcloud: {
          borderRadius: 3,
          borderWidth: "1px",
          borderColor: 'blue',
     
          colors: ['#041962', '#0392FA'],
  
        },
      },
    };

    const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    // ...
    if (words) {
      const categories = words.map((d) => d.term);
      const amongValues = words.map((d) => Number(d.among));
      const sumAmongValues = amongValues.reduce((acc, cur) => acc + cur, 0);

      setChartOptions({
        chart: {
          type: "area",
          backgroundColor: "transparent",
          fontFamily: "Ubuntu, sans-serif",
          height: '590px', // Define a altura como 100% da tela
          position: "relative",
          border: 'none'
        },
        exporting: {
          enabled: false, // Remove a opção de menu para baixar o gráfico
        },
        title: {
          text: "",
        },
        legend: {
          enabled: false, // Defina esta propriedade como false para remover a legenda
        },
        xAxis: {
          categories,
          labels: {
            enabled: false, // Remove as legendas do eixo x
          },
          lineColor: 'transparent', // Torna a linha do eixo x transparente
  lineWidth: 0,
  gridLineWidth: 0
        },
        yAxis: {
          labels: {
            enabled: false, // Remove as legendas do eixo y
          },
          gridLineWidth: 0, // Remove as linhas de referência do eixo y
        },
        series: [
          {
            data: amongValues,
          },
        ],

        credits: {
          enabled: false,
        },
        plotOptions: {
          area: {
            color: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1,
              },
              stops: [
                [0, "#7D96FF"],   // Cor inicial (transparente)
                [1, "#ffffff"],       // Cor final (#005399)
              ],
            },
            lineWidth: 0,
          },
        },
        animation: {
          duration: 100000, // Duração da animação em milissegundos
        },
      });
    }
  }, [words]);
  
//

    //Se o botão Pesquisadores for clicado
    const handleClickPesquisadores = () => {
      setBotaoPesquisadoresClicado(true);
      setBotaoPatentesClicado(false)
      setBotaoTermosClicado(false);
      setBotaoAreasClicado(false);
      setBotaoResumoClicado(false)
      //Apagar checkbox ao mudar de aba - termos


      setSelectedTab(3);
    };

    //patentes
    const handleClickPatentes = () => {
      setBotaoPesquisadoresClicado(false);
      setBotaoPatentesClicado(true)
      setBotaoTermosClicado(false);
      setBotaoAreasClicado(false);
      setBotaoResumoClicado(false)
      //Apagar checkbox ao mudar de aba - termos


      setSelectedTab(4);
    };

    //Se o botão Termos for clicado
    const handleClickTermos = () => {
      setBotaoPesquisadoresClicado(false);
      setBotaoPatentesClicado(false)
      setBotaoTermosClicado(true);
      setBotaoAreasClicado(false);
      setBotaoResumoClicado(false)
      //Apagar checkbox ao mudar de aba - pesqisadores



      setSelectedTab(0);
    };

    const handleClickResumo = () => {
      setBotaoPesquisadoresClicado(false);
      setBotaoResumoClicado(true);
      setBotaoPatentesClicado(false)
      setBotaoAreasClicado(false);
      setBotaoTermosClicado(false)
      //Apagar checkbox ao mudar de aba - pesqisadores


      setSelectedTab(1);

    };

    //Se o botão Areas for clicado
    const handleClickAreas = () => {
      setBotaoAreasClicado(true);
      setBotaoPesquisadoresClicado(false);
      setBotaoPatentesClicado(false)
      setBotaoTermosClicado(false);
      setBotaoResumoClicado(false)
      //Apagar checkbox ao mudar de aba - pesqisadores


      setSelectedTab(2);
    };

    //popup

    const [popUpProgram, setPopUpProgram] = useState(true);

useEffect(() => {
  const storedPopUpHome = localStorage.getItem('popUpHome');

  if (storedPopUpHome) {
    // If user information is found in local storage, set the user and mark as logged in
    setPopUpProgram(JSON.parse(storedPopUpHome));
  }
}, []); // Empty dependency array ensures the effect runs only once during component mount

const handlePopUp = () => {
  if (popUpProgram) {
    setPopUpProgram(false);
    localStorage.setItem('popUpHome', JSON.stringify(false)); // Set to false only on the first visit
  }
};

    
    

  return (
    <div className="   ">

<div className="overflow-hidden absolute   w-full">
       
       <div className="z-[-999999999] w-[120%] h-[70vh] absolute top-[00px] left-[-100px]">
         <HighchartsReact highcharts={Highcharts} options={chartOptions} />
       </div>
      

       <div className="rounded-lg">
         <div className=" min-h-[340px] flex items-center">
           <div className=" w-full h-full items-start justify-start testeeee grid grid-cols-2">
             <div className=" flex flex-col  h-full transition ">
           
              
             <div className="pl-6 md:pl-16 flex justify-center h-[70vh] flex-col  w-fit">
        <div className="h-[350px] absolute  ml-16 "><Circle/></div>
        <h1 className="z-[999] text-4xl mb-4 font-medium max-w-[750px] ">Experimente
        <strong className="bg-red-400 text-white font-normal">
        pesquisar um tema
        </strong>{" "}
        e veja o que a plataforma pode filtrar para você.
      </h1>
          <p className=" z-[999] max-w-[620px]  text-lg text-gray-400">O principal objetivo desse sistema é identificar as competências individuais e coletivas dos profissionais na Bahia. </p>

   
          
          {idVersao === "2"  || idVersao === "4" ? (
              <div className=" flex  rounded-md items-center  bg-opacity-80 z-[99] flex-wrap gap-6 mt-8 relative">
              <img src={logo_1} className=" relative w-auto h-12"/>
              <img src={logo_2} className=" relative w-auto h-12"/>
              <img src={logo_3} className=" relative w-auto h-12"/>
              <img src={logo_5} className=" relative w-auto h-12"/>
              <img src={logo_4} className=" relative w-auto h-8"/>
              
          </div>
            ):('')}
          
      </div>
                 
             </div>

             <div id="nuveeeem" className="flex w-full h-full items-center  z-[999] ">
             <HighchartsReact highcharts={Highcharts} options={options} callback={(chart) => setChart(chart)} className="h-full  cursor-pointer" />
             </div>

             <div>

             </div>
           </div>
         </div>
       </div>
     </div>


     <div className="pt-[60vh] flex flex-1 flex-col relative  items-center  ">

    

      {isSticky ? (
        <Filter/>
      ):('')}

     

      <div
          ref={ref}
          className={` left-0  flex-col items-center flex flex-1 w-full transition justify-center z-[99999] ${isSticky ? 'pb-6 sticky top-0 left-0 bg-white transition-all shadow-sm' : ' transition-all'}`}
      >

          <div className={`${isSticky ? 'flex' : ' hidden'} h-20 w-full`}>
            <Header />
          </div>

          <Search  />
        </div>


{valoresSelecionadosExport == "" && valorDigitadoPesquisaDireta == "" ? (
  

    <DadosGerais/>
   
 
) : (
  <Tabs className="w-full items-center flex flex-col " >
    <div className="flex items-center justify-between w-full mt-6  px-6 md:px-16 m-[0 auto]">
      <p className="text-gray-400 mr-6 min-w-[350px] lg:flex gap-1">
        Resultados da pesquisa em {' '}
        <strong className="font-bold text-blue-400">
          {botaoTermosClicado ? 'termos' : botaoResumoClicado ? 'resumo' : botaoAreasClicado ? 'áreas' : botaoPesquisadoresClicado ? 'nome' : botaoPatentesClicado ? 'patente' :''}
        </strong> por:
      </p>
      <TabList className="w-full">
        <div className={`w-full gap-6  m-0 grid  ${botaoPesquisadoresClicado || botaoPatentesClicado ? 'grid-cols-2' : 'grid-cols-3'}`}>
          <Tab onClick={() => setSelectedTab(0)} selected={selectedTab === 0} selectedClassName={botaoTermosClicado ? "activeTermos" : (botaoAreasClicado ? "activeAreas" : botaoResumoClicado ? "activeResumo" : (botaoPesquisadoresClicado ? "activePesquisadores" : botaoPatentesClicado ? "activePatente": botaoEventosClicado ? "activeEventos" : botaoLivrosCapitulosClicado ? "activeLivrosCapitulos" : ""))} className="w-full cursor-pointer h-12 p-4 text-gray-400 border-[1px] border-solid bg-white border-gray-300 rounded-xl justify-center items-center flex outline-none   gap-3  transition-all" >
            <User size={16} className="" />
            <p className=" md:flex hidden"> Pesquisadores</p>
            {selectedTab == 0 ? (<div className={` py-1 px-4 rounded-full text-xs font-bold bg-white ${botaoEventosClicado ? 'text-orange-400' : ''} ${botaoLivrosCapitulosClicado ? 'text-pink-400' : ''} ${botaoTermosClicado ? 'text-blue-400' : ''} ${botaoResumoClicado ? 'text-yellow-400' : ''} ${botaoAreasClicado ? 'text-green-400' : ''} ${botaoPesquisadoresClicado ? 'text-red-400' : botaoPatentesClicado ? "text-cyan-400" :''}`}>{totalPesquisadores}</div>): ('')}
          </Tab>


          {botaoPatentesClicado ? (
            <head></head>
          ) : (
          <Tab onClick={() => setSelectedTab(1)} selected={selectedTab === 1} selectedClassName={botaoTermosClicado ? "activeTermos" : (botaoAreasClicado ? "activeAreas" : botaoResumoClicado ? "activeResumo" : (botaoPesquisadoresClicado ? "activePesquisadores" : botaoPatentesClicado ? "activePatente": botaoEventosClicado ? "activeEventos" : botaoLivrosCapitulosClicado ? "activeLivrosCapitulos"  : ""))} className="w-full cursor-pointer h-12 p-4 text-gray-400 border-[1px] border-solid bg-white border-gray-300 rounded-xl justify-center items-center flex outline-none   gap-3  transition-all"  >
            <File size={16} className="" />

            <p className=" md:flex hidden">Publicações</p>
            {selectedTab == 1 ? (<div className={` py-1 px-4  rounded-full text-xs font-bold bg-white ${botaoTermosClicado ? 'text-blue-400' : ''} ${botaoEventosClicado ? 'text-orange-400' : ''} ${botaoLivrosCapitulosClicado ? 'text-pink-400' : ''} ${botaoResumoClicado ? 'text-yellow-400' : ''} ${botaoAreasClicado ? 'text-green-400' : ''} ${botaoPesquisadoresClicado ? 'text-red-400' : botaoPatentesClicado ? "text-cyan-400" : ''}`}>{totalPublicacoes}</div>): ('')}
            
          </Tab>
          )}



          {botaoPesquisadoresClicado ? (
            <head></head>
          ) : (
            <Tab onClick={() => setSelectedTab(2)} selected={selectedTab === 2} selectedClassName={botaoTermosClicado ? "activeTermos" : (botaoAreasClicado ? "activeAreas" : botaoResumoClicado ? "activeResumo" : (botaoPesquisadoresClicado ? "activePesquisadores" : botaoPatentesClicado ? "activePatente" : botaoEventosClicado ? "activeEventos" : botaoLivrosCapitulosClicado ? "activeLivrosCapitulos"  : ""))} className="w-full cursor-pointer h-12 p-4 text-gray-400 border-[1px] border-solid bg-white border-gray-300 rounded-xl justify-center items-center flex outline-none   gap-3  transition-all"  >
              <Buildings size={16} className="" />
              <p className="md:flex hidden">Instituições</p>

              {selectedTab == 2 ? (<div className={` py-1 px-4  rounded-full text-xs font-bold bg-white ${botaoTermosClicado ? 'text-blue-400' : ''} ${botaoEventosClicado ? 'text-orange-400' : ''} ${botaoLivrosCapitulosClicado ? 'text-pink-400' : ''} ${botaoResumoClicado ? 'text-yellow-400' : ''} ${botaoAreasClicado ? 'text-green-400' : ''} ${botaoPesquisadoresClicado ? 'text-red-400' : botaoPatentesClicado ? "text-cyan-400" : ''}`}>{totalInstituicoes}</div>): ('')}
              
            </Tab>
          )}
        </div>
      </TabList>
    </div>

    <div className="w-full ">
              <TabPanel className="h-full  mt-9 items-center justify-center w-full px-6 md:px-16 ">
                <Pesquisadores />
              </TabPanel>

              {botaoPatentesClicado ? (''):(
                <TabPanel className="h-full  mt-9 items-center justify-center w-full px-6 md:px-16">
                <Publicacoes />
              </TabPanel>
              )}


              <TabPanel className="h-full  mt-9 items-center justify-center w-full px-6 md:px-16">
                <Instituicoes />
              </TabPanel>

            </div>

  </Tabs>
)}

  

      {valoresSelecionadosExport == "" && valorDigitadoPesquisaDireta == "" ? (
        <div>
          <div className="w-full flex justify-center my-6  px-6 md:px-16">
                <div className=" p-24 m-[0 auto] w-full rounded-2xl bg-blue-400 items-center grid grid-cols-2 gap-12 bg-opacity-10 backdrop-blur-sm">
                    <div>
                        <h3 className="text-3xl font-medium text-gray-400 max-w-[500px] mb-4">O que a plataforma pode <strong className="bg-blue-400 text-white font-medium">fazer</strong> e como ela pode te <strong className="bg-blue-400 text-white font-medium">auxiliar</strong>?</h3>
                        <p className=" text-gray-400 mb-8">O Sistema de Mapeamento de Competências é uma plataforma desenvolvida com o objetivo de auxiliar na seleção e filtragem de pesquisadores. Esta plataforma tem o potencial facilitar o processo de identificação e escolha dos profissionais mais qualificados em suas respectivas áreas de atuação, ver linhas de pesquisas e orientações.</p>

                        <Link to={"/indicators"} className="w-fit mt-8 whitespace-nowrap flex items-center gap-4 bg-blue-400 text-white rounded-xl px-6 py-2 justify-center hover:bg-blue-500 text-base font-medium transition">
                            <YoutubeLogo size={16} className="text-white" /> Assistir vídeo
                        </Link>
                    </div>

                    <div className="flex-1 h-full flex items-center justify-center"> 
                    {idVersao === '1' || idVersao === ''  ? (
                        <div className="w-3/5 flex items-center justify-center "><LogoIapos /></div>
                  ) : (idVersao === '2') ? (
                    <div className="w-3/5 flex items-center justify-center "><Logo /></div>
                  ) : (idVersao == '4') ? (
                    <div className=" w-3/5 flex items-center justify-center "><LogoSimcc /></div>
                  ) : (
                  ''
                  )}
                  </div>

                </div>

               
               
            </div>


            <div className="grid grid-cols-2 py-24 gap-12 px-6 md:px-16">
                <div className="w-full max-w-[640px] ">
                    <h3 className="font-medium text-4xl mb-4 text-gray-400">1. Use <strong className="bg-blue-400 text-white hover:bg-blue-500 transition duration-500 font-medium">palavras-chave</strong> específicas</h3>
                    <p className="text-lg text-gray-400">
                        Tente usar palavras-chave específicas que descrevem o tópico que você está procurando. Por exemplo, em vez de pesquisar por "robótica", pesquise por "robótica educacional". Você pode fazer a pesquisa com mais de uma palavra-chave
                    </p>
                </div>


                <div className="flex  gap-4 flex-wrap">
                <li className='whitespace-nowrap gap-2 bg-[#FEE9E9] border-red-400 border-[1px] inline-flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold'>Hugo Saba
                  <button ><X size={16} className="text-gray-400 hover:text-red-400" /></button>
                </li>

                <li
      
        className="whitespace-nowrap gap-2 bg-[#F4FAEC] border-green-400 border-[1px] inline-flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold"
      >
        Ciencias Ambientais | Ecologia
        <button >
          <X size={16} className="text-gray-400 hover:text-green-400" />
        </button>
      </li>

      <li  className='whitespace-nowrap gap-2 bg-blue-100 border-blue-400 border-[1px] inline-flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold'>Taxonomia
        <button ><X size={16} className="text-gray-400 hover:text-blue-400" /></button>
      </li>

      <li className='whitespace-nowrap gap-2 bg-[#FFFAE6] border-yellow-400 border-[1px] inline-flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold'>Educação
        <button ><X size={16} className="text-gray-400 hover:text-yellow-400" /></button>
      </li>

      <li  className='whitespace-nowrap gap-2 bg-[#E9F4F4] border-cyan-400 border-[1px] inline-flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold'>Sistema
        <button ><X size={16} className="text-gray-400 hover:text-cyan-400" /></button>
      </li>

      <li
      
        className="whitespace-nowrap gap-2 bg-[#F4FAEC] border-green-400 border-[1px] inline-flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold"
      >
        Educação Da Relações Étnico Raciais | Antropologia
        <button >
          <X size={16} className="text-gray-400 hover:text-green-400" />
        </button>
      </li>

      <li className='whitespace-nowrap gap-2 bg-[#FEE9E9] border-red-400 border-[1px] inline-flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold'>Carlos Eduardo
                  <button ><X size={16} className="text-gray-400 hover:text-red-400" /></button>
                </li>

                <li  className='whitespace-nowrap gap-2 bg-blue-100 border-blue-400 border-[1px] inline-flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold'>Energia
        <button ><X size={16} className="text-gray-400 hover:text-blue-400" /></button>
      </li>

      <li  className='whitespace-nowrap gap-2 bg-blue-100 border-blue-400 border-[1px] inline-flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold'>Renováveis
        <button ><X size={16} className="text-gray-400 hover:text-blue-400" /></button>
      </li>

      <li className='whitespace-nowrap gap-2 bg-[#FFFAE6] border-yellow-400 border-[1px] inline-flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold'>Modelo
        <button ><X size={16} className="text-gray-400 hover:text-yellow-400" /></button>
      </li>

      <li  className='whitespace-nowrap gap-2 bg-[#E9F4F4] border-cyan-400 border-[1px] inline-flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold'>Modificador
        <button ><X size={16} className="text-gray-400 hover:text-cyan-400" /></button>
      </li>
                </div>

            </div>

            <div className="grid grid-cols-2 py-24 gap-12 px-6 md:px-16">


                <div className="flex items-center ">

                </div>

                <div className="w-full max-w-[640px] ">
                    <h3 className="font-medium text-4xl text-gray-400 mb-4">2. Use <strong className="bg-blue-400 text-white hover:bg-blue-500 transition duration-500 font-medium">filtros</strong> de pesquisa</h3>
                    <p className="text-lg text-gray-400 mb-4">
                    Limite os resultados da pesquisa usando categorias que possuem diferentes critérios de seleção. Por exemplo, é possível buscar por termos em artigos, em resumo, patentes, nome de pesquisador ou por área de especialidade.
                    </p>
                    <p className="text-lg text-gray-400">
                    Você pode usar os filtros na plataforma para refinar o resultado da pesquisa por cidade, instituição, qualis, ano ou área de atuação.
                    </p>
                </div>

            </div>

            <div className="grid grid-cols-2 py-24 gap-12 px-6 md:px-16">
                <div className="w-full max-w-[640px] ">
                    <h3 className="font-medium text-4xl mb-4 text-gray-400">3. Use o <strong className="bg-blue-400 text-white hover:bg-blue-500 transition duration-500 font-medium">dicionário</strong> de termos</h3>
                    <p className="text-lg text-gray-400 mb-8">
                    Em caso de dúvida de qual palavra utilizar para realizar sua pesquisa, acesse o dicionário de termos com mais de 36 mil palavras disponíveis para refinar a sua busca. Você também pode pesquisar as informações das revistas (ISSN, qualis e JCR).
                    </p>

                   

                    <div className="flex gap-4">
                    <Link to={`/terms/${idVersao}`} className="w-fit cursor-pointer h-10 whitespace-nowrap flex items-center gap-4 bg-blue-400 text-white rounded-xl px-4 py-2 justify-center hover:bg-blue-500 text-sm font-medium transition">
                        <ListDashes size={16} className="text-white" /> Dicionário
                    </Link>

                    <Link to={`/magazine/${idVersao}`} className="w-fit cursor-pointer h-10 whitespace-nowrap flex  items-center gap-4  text-blue-400 rounded-xl px-4 py-2 justify-center hover:bg-gray-300 text-sm font-medium transition">
                        <BookOpen size={16} className="" /> Revistas
                    </Link>
                    </div>
                </div>


                <div className="flex items-center justify-end">
                    
                </div>

            </div>

            

      
            <div className="w-full flex flex-col px-6 md:px-16">
            
                <div className="mb-16 pt-52 pb-0 flex justify-center flex-col items-center">
                    <h3 className="font-medium text-4xl text-gray-400 text-center mb-4">4. Conheça a aba <strong className="bg-blue-400 text-white font-medium text-4xl">baremas de avaliação </strong></h3>
                    <p className="mb-6 text-gray-400 text-center max-w-[1000px]">Quer ranquear quais pesquisadores estão mais capacitados para participação em determinado edital? É simples. Basta ir na aba “baremas” que a plataforma irá fazer baremas de avaliação onde você pode determinar pesos diferentes para cada critério desejado (graduação, produção bibliográfica, participação em eventos, produção técnica, entre outros). </p>

                    <div className="flex gap-4 items-center">

                      <p className="text-gray-400 font-bold"> Conheça um mundo de possibilidades. Processe seu primeiro</p>
                    <Link to={`/barema/${idVersao}`} className="w-fit cursor-pointer h-10 whitespace-nowrap flex items-center gap-4 bg-blue-400 text-white rounded-xl px-4 py-2 justify-center hover:bg-blue-500 text-sm font-medium transition">
                        <Textbox size={16} className="text-white" /> Barema
                    </Link>

                  
                    </div>
                </div>

                <div className="flex-1 h-full flex items-center"> <img src={footer} alt="" className="w-full no-drag"/> </div>
            </div>


      <button className={`fixed bottom-[32px] right-0 w-10 mb-[32px] h-auto hidden  ${isSticky ? 'md:flex' : ' hidden'}`} onClick={handleClickt}>
        <div className="z-[99999999999999999999999]">
          <p className="text-blue-400 font-bold  writing-mode-vertical origin-top-right transform " style={{ writingMode: "vertical-rl" }}>VOLTAR AO TOPO</p>
          <ArrowCircleUp size={24} className="text-blue-400 mt-4" />
        </div>
      </button>
        </div>
      ):('')}

      
   
      </div>

      {popUpProgram &&  loggedIn == false ? (
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
                        
                        >
                            
                        </div>
                        </div>

                        <div className="">
                            <div className="h-full max-w-[500px] ">
                                <div className=" border-l h-full pb-[96px] overflow-y-auto elementBarra border-l-gray-300 p-12 ">
                                <div onClick={() => handlePopUp()} className={`ml-auto float-right cursor-pointer rounded-xl hover:bg-gray-100 h-[38px] w-[38px] transition-all flex items-center justify-center `}>
                        <X size={20} className={'rotate-180 transition-all text-gray-400'} />
                        </div>  

                          <div className="h-12 mb-4"><LogoSimcc/></div>
                                
                                <h3 className=" font-medium text-2xl mb-4 text-gray-400"><strong className="bg-blue-400 text-white hover:bg-blue-500 transition duration-500 font-medium">Bem vindo (a)</strong> ao Sistema de Mapeamento de Competências da Bahia</h3>
                                    <p className="  text-gray-400 mb-2">
                                    É de interesse das universidades públicas tornar as produções cientificas desenvolvidas acessíveis para aqueles interessados, uma premissa simples com desafios significativos envolvidos. 
                                    </p>

                                    <p className="  text-gray-400 mb-2">
                                    É de interesse das universidades públicas tornar as produções cientificas desenvolvidas acessíveis para aqueles interessados, uma premissa simples com desafios significativos envolvidos. 
                                    </p>

                                   
                           
                                </div>


                            </div>
                        </div>
                    </div>

                </PopUpWrapper>
            ):(
                ``
            )}
    </div>
  );
}
