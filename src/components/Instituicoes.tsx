import Carregando from "./Carregando";
import { Pesquisador } from "./Pesquisador"
import { UserContext } from '../contexts/context'
import { useEffect, useState, useContext } from "react";

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import drilldown from 'highcharts/modules/drilldown'

type Instituicoes = {
  among: string,
  id: string,
  image: string,
  institution: string,
}

export function Instituicoes() {
  const [isLoading, setIsLoading] = useState(false);
  const { valoresSelecionadosExport, setValoresSelecionadosExport } = useContext(UserContext);
  const { valorDigitadoPesquisaDireta, setValorDigitadoPesquisaDireta } = useContext(UserContext);
  const { totalInstituicoes, setTotalInstituicoes } = useContext(UserContext);
  const { urlGeral, setUrlGeral } = useContext(UserContext);

  //btns da página search

  const { botaoPesquisadoresClicado, setBotaoPesquisadoresClicado } = useContext(UserContext);
  const { botaoTermosClicado, setBotaoTermosClicado } = useContext(UserContext);
  const { botaoResumoClicado, setBotaoResumoClicado } = useContext(UserContext);
  const { botaoAreasClicado, setBotaoAreasClicado } = useContext(UserContext);

  const [instituicoes, setInstituicoes] = useState<Instituicoes[]>([]); // Define o estado vazio no início

  let urlTermPublicacoes = `${urlGeral}institutionFrequenci?terms=${valoresSelecionadosExport}`;
  const { intituicoesSelecionadasCheckbox, setIntituicoesSelecionadasCheckbox } = useContext(UserContext)


  if (botaoTermosClicado) {

    urlTermPublicacoes = `${urlGeral}institutionFrequenci?terms=${valoresSelecionadosExport}&university=${intituicoesSelecionadasCheckbox}`

  }

  if (botaoResumoClicado) {

    urlTermPublicacoes = `${urlGeral}institutionFrequenci?terms=${valoresSelecionadosExport}&university=${intituicoesSelecionadasCheckbox}`

  }

  if (botaoAreasClicado) {
    urlTermPublicacoes = `${urlGeral}//institutionArea?area_specialty=${valoresSelecionadosExport}&great_area=&university=${intituicoesSelecionadasCheckbox}`;
  }

  if (botaoTermosClicado && valoresSelecionadosExport == "") {
    `${urlGeral}institutionFrequenci?terms=${valorDigitadoPesquisaDireta}&university=${intituicoesSelecionadasCheckbox}`;
  }

  if (botaoResumoClicado && valoresSelecionadosExport == "") {
    `${urlGeral}institutionFrequenci?terms=${valorDigitadoPesquisaDireta}&university=${intituicoesSelecionadasCheckbox}`;
  }

  if (botaoAreasClicado && valoresSelecionadosExport == "") {
    urlTermPublicacoes = `${urlGeral}/institutionArea?terms=${valorDigitadoPesquisaDireta}&university=${intituicoesSelecionadasCheckbox}`;
  }

  //fetch
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
          setInstituicoes(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [urlTermPublicacoes]);

  // gráfico
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    // ...
    if (instituicoes) {
      const categories = instituicoes.map((d) => d.institution);
      const amongValues = instituicoes.map((d) => Number(d.among));
      const sumAmongValues = amongValues.reduce((acc, cur) => acc + cur, 0);

      setChartOptions({
        chart: {
          type: "column",
          backgroundColor: 'transparent',
          fontFamily: 'Ubuntu, sans-serif',
          height: '280px',

          display: 'flex',
          position: 'relative'
        },
        title: {
          text: "",
        },
        xAxis: {
          categories,
        },
        yAxis: {
          title: {
            text: "Quantidade",
          },
        },
        series: [
          {
            name: "Soma do among",
            data: amongValues,
          },
        ],
        tooltip: {
          pointFormat: "<b>{point.y}</b> ocorrências",
        },
        subtitle: {
          text: `Total: ${sumAmongValues}`,
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          column: {
            color: "#005399",
            dataLabels: {
              enabled: true,
              inside: true,
              style: {
                color: 'white', // cor do texto dentro da barra
                fontSize: '18px', // tamanho da fonte
                textOutline: '0px contrast', // cor da borda do texto
                fontFamily: 'Ubuntu, sans-serif'
              },
            },
          },
        },
      });
    }
  }, [instituicoes]);

  //TOTAL DE PUBLICAÇÕES
  const quantidadeTotalDeInstituicoes = instituicoes.length;
  setTotalInstituicoes(quantidadeTotalDeInstituicoes.toString());


  return (
    <div className="flex flex-col  m-[0 auto] min-w-full  flex justify-center items-center">


      <div className=" m-[0 auto] w-full">
        <div>
          {isLoading ? (
            <div>

            </div>
          ) : (
            <div className="w-full flex gap-4 p-6 border-[1px] border-gray-300 rounded-md mb-9">
              <div className="w-full">
                <div className="text-center font-medium text-xl text-gray-500 mb-6">Ocorências por instituição</div>
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
            <div className="mb-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6  m-[0 auto] w-full">
              {instituicoes.map(props => {
                return (
                  <div key={props.id} id="id_perfil" className="group items-center bg-white gap-4  border-solid border-gray-300 border-[1px] flex p-6 rounded-md hover:shadow-md transition w-full">

                    <div className="whitespace-nowrap h-20 w-20 rounded-md flex items-center justify-center p-4 relative bg-gray-50">
                      <img src={props.image} alt="" className="h-full rounded-sm  whitespace-nowrap" />
                    </div>

                    <div className="flex flex-col flex-1 pr-2">
                      <h4 className="text-base font-medium ">{props.institution}</h4>
                      {valoresSelecionadosExport === "" ? (
                        <p>Instituição com <strong className="text-blue-400">{props.among} </strong>termos encontrados</p>
                      ) : (
                        botaoAreasClicado ? (
                          <p className="text-gray-400 text-sm font-medium">
                            A área {valoresSelecionadosExport.replace(/%20/g, " ").replace(/;/g, " ou ")} aparece <strong className="text-blue-400">{props.among} vezes</strong> na instituição
                          </p>
                        ) : (
                          <p className="text-gray-400 text-sm font-medium">
                            O termo {valoresSelecionadosExport.replace(/;/g, " ou ")} aparece <strong className="text-blue-400">{props.among} vezes</strong> na instituição
                          </p>
                        )
                      )}
                    </div>
                  </div>

                )
              })}
            </div>
          )}

        </div>
      </div>


    </div>
  )
}