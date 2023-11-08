import { Book, BookOpen, Books, Calendar, CalendarBlank, Graph, Quotes, File, CaretCircleLeft, CaretCircleRight, LinkBreak, SquaresFour, Rows, FileCsv, X } from "phosphor-react";
import { UserContext } from '../contexts/context'
import { useEffect, useState, useContext } from "react";
import Carregando from "./Carregando";

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import drilldown from 'highcharts/modules/drilldown'
import { Publicacao } from "./Publicacao";

drilldown(Highcharts)

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
  magazine: string,
  lattes_10_id: string,
  jcr_link: string,
  jif: string
}


interface PesquisadorProps {
  id: string,
}

export function Publicacoes() {
  const [isLoading, setIsLoading] = useState(false);
  const { valoresSelecionadosExport, setValoresSelecionadosExport } = useContext(UserContext);
  const { totalPublicacoes, setTotalPublicacoes } = useContext(UserContext);
  const { valorDigitadoPesquisaDireta, setValorDigitadoPesquisaDireta } = useContext(UserContext);
  const { urlGeral, setUrlGeral } = useContext(UserContext);

  let urlTermPublicacoes = `${urlGeral}bibliographic_production_article?terms=${valoresSelecionadosExport}&year=2000&qualis=A1;A2;A3;A4;B1;B2;B3;B4;B5;C`;

  const [researcher, setResearcher] = useState<PesquisadorProps[]>([]); // Define o estado vazio no início
  const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]); // Define o estado vazio no início

  // BTN MOSTRAR RESULTADOS 
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 12;
  const totalPages = Math.ceil(publicacoes.length / resultsPerPage);

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;

  const currentResults = publicacoes.slice(indexOfFirstResult, indexOfLastResult);

  //btns da página search

  const { botaoPesquisadoresClicado, setBotaoPesquisadoresClicado } = useContext(UserContext);
  const { botaoTermosClicado, setBotaoTermosClicado } = useContext(UserContext);
  const { botaoResumoClicado, setBotaoResumoClicado } = useContext(UserContext);
  const { botaoAreasClicado, setBotaoAreasClicado } = useContext(UserContext);

  //mudar cor
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
    'NP': 'bg-[#560B11]'
  }



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

  //pesqusisadores

  let urlTermPesquisadores = `${urlGeral}/researcherName?name=${valoresSelecionadosExport}`;

  if (botaoPesquisadoresClicado) {
    urlTermPesquisadores = `${urlGeral}/researcherName?name=${valoresSelecionadosExport}`;
  }

  if (botaoPesquisadoresClicado && valoresSelecionadosExport == "") {
    let valorDigitadoPesquisaDiretaPesquisadores = valorDigitadoPesquisaDireta.replace(/;/g, '%20')
    urlTermPesquisadores = `${urlGeral}/researcherName?name=${valorDigitadoPesquisaDiretaPesquisadores}&year=${value}`;
  }

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

  // novo

  const { enabled, setEnabled } = useContext(UserContext)

  const [type, setType] = useState('ARTICLE')


  useEffect(() => {
    if (enabled === true) {
      setType('ABSTRACT');
    } else {
      setType('ARTICLE');
    }
  }, [enabled]);

  const { intituicoesSelecionadasCheckbox, setIntituicoesSelecionadasCheckbox } = useContext(UserContext)

  const {distinct, setDistinct} = useContext(UserContext)
  const [distinctValue, setDistinctValeu] = useState('0')

  useEffect(() => {
    if (distinct === false) {
      setDistinctValeu('0')
    }
    else {
      setDistinctValeu('1')
    }
  }, [distinct]);


  const { idGraduateProgram, setIdGraduateProgram } = useContext(UserContext)

  let valoresSelecionados = itensSelecionados.join(';');

  urlTermPublicacoes = `${urlGeral}bibliographic_production_article?terms=${valoresSelecionadosExport}&year=${value}&qualis=${valoresSelecionados}&university=${intituicoesSelecionadasCheckbox}&distinct=${distinctValue}&graduate_program_id=${idGraduateProgram}`;

  if (botaoTermosClicado) {
    urlTermPublicacoes = `${urlGeral}bibliographic_production_article?terms=${valoresSelecionadosExport}&year=${value}&qualis=${valoresSelecionados}&university=${intituicoesSelecionadasCheckbox}&distinct=${distinctValue}&graduate_program_id=${idGraduateProgram}`;
  }

  if (botaoTermosClicado && valoresSelecionadosExport == "") {
    urlTermPublicacoes = `${urlGeral}bibliographic_production_article?terms=${valorDigitadoPesquisaDireta}&year=${value}&qualis=${valoresSelecionados}&university=${intituicoesSelecionadasCheckbox}&distinct=${distinctValue}&graduate_program_id=${idGraduateProgram}`;
  }

  if (botaoResumoClicado) {
    urlTermPublicacoes = `${urlGeral}bibliographic_production_article?terms=${valoresSelecionadosExport}&year=${value}&qualis=${valoresSelecionados}&university=${intituicoesSelecionadasCheckbox}&distinct=${distinctValue}`;
  }

  if (botaoResumoClicado && valoresSelecionadosExport == "") {
    urlTermPublicacoes = `${urlGeral}bibliographic_production_article?terms=${valorDigitadoPesquisaDireta}&year=${value}&qualis=${valoresSelecionados}&university=${intituicoesSelecionadasCheckbox}&distinct=${distinctValue}`;
  }

  if (botaoAreasClicado && valoresSelecionadosExport == "") {
    urlTermPublicacoes = `${urlGeral}bibliographic_production_article_area?area_specialty=${valorDigitadoPesquisaDireta}&great_area=&year=${value}&qualis=${valoresSelecionados}`;
  }

  if (botaoAreasClicado) {
    urlTermPublicacoes = `${urlGeral}bibliographic_production_article_area?area_specialty=${valoresSelecionadosExport.replace(/;/g, ' ')}&great_area=&year=${value}&qualis=${valoresSelecionados}`;
  }

  if (botaoPesquisadoresClicado) {
    urlTermPublicacoes = `${urlGeral}bibliographic_production_researcher?terms=&researcher_id=${researcher.map((item) => item.id).join(';')}&type=ARTICLE&qualis=${valoresSelecionados}`;
  }

  if (botaoPesquisadoresClicado && valoresSelecionadosExport == "") {
    urlTermPublicacoes = `${urlGeral}bibliographic_production_researcher?terms=&researcher_id=${researcher.map((item) => item.id).join(';')}&type=ARTICLE&qualis=${valoresSelecionados}`;
  }

  const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(urlTermPublicacoes, {
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
          setCurrentPage(1)
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [urlTermPublicacoes]);






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

  //TOTAL DE PUBLICAÇÕES
  const quantidadeTotalDePublicacoes = publicacoes.length;
  setTotalPublicacoes(quantidadeTotalDePublicacoes.toString())

  //resetr pesquisa
  if (valoresSelecionadosExport != "") {
    setValorDigitadoPesquisaDireta('')
  }

  //block list

  const { isOn, setIsOn } = useContext(UserContext)

  const toggleButtonOn = () => {
    setIsOn(false);
  };

  const toggleButtonOff = () => {
    setIsOn(true);
  };

  //

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };

  //btn json

  const [jsonData, setJsonData] = useState<any[]>([]);
  const [downloadReady, setDownloadReady] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(urlTermPublicacoes, {
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
  }, [urlTermPublicacoes]);

  const convertJsonToCsv = (json: any[]): string => {
    const items = json;
    const replacer = (key: string, value: any) => (value === null ? '' : value); // Handle null values
    const header = Object.keys(items[0]);
    const csv = [
      header.join(','), // CSV header
      ...items.map((item) =>
        header.map((fieldName) => JSON.stringify(item[fieldName], replacer)).join(',')
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


  return (
    <div id="contentPesquisador" className="flex flex-col  m-[0 auto] min-w-full  flex justify-center items-center">
      <div className="  m-[0 auto] w-full">
        <div className="w-full flex gap-4 p-6 border-[1px] border-gray-300 rounded-md mb-9 items-center">
          <div>
            <p className="text-gray-400 mb-4 w-min whitespace-nowrap">Selecione os qualis desejados</p>
            <div className="gap-4 flex flex-wrap ">
              {checkboxQualis}
            </div>
          </div>

          <div className="mx-4 h-[80px] min-h-max w-[1px] bg-gray-300 relative ">

          </div>

          <div className="flex-1 ">
            <p className="text-gray-400 mb-4">Selecione o ano da publicação</p>
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


        <div className="flex gap-4 w-full pb-8 justify-between items-center min-w-full">
          <div className="flex gap-4">
            <Quotes size={24} className="text-gray-400" />
            <p className="text-gray-400">Artigos</p>
          </div>

          <div className="flex gap-4">

            {botaoPesquisadoresClicado ? (
              <div></div>
            ) : (
              <div className='flex gap-2  items-center '>
                <strong className='text-gray-500 text-sm'>Artigos:</strong>
                <p className="text-gray-400 text-sm">iguais</p>
                <label className="inline-flex relative items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={distinct}
                    readOnly
                  />
                  <div
                    onClick={() => {
                      setDistinct(!distinct);
                    }}
                    className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-400"
                  ></div>
                </label>
                <p className="text-gray-400 text-sm">distintos</p>
              </div>
            )}

            <div className="bg-gray-300 h-[36px] w-[1px]"></div>
            <div onClick={toggleButtonOn} className={`cursor-pointer rounded-full hover:bg-gray-100 h-[38px] w-[38px] transition-all flex items-center justify-center ${isOn ? "bg-transparent" : "bg-gray-300"}`}>
              <SquaresFour size={24} className={'rotate-180 transition-all text-gray-400'} />
            </div>

            <div onClick={toggleButtonOff} className={`cursor-pointer rounded-full hover:bg-gray-100 h-[38px] w-[38px] transition-all flex items-center justify-center ${isOn ? "bg-gray-300" : "bg-transparent"}`}>
              <Rows size={24} className={'rotate-180 transition-all text-gray-400'} />
            </div>
          </div>
        </div>

        <div>
          {isLoading ? (
            <div>

            </div>
          ) : (
            <div className="w-full flex gap-4 p-6 border-[1px] border-gray-300 rounded-md mb-9">
              <div className="w-full">
                <div className="text-center font-medium text-xl text-gray-500 mb-6">Quantidade de qualis por tipo</div>
                <HighchartsReact highcharts={Highcharts} options={chartOptions} />
              </div>
            </div>
          )}

        </div>

        <div>
          {isLoading ? (
            <div className="flex items-center justify-center w-full py-10">
              <Carregando />
            </div>
          ) : (
            <div className={`mb-9 masonry grid grid-cols-1 md:grid-cols-2 gap-6  m-[0 auto] w-full ${isOn ? "lg:grid-cols-1 2xl:grid-cols-1" : "lg:grid-cols-3 2xl:grid-cols-4"}`}>
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

          {valoresSelecionadosExport || valorDigitadoPesquisaDireta ? (
            <div className=" justify-between w-full gap-1 flex p-6 border-[1px] border-gray-300 rounded-md mb-9">
              <p className="text-gray-400 ">Foram encontrados <strong className="font-bold text-blue-400">{totalPublicacoes}</strong> publicações para <strong className="font-bold text-blue-400">{valorDigitadoPesquisaDireta.replace(/;/g, ' ')}{decodeURIComponent(valoresSelecionadosExport.replace(/;/g, ' ou ')).split('%20').join(' ')} </strong>
                em artigos
              </p>


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
                backgroundColor: indexOfLastResult >= publicacoes.length ? '#ccc' : '#173DFF',
                opacity: indexOfLastResult >= publicacoes.length ? '0.5' : '1',
              }}
              disabled={indexOfLastResult >= publicacoes.length}
            >
              Próximo<CaretCircleRight size={16} className="text-white" />
            </button>
          </div>
        </div>

        <div className="flex gap-4 w-full pb-8">
          <Book size={24} className="text-gray-400" />
          <p className="text-gray-400">Livros</p>
        </div>

        <div className="flex gap-4 w-full pb-8">
          <Books size={24} className="text-gray-400" />
          <p className="text-gray-400">Capítulos de livros</p>
        </div>

        <div className="mb-9">

          <button onClick={handleDownloadJson} className="flex items-center gap-4 bg-blue-400 text-white rounded-full px-6 py-2 ml-auto justify-center hover:bg-blue-500 mb-6 font-medium transition"><FileCsv size={16} className="text-white" />Download CSV</button>

        </div>
      </div>


     
    </div>
  )
}