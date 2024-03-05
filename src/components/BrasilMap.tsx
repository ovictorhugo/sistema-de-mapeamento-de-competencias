
import Highcharts from 'highcharts';
import Highmaps from 'highcharts/highmaps';
import HighchartsAccessibility from 'highcharts/modules/accessibility';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsOfflineExporting from 'highcharts/modules/offline-exporting';

import { UserContext } from '../contexts/context'
import { useEffect, useState, useContext } from "react";

// Initialize Highcharts modules
HighchartsAccessibility(Highcharts);
HighchartsExporting(Highcharts);
HighchartsOfflineExporting(Highcharts);

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

// Importar dados GeoJSON do Brasil

import brazilStatesGeoJSON from './br_states.json'; // Substitua pelo caminho correto

function BrasilMap() {
  const { urlGeral, setUrlGeral } = useContext(UserContext);
  const { idGraduateProgram, setIdGraduateProgram } = useContext(UserContext);
  const [graduatePrograms, setGraduatePrograms] = useState<GraduateProgram[]>([]);

  const { estadoSelecionado, setEstadoSelecionado } = useContext(UserContext);
  const [selectedGraduateProgramId, setSelectedGraduateProgramId] = useState<string | null>(null);


   const { idVersao, setIdVersao } = useContext(UserContext);
   let urlGraduateProgram = `${urlGeral}/graduate_program_profnit?id=`;
   const isDashboard = location.pathname === `/profnit`
   useEffect(() => {
    if(isDashboard) {
       urlGraduateProgram = `${urlGeral}/graduate_program_profnit?id=2`;
    } else (
      urlGraduateProgram = `${urlGeral}/graduate_program_profnit?id=`
    )
  }, []);
  

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

  console.log(urlGraduateProgram)

  // UseEffect para inicializar o gráfico quando o componente for montado
  useEffect(() => {
    // Assumindo que você já tenha os dados dos programas de pós-graduação em graduatePrograms

// Crie um objeto para armazenar a contagem de programas por estado
const stateProgramCount: Record<string, number> = {};

// Mapeie os programas e conte-os por estado
graduatePrograms.forEach(program => {
  const state = program.state;
  if (stateProgramCount[state]) {
    stateProgramCount[state] += 1;
  } else {
    stateProgramCount[state] = 1;
  }
});

// Agora você pode criar o array brazilStateData com base na contagem
const brazilStateData = Object.entries(stateProgramCount).map(([state, count]) => [state, count]);

const formattedData = brazilStateData.map(item => ({
  PK_sigla: item[0].toString(), // Convert to a string if it's not already
  value: parseFloat(String(item[1])) || 0, // Convert to a number, or use 0 as a default
}));

// Ordenar o array por estado (opcional)
brazilStateData.sort();
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
          data: formattedData,
          keys: ['PK_sigla', 'value'],
          joinBy: 'PK_sigla',
          
       
          // Habilitar drilldown para estados
          allowPointSelect: false,
          cursor: 'pointer',
       
          point: {
            events: {
              // Lidar com o evento de clique para os estados
              click: function () {
                const state = (this.options as { PK_sigla: string })['PK_sigla'];

                // Implementar lógica de zoom ou drilldown aqui

                if (stateProgramCount[state] === 1) {
                  
                  // Procurar pelo programa de pós-graduação com o estado correspondente e obter o ID
                  const programWithState = graduatePrograms.find(program => program.state === state);
                  if (programWithState) {
                
                    const programId = programWithState.graduate_program_id;
                    console.log('aq porra')
                    // Definir o ID do programa selecionado em selectedGraduateProgramId
                    setIdGraduateProgram(programId);
                    console.log(idGraduateProgram)
                  }
                }

                setEstadoSelecionado(state);

                if (stateProgramCount[state] > 1) {
                  setIdGraduateProgram('0');
                }
           
               
                console.log(`Estado clicado: ${state}`);
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
  }, [graduatePrograms]); // O array vazio garante que o useEffect seja executado apenas uma vez na montagem

  return <div className={` absolute ${idVersao == '4'  ? ('w-[140%] h-[170%] left-[-200px]'): idVersao == '2' ? ('w-[140%] h-[130%] left-[-20px]'): idVersao == '1'  ? ('w-[140%] h-[170%] left-[-200px]') : ('w-[140%] h-[130%] left-[-20px]')}`} id="containerone" />;
}

export default BrasilMap;
