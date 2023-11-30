import React, { useContext, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { UserContext } from "../contexts/context";
import { ArrowCircleUp, ArrowRight, BookmarkSimple, Buildings, File, GraduationCap, MagnifyingGlass, MapPin, Star, User, X, YoutubeLogo } from "phosphor-react";
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
  

  const { idVersao, setIdVersao } = useContext(UserContext);
  setIdVersao(props.id)



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

  const handleClickt = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };



  const urlGraduateProgram = `${urlGeral}/graduate_program_profnit?id=${props.id}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(urlGraduateProgram, {
          mode: "cors",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "3600",
            "Content-Type": "text/plain",
          },
        });
        const data = await response.json();
        if (data) {
          setGraduatePrograms(data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [urlGraduateProgram]);


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


   //stick search
  const [isSticky, setIsSticky] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
   
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
          BackgroundColor: 'red',
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
  


  return (
    <div className="  overflow-y-hidden  overflow-x-hidden flex justify-center flex-col">

<div className="overflow-hidden absolute top-0   w-full">
       
       <div className="z-[-999999999] w-[120%] absolute top-[30px] left-[-100px]">
         <HighchartsReact highcharts={Highcharts} options={chartOptions} />
       </div>
      

       <div className="rounded-lg">
         <div className=" min-h-[340px] flex items-center ">
           <div className=" w-full h-full items-start justify-start testeeee grid grid-cols-2">
             <div className=" flex flex-col  h-full transition ">
           
              
             <div className="px-6 md:px-16 flex justify-center h-[75vh] flex-col  w-fit">
        <div className="h-[350px] absolute  ml-16 "><Circle/></div>
        <h1 className="z-[999999] text-4xl mb-4 font-medium max-w-[750px] ">
        <strong className="bg-blue-400 text-white font-normal">
        Escolha um programa
        </strong>{" "}
        e veja o que a plataforma filtra para você.
      </h1>
          <p className=" z-[999999] max-w-[620px]  text-lg text-gray-400">Arraste ou clique em um dos pontos no gráfico para selecionar o programa de pós-graduação. Você também pode escolher pela lista abaixo </p>

   
          
          {idVersao === "2"  || idVersao === "4" ? (
              <div className=" flex  rounded-md  bg-opacity-80 z-[99] flex-wrap gap-6 mt-8 relative">
              <img src={logo_1} className=" relative w-auto h-12"/>
              <img src={logo_2} className=" relative w-auto h-12"/>
              <img src={logo_3} className=" relative w-auto h-12"/>
              <img src={logo_5} className=" relative w-auto h-12"/>
              <img src={logo_4} className=" relative w-auto h-12"/>
              
          </div>
            ):('')}
          
      </div>
                 
             </div>

             <div id="nuveeeem" className="flex w-full h-full items-center">
             <HighchartsReact highcharts={Highcharts} options={options} className="h-full" />
             </div>

             <div>

             </div>
           </div>
         </div>
       </div>
     </div>


     <div className="pt-[535px] flex flex-1 flex-col relative  items-center w-full ">

      <div className=" w-full">

      <Filter/>

      <div className=" flex flex-1 flex-col relative items-center w-full ">

<div
  ref={ref}
  className={` left-0 flex-col items-center flex flex-1 w-full transition justify-center z-[999] ${isSticky ? 'pb-6 sticky top-0 bg-white transition-all shadow-sm' : ' transition-all'}`}
>

  <div className={`${isSticky ? 'flex' : ' hidden'} h-20 w-full`}>
    <Header />
  </div>

  <Search />
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
          <Tab onClick={handleClickTabs} selected={selectedTab === 0} selectedClassName={botaoTermosClicado ? "activeTermos" : (botaoAreasClicado ? "activeAreas" : botaoResumoClicado ? "activeResumo" : (botaoPesquisadoresClicado ? "activePesquisadores" : botaoPatentesClicado ? "activePatente" : ""))} className="w-full cursor-pointer h-12 p-4 text-gray-400 border-[1px] border-solid bg-white border-gray-300 rounded-lg justify-center items-center flex outline-none   gap-3  transition-all" >
            <User size={16} className="" />
            <p className=" md:flex hidden"> Pesquisadores</p>
            <div className={` py-1 px-4 rounded-full text-xs font-bold bg-white ${botaoTermosClicado ? 'text-blue-400' : ''} ${botaoResumoClicado ? 'text-yellow-400' : ''} ${botaoAreasClicado ? 'text-green-400' : ''} ${botaoPesquisadoresClicado ? 'text-red-400' : botaoPatentesClicado ? "text-cyan-400" :''}`}>{totalPesquisadores}</div>
          </Tab>


          {botaoPatentesClicado ? (
            <head></head>
          ) : (
          <Tab onClick={handleClickTabs} selected={selectedTab === 1} selectedClassName={botaoTermosClicado ? "activeTermos" : (botaoAreasClicado ? "activeAreas" : botaoResumoClicado ? "activeResumo" : (botaoPesquisadoresClicado ? "activePesquisadores" : botaoPatentesClicado ? "activePatente"  : ""))} className="w-full cursor-pointer h-12 p-4 text-gray-400 border-[1px] border-solid bg-white border-gray-300 rounded-lg justify-center items-center flex outline-none   gap-3  transition-all"  >
            <File size={16} className="" />

            <p className=" md:flex hidden">Publicações</p>
            <div className={` py-1 px-4  rounded-full text-xs font-bold bg-white ${botaoTermosClicado ? 'text-blue-400' : ''} ${botaoResumoClicado ? 'text-yellow-400' : ''} ${botaoAreasClicado ? 'text-green-400' : ''} ${botaoPesquisadoresClicado ? 'text-red-400' : botaoPatentesClicado ? "text-cyan-400" : ''}`}>{totalPublicacoes}</div>
          </Tab>
          )}



          {botaoPesquisadoresClicado ? (
            <head></head>
          ) : (
            <Tab onClick={handleClickTabs} selected={selectedTab === 2} selectedClassName={botaoTermosClicado ? "activeTermos" : (botaoAreasClicado ? "activeAreas" : botaoResumoClicado ? "activeResumo" : (botaoPesquisadoresClicado ? "activePesquisadores" : botaoPatentesClicado ? "activePatente"  : ""))} className="w-full cursor-pointer h-12 p-4 text-gray-400 border-[1px] border-solid bg-white border-gray-300 rounded-lg justify-center items-center flex outline-none   gap-3  transition-all"  >
              <Buildings size={16} className="" />
              <p className="md:flex hidden">Instituições</p>

              <div className={` py-1 px-4  rounded-full text-xs font-bold bg-white ${botaoTermosClicado ? 'text-blue-400' : ''} ${botaoResumoClicado ? 'text-yellow-400' : ''} ${botaoAreasClicado ? 'text-green-400' : ''} ${botaoPesquisadoresClicado ? 'text-red-400' : botaoPatentesClicado ? "text-cyan-400" : ''}`}>{totalInstituicoes}</div>
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
</div>
      </div>

      {valoresSelecionadosExport == "" && valorDigitadoPesquisaDireta == "" ? (
        <div>
          <div className="w-full flex justify-center my-6  px-6 md:px-16">
                <div className=" p-24 m-[0 auto] w-full rounded-2xl bg-blue-400 items-center grid grid-cols-2 gap-12 bg-opacity-10 backdrop-blur-sm">
                    <div>
                        <h3 className="text-3xl font-medium text-gray-400 max-w-[500px] mb-4">O que a plataforma pode <strong className="bg-blue-400 text-white font-medium">fazer</strong> e como ela pode te <strong className="bg-blue-400 text-white font-medium">auxiliar</strong>?</h3>
                        <p className=" text-gray-400 mb-8">O Sistema de Mapeamento de Competências é uma plataforma desenvolvida com o objetivo de auxiliar na seleção e filtragem de pesquisadores. Esta plataforma tem um potencial facilitar o processo de identificação e escolha dos profissionais mais qualificados em suas respectivas áreas de atuação, ver linhas de pesquisas e orientações.</p>

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

               <div className="right-[400px] relative z-[-9] py-6"> <Circle/></div>
            </div>


            <div className="grid grid-cols-2 py-24 gap-12 px-6 md:px-16">
                <div className="w-full max-w-[640px] ">
                    <h3 className="font-medium text-4xl mb-4">1. Use <strong className="bg-blue-400 text-white hover:bg-blue-500 transition duration-500 font-medium">palavras-chave</strong> específicas</h3>
                    <p className="text-lg text-gray-400">
                        Tente usar palavras-chave específicas que descrevem o tópico que você está procurando. Por exemplo, em vez de pesquisar por "robótica", pesquise por "robótica educacional". Você pode fazer a pesquisa com mais de uma palavra-chave
                    </p>
                </div>


                <div className="flex items-center justify-end">
                    
                </div>

            </div>

            <div className="grid grid-cols-2 py-24 gap-12 px-6 md:px-16">


                <div className="flex items-center justify-end">
                    
                </div>

                <div className="w-full max-w-[640px] ">
                    <h3 className="font-medium text-4xl mb-4">2. Use <strong className="bg-blue-400 text-white hover:bg-blue-500 transition duration-500 font-medium">filtros</strong> de pesquisa</h3>
                    <p className="text-lg text-gray-400">
                    Você pode usar os filtros de pesquisa na plataforma para limitar os resultados da pesquisa com base em diferentes critérios, como buscar por Pesquisador específico, filtrar por área ou por qualis e ano.
                    </p>
                </div>

            </div>

            <div className="grid grid-cols-2 py-24 gap-12 px-6 md:px-16">
                <div className="w-full max-w-[640px] ">
                    <h3 className="font-medium text-4xl mb-4">3. Use <strong className="bg-blue-400 text-white hover:bg-blue-500 transition duration-500 font-medium">palavras-chave</strong> específicas</h3>
                    <p className="text-lg text-gray-400">
                        Tente usar palavras-chave específicas que descrevem o tópico que você está procurando. Por exemplo, em vez de pesquisar por "robótica", pesquise por "robótica educacional". Você pode fazer a pesquisa com mais de uma palavra-chave
                    </p>
                </div>


                <div className="flex items-center justify-end">
                    
                </div>

            </div>

            

      <div
        id="principal"
        className="h-screen max-h-screen overflow-y-hidden grid grid-cols-5 gap-6 w-[450px] py-6 px:6 md:pl-16"
        style={{ maxHeight: "100vh" }}
      >
        {ResearcherImage.map((props, index) => (
          <a
            href={`https://lattes.cnpq.br/${props.lattes}`}
            key={props.lattes_10_id}
            className="whitespace-nowrap bg-cover bg-center bg-no-repeat rounded-md"
            style={{
              backgroundImage:
                index % 3 === 0
                  ? "none"
                  : `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id})`,
              paddingTop: "100%", // Define a proporção 1:1 (quadrado)
            }}
          ></a>
        ))}
      </div>


      <button className={`fixed bottom-[32px] right-0 w-10 mb-[32px] h-auto hidden  ${isSticky ? 'md:flex' : ' hidden'}`} onClick={handleClickt}>
        <div className="">
          <p className="text-blue-400 font-bold  writing-mode-vertical origin-top-right transform " style={{ writingMode: "vertical-rl" }}>VOLTAR AO TOPO</p>
          <ArrowCircleUp size={24} className="text-blue-400 mt-4" />
        </div>
      </button>
        </div>
      ):('')}

      
   
      </div>
    </div>
  );
}
