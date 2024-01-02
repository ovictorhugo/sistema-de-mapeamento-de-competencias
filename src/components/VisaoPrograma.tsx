import { Books, DownloadSimple, Export, StripeLogo, UserCircle, UserSwitch } from "phosphor-react";
import 'react-circular-progressbar/dist/styles.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/context";

import HC_wordcloud from 'highcharts/modules/wordcloud';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface VisaoPrograma {
  article: number,
  book: number,
  book_chapter: number,
  brand: number,
  patent: number,
  researcher: string,
  software: number,
  work_in_event: number
}

interface Qualis {
  among: string,
  qualis: string
}

export function VisaoPrograma() {
  const { urlGeral, setUrlGeral } = useContext(UserContext);
  const { idGraduateProgram, setIdGraduateProgram } = useContext(UserContext);

  const [VisaoPrograma, setVisaoPrograma] = useState<VisaoPrograma[]>([]); 
  const [Qualis, setQualis] = useState<Qualis[]>([]); 

    // Obtém o ano atual
const anoAtual = new Date().getFullYear();

  // Calcula o ano 5 anos atrás
  const ano5AnosAtras = anoAtual - 4;


  let urlVisaoPrograma = `${urlGeral}/graduate_program_production?graduate_program_id=${idGraduateProgram}&year=${ano5AnosAtras}`;

  console.log(urlVisaoPrograma)
// Monta a URL com o ano 4 anos atrás

let QualQualis = idGraduateProgram




const urlQualis = `${urlGeral}/qualis_researcher?graduate_program_id=${QualQualis}&year=${ano5AnosAtras}&researcher_id=`;

console.log(urlQualis)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(urlVisaoPrograma, {
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
          setVisaoPrograma(data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [urlVisaoPrograma]);

  //qualis

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(urlQualis, {
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
          setQualis(data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [urlQualis]);

  console.log(urlQualis)

  //gráfico qualis
  const optionsqualis= {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      fontFamily: 'Ubuntu, sans-serif',
      height: 'full',
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
      categories: Qualis.map((item) => item.qualis),
      
      title: {
        text: 'Tipo',
        fontFamily: 'Ubuntu, sans-serif',
      },
      labels: {
        style: {
          color: "white", // Define a cor dos rótulos do eixo y como branco
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: '',
        color: "white",
      },
      gridLineWidth: 0, // Remove as linhas de referência do eixo y
      labels: {
        style: {
          color: "white", // Define a cor dos rótulos do eixo y como branco
        },
      },
    },
    series: [
      {
        name: '',
        data: Qualis.map((item) => parseInt(item.among)),
        color: "white",
      },
    ],
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          inside: true,
          style: {
            color: '#173DFF',
            fontSize: '18px',
            textOutline: '0px contrast',
            fontFamily: 'Ubuntu, sans-serif',
          },
        },
      },
    },
    legend: {
      itemStyle: {
        color: "white", // Define a cor da legenda como branca
      },
    },
  };

  // Valores de pontuação para cada Qualis
  const pontuacaoQualis: { [key: string]: number } = {
    A1: 1,
    A2: 0.875,
    A3: 0.75,
    A4: 0.625,
    B1: 0.5,
    B2: 0.375,
    B3: 0.25,
    B4: 0.125,
  };
  

  const pontuacaoTotal = Qualis.reduce((total, item) => {
    const pontuacao = pontuacaoQualis[item.qualis] || 0;
    return total + (pontuacao * parseFloat(item.among)); // Use parseFloat para converter strings em números com casas decimais
  }, 0);


  
  // Suponha que VisaoPrograma seja uma matriz de objetos com a propriedade "researcher"
  const numeroTotalDocentes = VisaoPrograma.reduce((total, item) => {
    const researcher = parseFloat(item.researcher); // Certifique-se de que "researcher" seja um número ou ajuste conforme necessário
    return total + researcher;
  }, 0);



  console.log(pontuacaoTotal)
  
  // Calcula o índice de produção artigos
  const indiceProducaoArtigos = (pontuacaoTotal / numeroTotalDocentes/4).toFixed(2);



    const percentage = 66;

      //download

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
          const csvData = convertJsonToCsv(VisaoPrograma);
          const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `dadosGerais.csv`;
          link.href = url;
          link.click();
        } catch (error) {
          console.error(error);
        }
      };

      console.log('URLQUALIS', urlQualis)
    return (
  
    <div className="md:px-16 px-6 pt-12 w-full">
      {VisaoPrograma.map(props => {
        const totalProducao = props.article + props.book + props.book_chapter 
        return(
          <div className=" ">
        <div className="flex gap-4 items-center w-full">
        <div className="">
        <h1 className="text-left max-w-[350px] min-w-[350px]  font-medium text-3xl ">
           Visão geral do programa de <strong className="bg-red-400 text-white font-medium">pós-graduação</strong>
        </h1>
        <p className="text-sm text-gray-400 mt-2">Informações referentes a produção dos últimos 4 anos</p>
        </div>

        <div className=" h-24 flex items-center justify-center  gap-4">
        <div className="h-24 w-24 flex items-center  ">
        <CircularProgressbar
        value={Number(((props.article / totalProducao)* 100).toFixed(2))}
        text={`${((props.article / totalProducao)* 100).toFixed(2)}%`}
        styles={buildStyles({
          pathColor: `rgba(23, 61, 255, ${((props.article / totalProducao) * 100).toFixed(2)})`,
          textColor: '#173DFF',
          trailColor: '#d6d6d6',
          backgroundColor: '#173DFF',
  
        })}
        className="text-ubuntu"
      />
        </div>

      <p className="text-sm text-gray-400  flex-1">Porcentagem de artigo nas produções científicas (livro, capítulo e artigo) </p>
        </div>

        <div className="grid grid-cols-4 gap-4 w-full">

            <div className="flex flex-col w-full items-end">
                <p className="text-gray-400">Total de artigos</p>
                <h3 className="text-6xl font-medium">{props.article != 0 ? (props.article): (0)}</h3>
            </div>

            <div className="flex flex-col w-full items-end">
                <p className="text-gray-400">Total de livros</p>
                <h3 className="text-6xl font-medium">{props.book != 0 ? (props.book): (0)}</h3>
            </div>

            <div className="flex flex-col w-full items-end">
                <p className="text-gray-400">Total de patentes</p>
                <h3 className="text-6xl font-medium">{props.patent != 0 ? (props.patent): (0)}</h3>
            </div>

            <div className="flex flex-col w-full items-end">
                <p className="text-gray-400">Total de softwares</p>
                <h3 className="text-6xl font-medium">{props.software != 0 ? (props.software): (0)}</h3>
            </div>
        </div>
        </div>

        <div className="flex gap-4 w-full py-8 justify-between items-center min-w-full">
            <div className="flex gap-4">
            <div className="border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-xl text-md font-medium w-fit bg-white items-center gap-2"><UserCircle size={16} className="" />Total de docentes: {props.researcher != "0" ? (props.researcher): (0)}</div>

            <div className="border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-xl text-md font-medium w-fit bg-white items-center gap-2"><Books size={16} className="" />Total de capítulos de livros: {props.book_chapter != 0 ? (props.book_chapter): (0)}</div>

            <div className="border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-xl text-md font-medium w-fit bg-white items-center gap-2"><StripeLogo size={16} className="" />Total de Marcas: {props.brand != 0 ? (props.brand): (0)}</div>
            </div>

            <div className="flex gap-4">
           

            <div onClick={handleDownloadJson}  className="cursor-pointer rounded-full hover:bg-gray-100 h-[38px] w-[38px] transition-all flex items-center justify-center">
              <DownloadSimple size={24} className={" transition-all text-gray-400"} />
            </div>
            </div>

          </div>
    </div>
        )
      })}


    <div className="flex gap-6 h-[500px] w-full">
            <div className="flex flex-1 h-full bg-blue-400  bg-opacity-50 backdrop-blur-sm rounded-2xl p-12 flex-col">
            <div className="text-center font-medium text-2xl text-white mb-6 w-full">Artigos por qualis nos últimos 4 anos</div>
            <HighchartsReact highcharts={Highcharts} options={optionsqualis} />
            </div>
            <div className="w-[450px] flex flex-col gap-6">
                <div className="border rounded-2xl p-12 border-gray-300 w-full h-1/2 flex flex-col justify-center">
                <div className=" font-medium text-2xl text-right mb-2 text-gray-400 w-full">Índice de produção de artigos</div>

                <h3 className="text-6xl font-medium   text-right">{indiceProducaoArtigos}</h3>
                </div>

                <div className="border flex flex-col justify-center p-12 rounded-2xl border-gray-300 w-full h-1/2">
                <div className=" text-gray-400 font-medium text-2xl text-right mb-2 w-full">Índice de produção de livros e capítulos</div>
                
                
                {VisaoPrograma.map(props => {
                
                return(<h3 className="text-6xl font-medium  text-right">{(((props.book * 1) + (props.book_chapter * 0.25) ) / 4 / numeroTotalDocentes).toFixed(2)}</h3> )
              })}
                </div>
            </div>
          </div>
    </div>

      
    );
  }