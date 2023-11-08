import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/context";
import { File, ArrowUDownLeft, Book, Books, Buildings, CaretCircleLeft, CaretCircleRight, CaretDown, ChartBar, GraduationCap, IdentificationBadge, LinkSimple, MagnifyingGlass, MapPin, PuzzlePiece, Quotes, Rows, SquaresFour, Stamp, Student, X, Code, StripeLogo, Files, FileArrowDown } from "phosphor-react";

import background from '../assets/bg_profnit.png';
import { Publicacao } from "./Publicacao";
import Carregando from "./Carregando";

import HC_wordcloud from 'highcharts/modules/wordcloud';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { Patent } from "./Patent";
import { CapLivro } from "./CapLivro";
import { Livro } from "./Livro";
import { Marca } from "./Marca";
import { Software } from "./Software";
import { Orientacoes } from "./Orientacoes";
import { Report } from "./Report";

type Livros = {
  id: string,
  title: string,
  year: string,
  isbn: string,
  publishing_company: string
}

type Orientacoes = {
  id: string,
  nature: string,
  oriented: string,
  status: string,
  title: string,
  type: string,
  year: string
}

interface Research {
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
  image: string,
  graduation: string,
  patent: string,
  software: string,
  brand: string,
  lattes_update: Date,
}

interface QuantidadeQualis {
  qualis: string;
  among: string;
  year: string
}


interface Props {
  program: string,
  id: string,
  term: string,
  type: string
}

type Publicacao = {
  id: string,
  doi: string,
  name_periodical: string,
  qualis: "A1" | "A2" | "A3" | "A4" | "B1" | "B2" | "B3" | "B4" | "B5" | "C" | "SQ" | "NP",
  title: string,
  year: string,
  color: string,
  researcher: string,
  lattes_id: string,
  magazine: string
  lattes_10_id: string
  jcr_link: string,
  jif: string
}

interface PalavrasChaves {
  term: string;
  among: number;
}

type Patente = {
  id: string,
  grant_date: string,
  title: string,
  year: string,
  financing: string,
  project_name: string
}


export function ResearcherPage(props: Props) {

  const { urlGeral, setUrlGeral } = useContext(UserContext);

  const { idVersao, setIdVersao } = useContext(UserContext);

  const urlGraduateProgram = `${urlGeral}/graduate_program_profnit?id=${props.program}`;

  console.log('props id',props.program)

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
         
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [urlGraduateProgram]);

  let urlTermPesquisador = `${urlGeral}researcherID?researcher_id=${props.id}`


  //logica versões
 
  setIdVersao(props.program)

  useEffect(() => {
  
  if(idVersao == "" || (idVersao > '5' )) {
    setIdVersao('1')
  }
}, [props.program]);

  console.log(urlTermPesquisador)

  const [researcher, setResearcher] = useState<Research[]>([])

  //so deixa aq
  const { valoresSelecionadosPopUp, setValoresSelecionadosPopUp } = useContext(UserContext)
  const { valoresSelecionadosExport, setValoresSelecionadosExport } = useContext(UserContext);
  const { botaoPesquisadoresClicado, setBotaoPesquisadoresClicado } = useContext(UserContext);
  const { botaoTermosClicado, setBotaoTermosClicado } = useContext(UserContext);
  const { botaoResumoClicado, setBotaoResumoClicado } = useContext(UserContext);
  const { botaoAreasClicado, setBotaoAreasClicado } = useContext(UserContext);
  const { valorDigitadoPesquisaDireta, setValorDigitadoPesquisaDireta } = useContext(UserContext);


  useEffect(() => {
    if (props.term) {
      setValoresSelecionadosExport(props.term);
    }
  }, [props.term]);

  const valoresArray = valoresSelecionadosPopUp.split(';');

  const listaValores = valoresArray.map((valor, index) => (
    <li key={index} className='whitespace-nowrap gap-2 bg-blue-100 border-blue-400 border-[1px] inline-flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold'>
      {valor.replace(/%20/g, ' ')}
      <button onClick={() => handleRemoverSelecionado(index)}>
        <X size={16} className="text-gray-400 hover:text-blue-400" />
      </button>
    </li>
  ));

  if (valoresSelecionadosPopUp == " ") {
    const listaValores = useState('')
  }



  const handleRemoverSelecionado = (index: number) => {
    setValoresSelecionadosPopUp((prevSelecionados) =>
      prevSelecionados.split(';').filter((_, i) => i !== index).join(',')
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(urlTermPesquisador, {
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
  }, [urlTermPesquisador]);

  console.log(researcher)

  const [isVisible, setIsVisible] = useState(false);

  /////////////////////////

  //qualis

  type Qualis = "A1" | "A2" | "A3" | "A4" | "B1" | "B2" | "B3" | "B4" | "B5" | "C" | "SQ" | "NP";

  const [qualis, setQualis] = useState([
    { id: 1, itens: 'A1' },
    { id: 2, itens: 'A2' },
    { id: 3, itens: 'A3' },
    { id: 4, itens: 'A4' },
    { id: 5, itens: 'B1' },
    { id: 6, itens: 'B2' },
    { id: 7, itens: 'B3' },
    { id: 8, itens: 'B4' },
    { id: 10, itens: 'C' },
    { id: 11, itens: 'SQ' },
  ]);

  //ano range
  const [value, setValue] = useState<number>(2000);

  type Quali = {
    id: number;
    itens: string;
  }

  function getColorForInstitution(qualis: Qualis) {
    const colors = {
      A1: '#006837',
      A2: '#8FC53E',
      A3: '#ACC483',
      A4: '#BDC4B1',
      B1: '#F15A24',
      B2: '#F5831F',
      B3: '#F4AD78',
      B4: '#F4A992',
      B5: '#F2D3BB',
      C: '#EC1C22',
      SQ: '#560B11',
      NP: '#560B11',
    };
    return colors[qualis] || '#000000';
  }

  const qualisColor: { [key: string]: string } = {
    'A1': 'bg-[#006837]',
    'A2': 'bg-[#8FC53E]',
    'A3': 'bg-[#ACC483]',
    'A4': 'bg-[#BDC4B1]',
    'B1': 'bg-[#F15A24]',
    'B2': 'bg-[#F5831F]',
    'B3': 'bg-[#F4AD78]',
    'B4': 'bg-[#F4A992]',
    'C': 'bg-[#EC1C22]',
    'SQ': 'bg-[#560B11]',
  }

  const [itensSelecionados, setItensSelecionados] = useState<string[]>([]);

  type CheckboxStates = {
    [index: number]: boolean;
  };

  const [checkboxStates, setCheckboxStates] = useState<CheckboxStates>({});

  const handleCheckboxChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const itemId = event.target.name;
    const isChecked = event.target.checked;

    setCheckboxStates((prevStates) => ({ ...prevStates, [itemId]: isChecked }));

    setItensSelecionados((prevSelecionados) => {
      const selectedQualis = qualis.find((q) => q.id === parseInt(itemId));
      if (selectedQualis) {
        if (isChecked) {
          return [...prevSelecionados, selectedQualis.itens];
        } else {
          return prevSelecionados.filter((item) => item !== selectedQualis.itens);
        }
      } else {
        // handle the case where selectedQualis is undefined
        return prevSelecionados;
      }
    });
  };

  const checkboxQualis = qualis.map((quali) => {
    const isChecked = checkboxStates[quali.id];
    return (
      <li
        key={quali.id}
        className="checkboxLabel group list-none inline-flex  group overflow-hidden"
        onMouseDown={(e) => e.preventDefault()}
      >
        <label
          className={`group-checked:bg-blue-400 cursor-pointer border-[1px] gap-3 bg-white border-gray-300 flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold hover:border-blue-400 hover:bg-blue-100 ${isChecked ? 'activeTab' : ''}`}
        >
          <div className={`rounded-sm h-4 w-4 ${qualisColor[quali.itens]}`}></div>
          <span className="text-center block">{quali.itens}</span>
          <input
            type="checkbox"
            name={quali.id.toString()}
            className="absolute hidden group"
            onChange={handleCheckboxChangeInput}
            id={quali.itens}
            checked={isChecked}
          />
        </label>
      </li>
    );
  });

  const [valoresSelecionados, setValoresSelecionados] = useState('');

  useEffect(() => {
    setValoresSelecionados(itensSelecionados.join(';'));
  }, [itensSelecionados]);

  //pubicações

  let urlPublicacoesPorPesquisador = `${urlGeral}bibliographic_production_researcher?terms=&researcher_id=${props.id}&type=ARTICLE&qualis=&qualis=${valoresSelecionados}&year=${value}`;

  if (props.type == "areas") {
    urlPublicacoesPorPesquisador = `${urlGeral}bibliographic_production_researcher?terms=&researcher_id=${props.id}&type=ARTICLE&qualis=&qualis=${valoresSelecionados}&year=${value}`;
  }

  if (props.type == "terms") {
    urlPublicacoesPorPesquisador = `${urlGeral}bibliographic_production_researcher?terms=${props.term}&researcher_id=${props.id}&type=ARTICLE&qualis=${valoresSelecionados}&year=${value}`;
  }

  if (props.type == "abstract") {
    urlPublicacoesPorPesquisador = `${urlGeral}bibliographic_production_researcher?terms=&researcher_id=${props.id}&type=ARTICLE&qualis=&qualis=${valoresSelecionados}&year=${value}`;
  }

  if (props.term == undefined && props.type == "") {
    urlPublicacoesPorPesquisador = `${urlGeral}bibliographic_production_researcher?terms=&researcher_id=${props.id}&type=ARTICLE&qualis=&qualis=${valoresSelecionados}&year=${value}`;
  }

  
  const [isLoading, setIsLoading] = useState(false);

  const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(urlPublicacoesPorPesquisador, {
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
          setPublicacoes(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [urlPublicacoesPorPesquisador]);

  //livros 

  const urlLivros = `${urlGeral}book_production_researcher?researcher_id=${props.id}&year=1000`;
  const [livros, setLivros] = useState<Livros[]>([]);
  const quantidadeDeLivros = livros.length;


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(urlLivros, {
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
          setLivros(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [urlLivros]);


  //cap livros 

  const urlCapLivros = `${urlGeral}book_chapter_production_researcher?researcher_id=${props.id}&year=1000`;
  const [capLivros, setCapLivros] = useState<Livros[]>([]);
  const quantidadeCapDeLivros = capLivros.length;


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(urlCapLivros, {
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
          setCapLivros(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [urlCapLivros]);


  //software

  const urlSoftware = `${urlGeral}/software_production_researcher?researcher_id=${props.id}&year=1000`;
  const [software, setSoftware] = useState<Livros[]>([]);
  const quantidadeSoftware = software.length;


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(urlSoftware, {
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
          setSoftware(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [urlSoftware]);


  //marca

  const urlMarca = `${urlGeral}brand_production_researcher?researcher_id=${props.id}&year=1000`;
  const [marca, setMarca] = useState<Livros[]>([]);
  const quantidadeMarcas = marca.length;


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(urlMarca, {
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
          setMarca(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [urlMarca]);


  //orientacoes

  const urlOrientacoes = `${urlGeral}guidance_researcher?researcher_id=${props.id}&year=1000`;
  const [orientacoes, setOrientacoes] = useState<Orientacoes[]>([]);
  const quantidadeOrientacoes = orientacoes.length;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(urlOrientacoes, {
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
          setOrientacoes(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [urlOrientacoes]);


  //block list

  const { isOn, setIsOn } = useContext(UserContext)

  const toggleButtonOn = () => {
    setIsOn(false);
  };

  const toggleButtonOff = () => {
    setIsOn(true);
  };

  const ignoredWords = ['a', 'do', 'da', 'o', 'os', 'as', 'de', "e", "i", 'na', 'du']; // Adicionar outras palavras que devem ser ignoradas


  //

  // gráfico

  interface GroupedPublications {
    [key: string]: number;
  }



  const groupedPublications = publicacoes.reduce((acc: Record<string, number>, curr) => {
    const year = curr.year;
    if (year in acc) {
      acc[year] += 1;
    } else {
      acc[year] = 1;
    }
    return acc;
  }, {});

  const colors = ['#003168', '#0057bb', '#0087ff', '#99c7ff']

  const getColorForIndex = (index: number) => {
    const colorIndex = index % colors.length;
    return colors[colorIndex];
  };

  const options = {
    credits: {
      enabled: false
    },
    chart: {
      type: valoresSelecionadosPopUp.length === 0 || botaoPesquisadoresClicado || botaoAreasClicado ? 'line' : 'column',
      height: '250px'
    },
    title: {
      text: '',
    },
    xAxis: {
      categories: Object.keys(groupedPublications),
      title: {
        text: 'Ano',
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Número de publicações',
      },
    },
    series: [
      {
        name: 'Publicações',
        data: Object.values(groupedPublications).map((value, index) => ({
          y: value,
          color: valoresSelecionadosPopUp.length === 0 || botaoPesquisadoresClicado || botaoAreasClicado ? '#005399' : getColorForIndex(index),
        })),
      },
    ],
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          inside: true,
          style: {
            color: 'white',
            fontSize: '14px',
            textOutline: '0px contrast',
            fontFamily: 'Ubuntu, sans-serif'
          },
        },
      }
    },
  };

  // gráfico palavras chaves
  const [words, setWords] = useState<PalavrasChaves[]>([]);

  let urlPalavrasChaves = `${urlGeral}lists_word_researcher?researcher_id=${props.id}`


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

  const options2 = {
    chart: {
      backgroundColor: 'transparent',
      height: '250px',
      display: 'flex',
      position: 'relative'
    },
    credits: {
      enabled: false
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
        colors: ['#005399', '#041962', '#174EA6'],

      },
    },
  };

  //teste de gráfico

  const [chartOptions, setChartOptions] = useState({});

  

  type CountResult = {
    [key: string]: number;
  };

  useEffect(() => {
    if (publicacoes) {
      const counts = publicacoes.reduce((result: CountResult, publicacao) => {
        const qualis = publicacao.qualis;
        result[qualis] = (result[qualis] || 0) + 1;
        return result;
      }, {});

      const data = Object.entries(counts).map(([name, count]) => {
        return { name, y: count };
      });

      const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
      const categories = sortedData.map((item) => item.name);

      const qualisYears = [...new Set(publicacoes.map(q => q.year))].sort();

      setChartOptions({
        chart: {
          type: 'column',
          backgroundColor: 'transparent',
          fontFamily: 'Ubuntu, sans-serif',
          height: '280px',
          display: 'flex',
          position: 'relative',
        },
        title: {
          text: '',
        },
        credits: {
          enabled: false
        },
        xAxis: {
          type: 'category',
          categories,
          title: {
            text: 'Tipo de Qualis',
            fontFamily: 'Ubuntu, sans-serif',
          },
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Quantidade',
          },
        },
        series: [
          {
            name: 'Qualis',
            data: sortedData.map((item) => {
              let qualis: Qualis = item.name as Qualis; // converte para o tipo Qualis
              return { y: item.y, color: getColorForInstitution(qualis) };
            }),
          },
        ],
        plotOptions: {
          series: {
            colorByPoint: false,
            pointWidth: null,
            dataLabels: {
              enabled: true,
              inside: true,
              style: {
                color: 'white',
                fontSize: '18px',
                textOutline: '0px contrast',
                fontFamily: 'Ubuntu, sans-serif',
              },
            },
          },
          column: {},
        },
      });
    }
  }, [publicacoes]);



  // BTN MOSTRAR RESULTADOS 

  const [filterValue, setFilterValue] = useState("");
  const filteredResults = publicacoes.filter(props =>
    props.title.toUpperCase().includes(filterValue.toUpperCase())
  );

  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 12;
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = filteredResults.slice(indexOfFirstResult, indexOfLastResult);



  //TOTAL DE PUBLICAÇÕES
  const { totalPublicacoes, setTotalPublicacoes } = useContext(UserContext);
  const quantidadeTotalDePublicacoes = publicacoes.length;
  setTotalPublicacoes(quantidadeTotalDePublicacoes.toString())

  //tabs
  const [selectedTab, setSelectedTab] = useState(0);

  function onClickPublicacoes() {
    setSelectedTab(0)
  }

  function onClickProducaoTecnica() {
    setSelectedTab(1)
  }

  function onClickOrientacoes() {
    setSelectedTab(2)
  }

  function onClickLivros() {
    setSelectedTab(3)
  }

  function onClickRelatorioTecnico() {
    setSelectedTab(4)
  }

  //patente

  const [patente, setPatente] = useState<Patente[]>([]);

  const urlPatente = `${urlGeral}patent_production_researcher?researcher_id=${props.id}&year=1000`;
  const quantidadePatente = patente.length;
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(urlPatente, {
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
          setPatente(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [urlPatente]);

  //btn voltar


  function ArrowUDownLeftClick(event: React.MouseEvent<HTMLDivElement>) {
    if (botaoResumoClicado === false) {
      setValoresSelecionadosPopUp(valoresSelecionadosExport)
    }
    setValoresSelecionados('');
    setItensSelecionados([])
  }

   //relatorio tecnico

  const [relatorio, setRelatorio] = useState<Patente[]>([]);

  const urlRelatorio = `${urlGeral}researcher_report?researcher_id=${props.id}&year=1000`;

    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(urlRelatorio, {
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
            setRelatorio(data);
          }
        } catch (err) {
          console.log(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }, [urlRelatorio]);



    //GRÁFICO PRODUÇÃO TÉCNICA

    const colorsprd = ['#173DFF', '#8AB4F8', '#174EA6'];
      const optionsproduc = {
        chart: {
          type: 'column',
          backgroundColor: 'transparent',
          fontFamily: 'Ubuntu, sans-serif',
          height: '280px',
          display: 'flex',
          position: 'relative',
        },
        title: {
          text: '',
        },
        credits: {
          enabled: false,
        },
        xAxis: {
          categories: ['Software', 'Patente', 'Marcas'],
          title: {
            text: '',
            fontFamily: 'Ubuntu, sans-serif',
          },
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Quantidade',
          },
        },
        series: [
          {
            name: 'Quantidade',
            data: [
              {
                y: quantidadeSoftware,
                color: colorsprd[0], // Cor para a coluna de Software
              },
              {
                y: quantidadePatente,
                color: colorsprd[1], // Cor para a coluna de Patente
              },
              {
                y: quantidadeMarcas,
                color: colorsprd[2], // Cor para a coluna de Marcas
              },
            ],
          },
        ],
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true,
              inside: true,
              style: {
                color: 'white',
                fontSize: '18px',
                textOutline: '0px contrast',
                fontFamily: 'Ubuntu, sans-serif',
              },
            },
          },
        },
      };

      //gráfico livros

  
      const optionslivros= {
        chart: {
          type: 'column',
          backgroundColor: 'transparent',
          fontFamily: 'Ubuntu, sans-serif',
          height: '280px',
          display: 'flex',
          position: 'relative',
        },
        title: {
          text: '',
        },
        credits: {
          enabled: false,
        },
        xAxis: {
          categories: ['Livros', 'Capítulos de livros'],
          title: {
            text: 'Tipo',
            fontFamily: 'Ubuntu, sans-serif',
          },
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Quantidade',
          },
        },
        series: [
          {
            name: 'Quantidade',
            data: [quantidadeDeLivros, quantidadeCapDeLivros],
          },
        ],
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true,
              inside: true,
              style: {
                color: 'white',
                fontSize: '18px',
                textOutline: '0px contrast',
                fontFamily: 'Ubuntu, sans-serif',
              },
            },
          },
        },
      };

      //gráfico orientações

      const colorsorientacoes = ['#238536', '#FFCF00'];

      const orientacaoProgramCount: Record<string, number> = {};

      orientacoes.forEach(program => {
        const state = program.status;
        if (orientacaoProgramCount[state]) {
          orientacaoProgramCount[state] += 1;
        } else {
          orientacaoProgramCount[state] = 1;
        }
      });

      const totalOrientacoes = Object.entries(orientacaoProgramCount).map(([status, count], index) => ({
        status,
        count,
        color: status === 'Em andamento' ? '#FFCF00' : status === 'Concluída' ? '#238536' :colorsorientacoes[index], // Destaca "Em andamento" com vermelho
      }));
    
      const optionsOrient = {
        chart: {
          type: 'column',
          backgroundColor: 'transparent',
          fontFamily: 'Ubuntu, sans-serif',
          height: '280px',
          display: 'flex',
          position: 'relative',
        },
        title: {
          text: '',
        },
        credits: {
          enabled: false,
        },
        xAxis: {
          categories: totalOrientacoes.map((item) => item.status),
          title: {
            text: 'Status',
            fontFamily: 'Ubuntu, sans-serif',
          },
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Quantidade',
          },
        },
        series: [
          {
            name: 'Orientações',
            data: totalOrientacoes.map((item) => ({
              y: item.count,
              color: item.color, // Usa a cor associada à coluna
            })),
          },
        ],
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true,
              inside: true,
              style: {
                color: 'white',
                fontSize: '18px',
                textOutline: '0px contrast',
                fontFamily: 'Ubuntu, sans-serif',
              },
            },
          },
        },
      };
      

  return (
    <div>
      {researcher.map(props => {

        const currentDate = new Date();
        const lattesUpdate = props.lattes_update.toString().split('/');
        const lattesMonth = parseInt(lattesUpdate[1]);

        const monthDifference = currentDate.getMonth() + 1 - lattesMonth;

        const isOutdated = monthDifference > 3;

        return (
          <div className={` absolute z-[-1] bg-cover bg-center bg-no-repeat backdrop-blur-md backdrop-brightness-150 h-[280px] rounded-sm w-full flex bg-blue-100`} style={{ backgroundImage: `url(${background})` }}>
            <div className={` bg-opacity-40 absolute backdrop-blur-sm w-full h-full`}>
              <div className="relative flex justify-end right-0 ml-auto">
                <div className={`border-[1px] ml-auto border-gray-300 w-fit py-2 px-4 text-gray-400 rounded-full text-xs font-bold  flex gap-1 items-center absolute top-[220px] right-16 ${isOutdated ? ('bg-red-400 text-white border-none') : ('bg-white')}`}>Data de atualização do Lattes: {props.lattes_update.toString()}</div>
              </div>
            </div>
          </div>
        )
      })}

      <div className="w-full px-6 md:px-16 flex pt-[120px] gap-12 ">
        <div className="bg-white border-[1px] elementPesquisador z-[999] overflow-y-auto border-gray-300 rounded-lg  p-8  min-w-[400px] w-[400px] sticky top-[80px]" style={{ height: `calc(100vh - 80px)` }}>
          {researcher.map(props => {
            return (

              <div>
                <div className="w-full flex justify-center ">
                  <div className="bg-cover bg-center bg-no-repeat h-24 w-24 bg-white rounded-md mb-3 border-4 border-white relative " style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id}) ` }}></div>
                </div>

                <div className="flex items-center flex-col  relative">
                  <h4 className="text-3xl font-medium px-8 text-center mb-4">{props.name}</h4>
                  <div className="flex items-center gap-2 mb-4">
                    {props.image == "None" ? (
                      <Buildings size={16} className="text-gray-500" />
                    ) : (
                      <img src={props.image} alt="" className="h-6" />

                    )}
                    <p className="text-md  text-gray-500">{props.university}</p>
                  </div>

                  <div className="flex gap-3 mb-6 flex-wrap  items-center w-full">

                    {props.area.split(';').map((value, index) => (
                      <li
                        key={index}
                        className={`py-2 whitespace-nowrap  justify-center px-4 rounded-md text-xs font-bold flex gap-2 text-white items-center ${value.includes('CIENCIAS AGRARIAS') ? 'bg-red-400' : value.includes('CIENCIAS EXATAS E DA TERRA') ? 'bg-green-400' : value.includes('CIENCIAS DA SAUDE') ? 'bg-[#20BDBE]' : value.includes('CIENCIAS HUMANAS') ? 'bg-[#F5831F]' : value.includes('CIENCIAS BIOLOGICAS') ? 'bg-[#EB008B]' : value.includes('ENGENHARIAS') ? 'bg-[#FCB712]' : value.includes('CIENCIAS SOCIAIS APLICADAS') ? 'bg-[#009245]' : value.includes('LINGUISTICA LETRAS E ARTES') ? 'bg-[#A67C52]' : value.includes('OUTROS') ? 'bg-[#1B1464]' : 'bg-[#000]'}
                            `}
                      >
                        <PuzzlePiece size={12} className="text-white" /> {value.trim()}
                      </li>
                    ))}

                    <div className="bg-blue-400 py-2  justify-center px-4 text-white rounded-md text-xs font-bold flex gap-2 items-center"><MapPin size={12} className="textwhite" /> {props.city}</div>
                    {props.orcid == "None" ? (
                      <head></head>
                    ) : (
                      <a href={`https://orcid.org/${props.orcid}`} target="blank_" className="bg-blue-400  justify-center py-2 px-4 text-white rounded-md text-xs font-bold flex gap-2 items-center"><IdentificationBadge size={12} className="textwhite" /> Orcid: {props.orcid}</a>
                    )}
                    <a href={`https://lattes.cnpq.br/${props.lattes_id}`} target="blank_" className="bg-blue-400 py-2 justify-center  px-4 text-white rounded-md text-xs font-bold flex gap-2 items-center"><LinkSimple size={12} className="textwhite" /> Currículo Lattes</a>

                    <div className="bg-blue-400 py-2 justify-center px-4 text-white rounded-md text-xs font-bold flex gap-2 items-center"><GraduationCap size={12} className="textwhite" /> {props.graduation}</div>



                  </div>



                  <div className={isVisible ? "h-auto transition-all" : "h-[60px] overflow-hidden transition-all"}>
                    <p className="text-sm text-gray-400 text-justify">
                      {props.abstract
                        .replace(/&quot;/g, '"')
                        .replace(/&#10;/g, '\n')
                        .split(' ')
                        .map((word, index) => {
                          const formattedWord = word.toLowerCase();
                          if (valoresSelecionadosExport.includes(formattedWord) && !ignoredWords.includes(formattedWord)) {
                            return (
                              <span key={index} className="text-blue-400 font-bold">
                                {word}{' '}
                              </span>
                            );
                          }
                          return <span key={index}>{word} </span>;
                        })}
                    </p>

                  </div>


                  <div className="flex gap-4 items-center mt-4">
                    <div className="animate-bounce cursor-pointer rounded-full hover:bg-gray-100 h-[38px] w-[38px] transition-all flex items-center justify-center">
                      <CaretDown onClick={() => setIsVisible(!isVisible)} size={24} className={isVisible ? "rotate-180 transition-all text-gray-400" : "text-gray-400 transition-all"} />
                    </div>
                  </div>


                  <div className="w-full lg:w-[350px] border-[1px] border-gray-300 rounded-md p-6 h-min mb-6">
                    <div className="w-full flex justify-center mb-4">

                      <ChartBar size={40} className="text-blue-400" />
                    </div>

                    <div className="flex  relative w-full justify-center">
                      {(botaoTermosClicado && valoresSelecionadosPopUp != "") || (botaoAreasClicado && props.among != null) ? (
                        <div className="text-blue-400 flex text-md font-bold">
                          {props.among} ocorrências
                          <p className="text-md  text-blue-400 mx-3">|</p>
                        </div>
                      ) : (
                        <head></head>
                      )}

                      <div className=" text-blue-400 text-md font-bold">{Number(props.articles) + Number(props.book) + Number(props.book_chapters) + Number(props.software) + Number(props.brand) + Number(props.patent)} produções</div>

                    </div>

                    <div className="flex w-full gap-4 items-center justify-between relative">
                      <div className="w-full grid grid-cols-2 gap-4 mt-6 ">
                        <div className="w-full border-[1px] h-14 items-center border-gray-300 py-3 flex px-4 text-gray-400 rounded-md text-xs font-medium">{props.articles} artigos</div>
                        <div className="w-full border-[1px] h-14 items-center border-gray-300 py-3 flex px-4 text-gray-400 rounded-md text-xs font-medium">{props.book} livros</div>
                        <div className="w-full border-[1px] h-14 items-center border-gray-300 py-3 flex px-4 text-gray-400 rounded-md text-xs font-medium">{props.book_chapters} capítulos de livros</div>
                        <div className="w-full border-[1px] h-14 items-center border-gray-300 py-3 flex px-4 text-gray-400 rounded-md text-xs font-medium">{props.patent} patentes</div>
                        <div className="w-full border-[1px] h-14 items-center border-gray-300 py-3 flex px-4 text-gray-400 rounded-md text-xs font-medium">{props.software} softwares</div>
                        <div className="w-full border-[1px] h-14 items-center border-gray-300 py-3 flex px-4 text-gray-400 rounded-md text-xs font-medium">{props.brand} marcas</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            )
          })}
        </div>

        <div className="mt-[160px] pt-12 w-full">
          <div className="flex-1 h-full ">


            <Tabs>
              <TabList className={`flex gap-2 mb-6`}>
                <Tab selected={selectedTab === 0} className={`outline-none cursor-pointer text-sm rounded-full text-gray-400 flex items-center border-[1px] border-white gap-2 px-4 py-2 font-semibold transition  ${selectedTab == 0 ? "bg-blue-400 text-white hover:bg-blue-500" : ('hover:bg-gray-100')}`} onClick={onClickPublicacoes} >
                  <Quotes size={16} />
                  Artigos
                </Tab>

                <Tab selected={selectedTab === 3} className={`outline-none cursor-pointer text-sm rounded-full text-gray-400 flex items-center border-[1px] border-white gap-2 px-4 py-2 font-semibold transition  ${selectedTab == 3 ? "bg-blue-400 text-white hover:bg-blue-500" : ('hover:bg-gray-100')}`} onClick={onClickLivros} >
                  <File size={16} />
                  Livros e capítulos
                </Tab>

                <Tab selected={selectedTab === 1} className={`outline-none cursor-pointer text-sm rounded-full text-gray-400 flex items-center border-[1px] border-white gap-2 px-4 py-2 font-semibold transition  ${selectedTab == 1 ? "bg-blue-400 text-white hover:bg-blue-500" : ('hover:bg-gray-100')}`} onClick={onClickProducaoTecnica}>
                  <Stamp size={16} />
                  Produção técnica
                </Tab>

                <Tab selected={selectedTab === 4} className={`whitespace-nowrap outline-none cursor-pointer text-sm rounded-full text-gray-400 flex items-center border-[1px] border-white gap-2 px-4 py-2 font-semibold transition  ${selectedTab == 4 ? "bg-blue-400 text-white hover:bg-blue-500" : ('hover:bg-gray-100')}`} onClick={onClickRelatorioTecnico}>
                      <Files size={16} />
                      Relatório técnico
                    </Tab>

                <Tab selected={selectedTab === 2} className={`outline-none cursor-pointer text-sm text-gray-400 rounded-full flex items-center gap-2 px-4 py-2 font-semibold  transition ${selectedTab == 2 ? "bg-blue-400 text-white hover:bg-blue-500" : ('hover:bg-gray-100')}`} onClick={onClickOrientacoes}>
                  <Student size={16} />
                  Orientações
                </Tab>
              </TabList>

              <TabPanel>
                <div>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="w-full border-[1px] border-gray-300 rounded-md p-6 h-full">
                      {valorDigitadoPesquisaDireta == "" && valoresSelecionadosPopUp == "" || botaoPesquisadoresClicado || botaoAreasClicado || props.type == "abstract" ||  props.type == "areas" ? (
                        <div className="text-center font-medium text-xl text-gray-500 mb-6">Todas as publicações por ano</div>
                      ) : (
                        <div className="flex gap-2 w-full flex-col justify-center">
                          <p className="text-center font-medium text-xl text-gray-500">Número de publicações pela palavra chave </p>
                          {valoresSelecionadosPopUp == "" ? (
                            <div className="text-blue-400 font-bold">{valorDigitadoPesquisaDireta.replace(/;/g, ' ')}</div>
                          ) : (
                            <div className="flex gap-2 justify-center mb-6">{listaValores}</div>
                          )}
                        </div>
                      )}
                      <HighchartsReact highcharts={Highcharts} options={options} />
                    </div>

                    <div className="w-full mb-6 border-[1px] border-gray-300 rounded-md p-6 h-full">
                      <div className="text-center font-medium text-xl text-gray-500 mb-6">Palavras-chaves mais recorrentes</div>
                      <HighchartsReact highcharts={Highcharts} options={options2} />
                    </div>
                  </div>

                  <div className="w-full border-[1px] border-gray-300 rounded-md p-6 h-min">
                  {valorDigitadoPesquisaDireta == "" && valoresSelecionadosPopUp == "" || botaoPesquisadoresClicado || botaoAreasClicado || props.type == "abstract" ||  props.type == "areas"? (
                    <div className="text-center font-medium text-xl text-gray-500 mb-6">Todas as publicações por qualis</div>
                  ) : (
                    <div className="flex gap-2 w-full flex-col justify-center">
                      <p className="text-center font-medium text-xl text-gray-500">Número de publicações por qualis pela palavra chave </p>
                      {valoresSelecionadosPopUp == "" ? (
                        <div className="text-blue-400 font-bold">{valorDigitadoPesquisaDireta.replace(/;/g, ' ')}</div>
                      ) : (
                        <div className="flex gap-2 justify-center mb-6">{listaValores}</div>
                      )}
                    </div>
                  )}
                    <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                  </div>

                  {valoresSelecionadosPopUp != '' ? ('') : (
                    <div className=" flex gap-4 p-6 border-[1px] border-gray-300 rounded-md mt-6 items-center w-fit">
                      <div>
                        <p className="text-gray-400 mb-4  whitespace-nowrap">Selecione os qualis desejados</p>
                        <div className="gap-4 flex flex-wrap ">
                          {checkboxQualis}
                        </div>
                      </div>

                      <div className="mx-4 h-[80px] min-h-max w-[1px] bg-gray-300 relative ">

                      </div>

                      <div className="flex-1 ">
                        <p className="text-gray-400 mb-4 whitespace-nowrap">Selecione o ano da publicação</p>
                        <div className="flex h-10 items-center">
                          <input
                            type="range"
                            min={2000}
                            max={2023}
                            defaultValue={2000}
                            step={1}
                            value={value}
                            onChange={(e) => setValue(Number(e.target.value))}
                            className="w-full "
                          />
                          <p className="ml-4 ">{value}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>


                {botaoAreasClicado || botaoPesquisadoresClicado || (valoresSelecionadosPopUp == "" && valorDigitadoPesquisaDireta == "" )  || props.type == "abstract"  || props.type == "areas" ? (
                  <div className="flex justify-between pb-8 w-full items-center mt-6">
                    <div className="flex gap-4 w-full">
                      <File size={24} className="text-gray-400" />
                      <p className="text-gray-400">Todas as produções</p>
                    </div>

                    <div className="flex gap-4">
                      <div onClick={ArrowUDownLeftClick} className=" cursor-pointer rounded-full hover:bg-gray-100 h-[38px] w-[38px] transition-all flex items-center justify-center">
                        <ArrowUDownLeft size={24} className="text-gray-400 transition-all" />
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
                ) : (
                  <div className="flex justify-between pb-8 w-full items-center mt-6">
                    <div className="flex gap-4 w-full  items-center">
                      <File size={24} className="text-gray-400" />
                      <p className="text-gray-400 flex items-center gap-2">
                        <strong className="text-blue-400">{totalPublicacoes}</strong> ocorrências do termo
                        <div className="flex gap-2">
                          {valoresSelecionadosPopUp == "" ? (
                            <div className="text-blue-400 font-bold">{valorDigitadoPesquisaDireta.replace(/;/g, ' ')}</div>
                          ) : (
                            listaValores
                          )}
                        </div> em

                        <strong className="text-blue-400"> {researcher.map(props => {
                          return (
                            <div>{Number(props.articles)}</div>
                          )
                        })} </strong> artigos
                      </p>
                    </div>



                    <div className="flex gap-4">
                      <div onClick={ArrowUDownLeftClick} className=" cursor-pointer rounded-full hover:bg-gray-100 h-[38px] w-[38px] transition-all flex items-center justify-center">
                        <ArrowUDownLeft size={24} className="text-gray-400 transition-all" />
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
                )}


                {valoresSelecionadosPopUp ? (
                  <div></div>
                ) : (
                  <div className="flex mb-6 items-center justify-center border-gray-300 border-[1px] rounded-lg py-4">
                    <MagnifyingGlass size={20} className={`text-gray-400 min-w-[52px] ${botaoTermosClicado ? 'group-hover:text-[#005399]' : ''} ${botaoResumoClicado ? 'group-hover:text-red-400' : ''} ${botaoAreasClicado ? 'group-hover:text-[#8FC53E]' : ''} ${botaoPesquisadoresClicado ? 'group-hover:text-[#20BDBE]' : ''}`} />
                    <input
                      type="text"
                      value={filterValue}
                      onChange={e => setFilterValue(e.target.value)}
                      placeholder="Filtrar resultados"
                      className="w-full outline-none"
                    />
                  </div>
                )}


                <div>
                  {isLoading ? (
                    <div className="flex items-center justify-center w-full py-10">
                      <Carregando />
                    </div>
                  ) : (
                    <div className={`mb-9 grid grid-cols-1 md:grid-cols-2 gap-6  m-[0 auto] w-full ${isOn ? "lg:grid-cols-1 2xl:grid-cols-1" : "lg:grid-cols-2 2xl:grid-cols-3"}`}>
                      {currentResults.map(props => {
                        return (
                          <Publicacao
                            id={props.id}
                            doi={props.doi}
                            name_periodical={props.name_periodical}
                            qualis={props.qualis}
                            title={props.title.toUpperCase()}
                            year={props.year}
                            color={props.color}
                            researcher={props.researcher}
                            lattes_id={props.lattes_id}
                            magazine={props.magazine}
                            lattes_10_id={props.lattes_10_id}
                            jcr_link={props.jcr_link}
                            jif={props.jif}
                          />

                        )
                      })}
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
                        backgroundColor: indexOfLastResult >= publicacoes.length ? '#ccc' : '#005399',
                        opacity: indexOfLastResult >= publicacoes.length ? '0.5' : '1',
                      }}
                      disabled={indexOfLastResult >= publicacoes.length}
                    >
                      Próximo<CaretCircleRight size={16} className="text-white" />
                    </button>
                  </div>
                </div>


                <div className="mb-9">



                </div>


              </TabPanel>

              <TabPanel>
              {quantidadeDeLivros !== 0 || quantidadeCapDeLivros !== 0 ? (
              <div className="w-full mb-6 border-[1px] border-gray-300 rounded-md p-6">
                <div className="text-center font-medium text-xl text-gray-500 mb-6">Quantidade de livros e capítulos</div>
                <HighchartsReact highcharts={Highcharts} options={optionslivros} />
              </div>
            ) : (
              <div></div>
            )}

                <div className="flex gap-4 w-full pb-8">
                  <Book size={24} className="text-gray-400" />
                  <p className="text-gray-400">Livros</p>
                </div>
                <div>
                  {isLoading ? (
                    <div className="flex items-center justify-center w-full py-10">
                      <Carregando />
                    </div>
                  ) : (
                    <>
                      {livros.length === 0 ? (
                        <p className="text-center">Nenhum livro encontrado</p>
                      ) : (
                        <div className={`mb-9 grid md:grid-cols-2 grid-cols-1 gap-6 m-[0 auto] w-full`}>
                          {livros.map(props => (
                            <Livro
                              id={props.id}
                              title={props.title}
                              year={props.year}
                              isbn= {props.isbn}
                              publishing_company= {props.publishing_company}

                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="flex gap-4 w-full pb-8">
                  <Books size={24} className="text-gray-400" />
                  <p className="text-gray-400">Capítulos de livros</p>
                </div>

                <div>
                  {isLoading ? (
                    <div className="flex items-center justify-center w-full py-10">
                      <Carregando />
                    </div>
                  ) : (
                    <>
                      {capLivros.length === 0 ? (
                        <p className="text-center">Nenhum capítulo de livro encontrado</p>
                      ) : (
                        <div className={`mb-9 grid md:grid-cols-2 grid-cols-1  gap-6 m-[0 auto] w-full`}>
                          {capLivros.map(props => (
                            <CapLivro
                              id={props.id}
                              title={props.title}
                              year={props.year}
                              isbn= {props.isbn}
                                  publishing_company= {props.publishing_company}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </TabPanel>


              <TabPanel className={`w-full`}>
              {quantidadeMarcas !== 0 || quantidadePatente !== 0 || quantidadeSoftware !== 0 ? (
              <div className="w-full mb-6 border-[1px] border-gray-300 rounded-md p-6">
                <div className="text-center font-medium text-xl text-gray-500 mb-6">Quantidade de produções técnicas</div>
                <HighchartsReact highcharts={Highcharts} options={optionsproduc} />
              </div>
            ) : (
              <div></div>
            )}


                <div className="flex gap-4 w-full pb-8">
                  <Books size={24} className="text-gray-400" />
                  <p className="text-gray-400">Patentes</p>
                </div>

                <div>
                  {isLoading ? (
                    <div className="flex items-center justify-center w-full py-10">
                      <Carregando />
                    </div>
                  ) : (
                    <>
                      {patente.length === 0 ? (
                        <p className="text-center text-gray-400 mb-6">Nenhuma patente encontrada</p>
                      ) : (
                        <div className={`mb-9 grid grid-cols-1  gap-6  m-[0 auto] w-full `}>
                          {patente.map(props => {
                            return (
                              <Patent

                                id={props.id}
                                grant_date={props.grant_date}
                                title={props.title}
                                year={props.year}

                              />

                            )
                          })}
                        </div>
                      )}
                    </>
                  )}

                </div>

                <div className="flex gap-4 w-full pb-8">
                  <Code size={24} className="text-gray-400" />
                  <p className="text-gray-400">Software</p>
                </div>

                <div>
                  {isLoading ? (
                    <div className="flex items-center justify-center w-full py-10">
                      <Carregando />
                    </div>
                  ) : (
                    <>
                      {software.length === 0 ? (
                        <p className="text-center">Nenhum software encontrado</p>
                      ) : (
                        <div className={`mb-9 grid grid-cols-2  gap-6 m-[0 auto] w-full`}>
                          {software.map(props => (
                            <Software
                              id={props.id}
                              title={props.title}
                              year={props.year}

                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>


                <div className="flex gap-4 w-full pb-8">
                  <StripeLogo size={24} className="text-gray-400" />
                  <p className="text-gray-400">Marca</p>
                </div>

                <div>
                  {isLoading ? (
                    <div className="flex items-center justify-center w-full py-10">
                      <Carregando />
                    </div>
                  ) : (
                    <>
                      {marca.length === 0 ? (
                        <p className="text-center">Nenhuma marca encontrada</p>
                      ) : (
                        <div className={`mb-9 grid grid-cols-1  gap-6 m-[0 auto] w-full`}>
                          {marca.map(props => (
                            <Marca
                              id={props.id}
                              title={props.title}
                              year={props.year}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </TabPanel>

              <TabPanel>
                <div className="flex gap-4 w-full pb-8">
                  <File size={24} className="text-gray-400" />
                  <p className="text-gray-400">Todos os relatórios </p>
                </div>

                <div>
                      {isLoading ? (
                        <div className="flex items-center justify-center w-full py-10">
                          <Carregando />
                        </div>
                      ) : (
                        <>
                          {relatorio.length === 0 ? (
                            <p className="text-center">Nenhum relatorio técnico encontrado</p>
                          ) : (
                            <div className={`mb-9 grid grid-cols-2  gap-6 m-[0 auto] w-full`}>
                              {relatorio.map(props => (
                                <Report
                                  id={props.id}
                                  title={props.title}
                                  year={props.year}
                                  financing={props.financing}
                                  project_name = {props.project_name}
                                />
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
              </TabPanel>

              <TabPanel>

              {quantidadeOrientacoes !== 0 ? (
              <div className="w-full mb-6 border-[1px] border-gray-300 rounded-md p-6">
                <div className="text-center font-medium text-xl text-gray-500 mb-6">Contagem de Orientações por Status</div>
                <HighchartsReact highcharts={Highcharts} options={optionsOrient} />
              </div>
            ) : (
              <div></div>
            )}
                <div className="flex gap-4 w-full pb-8">
                  <Books size={24} className="text-gray-400" />
                  <p className="text-gray-400">Orientações</p>
                </div>

                <div>
                  {isLoading ? (
                    <div className="flex items-center justify-center w-full py-10">
                      <Carregando />
                    </div>
                  ) : (
                    <>
                      {orientacoes.length === 0 ? (
                        <p className="text-center">Nenhuma orientação encontrada</p>
                      ) : (
                        <div className={`mb-9 grid grid-cols-1 md:grid-cols-2 ${isOn ? "lg:grid-cols-1 2xl:grid-cols-1" : "lg:grid-cols-2 2xl:grid-cols-3"} gap-6 m-[0 auto] w-full`}>
                          {orientacoes.map(props => (
                            <Orientacoes
                              id={props.id}
                              title={props.title}
                              year={props.year}
                              type={props.type}
                              nature={props.nature}
                              oriented={props.oriented}
                              status={props.status}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </TabPanel>
            </Tabs>
          </div>




        </div>
      </div>

    </div>
  )
}