import { ArrowSquareOut, Buildings, CursorText, FileCsv, GitBranch, MapPin, Plus, UserList, X, UsersThree, ChartPieSlice, Trash, MagnifyingGlass, CaretUp, CaretDown, ListBullets, Rows, Columns } from "phosphor-react";
import { Header } from "./Header";
import { useContext, useEffect, useState } from "react";
import Papa from 'papaparse';
import { UserContext } from "../contexts/context";
import DropdownMultiSelect from "./DropdownMultiSelect";
import { Link } from "react-router-dom";
import { PopUp } from "./PopUp";
import Carregando from "./Carregando";

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsTreemap from 'highcharts/modules/treemap';
import { chart } from 'highcharts';
import { Filter } from "./Filter";

import Lottie from "lottie-react";
import search_animation from "./search_animation.json";
import loading from "./loading_red.json";
import { Footer } from "./Footer";

// Inicializando o módulo treemap do Highcharts
HighchartsTreemap(Highcharts);


interface Csv {
    tax: string
    termos: string
    terms: string
    termos_tax: string
    group: string


  }

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
    termo:string 
  }

  interface Post {
    frequency: string
    term: string
    checked: boolean
    type: string
  }


export function Taxonomia() {

    const [researcher, setResearcher] = useState<Research[]>([]);
    const { urlGeral, setUrlGeral } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    const [isTab, setIsTab] = useState(false);
    const [palavraProcessada, setPalavraProcessada] = useState(``);
    const { isOn, setIsOn } = useContext(UserContext)
    

    const [taxValues, setTaxValues] = useState([]);
    const [selectedTax, setSelectedTax] = useState('');
    const [filteredItems, setFilteredItems] = useState<Csv[]>([]);
    const [originalItems, setOriginalItems] = useState([]); 

    const optionsDropdown = ['Universidade Estadual do Sudoeste da Bahia', 'Universidade Estadual de Santa Cruz', 'Universidade do Estado da Bahia', 'Universidade Estadual de Feira de Santana'];
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const {intituicoesSelecionadasCheckbox, setIntituicoesSelecionadasCheckbox} = useContext(UserContext)
    setIntituicoesSelecionadasCheckbox(selectedOptions.join(';'))

    const [researcherCountsByTerm, setResearcherCountsByTerm] = useState<{ [termo: string]: number }>({});
    const [totalResearcherCount, setTotalResearcherCount] = useState<number>(0);

    const [pesquisaInput, setPesquisaInput] = useState('');
    const [resultados, setResultados] = useState<Post[]>([]);

    
  //checkbox term

  const [itensSelecionadosTerm, setItensSelecionadosTerm] = useState<string[]>([]);
console.log(itensSelecionadosTerm)
  const handleCheckboxChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    const isChecked = event.target.checked;

    setItensSelecionadosTerm((prevSelecionados) => {
      if (isChecked) {
        return [...prevSelecionados, name];
      } else {
        return prevSelecionados.filter((item) => item !== name);
      }
    });
  };

  const checkboxItems = resultados.slice(0, 6).map((resultado) => (
    <li
      key={resultado.term}
      className="checkboxLabel group list-none inline-flex  group overflow-hidden"
      onMouseDown={(e) => e.preventDefault()}
    >
      <label className="group-checked:bg-blue-400 cursor-pointer border-[1px] bg-blue-100 border-blue-400 hover:text-blue-400 flex h-10 items-center px-4 text-gray-400 rounded-lg text-xs font-bold hover:border-blue-400 hover:bg-blue-100">
        <span className="text-center block">{resultado.term.replace(/;/g, ' ')}</span>
        <input
          type="checkbox"
          name={resultado.term}
          className="absolute hidden group"
          checked={itensSelecionadosTerm.includes(resultado.term)}
          id={resultado.term}
          onChange={handleCheckboxChangeInput}
       
        />
      </label>
    </li>
  ));



    const pesquisaInputFormatado = pesquisaInput.trim().replace(/\s+/g, ";");
    const url = urlGeral + `/originals_words?initials=${pesquisaInputFormatado}&type=ARTICLE`;

    useEffect(() => {
    fetch(url, {
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
          term: post.term.replace(/\s+/g, ";")
        }));
        setResultados([]);
        setResultados(newData);
      })
      .catch((err) => {
        console.log(err.message);
      });



    }, []);

    const handleTaxChange = (event:any) => {
        let selectedValue = event.target.value;
        setSelectedTax(selectedValue);
        setResearcher([])
    
        // Filtrar os itens apenas quando um input estiver marcado
        if (event.target.checked) {
          const filtered = originalItems.filter((item: any) => item.tax === selectedValue);
          setFilteredItems(filtered);
        } else {
          setFilteredItems([]);
          setTaxValues([]) // Limpar a lista filtrada se nenhum input estiver marcado
        }
      };

    useEffect(() => {
        const filePath = '../taxonomia.csv';

        const fetchData = async () => {
          try {
            const response = await fetch(filePath);
            const text = await response.text();
    
            Papa.parse(text, {
              complete: (result: any) => {
                const parsedData = result.data;
            
                setFilteredItems(parsedData); 
                console.log(parsedData);

                const uniqueTaxValues = [...new Set(parsedData.map((item: any) => item.tax))] as string[];

                setTaxValues(uniqueTaxValues);
                    setOriginalItems(parsedData);


                    if (uniqueTaxValues.length > 0) {
                      setSelectedTax(uniqueTaxValues[0]);
                      // Filtrar os itens com base no valor selecionado usando a lista original
                      const filtered = parsedData.filter((item:any) => item.tax === uniqueTaxValues[0]);

                      

                      const filteredTotal = [
                        ...filtered,
                        ...itensSelecionadosTerm.map((term) => ({
                          tax: selectedTax,
                          termos: term,
                          termos_tax: term,
                          terms: term
                          // Add other properties as needed
                        })),
                      ];

                      console.log(`filtered`, filteredTotal)
                      setFilteredItems(filteredTotal);
                    }
              },
              header: true,
              skipEmptyLines: true,
              delimiter: ';',
              encoding: 'UTF-8',
            });
          } catch (error) {
            console.error('Erro ao carregar o arquivo:', error);
          }
        };
    
        fetchData();
      }, [itensSelecionadosTerm]);
     
      console.log(`filteredItems`,filteredItems)


      

      useEffect(() => {
        const fetchData = async () => {
          setIsLoading(true);
          try {

            let totalCount = 0;
        const updatedResearcherData: { [termo: string]: Research[] } = {};
        const updatedResearcherCountsByTerm: { [termo: string]: number } = {};

            // Iterar sobre cada termo em filteredItems
            for (const item of filteredItems) {
              setPalavraProcessada(item.termos)
              const urlTermPesquisadores = `${urlGeral}researcher?terms=${item.termos}&university=${intituicoesSelecionadasCheckbox}&type=ARTICLE&graduate_program_id=`;
              console.log(urlTermPesquisadores)
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

              const researchersArray = Array.isArray(data) ? data : Object.values(data);

          // Remover duplicatas e garantir pesquisadores únicos
          const uniqueResearchers = Array.from(new Set(researchersArray.map((researcher) => researcher.id))).map(
            (id) => {
              const researcherWithTerm: Research = {
                ...researchersArray.find((r) => r.id === id)!,
                termo: item.termos,
              };
              return researcherWithTerm;
            }
            );
              updatedResearcherData[item.termos] = uniqueResearchers;
              updatedResearcherCountsByTerm[item.termos] = uniqueResearchers.length;
              totalCount += uniqueResearchers.length;

              // Atualizar o estado usando uma cópia independente
              setResearcher((prevResearcher) => ({
                ...prevResearcher,
                [item.termos]: data,
              }));
            


              setResearcher(updatedResearcherData);
            
              setResearcherCountsByTerm(updatedResearcherCountsByTerm);
              setTotalResearcherCount(totalCount);

              console.log(`researcher`, researcher)
             
            }
          } catch (err) {
            console.error(err);
          } finally {
            setIsLoading(false);
          }
        };

        


    
        // Certifique-se de chamar fetchData apenas se houver itens filtrados
        if (filteredItems.length > 0) {
          fetchData();
        }
      }, [ intituicoesSelecionadasCheckbox, filteredItems, itensSelecionadosTerm ]);

      const [isPopUpVisible, setIsPopUpVisible] = useState(false);
      const { EstadoFiltro, setEstadoFiltro } = useContext(UserContext);
      const { idVersao, setIdVersao } = useContext(UserContext);
      const { valoresSelecionadosPopUp, setValoresSelecionadosPopUp } = useContext(UserContext)
        // Função para exibir o PopUp
        const [popUpVisibilities, setPopUpVisibilities] = useState({});
  const { valoresSelecionadosExport, setValoresSelecionadosExport } = useContext(UserContext);
  const [popUpVisibilitiesMap, setPopUpVisibilitiesMap] = useState([]);
  const [openPopUpId, setOpenPopUpId] = useState(null);

  const handleOpenPopUp = (index: any, termo: any) => {
    setOpenPopUpId(index);
    setEstadoFiltro(false);
    setIsPopUpVisible(true);
    setValoresSelecionadosExport(termo)
    setValoresSelecionadosPopUp(termo)

  };

  const handleClosePopUp = (index: any) => {
    setOpenPopUpId(null);
    setEstadoFiltro(false);
    setIsPopUpVisible(false);
    setValoresSelecionadosPopUp(valoresSelecionadosExport);
  };

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
  

//csv
const [jsonData, setJsonData] = useState<any[]>([]);
const handleBtnCsv = (id_pesquisador: any) => {

    try {
        let urlPublicacoesPorPesquisador = `${urlGeral}bibliographic_production_researcher?terms=${valoresSelecionadosPopUp}&researcher_id=${id_pesquisador}&type=ARTICLE&qualis=&year=1900`



    

  
    
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

  const handleBtnCsvTaxonomia = () => {
    try {
      const convertJsonToCsvTaxonomia = (researcherData: Record<string, Research[]>): string => {
          const replacer = (key: string, value: any) => (value === null ? '' : value); // Handle null values

          let csv = '';

          // Iterate over each term and its associated researchers
          Object.keys(researcherData).forEach((term) => {
              const items = researcherData[term];
              const header = Object.keys(items[0]);

              // Add CSV header for each term
              csv += `\uFEFF${term}\r\n${header.join(';')}\r\n`;

              // Add CSV data for each researcher
              csv += items
                  .map((item) => header.map((fieldName) => JSON.stringify(item[fieldName], replacer)).join(';'))
                  .join('\r\n');
              
              // Add a line break between terms
              csv += '\r\n';
          });

          return csv;
      };
      if (!researcher) {
        throw new Error('Researcher data is undefined or null.');
    }

    // Group researchers by term
    const researcherData: Record<string, Research[]> = {};
    researcher.forEach((item) => {
        const term = item.termo;
        if (!researcherData[term]) {
            researcherData[term] = [];
        }
        researcherData[term].push(item);
    });

    const csvData = convertJsonToCsvTaxonomia(researcherData);
    const blob = new Blob([csvData], { type: 'text/csv;charset=windows-1252;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `taxonomia.csv`;
    link.href = url;
    link.click();
} catch (error) {
   
}
};


console.log(`trerge`, researcher)

  //logica treemap

   // Função para converter o objeto de dados em um formato adequado para o treemap
   const formatDataForTreemap = () => {
    const formattedData = Object.entries(researcher).map(([termo, count]) => ({
      name: termo,
      value: researcher[termo].length,
    }));
    return formattedData;
  };

  // Configuração do treemap
  const treemapOptions: Highcharts.Options = {
    chart: {
        height: '100%', // Para ocupar a altura total
        margin: 0,
      
      },
    series: [
      {
        type: 'treemap',
        layoutAlgorithm: 'squarified',
        data: formatDataForTreemap(),
        colorByPoint: true, // Cada ponto terá uma cor diferente
      },
    ],
  
    title: {
      text: '',
    },
    credits: {
        enabled: false
      },
  };

 //////////////////////

 const handleDeleteTerm = (termoToDelete: string) => {
  // Create a copy of the current researcher state
  const updatedResearcher = { ...researcher };

  // Remove the termoToDelete key from the copy
  delete updatedResearcher[termoToDelete];

  // Update the state with the updated researcher object
  setResearcher(updatedResearcher);

  console.log(updatedResearcher);

  // Optionally, you can also update the state related to the filtered and original items
  // and trigger a re-fetch of data based on the updated options if needed.
};
    
/////////////////////////////////////////////

const [columns, setColumns] = useState<string[]>(Object.keys(researcher));

const onDragEnd = (result: any) => {
  if (!result.destination) {
    // Item was dropped outside of any droppable area
    return;
  }

  const sourceIndex = result.source.index;
  const destinationIndex = result.destination.index;

  // Ensure the source and destination are different
  if (sourceIndex !== destinationIndex) {
    // Create a new array to avoid mutating the state directly
    const updatedColumns = [...columns];

    // Reorder the columns based on the drag-and-drop operation
    const [draggedTerm] = updatedColumns.splice(sourceIndex, 1);
    updatedColumns.splice(destinationIndex, 0, draggedTerm);

    // Update the state with the new order of columns
    setColumns(updatedColumns);
  }
};

  console.log(`columns`, researcher)

  ////////////////////////////////

  const [searchState, setSearchState] = useState(false)
 
  const [termsList , setTermsList] = useState(false);
  const [isCategorias , setIsCategorias] = useState(false);




 
    
    return  (
        <div className="h-screen max-h-screen">
      <Header/>

      <div className="pt-24 h-full px-6 md:px-16 w-full">

        <div className="flex gap-6 h-[10vh] justify-between border-b  border-b-gray-300">

        <div className="flex gap-6 items-center  justify-start">
            
            <div className="flex gap-4 items-center">
            <div className="flex items-center justify-center text-white bg-blue-400 h-12 w-12 rounded-xl"> <GitBranch size={20} className="rotate-180 " /></div>

        <div className="">
        <p className="font-medium">Taxonomia</p>
        <p className="text-sm text-gray-400">Termos em artigos</p>
        </div>
        </div>

        <div className="flex gap-3">
        <div
          onClick={() => setIsTab(false)}
          className={` ${isTab ? (`text-gray-400 hover:bg-gray-50`):(` bg-blue-400 text-white hover:bg-blue-500`)} w-full relative cursor-pointer h-10 whitespace-nowrap flex items-center gap-4  rounded-xl px-4 py-2 justify-center  text-sm font-medium transition`}
        >
          <UsersThree size={16} className="" />
          Lista de pesquisadores
        </div>

        <div
          onClick={() => setIsTab(true)}
          className={` ${isTab ? (`bg-blue-400 text-white hover:bg-blue-500`):(`text-gray-400 hover:bg-gray-50`)} w-full relative  cursor-pointer h-10 whitespace-nowrap flex items-center gap-4  rounded-xl px-4 py-2 justify-center  text-sm font-medium transition`}
        >
          <ChartPieSlice size={16} className="" />
          Busca analítica
        </div>
        </div>
            </div>


        <div className="flex gap-4 flex-1 w-full justify-end items-center">
          <div className="flex gap-4 items-center">

         <div>
         <div onClick={() => setIsCategorias(!isCategorias)} className='w-fit h-12 border border-gray-300  hover:bg-gray-50 transition-all cursor-pointer rounded-xl flex items-center justify-between'>
                  
                  <div className='flex w-full px-4 items-center gap-6 justify-between'>
                 <div className='flex items-center gap-4'>
                     <Rows size={20} className="text-gray-400" />
                     <p className='text-gray-400 text-sm font-medium whitespace-nowrap'>{selectedTax == "" ? (`Categorias`):(selectedTax)}</p>
                 </div>
 
                 <div  className={`cursor-pointer  transition-all flex items-center justify-center `}>
                         {isCategorias ? (
                          <CaretUp size={16} className={' text-gray-400'} />
                         ): (
                          <CaretDown size={16} className={' text-gray-400'} />
                         )}
                         </div>
                 </div>
 
                  </div>

                  {isCategorias ? (
                    <div className="mt-4 bg-white z-[999] p-4 absolute gap-3 flex flex-col border border-gray-300 rounded-xl ">

{taxValues.map((taxValue, index) => (
        <div key={index}>
       
        <label htmlFor={`tax-${index}`} className="inputRadio ">
            <div className={` h-10 text-sm font-medium hover:bg-gray-50  cursor-pointer flex items-center px-4  rounded-xl ${selectedTax == taxValue ? (`text-blue-400 bg-gray-50`):(`text-gray-400`)}`}>{taxValue}</div>
            <input
        type="radio"
        id={`tax-${index}`}
        name="tax"
        value={taxValue}
        checked={selectedTax === taxValue}
        onChange={handleTaxChange}
        hidden 
        />
            </label>
        </div>
        ))}

                    </div>
                   ):(``)}
         </div>

         <div>
         <div onClick={() => setTermsList(!termsList)} className='w-fit h-12 border border-gray-300  hover:bg-gray-50 transition-all cursor-pointer rounded-xl flex items-center justify-between'>
                   <div className='flex w-full px-4 items-center gap-6 justify-between'>
                 <div className='flex items-center gap-4'>
                     <Columns size={20} className="text-gray-400" />
                     <p className='text-gray-400 text-sm font-medium whitespace-nowrap'>Termos da consulta</p>
                 </div>
 
                 <div  className={`cursor-pointer  transition-all flex items-center justify-center `}>
                         {termsList && !isLoading ? (
                          <CaretUp size={16} className={' text-gray-400'} />
                         ): (
                          <CaretDown size={16} className={' text-gray-400'} />
                         )}
                         </div>
                 </div>
                   </div>


                   {termsList && !isLoading ? (
                    <div className="mt-4 absolute max-h-[500px]  bg-white flex flex-col  gap-2 z-[999] p-4 border border-gray-300 rounded-xl ">
                     <div className="flex gap-3 flex-col overflow-y-auto elementBarra pr-2">
                     {isLoading? (
                        ``
                       ):(
                        Object.keys(researcher).map((termo, index) => (
                          <div className="text-xs gap-4 h-10 min-h-[40px] font-bold transition-all rounded-xl items-center px-2 hover:bg-gray-50 flex justify-between text-gray-400">
                            <div className="flex items-center gap-3">
                            <p className="p-1 px-3 bg-blue-400 w-[38px] items-center justify-center flex rounded-md text-white text-xs font-medium ">{researcherCountsByTerm[termo]}</p>
                            {termo.replace(/;/g, ' ')}

                            </div>

                            <div onClick={() => handleDeleteTerm(termo)} className={`outline-none cursor-pointer text-sm rounded-md text-gray-400 flex items-center  justify-center  gap-2  font-semibold transition hover:bg-gray-100 w-6 whitespace-nowrap h-6 `}>
                            <Trash size={16} className="" />
                            </div>
                          </div>
                         ))
                       )}
                     </div>
                    </div>
                   ):(``)}

         </div>

          <div onClick={() => setSearchState(!searchState)} className={`rounded-xl w-12 h-12 min-w-12 cursor-pointer  border-gray-300 border flex items-center justify-center hover:bg-gray-50 transition-all  text-blue-400 `}>{searchState == false ? (<Plus size={16} className="" />):(<X size={16} className="" />)}</div>
          
          {searchState == true ? (
                  <div className="">
                    <div className={`flex  items-center h-12 group w-full flex-1  text-sm font-medium  justify-center transition border-[1px] border-gray-300 rounded-xl `}>
                  <MagnifyingGlass size={16} className={` min-w-[52px] `} />
                  
                  <input
                    type="text"
                    value={pesquisaInput}
                    onChange={(e) => setPesquisaInput(e.target.value)}
                    name=""
                    placeholder="Digite um termo"
                    id="" 
                    className="placeholder-white::placeholder w-full h-full outline-none rounded-xl text-gray-400" />
                </div>

                {pesquisaInput.length >= 3 ? (
                    <div className="mt-4 bg-white z-[999] p-4 absolute gap-3 flex flex-col border border-gray-300 rounded-xl ">
                        <div className="flex gap-3 flex-wrap max-w-[300px] w-[300px]">
                          {checkboxItems}
                        </div>


                    </div>
                   ):(``)}

               
                  </div>
                ): ('')}

<div onClick={() => handleBtnCsvTaxonomia()}  className={`rounded-xl w-12 h-12 min-w-12 cursor-pointer  border-gray-300 border flex items-center justify-center hover:bg-gray-50 transition-all  text-blue-400 `}><FileCsv size={16} className="" /></div>
          
          </div>


      
            <div className="p-2 h-12 justify-center bg-blue-400 px-6 rounded-xl text-white  flex items-center">
            {isLoading? (
                 <div className="w-12">
                 <Lottie animationData={loading} loop={true}/>
              </div>
            ):(
                <div className="flex items-center justify-center gap-2">
                    <h4 className="text-xl font-bold">{totalResearcherCount}</h4>
                <p>pesquisadores</p>
                </div>
            )}
            </div>
        </div>
        </div>

       {isTab ? (
        <div className="flex flex-1 w-full mt-8" style={{ height: `calc(90vh - 146px )` }}>
          {isLoading? (

<div className="flex items-center justify-center  w-full py-10 ">
<div className="w-[700px]">
<Lottie animationData={search_animation} loop={true}/>
<p className="text-gray-400 font-medium text-center">Estamos fazendo a busca dos melhores termo para a taxonomia de {selectedTax}. Aguarde um momento enquanto processamos <span className="text-blue-400 text-lg font-bold">{palavraProcessada.replace(/;/g, ' ')}</span></p>
</div>
</div>
):(
<div className="flex">
<div className="flex flex-1 h-full">






</div>

<div className="h-full pb-24">
    

    
           
               <div className="h-full  rounded-xl">
                 <HighchartsReact highcharts={Highcharts} options={treemapOptions} className={`h-full rounded-xl`} />
               </div>
          
   </div>
</div>
)}
     
        </div>

       ): (
         <div className="flex flex-1 w-full " style={{ height: `calc(90vh - 146px )` }}>
 


         <div className="w-full overflow-x-auto mt-8 elementBarra overflow-y-hidden flex gap-6">
           <div  className="flex gap-6 flex-nowrap h-full ">
           {isLoading? (
               <div className="flex items-center justify-center h-full w-full py-10">
               <div className="w-[700px]">
               <Lottie animationData={search_animation} loop={true}/>
               <p className="text-gray-400 font-medium text-center">Estamos fazendo a busca dos melhores termo para a taxonomia de {selectedTax}. Aguarde um momento enquanto processamos <span className="text-blue-400 text-lg font-bold">{palavraProcessada.replace(/;/g, ' ')}</span></p>
               </div>
           </div>
           ):(
            Object.keys(researcher).map((termo, index) => (
                  <div  key={termo} >
          
 <div id={`trellobox${index}`}  style={{ maxHeight: `calc(90vh - 196px )`}} className="min-w-[370px] w-[370px]  gap-3 flex flex-col h-fit bg-white border border-gray-300 p-4 rounded-xl" key={index}>
 {/* Renderizar a lista de pesquisadores para cada termo */}


<div className=" rounded-lg items-center  h-16 text-gray-400 p-4 flex justify-between">
<div className="flex gap-3 items-center">
<CursorText size={16} className="" />
<p className="p-1 px-3 bg-blue-400 rounded-md text-white text-xs font-medium ">{researcherCountsByTerm[termo]}</p>
<h3 className="font-medium">{termo.replace(/;/g, ' ')}</h3>
</div>


<div onClick={() => handleDeleteTerm(termo)} className={`outline-none cursor-pointer text-sm rounded-xl text-gray-400 flex items-center border-[1px] justify-center border-white gap-2  font-semibold transition hover:bg-gray-100 w-[38px] whitespace-nowrap h-[38px] `}>
<Trash size={16} className="" />
</div>
</div>

<ul className="flex flex-col gap-3  overflow-y-auto elementBarra">
{researcher[termo].map((researcher: any, researcherIndex: any) => (
<div>
<div key={researcherIndex} onClick={() => handleOpenPopUp(researcher.id,termo)} className="bg-white group cursor-pointer flex hover:shadow-md transition-all  border boder-gray-300 rounded-lg h-32 ">




<div className="p-4 h-full w-full justify-between  flex-1 flex flex-col">
<div className={`flex  flex-col w-full relative `}>
<h4 className={`text-sm font-bold text-gray-500  mb-1 `}>{researcher.name}</h4>
<div className="flex items-center gap-2 overflow-hidden truncate">
{researcher.image == "None" ? (
 <Buildings size={16} className="text-gray-500" />
) : (
 <img src={researcher.image} alt="" className="h-6" />

)}
<p className="text-[12px]  w-full whitespace-normal text-gray-500 truncate">{researcher.university}</p>
</div>
</div>

<div className="flex justify-between items-center gap-3">
<div className="text-blue-400 flex text-xs font-bold gap-3">{researcher.among} ocorrências</div>



<div className="flex gap-3">
<Link to={`/researcher/4/${researcher.id}`} target="_blank" className={`   z-[9]  top-6 hidden group-hover:flex cursor-pointer items-center gap-4 bg-blue-400 hover:bg-blue-500 text-white rounded-md h-[32px] w-[32px] justify-center  font-medium transition right-20  ${valoresSelecionadosExport != '' ? "right-20" : "right-6"}`}>
<ArrowSquareOut size={16} className="text-white" />
</Link>

<label className={` ${pesquisadoresSelecionadosGroupBarema.includes(researcher.name) ? 'bg-red-400 hover:bg-red-500' : 'bg-blue-400 hover:bg-blue-500'}  z-[9]  top-6 hidden group-hover:flex cursor-pointer items-center gap-4 bg-blue-400 hover:bg-blue-500 text-white rounded-md h-[32px] w-[32px] justify-center  font-medium transition right-20  ${valoresSelecionadosExport != '' ? "right-20" : "right-6"}`}>
{pesquisadoresSelecionadosGroupBarema.includes(researcher.name) ? (
<X size={16} className="text-white" />
) : (
<Plus size={16} className="text-white" />
)}

<input
type="checkbox"
className="absolute hidden"
name={researcher.name}
checked={itensSelecionados.includes(researcher.name)}
onChange={() => handleCheckboxChange(researcher)}
/>
</label>
</div>

<div className="border-[1px] border-gray-300 py-2 flex group-hover:hidden px-4 text-gray-400 rounded-md text-xs font-medium gap-2 items-center"><MapPin size={12} className="" /> {researcher.city}</div>


</div>
</div>


{ researcher.area.split(';').slice(0, 1).map((value: any, index:any) => (
   <li
     key={index}
     className={` w-2 rounded-r-lg text-white items-center ${value.includes('CIENCIAS AGRARIAS') ? 'bg-red-400' : value.includes('CIENCIAS EXATAS E DA TERRA') ? 'bg-green-400' : value.includes('CIENCIAS DA SAUDE') ? 'bg-[#20BDBE]' : value.includes('CIENCIAS HUMANAS') ? 'bg-[#F5831F]' : value.includes('CIENCIAS BIOLOGICAS') ? 'bg-[#EB008B]' : value.includes('ENGENHARIAS') ? 'bg-[#FCB712]' : value.includes('CIENCIAS SOCIAIS APLICADAS') ? 'bg-[#009245]' : value.includes('LINGUISTICA LETRAS E ARTES') ? 'bg-[#A67C52]' : value.includes('OUTROS') ? 'bg-[#1B1464]' : 'bg-gray-400'} `}
   >
    
   </li>
 ))}

</div>

{openPopUpId === researcher.id  && researcher.termo === valoresSelecionadosExport  && (
<div key={researcher.id} className={"elementPesquisador flex justify-center transition-all fixed top-0 right-0 pb-24 w-full h-screen bg-[#000] z-[99999] bg-opacity-75 pt-20 overflow-y-auto overflow-x-hidden "}>

<div className="w-screen h-screen absolute top-0 left-0 " onClick={() => handleClosePopUp(researcher.id)} ></div>
<PopUp
isPopUpVisible={isPopUpVisible}
among={researcher.among}
articles={researcher.articles}
book={researcher.book}
book_chapters={researcher.book_chapters}
id={researcher.id}
name={researcher.name}
university={researcher.university}
lattes_id={researcher.lattes_id}
area={researcher.area}
abstract={researcher.abstract}
lattes_10_id={researcher.lattes_10_id}
city={researcher.city}
orcid={researcher.orcid}
image={researcher.image}
graduation={researcher.graduation}
patent={researcher.patent}
software={researcher.software}
brand={researcher.brand}
lattes_update={researcher.lattes_update}
/>

<div className=" pt-20 flex flex-col fixed items-center h-screen right-0 top-0 w-32 z-[9999999]">

<div className="mb-6 flex flex-col justify-center items-center">
<div onClick={() => handleClosePopUp(researcher.id)} className="mb-2 h-12 w-12 rounded-2xl bg-white items-center justify-center flex hover:bg-gray-100 cursor-pointer transition-all">
<X size={16} className="text-gray-500" />
</div>
<p className="text-[12px] text-white">Fechar</p>
</div>



<div className="mb-6 flex flex-col justify-center items-center">
<div  onClick={() => handleBtnCsv(researcher.id)} className="mb-2 h-12 w-12 rounded-2xl bg-white items-center justify-center flex hover:bg-gray-100 cursor-pointer transition-all">
<FileCsv size={16} className="text-gray-500" />
</div>

<p className="text-[12px] text-white"> CSV publicações</p>
</div>

<div className="mb-6 flex flex-col justify-center items-center">
<label key={index} className={`mb-2 h-12 w-12 rounded-2xl ${pesquisadoresSelecionadosGroupBarema.includes(researcher.name) ? 'bg-red-400 hover:bg-red-500 text-white' : 'text-gray-500 bg-white hover:bg-gray-50'} items-center justify-center flex hover:bg-gray-100 cursor-pointer transition-all`}>
{pesquisadoresSelecionadosGroupBarema.includes(researcher.name) ? (
<X size={16} className="" />
) : (
<Plus size={16} className="" />
)}

<input
type="checkbox"
className="absolute hidden"
name={researcher.name}
checked={itensSelecionados.includes(researcher.name)}
onChange={() => handleCheckboxChange(researcher)}
/>
</label>

<p className="text-[12px] text-white"> {pesquisadoresSelecionadosGroupBarema.includes(researcher.name) ? (`Remover`): (`Adicionar`)}</p>
</div>

<div className="mb-6 flex flex-col justify-center items-center">
<Link to={`/researcher/4/${researcher.id}`} target="_blank" className="mb-2 h-12 w-12 rounded-2xl bg-blue-400 items-center justify-center flex hover:bg-blue-500 cursor-pointer transition-all">
<ArrowSquareOut size={16} className="text-white" />
</Link>

<p className="text-[12px] text-white"> Mais info</p>
</div>


</div>
</div>
)}
</div>
))}
</ul>


</div>

                   
                  </div>
                     ))
)}

           </div>


















         </div>




       </div>
       )}
      </div>


      <Filter/>
      <Footer/>
        </div>
    )
}