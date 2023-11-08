import { ArrowCircleDown, Info, Funnel, User, File, Buildings, MagnifyingGlass, Rows, Lightbulb, ArrowCircleUp, ChartLine, PaperPlaneTilt, Question, UserPlus, Users, BookmarkSimple, GraduationCap, Star, MapPin } from "phosphor-react";
 

import { Pesquisadores } from "./Pesquisadores";
import { Publicacoes } from "./Publicacoes";

import { Instituicoes } from "./Instituicoes";

import React, { useState, useEffect, useRef, useContext } from "react";
import { UserContext } from '../contexts/context'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import Search from './Search'
import { Footer } from "./Footer";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import drilldown from 'highcharts/modules/drilldown'
import HC_wordcloud from 'highcharts/modules/wordcloud';

import { useNavigate } from 'react-router-dom';
import { PopUpPesquisadoresGroup } from "./PopUpPesquisadoresGroup";
import Carregando from "./Carregando";
import { Header } from "./Header";
import { HomeInicial } from "./HomeInicial";
import { Circle } from "./Circle";
import { Circle2 } from "./Circle2";
import { VisaoPrograma } from "./VisaoPrograma";

interface ButtonStyle extends React.CSSProperties {
  position: 'fixed';
  bottom: string;
  left: string;
}


HC_wordcloud(Highcharts);

type Total = {
  organizations: string,
  publications: string,
  researcher: string
}

type Terms = {
  keywords: string[][];
}

interface PalavrasChaves {
  term: string;
  among: number;
}

//chat gpt

interface Post {
  id: number;
  title: string;
  body: string;
}

interface Checkbox {
  name: string;
  value: boolean;
}

interface FormState {
  [key: string]: boolean;
}

type GraduateProgram = {
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



export function Homepage() {

  const [urlTermExport, seturlTermExport] = useState('');

  const { totalPublicacoes, setTotalPublicacoes } = useContext(UserContext);
  const { totalPesquisadores, setTotalPesquisadores } = useContext(UserContext);
  const { totalInstituicoes, setTotalInstituicoes } = useContext(UserContext);
  const { urlGeral, setUrlGeral } = useContext(UserContext);

  const { idGraduateProgram, setIdGraduateProgram } = useContext(UserContext)
  const { idVersao, setIdVersao } = useContext(UserContext);
  const urlGraduateProgram = `${urlGeral}/graduate_program_profnit?id=${idVersao}`;
  const [graduateProgram, setGraduatePogram] = useState<GraduateProgram[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(urlGraduateProgram, {
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
          setGraduatePogram(data);
        }
      } catch (err) {
        console.log(err);
      } finally {

      }
    };
    fetchData();
  }, [urlGraduateProgram]);


  //BOTÃO SUBIR PÁGINA

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

  const handleClick = () => {
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


  //estado btns 
  const [selectedTab, setSelectedTab] = useState(0);

  //zerar total

  const handleClickTabs = () => {
    setTotalPesquisadores('')
    setTotalPublicacoes('')
    setTotalInstituicoes('')
  };

  // palavras chaves

  const [words, setWords] = useState<PalavrasChaves[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  let urlPalavrasChaves = `${urlGeral}lists_word_researcher?graduate_program_id=${idGraduateProgram}&researcher_id=`

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

  //btns da página search

  const { botaoPesquisadoresClicado, setBotaoPesquisadoresClicado } = useContext(UserContext);
  const { botaoTermosClicado, setBotaoTermosClicado } = useContext(UserContext);
  const { botaoResumoClicado, setBotaoResumoClicado } = useContext(UserContext);
  const { botaoAreasClicado, setBotaoAreasClicado } = useContext(UserContext);


  //btn grupo pesquisadores
  const [expanded, setExpanded] = useState(false);
  const history = useNavigate();
  const { valoresSelecionadosExport, setValoresSelecionadosExport } = useContext(UserContext);
  const { valorDigitadoPesquisaDireta, setValorDigitadoPesquisaDireta } = useContext(UserContext);

  const handleClickBtn = () => {

    setValoresSelecionadosExport('')
    setExpanded(true);
    setTimeout(() => {
      history('/pesquisadoresSelecionados');
    }, 1000);
  };

  //background

  const backgroundImages = [
    '/src/assets/img3.jpg',
    '/src/assets/img4.jpg',
    '/src/assets/img5.jpg',
    '/src/assets/img6.jpg',



    // Adicione mais URLs de imagens de fundo, se necessário
  ];

  const [backgroundImage, setBackgroundImage] = useState<string>(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    return backgroundImages[randomIndex];
  });

  ;
  //

  useEffect(() => {
    const fetchData = async () => {

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
      }
    };
    fetchData();
  }, [urlPalavrasChaves]);

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

    <div className="h-screen">

      <Header />
      <div className="overflow-hidden absolute  py-24 px-6 md:px-16 w-full">
       
        <div className="z-[-999999999] w-[120%] absolute top-[30px] left-[-100px]">
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
       

        <div className="rounded-lg">
          <div className=" min-h-[340px] flex items-center ">
            <div className=" w-full h-full items-start justify-start testeeee grid grid-cols-2">
              <div className=" flex flex-col  h-full transition py-12">
            
                {graduateProgram.map(props => {
              if (props.graduate_program_id === idGraduateProgram) {
                return (
                  <div className="flex flex-col h-full transition ">
                   <div><img src={`${props.url_image}`} alt="" className="h-16 border-none w-auto mb-4"/></div>
                   <div className="h-[350px] absolute z-[-9] ml-16 scale-x-[-1] "><Circle2/></div>
                    <h1 className="text-left max-w-[670px] font-medium text-4xl mb-2">
                      <strong className="bg-blue-400 text-white font-medium">Pesquise um termo</strong> no programa de pós-graduação {props.name}
                    </h1>
                    <p className="text-gray-400 max-w-[500px] ">Para ajudar a sua pesquisa, fornecemos uma lista extensa de termos e áreas de especialidade, abrangendo diversos setores.</p>
                  </div>
                );
              }
            })}
                <div className="flex mt-6 w-full">
                  {graduateProgram.map(props => {
                    if (props.graduate_program_id === idGraduateProgram) {
                      return (
                        <div className="flex">

                          <div className="flex gap-2  flex-wrap">

                            <div className="border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium w-fit bg-white">{props.area}</div>

                            <div className="border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium w-fit bg-white gap-1 items-center"><MapPin size={12} className="" /> {props.city}</div>


                            {props.type.split(';').map((value, index) => {
                              const ratingValues = props.rating.split(';');
                              const ratingDoutorado = ratingValues[0]; // Valor correspondente a DOUTORADO
                              const ratingMestrado = ratingValues[1]; // Valor correspondente a MESTRADO

                              return (
                                <div
                                  key={index}
                                  className={`py-2 px-4 h-8 text-white w-fit rounded-md text-xs font-bold flex gap-2 items-center ${value.includes('MESTRADO') ? 'bg-blue-200' : 'bg-blue-300'
                                    }`}
                                >
                                  <GraduationCap size={12} className="textwhite" />
                                  {value.trim()}
                                  <p className=" flex gap-2 items-center"><Star size={12} className="textwhite" /> {props.type.split(';').length == 2 ? (value.includes('MESTRADO') ? ratingMestrado : ratingDoutorado) : (props.rating)}</p>
                                </div>
                              );
                            })}

                            <div className="bg-blue-400 py-2 h-8 px-4 text-white rounded-md text-xs font-bold flex gap-2 items-center">
                              <BookmarkSimple
                                size={12} className="textwhite" />
                              {props.modality}
                            </div>
                          </div>
                        </div>
                      )
                    } else {
                      return null; // Renderizar null para os outros itens que não correspondem ao índice desejado
                    }
                  })}
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






      <div className="pt-[535px] flex flex-1 flex-col relative items-center ">

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
          
          <div>
            <VisaoPrograma/>
            <HomeInicial />
          </div>
        ) : (
          <Tabs className="w-full items-center flex flex-col " defaultIndex={0}>
            <div className="flex items-center justify-between w-full mt-6  px-6 md:px-16 m-[0 auto]">
              <p className="text-gray-400 mr-6 min-w-[350px] lg:flex gap-1">
                Resultados da pesquisa em {' '}
                <strong className="font-bold text-blue-400">
                  {botaoTermosClicado ? 'termos' : botaoResumoClicado ? 'resumo' : botaoAreasClicado ? 'áreas' : botaoPesquisadoresClicado ? 'nome' : ''}
                </strong> por:
              </p>
              <TabList className="w-full">
                <div className={`w-full gap-6  m-0 grid  ${botaoPesquisadoresClicado ? 'grid-cols-2' : 'grid-cols-2'}`}>
                  <Tab onClick={handleClickTabs} selected={selectedTab === 0} selectedClassName={botaoTermosClicado ? "activeTermos" : (botaoAreasClicado ? "activeAreas" : botaoResumoClicado ? "activeResumo" : (botaoPesquisadoresClicado ? "activePesquisadores" : ""))} className="w-full cursor-pointer h-12 p-4 text-gray-400 border-[1px] border-solid bg-white border-gray-300 rounded-lg justify-center items-center flex outline-none   gap-3  transition-all" >
                    <User size={16} className="" />
                    <p className=" md:flex hidden"> Pesquisadores</p>
                    <div className={` py-1 px-4 rounded-full text-xs font-bold bg-white ${botaoTermosClicado ? 'text-blue-400' : ''} ${botaoResumoClicado ? 'text-yellow-400' : ''} ${botaoAreasClicado ? 'text-green-400' : ''} ${botaoPesquisadoresClicado ? 'text-red-400' : ''}`}>{totalPesquisadores}</div>
                  </Tab>


                  <Tab onClick={handleClickTabs} selected={selectedTab === 1} selectedClassName={botaoTermosClicado ? "activeTermos" : (botaoAreasClicado ? "activeAreas" : botaoResumoClicado ? "activeResumo" : (botaoPesquisadoresClicado ? "activePesquisadores" : ""))} className="w-full cursor-pointer h-12 p-4 text-gray-400 border-[1px] border-solid bg-white border-gray-300 rounded-lg justify-center items-center flex outline-none   gap-3  transition-all"  >
                    <File size={16} className="" />

                    <p className=" md:flex hidden">Publicações</p>
                    <div className={` py-1 px-4  rounded-full text-xs font-bold bg-white ${botaoTermosClicado ? 'text-blue-400' : ''} ${botaoResumoClicado ? 'text-yellow-400' : ''} ${botaoAreasClicado ? 'text-green-400' : ''} ${botaoPesquisadoresClicado ? 'text-red-400' : ''}`}>{totalPublicacoes}</div>
                  </Tab>




                  {botaoPesquisadoresClicado ? (
                    <head></head>
                  ) : (
                    <Tab onClick={handleClickTabs} selected={selectedTab === 2} selectedClassName={botaoTermosClicado ? "activeTermos" : (botaoAreasClicado ? "activeAreas" : botaoResumoClicado ? "activeResumo" : (botaoPesquisadoresClicado ? "activePesquisadores" : ""))} className="w-full hidden cursor-pointer h-12 p-4 text-gray-400 border-[1px] border-solid bg-white border-gray-300 rounded-lg justify-center items-center outline-none   gap-3  transition-all"  >
                      <Buildings size={16} className="text-gray-500" />
                      <p className="text-gray-400 md:flex hidden">Instituições</p>

                      <div className={` py-1 px-4 text-white rounded-full text-xs font-bold ${botaoTermosClicado ? 'bg-[#005399]' : ''}  ${botaoResumoClicado ? 'bg-[#EC1C22]' : ''} ${botaoAreasClicado ? 'bg-[#8FC53E]' : ''} ${botaoPesquisadoresClicado ? 'bg-[#20BDBE]' : ''}`}>{totalInstituicoes}</div>
                    </Tab>
                  )}
                </div>
              </TabList>
            </div>

            <div className="w-full">
              <TabPanel className="h-full  mt-9 items-center justify-center w-full px-6 md:px-16 ">
                <Pesquisadores />
              </TabPanel>

              <TabPanel className="h-full  mt-9 items-center justify-center w-full px-6 md:px-16">
                <Publicacoes />
              </TabPanel>


              <TabPanel className="h-full  mt-9 items-center justify-center w-full px-6 md:px-16">
                <Instituicoes />
              </TabPanel>

            </div>

          </Tabs>
        )}
      </div>

      <button className={`fixed bottom-[32px] right-0 w-10 mb-[32px] h-auto hidden  ${isSticky ? 'md:flex' : ' hidden'}`} onClick={handleClick}>
        <div className="">
          <p className="text-blue-400 font-bold  writing-mode-vertical origin-top-right transform " style={{ writingMode: "vertical-rl" }}>VOLTAR AO TOPO</p>
          <ArrowCircleUp size={24} className="text-blue-400 mt-4" />
        </div>
      </button>

      <div className="group flex flex-col gap-6   fixed z-[99999999999] left-8 bottom-16" id="uuuuuuuuu">
        <div className=" group-hover:flex hidden transition-all duration-1000">
          <PopUpPesquisadoresGroup />
        </div>

        <button
          className={`rounded-md p-4  text-white flex items-center justify-center ${expanded ? ' bg-[#F9F9F9] scale-full z-[9999999999999] fixed left-8 bottom-16' : ' w-12 h-12 bg-blue-400 hover:bg-blue-500'
            } transition-all duration-1000`}
          onClick={handleClickBtn}
        >
          <Users size={24} className={` ${expanded ? ' hidden' : ' text-white flex'
            } `} />
        </button>
      </div>


    </div>
  )
};