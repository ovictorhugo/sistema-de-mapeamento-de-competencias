import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/context';
import { Buildings, CaretDown, CaretLeft, CaretRight, CaretUp, Info, PuzzlePiece, SlidersHorizontal, Trash, Users, X } from 'phosphor-react';
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
    const [popupPesquisadores , setPopupPesquisadores] = useState(false);
    const [filtroInstituicao , setFiltroInstituicao] = useState(false);

  

    const [researcher, setResearcher] = useState<Research[]>([]); // Define o estado vazio no início
    const [isLoading, setIsLoading] = useState(false);

    const { botaoPesquisadoresClicado, setBotaoPesquisadoresClicado } = useContext(UserContext);
  const { urlGeral, setUrlGeral } = useContext(UserContext);
  const { pesquisadoresSelecionadosGroupBarema, setPesquisadoresSelecionadosGroupBarema } = useContext(UserContext);

  let urlTermPesquisadores = `${urlGeral}/researcherName?name=${pesquisadoresSelecionadosGroupBarema}`

  if (botaoPesquisadoresClicado) {
    urlTermPesquisadores = `${urlGeral}/researcherName?name=${pesquisadoresSelecionadosGroupBarema}`;
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
              className={`  ${qualisColor[quali.itens]}  cursor-pointer  gap-3 flex h-8 items-center px-4 text-white rounded-md text-xs font-bold ${isChecked ? 'activeTab' : ''}`}
            >
              <PuzzlePiece size={12} className="text-white" /> 
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

       
   
      };

      const limparSelecao = () => {
        setPesquisadoresSelecionadosGroupBarema('')
       
   
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
      const optionsDropdown = ['Universidade Estadual do Sudoeste da Bahia', 'Universidade Estadual de Santa Cruz', 'Universidade do Estado da Bahia', 'Universidade Estadual de Feira de Santana'];
      const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
      const {intituicoesSelecionadasCheckbox, setIntituicoesSelecionadasCheckbox} = useContext(UserContext)
      setIntituicoesSelecionadasCheckbox(selectedOptions.join(';'))

      console.log(intituicoesSelecionadasCheckbox)

  return (
    <div  ref={ref} className={` `} >

        
            <div className='transition pb-8 fixed top-0 flex left-0 h-full z-[999999]  '>
              <div className={`h-full pb-4 w-16 items-center z-10 flex flex-col justify-between ${EstadoFiltro || popupPesquisadores ? ('bg-gray-50'): ('')}`}>
                <div>
                <div className='h-[80px] items-center justify-center flex '>
                <div onClick={() => setEstadoFiltro(!EstadoFiltro)} className="  h-10 w-10 rounded-xl bg-gray-100 items-center justify-center flex hover:bg-gray-300 cursor-pointer transition-all">
                    {EstadoFiltro ? (
                      <CaretLeft size={16} className="text-gray-500" />
                    ): (
                      <CaretRight size={16} className="text-gray-500" />
                    )}
                  </div>
                </div>

                {EstadoFiltro || popupPesquisadores ? (
                  <div onClick={() => setEstadoFiltro(!EstadoFiltro)} className="mb-2 h-10 w-10 rounded-xl bg-blue-400 items-center justify-center flex hover:bg-blue-500 cursor-pointer transition-all">
                  <SlidersHorizontal size={16} className="text-white" />
                </div>
                ): ('')}
                </div>
                <div>

                <div  className="mb-4  h-10 w-10 rounded-xl bg-gray-100 items-center justify-center flex hover:bg-gray-300 cursor-pointer transition-all">
                <Info size={16} className="text-gray-500" />
                  </div>
               
                  <div  onClick={handleClickBtn} className=" h-10 w-10 rounded-xl bg-blue-400 items-center justify-center flex hover:bg-blue-500 cursor-pointer transition-all">
                    <Users size={16} className="text-white" />
                  </div>

                 
              
                </div>
              </div>

               {EstadoFiltro ? (
                 <div className='bg-white w-[400px] h-full mb-8 p-6 shadow-lg border-r-300 border-r  '>
                 <div className='flex items-center gap-6 justify-between mb-8'>
                 <div className='flex items-center gap-4'>
                     <SlidersHorizontal size={24} className="text-gray-400" />
                     <p className='text-gray-400 text-lg '>Filtros</p>
                 </div>
 
                 <div className="w-fit cursor-pointer h-10 whitespace-nowrap flex items-center gap-2  text-blue-400 rounded-xl px-4 py-2 justify-center hover:bg-gray-50 text-sm font-medium transition">
                 <Trash size={16} className="" /> Limpar filtros
                 </div>
                 </div>
 
                 <div className=''>
 
                   <div onClick={() => setFiltroArea(!filtroArea)} className='w-full h-12 border border-gray-300 mb-4 hover:bg-gray-50 transition-all cursor-pointer rounded-xl flex items-center justify-between'>
                   <div className='flex w-full p-6 items-center gap-6 justify-between'>
                 <div className='flex items-center gap-4'>
                     <SlidersHorizontal size={20} className="text-gray-400" />
                     <p className='text-gray-400 text-base font-medium '>Área de especialidade</p>
                 </div>
 
                 <div  className={`cursor-pointer  transition-all flex items-center justify-center `}>
                         {filtroArea ? (
                          <CaretUp size={20} className={' text-gray-400'} />
                         ): (
                          <CaretDown size={20} className={' text-gray-400'} />
                         )}
                         </div>
                 </div>
                   </div>
 
                 {filtroArea ? (
                  <div className="gap-3 flex flex-wrap mb-8 ">
                  {checkboxQualis}
                </div>
                 ): ('')}

<div onClick={() => setFiltroInstituicao(!filtroInstituicao)} className='w-full h-12 border border-gray-300 mb-4 hover:bg-gray-50 transition-all cursor-pointer rounded-xl flex items-center justify-between'>
                   <div className='flex w-full p-6 items-center gap-6 justify-between'>
                 <div className='flex items-center gap-4'>
                     <Buildings size={20} className="text-gray-400" />
                     <p className='text-gray-400 text-base font-medium '>Instituição</p>
                 </div>
 
                 <div  className={`cursor-pointer  transition-all flex items-center justify-center `}>
                         {filtroInstituicao ? (
                          <CaretUp size={20} className={' text-gray-400'} />
                         ): (
                          <CaretDown size={20} className={' text-gray-400'} />
                         )}
                         </div>
                 </div>
                   </div>

                   {filtroInstituicao ? (
                    <DropdownMultiSelect
                    options={optionsDropdown}
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                    />
                   ): ('')}

                 </div>
                 </div>
               ):('')}

{popupPesquisadores ? (
        <div className='bg-white w-[400px] h-full mb-8 p-6 shadow-lg border-r-300 border-r  '>
           <div className='flex items-center gap-6 justify-between mb-8'>
                 <div className='flex items-center gap-4'>
                     <Users size={24} className="text-gray-400" />
                     <p className='text-gray-400 text-lg '>Pesquisadores selecionados</p>
                 </div>
 
                 <div onClick={() => limparSelecao()} className="w-fit cursor-pointer h-10 whitespace-nowrap flex items-center gap-2  text-blue-400 rounded-xl px-4 py-2 justify-center hover:bg-gray-50 text-sm font-medium transition">
                 <Trash size={16} className="" /> Limpar seleção
                 </div>
                 </div>

                 <div>
                 {pesquisadoresSelecionadosGroupBarema == "" ? (
        <div className="text-gray-300 mb-4 font-bold text-sm">Nenhum pesquisador selecionado</div>
      ) : (
        <div className="mb-4 flex flex-col gap-4  m-[0 auto] w-full">
          {researcher.map(user => {
            return (
              <li key={user.id} className="list-none">
                <div className="rounded-md p-4 border-[1px] border-gray-300 flex gap-4 items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <div className="bg-cover border-[1px] border-gray-300 bg-center bg-no-repeat h-16 w-16 bg-white rounded-md relative" style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${user.lattes_10_id}) ` }}></div>

                    <div className="flex flex-col">
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
        </div>
       ): ('')}

            </div>
       

      
      
      
    </div>
  )
};
