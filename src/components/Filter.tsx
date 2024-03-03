import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/context';
import { Buildings, CaretDown, CaretLeft, CaretRight, CaretUp, CheckCircle, FileCsv, Info, PuzzlePiece, SlidersHorizontal, Textbox, Trash, Users, UsersThree, X } from 'phosphor-react';
import DropdownMultiSelect from './DropdownMultiSelect';

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
  abstract: string
  city: string,
  orcid: string,
  image: string,
  graduation: string,
  patent: string,
  software: string,
  brand: string,
  lattes_update: Date,
}

export function Filter() {
    const { EstadoFiltro, setEstadoFiltro } = useContext(UserContext);
    const [filtroArea , setFiltroArea] = useState(false);
    const [infoFiltro, setInfoFiltro] = useState(false);
    const [popupPesquisadores , setPopupPesquisadores] = useState(false);
    const [filtroInstituicao , setFiltroInstituicao] = useState(false);

  

    const [researcher, setResearcher] = useState<Research[]>([]); // Define o estado vazio no início
    const [isLoading, setIsLoading] = useState(false);

    const { botaoPesquisadoresClicado, setBotaoPesquisadoresClicado } = useContext(UserContext);
  const { urlGeral, setUrlGeral } = useContext(UserContext);
  const { pesquisadoresSelecionadosGroupBarema, setPesquisadoresSelecionadosGroupBarema } = useContext(UserContext);
   
  let urlTermPesquisadores = `${urlGeral}/researcherName?name=${pesquisadoresSelecionadosGroupBarema}&graduate_program_id=`
  
  if(pesquisadoresSelecionadosGroupBarema == "") {
    urlTermPesquisadores = `${urlGeral}/researcherName?name=null&graduate_program_id=`
  }
  const [jsonData, setJsonData] = useState<any[]>([]);
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
          setJsonData(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [pesquisadoresSelecionadosGroupBarema]);


  

    const qualisColor: { [key: string]: string } = {
        'CIENCIAS AGRARIAS': 'bg-red-400',
        'CIENCIAS EXATAS E DA TERRA': 'bg-green-400',
        'CIENCIAS DA SAUDE': 'bg-cyan-400',
        'CIENCIAS HUMANAS': 'bg-[#F5831F]',
        'CIENCIAS BIOLOGICAS': 'bg-[#EB008B]',
        'ENGENHARIAS': 'bg-[#FCB712]',
        'CIENCIAS SOCIAIS APLICADAS': 'bg-[#009245]',
        'LINGUISTICA LETRAS E ARTES': 'bg-[#A67C52]',
        'OUTROS': 'bg-[#1B1464]',
      }

      type Qualis = "A1" | "A2" | "A3" | "A4" | "B1" | "B2" | "B3" | "B4" | "B5" | "C" | "SQ" | "NP";

      const [qualis, setQualis] = useState([
        { id: 1, itens: 'CIENCIAS AGRARIAS' },
        { id: 2, itens: 'CIENCIAS EXATAS E DA TERRA' },
        { id: 3, itens: 'CIENCIAS DA SAUDE' },
        { id: 4, itens: 'CIENCIAS HUMANAS' },
        { id: 5, itens: 'CIENCIAS BIOLOGICAS' },
        { id: 6, itens: 'ENGENHARIAS' },
        { id: 7, itens: 'CIENCIAS SOCIAIS APLICADAS' },
        { id: 8, itens: 'LINGUISTICA LETRAS E ARTES' },
        { id: 10, itens: 'OUTROS' },
      ]);

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
            className={`checkboxLabel group list-none inline-flex group overflow-hidden`}
            onMouseDown={(e) => e.preventDefault()}
          >
            <label
              className={`   cursor-pointer  gap-3 flex h-10 items-center px-4  rounded-lg text-xs font-bold activeTab bg-blue-100 hover:text-blue-400 transition-all ${isChecked ? ' text-blue-400' : 'border-gray-300 border text-gray-400'}`}
            >
              <PuzzlePiece size={12} className="" /> 
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

      const history = useNavigate();
      const { valoresSelecionadosExport, setValoresSelecionadosExport } = useContext(UserContext);

      const handleClickBtn = () => {
        setPopupPesquisadores(!popupPesquisadores)
        setEstadoFiltro(false)
        setInfoFiltro(false)
       
   
      };

      const handleFiltroBtn = () => {
        setEstadoFiltro(true)
        setPopupPesquisadores(false)
        setInfoFiltro(false)
      }

      const handleInfoBtn = () => {
        setEstadoFiltro(false)
        setPopupPesquisadores(false)
        setInfoFiltro(true)
      }

      const handleBackBtn = () => {
        setEstadoFiltro(false)
        setPopupPesquisadores(false)
        setInfoFiltro(false)
      }


      const handlePopUpBtn = () => {

        if(EstadoFiltro == false && popupPesquisadores == false && infoFiltro == false) {
          setEstadoFiltro(!EstadoFiltro)
        }

        if(EstadoFiltro == true && popupPesquisadores == false && infoFiltro == false) {
          
          setEstadoFiltro(!EstadoFiltro)
        }

        if(EstadoFiltro == false && popupPesquisadores == true && infoFiltro == false) {
          setPopupPesquisadores(!popupPesquisadores)
        }

        if(EstadoFiltro == false && popupPesquisadores == false && infoFiltro == true) {
          setInfoFiltro(!infoFiltro)
        }
        
        setPopupPesquisadores(false)
        setInfoFiltro(false)
      }

      const limparSelecao = () => {
        setPesquisadoresSelecionadosGroupBarema('')
        localStorage.setItem('pesquisadoresSelecionadosGroupBarema', JSON.stringify(""))
       
   
      };
      const {filtroAreas, setFiltroAreas} = useContext(UserContext)

      const limparFiltros = () => {
        setSelectedOptions([])
        setFiltroAreas('')
        setItensSelecionados([])
   
      };



      //scrool
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

      //instituições
      //dropdowsn
      const optionsDropdown = ['Universidade Estadual do Sudoeste da Bahia', 'Universidade Estadual de Santa Cruz', 'Universidade do Estado da Bahia', 'Universidade Estadual de Feira de Santana', 'Universidade Federal do Sul da Bahia'];
      const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
      const {intituicoesSelecionadasCheckbox, setIntituicoesSelecionadasCheckbox} = useContext(UserContext)
      
      setIntituicoesSelecionadasCheckbox(selectedOptions.join(';'))

      

      setFiltroAreas(itensSelecionados.join(';'))
     

      const [dataModificacao, setDataModificacao] = useState('');

      useEffect(() => {
        const dataAtual = new Date();
        const dataFormatada = `${dataAtual.getDate()}/${dataAtual.getMonth() + 1}/${dataAtual.getFullYear()}`;
    
        
        setDataModificacao(dataFormatada);
      }, []);


      // btn download

      const { valorDigitadoPesquisaDireta, setValorDigitadoPesquisaDireta } = useContext(UserContext);
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
      const csvData = convertJsonToCsv(jsonData);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `pesquisadores_${valoresSelecionadosExport}${valorDigitadoPesquisaDireta}.csv`;
      link.href = url;
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  const [colaboradores, setColaboradores] = useState([
    { id: 1, itens: 'https://www.ufba.br/sites/portal.ufba.br/files/brasao_ufba.jpg', name: `Victor Hugo de Jesus Oliveira`, inst: `Universidade Federal da Bahia`, img:`../col_3.png` },
    { id: 2, itens: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Bras%C3%A3o_da_UNEB.png', name: `Matheus Souza dos Santos`, inst: `Universidade do Estado da Bahia`, img:`../col_4.png` },
    { id: 3, itens: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Bras%C3%A3o_da_UNEB.png', name: `Eduardo Manuel de Freitas Jorge`, inst: `Universidade do Estado da Bahia`, img:`../col_2.png` },
    { id: 4, itens: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Bras%C3%A3o_UESC.svg/1200px-Bras%C3%A3o_UESC.svg.png', name: `Gesil Sampaio Amarante Segundo`, inst: `Universidade Estadual de Santa Cruz`, img:`../col_5.png` },
    { id: 5, itens: 'https://www.ufrb.edu.br/ascom/images/documentos/marca/01_-_Preferencial.png', name: `Gleidson de Meireles Costa`, inst: `Universidade Federal do Recôncavo da Bahia`, img:`../col_1.png` },
  ]);



  return (
    <div  ref={ref} className={` `} >

        
            <div className={`transition pb-8 fixed top-0 flex left-0 h-full z-[999999]  ${EstadoFiltro || popupPesquisadores || infoFiltro ? ('w-full'):('')}`}>
              <div className={`h-full pb-4 w-16 items-center z-10 flex flex-col justify-between ${EstadoFiltro || popupPesquisadores || infoFiltro ? ('bg-[#000] bg-opacity-25'): ('')}`}>
                <div>
                <div className='h-[80px] items-center justify-center flex '>
                <div onClick={() => handlePopUpBtn()} className="  h-10 w-10 rounded-xl bg-gray-100 items-center justify-center flex hover:bg-gray-300 cursor-pointer transition-all">
                    {EstadoFiltro || popupPesquisadores || infoFiltro ? (
                      <CaretLeft size={16} className="text-gray-500" />
                    ): (
                      <CaretRight size={16} className="text-gray-500" />
                    )}
                  </div>
                </div>

                {EstadoFiltro || popupPesquisadores || infoFiltro ? (
                  <div onClick={() => handleFiltroBtn()} className="mb-2 h-10 w-10 rounded-xl bg-blue-400 items-center justify-center flex hover:bg-blue-500 cursor-pointer transition-all">
                  <SlidersHorizontal size={16} className="text-white" />
                </div>
                ): ('')}
                </div>
                <div>

                <div onClick={() => handleInfoBtn()} className="mb-4  h-10 w-10 rounded-xl bg-gray-100 items-center justify-center flex hover:bg-gray-300 cursor-pointer transition-all">
                <Info  size={16} className="text-gray-500" />
                  </div>
               
                  <div  onClick={handleClickBtn} className=" h-10 w-10 rounded-xl bg-blue-400 items-center justify-center flex hover:bg-blue-500 cursor-pointer transition-all">
                    <Users size={16} className="text-white" />
                  </div>

                 
              
                </div>
              </div>

               {EstadoFiltro ? (
                 <div className='p-2 bg-[#000] pl-0  bg-opacity-25'>
                  <div className='bg-white w-[400px] rounded-xl h-full mb-8 p-6 shadow-lg border-r-300 border-r  '>
                 <div className='flex items-center gap-6 justify-between mb-8'>
                 <div className='flex items-center gap-4'>
                     <SlidersHorizontal size={24} className="text-gray-400" />
                     <p className='text-gray-400 text-lg '>Filtros</p>
                 </div>
 
                 <div onClick={() => limparFiltros()} className="w-fit cursor-pointer h-10 whitespace-nowrap flex items-center gap-2  text-blue-400 rounded-xl px-4 py-2 justify-center hover:bg-gray-50 text-sm font-medium transition">
                 <Trash size={16} className="" /> Limpar filtros
                 </div>
                 </div>
 
                 <div className=' overflow-y-auto elementBarra h-full'>
 
                   <div onClick={() => setFiltroArea(!filtroArea)} className='w-full h-12 border border-gray-300 mb-4 hover:bg-gray-50 transition-all cursor-pointer rounded-xl flex items-center justify-between'>
                   <div className='flex w-full p-6 items-center gap-6 justify-between'>
                 <div className='flex items-center gap-4'>
                     <SlidersHorizontal size={20} className="text-gray-400" />
                     <p className='text-gray-400 text-base font-medium '>Área de especialidade</p>
                 </div>
 
                 <div  className={`cursor-pointer  transition-all flex items-center justify-center `}>
                         {filtroArea ? (
                          <CaretUp size={16} className={' text-gray-400'} />
                         ): (
                          <CaretDown size={16} className={' text-gray-400'} />
                         )}
                         </div>
                 </div>
                   </div>
 
                 {filtroArea ? (
                  <div className="gap-3 flex flex-wrap mb-8 ">
                  {checkboxQualis}
                </div>
                 ): ('')}



                
                   <div className='w-full'>
                    <DropdownMultiSelect
                    options={optionsDropdown}
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                    />
                    </div>
             

                 </div>
                 </div>
                 </div>
               ):('')}

{popupPesquisadores ? (
  
  <div className='p-2 bg-[#000] pl-0  bg-opacity-25'>
    <div className='bg-white w-[400px] h-full rounded-xl mb-8 p-6 shadow-lg border-r-300 border-r  '>
           <div className='flex items-center gap-6 justify-between mb-8'>
                 <div className='flex items-center gap-4'>
                     <Users size={24} className="text-gray-400" />
                     <p className='text-gray-400 text-lg flex flex-1'>Pesquisadores selecionados</p>
                 </div>
 
                 <div onClick={() => limparSelecao()} className="w-fit cursor-pointer h-10 whitespace-nowrap flex items-center gap-2  text-blue-400 rounded-xl px-4 py-2 justify-center hover:bg-gray-50 text-sm font-medium transition">
                 <Trash size={16} className="" /> Limpar seleção
                 </div>
                 </div>

                 <div className='h-full overflow-y-auto elementBarra'>
                 {pesquisadoresSelecionadosGroupBarema == "" ? (
        <div className="text-gray-400 mb-4 ">Nenhum pesquisador selecionado</div>
      ) : (
        <div className="mb-4 flex flex-col gap-4  m-[0 auto] w-full">
          {researcher.map(user => {
            return (
              <li key={user.id} className="list-none">
                <div className="rounded-xl p-4 border-[1px] border-gray-300 flex gap-4 items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <div className="bg-cover border-[1px] border-gray-300 bg-center bg-no-repeat h-16 w-16 bg-white rounded-md relative" style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${user.lattes_10_id}) ` }}></div>

                    <div className="flex flex-col flex-1">
                      <h4 className="text-base font-medium  mb-1">{user.name}</h4>
                      <div className="flex items-center gap-2">
                        <Buildings size={16} className="text-gray-500" />
                        <p className="text-[13px]  text-gray-500">{user.university}</p>
                      </div>
                    </div>
                  </div>

                  <div>

                  </div>
                </div>
              </li>
            )
          })}
        </div>
      )}

      
                 </div>

                 <div className='pt-6 bg-white top-[-226px] z-[99] right-0  relative'>

                 <div  onClick={handleDownloadJson} className="w-full mb-4  text-blue-400 text-sm font-medium cursor-pointer h-12 p-4  border-[1px] border-solid bg-white border-gray-300 rounded-xl justify-center items-center flex outline-none  hover:bg-gray-50  gap-3  transition ">
                <FileCsv size={16} className="" /> Download dos pesquisadores selecionados
              </div>

                 <Link to={`/barema`} className="w-full cursor-pointer h-12 whitespace-nowrap flex items-center gap-4 bg-blue-400 text-white rounded-xl px-4 py-2 justify-center hover:bg-blue-500 text-sm font-medium transition">
                
                <Textbox size={16} className="text-white" />
             Barema
          </Link>
                 </div>
                 
        </div>
  </div>
       ): ('')}

{infoFiltro ? (
       <div className='p-2 bg-[#000] pl-0  bg-opacity-25'>
         <div className='bg-white rounded-xl w-[400px] h-full mb-8 p-6 shadow-lg border-r-300 border-r  '>
           <div className='flex items-center gap-6 justify-between mb-8'>
                 <div className='flex items-center gap-4 h-10'>
                     <Info size={24} className="text-gray-400" />
                     <p className='text-gray-400 flex flex-1 text-lg '>Informações</p>
                 </div>
 
                 
                 </div>

                <div className=' h-full'>
                <div className=' overflow-y-auto h-full elementBarra pb-24 pr-2'>
                 <div className="border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium gap-2 items-center w-fit mb-4">Versão 2.0.5 (beta) </div>
                 <div className="border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium gap-2 items-center w-fit mb-4">Sistema de Mapeamento de Competências da Bahia </div>
                    <p className='text-gray-400 text-justify mb-4'>
                    O Sistema de Mapeamento de Competências da Bahia - SIMCC é uma iniciativa que visa promover o desenvolvimento e aprimoramento das habilidades e conhecimentos dos profissionais no estado da Bahia. Desenvolvido por uma equipe composta por Victor Hugo de Jesus Oliveira (IFBA), Matheus Souza dos Santos (UNEB), Eduardo Manuel de Freitas Jorge (UNEB), Gesil Sampaio Amarante Segundo (UESC) e Gleidson de Meireles Costa (UFRB), o sistema representa uma abordagem inovadora para entender, organizar e utilizar as competências existentes na região. Têm-se os agradecimentos pela soma de esforços e de conhecimentos para idealização e criação da plataforma como Trabalho de Conclusão de Curso e projeto de Iniciação Científica. 

Agradecimento especial as Instituições de ensino público da Bahia e a Secretaria de Ciência, Tecnologia e Inovação.

Menção a Jônatas Pereira do Nascimento Rosa (UNEB) pela revisão e projeto textual da landing page.
                    </p>

                    <p className='text-gray-400 font-bold text-sm'>Site atualizado em {dataModificacao}</p>
      
                    <div className='flex items-center gap-4 h-10 my-4'>
                     <CheckCircle size={24} className="text-gray-400" />
                     <p className='text-gray-400 flex flex-1 text-lg '>Novidades da atualização</p>
                 </div>

                 <p className='text-gray-400 text-justify mb-4'>
                 - Mapa de pesquisadores por cidade<br/>
                 - Pesquisa por livros e capítulos<br/>
                 - Pesquisa por participações em eventos<br/>
                 - Barema de avaliação<br/>
                 - Login e criar conta<br/>
                 - Login módulo administrativo<br/>
                 - Revisão visual de componentes<br/>
                 - Módulo profnit<br/>
                    </p>

                    <div className='flex items-center gap-4 h-10 my-4'>
                     <UsersThree size={24} className="text-gray-400" />
                     <p className='text-gray-400 flex flex-1 text-lg '>Colaboradores</p>
                 </div>

                 <div className='w-full flex flex-col gap-3'>
                 {colaboradores.map(props => {
                            return(
                              <div  className="hover:bg-gray-50 transition-all  p-2 cursor-pointer border w-full flex gap-4 items-center border-gray-300 rounded-md " key={props.name}>
                              <div className={`whitespace-nowrap rounded-md bg-contain bg-center bg-no-repeat h-10 w-10  relative `} style={{ backgroundImage: `url(${props.img}) ` }}>
                               </div>
                            <div className='flex flex-1 flex-col' >
                            <div className="flex-1 m-0 font-bold text-gray-500">{props.name}</div>
                            <div className='flex items-center gap-2 mt-1'>
                            <div className={`whitespace-nowrap bg-contain bg-center bg-no-repeat h-6 w-6  relative `} style={{ backgroundImage: `url(${props.itens}) ` }}></div>
                            <div className="flex-1 m-0 text-gray-400 text-sm truncate max-w-[225px]">{props.inst}</div>
                           
                            </div>
                            </div>
                           </div>

                            )
                        })}
                 </div>
                 </div>
                </div>
                 
        </div>
       </div>
       ): ('')}

{EstadoFiltro || popupPesquisadores || infoFiltro ? (
  <div onClick={() => handleBackBtn()} className="h-screen w-full bg-[#000] flex-1 flex opacity-25"></div>
):('')}



            </div>
       

      
      
      
    </div>
  )
};
