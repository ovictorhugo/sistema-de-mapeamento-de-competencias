import { ArrowSquareOut, Buildings, CursorText, FileCsv, GitBranch, MapPin, Plus, UserList, X } from "phosphor-react";
import { Header } from "./Header";
import { useContext, useEffect, useState } from "react";
import Papa from 'papaparse';
import { UserContext } from "../contexts/context";
import DropdownMultiSelect from "./DropdownMultiSelect";
import { Link } from "react-router-dom";
import { PopUp } from "./PopUp";


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
  }


export function Taxonomia() {

    const [researcher, setResearcher] = useState<Research[]>([]);
    const { urlGeral, setUrlGeral } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    

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

    const handleTaxChange = (event:any) => {
        const selectedValue = event.target.value;
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

                    // Defina o primeiro valor como selecionado por padrão
                    if (uniqueTaxValues.length > 0) {
                        setSelectedTax(uniqueTaxValues[0]);
                        // Filtrar os itens com base no valor selecionado usando a lista original
                        const filtered = parsedData.filter((item:any) => item.tax === uniqueTaxValues[0]);
                        setFilteredItems(filtered);
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
      }, []);
     
      console.log(`filteredItems`,filteredItems)


      //fetch pesquisadores

      useEffect(() => {
        const fetchData = async () => {
          setIsLoading(true);
          try {

            let totalCount = 0;
        const updatedResearcherData: { [termo: string]: Research[] } = {};
        const updatedResearcherCountsByTerm: { [termo: string]: number } = {};

            // Iterar sobre cada termo em filteredItems
            for (const item of filteredItems) {
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
            (id) => researchersArray.find((r) => r.id === id)!
          );

              updatedResearcherData[item.termos] = uniqueResearchers;
              updatedResearcherCountsByTerm[item.termos] = uniqueResearchers.length;
              totalCount += uniqueResearchers.length;
              // Atualizar o estado usando uma cópia independente
              setResearcher((prevResearcher) => ({
                ...prevResearcher,
                [item.termos]: data,
              }));
              console.log(researcher)

              setResearcherCountsByTerm(updatedResearcherCountsByTerm);
              setTotalResearcherCount(totalCount);
             
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
      }, [taxValues, intituicoesSelecionadasCheckbox]);

      const [isPopUpVisible, setIsPopUpVisible] = useState(false);
      const { EstadoFiltro, setEstadoFiltro } = useContext(UserContext);
      const { idVersao, setIdVersao } = useContext(UserContext);
      const { valoresSelecionadosPopUp, setValoresSelecionadosPopUp } = useContext(UserContext)
        // Função para exibir o PopUp
  const [popUpVisibilities, setPopUpVisibilities] = useState([]);
  const { valoresSelecionadosExport, setValoresSelecionadosExport } = useContext(UserContext);
  const [popUpVisibilitiesMap, setPopUpVisibilitiesMap] = useState([]);

  const handleOpenPopUp = (index: any) => {
    const newVisibilities = [...popUpVisibilities];
    newVisibilities[index][0] = true;
    setPopUpVisibilities(newVisibilities);
    setEstadoFiltro(false);
    setIsPopUpVisible(true);
  };

  const handleOpenPopUpMap = (index: any) => {
    const newVisibilities = [...popUpVisibilitiesMap];
    newVisibilities[index][0] = true;
    setPopUpVisibilitiesMap(newVisibilities);
    setEstadoFiltro(false);
    setIsPopUpVisible(true);
  };
  
  const handleClosePopUp = (index: any) => {
    const newVisibilities = [...popUpVisibilities];
    newVisibilities[index][0] = false;
    setPopUpVisibilities(newVisibilities);
    setEstadoFiltro(false);
    setIsPopUpVisible(false);
    setValoresSelecionadosPopUp(valoresSelecionadosExport);
  };

  const handleClosePopUpMap = (index: any) => {
    const newVisibilities = [...popUpVisibilitiesMap];
    newVisibilities[index][0] = false;
    setPopUpVisibilitiesMap(newVisibilities);
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
let id_pesquisador = ""
const handleBtnCsv = () => {

    try {
    let urlPublicacoesPorPesquisador = `${urlGeral}bibliographic_production_researcher?terms=${valoresSelecionadosPopUp}&researcher_id=${id_pesquisador}&type=ARTICLE&qualis=&year=1900`;



    const [jsonData, setJsonData] = useState<any[]>([]);

  
    
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
  
    
    
    return  (
        <div className="h-screen max-h-screen">
      <Header/>

      <div className="py-24 h-full px-6 md:px-16 w-full">

        <div className="flex gap-6 my-6 justify-between">

        <div className="flex gap-6 items-center w-full">
            
            <div className="flex gap-4 items-center">
            <div className="flex items-center justify-center text-white bg-blue-400 h-12 w-12 rounded-xl"> <GitBranch size={20} className="rotate-180 " /></div>

        <div className="">
        <p className="font-medium">Taxonomia</p>
        <p className="text-sm text-gray-400">Termos em artigos</p>
        </div>
        </div>

        <div className="flex items-center gap-3 w-full flex-1">
       
        </div>
            </div>


        <div className="flex gap-6 flax-1">
            <div className="p-6 border flex items-center boder-gray-300 px-10 h-full rounded-xl">
            <form className="flex">
        {taxValues.map((taxValue, index) => (
        <div key={index}>
        <input
        type="radio"
        id={`tax-${index}`}
        name="tax"
        value={taxValue}
        checked={selectedTax === taxValue}
        onChange={handleTaxChange}
        />
        <label htmlFor={`tax-${index}`}>{taxValue}</label>
        </div>
        ))}
        </form>

        <div className='w-[320px] z-[99] flex'>
                    <DropdownMultiSelect
                    options={optionsDropdown}
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                    />
                    </div>
            </div>
            <div className="p-6 bg-blue-400 px-10 rounded-xl text-white flex-col flex items-center">
                <h4 className="text-xl font-bold">{totalResearcherCount}</h4>
                <p>pesquisadores</p>
            </div>
        </div>
        </div>

        <div className="h-full flex flex-1 w-full">
 


          <div className="w-full overflow-x-auto mt-8 elementBarra">
            <div className="flex gap-6 flex-nowrap">
            {Object.keys(researcher).map((termo, index) => (
              <div className="min-w-[450px] w-[450px]  gap-3 flex flex-col h-fit bg-white border border-gray-300 p-4 rounded-xl" key={index}>
                  {/* Renderizar a lista de pesquisadores para cada termo */}
     
      
          <div className=" rounded-lg items-center  h-16 text-gray-400 p-4 flex justify-between">
          <div className="flex gap-3 items-center">
          <CursorText size={16} className="" />
          <h3 className="font-medium">{termo}</h3>
          </div>
          <p>{researcherCountsByTerm[termo]}</p>
          </div>

          <ul className="flex flex-col gap-3 max-h-[400px] overflow-y-auto elementBarra">
          {researcher[termo].map((researcher: any, researcherIndex: any) => (
              <div>
                <div key={researcherIndex} onClick={() => handleOpenPopUp(researcher.id)} className="bg-white cursor-pointer flex hover:shadow-md transition-all  border boder-gray-300 rounded-lg h-32 ">
                
                <div className="relative">
                <div  className={`bg-cover absolute bg-top bg-no-repeat float-left backdrop-blur-md backdrop-brightness-150 h-full bg-gray-400 rounded-l-lg  w-16 flex`} style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${researcher.lattes_10_id}) ` }}>
          <div className={`bg-[#000000] bg-opacity-30 absolute backdrop-blur-sm w-full h-full rounded-l-lg`}></div>

        </div>
                </div>

        <div className="flex items-center relative pl-4">
        <div className={`whitespace-nowrap   bg-cover bg-center bg-no-repeat h-20 w-20 bg-white rounded-xl border-4 border-white  `} style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${researcher.lattes_10_id}) ` }}>
            </div>
        </div>

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
            <div className="border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium gap-2 items-center"><MapPin size={12} className="" /> {researcher.city}</div>
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

              {popUpVisibilities[researcher.id] && (
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
        <div onClick={handleBtnCsv} className="mb-2 h-12 w-12 rounded-2xl bg-white items-center justify-center flex hover:bg-gray-100 cursor-pointer transition-all">
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
        <Link to={``} target="_blank" className="mb-2 h-12 w-12 rounded-2xl bg-blue-400 items-center justify-center flex hover:bg-blue-500 cursor-pointer transition-all">
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
                ))}
            </div>
          </div>




        </div>
      </div>
        </div>
    )
}