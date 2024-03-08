import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/context";
import Papa from 'papaparse';
import { Books, Copyright, Funnel, IdentificationCard, Lightbulb, MagnifyingGlass, Quotes, SlidersHorizontal, TextAlignLeft, Ticket, Trash, X } from "phosphor-react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import unorm from 'unorm';
import p from 'pluralize-ptbr';

interface Csv {
    great_area: string
    term: string
    frequency: string
    type_: string
  }

export function NewSearch() {
    const { urlGeral, setUrlGeral } = useContext(UserContext);
    const { EstadoFiltro, setEstadoFiltro } = useContext(UserContext);
    const [isOpen, setIsOpen] = useState(false);
    const [filteredItems, setFilteredItems] = useState<Csv[]>([]);
    const [pesquisaInput, setPesquisaInput] = useState("")

    const { valoresSelecionadosExport, setValoresSelecionadosExport } = useContext(UserContext);
    const {valoresSelecionadosNuvem, setValoresSelecionadosNuvem} = useContext(UserContext)
    const { valorDigitadoPesquisaDireta, setValorDigitadoPesquisaDireta } = useContext(UserContext);

    const { botaoPatentesClicado, setBotaoPatentesClicado } = useContext(UserContext);
    const { botaoPesquisadoresClicado, setBotaoPesquisadoresClicado } = useContext(UserContext);
    const { botaoTermosClicado, setBotaoTermosClicado } = useContext(UserContext);
    const { botaoResumoClicado, setBotaoResumoClicado } = useContext(UserContext);
    const { botaoAreasClicado, setBotaoAreasClicado } = useContext(UserContext);
    const { botaoLivrosCapitulosClicado, setBotaoLivrosCapitulosClicado } = useContext(UserContext);
    const { botaoEventosClicado, setBotaoEventosClicado } = useContext(UserContext);

    useEffect(() => {
        const filePath = "../dicionario.csv";

        const fetchData = async () => {
          try {
            const response = await fetch(filePath);
            const text = await response.text();
    
            Papa.parse(text, {
              complete: (result: any) => {
                const parsedData = result.data;
            
                setFilteredItems(parsedData); 
                console.log(parsedData);
                
                      
              },
              header: true,
              skipEmptyLines: true,
              delimiter: ',',
              encoding: 'UTF-8',
            });
          } catch (error) {
            console.error('Erro ao carregar o arquivo:', error);
          }
        };
    
        fetchData();
      }, []);

      const filteredResults = filteredItems.filter(props =>
        unorm.nfkd(props.term).replace(/[^\w\s]/gi, '').toLowerCase().startsWith(unorm.nfkd(pesquisaInput).replace(/[^\w\s]/gi, '').toLowerCase())
      );

      //limpar pesquisa
    const limparPesquisa = () => {
        setValorDigitadoPesquisaDireta(``)
        setValoresSelecionadosExport(``)
        setPesquisaInput("");
  
        setPesquisaInput('')
        setValoresSelecionadosNuvem(``)
   
      };

      function handleClick() {
        setValorDigitadoPesquisaDireta(pesquisaInput.replace(/\s+/g, ";"));
        setIsOpen(false)
      }

      const [selectedTab, setSelectedTab] = useState(0);

      const handleClickAreas = () => {
        setBotaoAreasClicado(true);
        setBotaoPesquisadoresClicado(false);
        setBotaoPatentesClicado(false)
        setBotaoTermosClicado(false);
        setBotaoResumoClicado(false)
        setBotaoEventosClicado(false)
        setBotaoLivrosCapitulosClicado(false)

        setSelectedTab(2);
        setPesquisaInput('')
      };

      const handleClickLivrosCapitulos = () => {
        setBotaoAreasClicado(false);
        setBotaoPesquisadoresClicado(false);
        setBotaoPatentesClicado(false)
        setBotaoTermosClicado(false);
        setBotaoResumoClicado(false)
        setBotaoEventosClicado(false)
        setBotaoLivrosCapitulosClicado(true)

        setSelectedTab(5);
        setPesquisaInput('')
      }

      const handleClickEventos = () => {
        setBotaoAreasClicado(false);
        setBotaoPesquisadoresClicado(false);
        setBotaoPatentesClicado(false)
        setBotaoTermosClicado(false);
        setBotaoResumoClicado(false)
        setBotaoEventosClicado(true)
        setBotaoLivrosCapitulosClicado(false)

        setSelectedTab(6);
        setPesquisaInput('')
      }

      const handleClickResumo = () => {
        setBotaoPesquisadoresClicado(false);
        setBotaoResumoClicado(true);
        setBotaoPatentesClicado(false)
        setBotaoAreasClicado(false);
        setBotaoTermosClicado(false)
        setBotaoEventosClicado(false)
        setBotaoLivrosCapitulosClicado(false)

        setSelectedTab(1);
        setPesquisaInput('')
      }

      const handleClickTermos = () => {
        setBotaoPesquisadoresClicado(false);
        setBotaoPatentesClicado(false)
        setBotaoTermosClicado(true);
        setBotaoAreasClicado(false);
        setBotaoResumoClicado(false)
        setBotaoEventosClicado(false)
        setBotaoLivrosCapitulosClicado(false)

        setSelectedTab(0);
        setPesquisaInput('')
      }

      const handleClickPatentes = () => {
        setBotaoPesquisadoresClicado(false);
        setBotaoPatentesClicado(true)
        setBotaoTermosClicado(false);
        setBotaoAreasClicado(false);
        setBotaoResumoClicado(false)
        setBotaoEventosClicado(false)
        setBotaoLivrosCapitulosClicado(false)

        setSelectedTab(4);
        setPesquisaInput('')
      }

      const handleClickPesquisadores = () => {
        setBotaoPesquisadoresClicado(true);
        setBotaoPatentesClicado(false)
        setBotaoTermosClicado(false);
        setBotaoAreasClicado(false);
        setBotaoResumoClicado(false)
        setBotaoEventosClicado(false)
        setBotaoLivrosCapitulosClicado(false)

        setSelectedTab(3);
        setPesquisaInput('')
      }

      const [itensSelecionados, setItensSelecionados] = useState<string[]>([]);

      const handleCheckboxChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name } = event.target;
        const isChecked = event.target.checked;
  
        setItensSelecionados((prevSelecionados) => {
          if (isChecked) {
            return [...prevSelecionados, name];
          } else {
            return prevSelecionados.filter((item) => item !== name);
          }
        });
      };

      const filteredSugestoes = filteredItems
      .sort((a, b) => Number(b.frequency) - Number(a.frequency))
      .filter(resultado => resultado.type_ === "ARTICLE")
      .slice(0, 10);

      const valoresSelecionados = itensSelecionados.join(';');

      useEffect(() => {
        setValoresSelecionadosExport(valoresSelecionados)

        // Lógica para obter o plural dos termos selecionados
   
      }, [itensSelecionados])

      const handleRemoverSelecionado = (index: number) => {
        setItensSelecionados((prevSelecionados) =>
          prevSelecionados.filter((_, i) => i !== index)
        );
      };

    return(
        <div className=' m-[0 auto] w-full px-6 md:px-16 '>
            <div  className='group w-full transition' onChange={() => setIsOpen(isOpen)} onFocus={() => setIsOpen(isOpen)} >
                
            <div className='flex flex-wrap md:flex-nowrap top-6 w-full'>

            <div className='flex w-full flex-col'>
                <div className={`flex  ${isOpen && pesquisaInput.length >= 3 ? 'bg-[#F9F9F9]' : 'bg-white'} items-center h-14 group w-full  text-base font-medium  justify-center transition border-[1px] border-gray-300 ${botaoTermosClicado ? 'hover:border-blue-400' : ''} ${botaoLivrosCapitulosClicado ? 'hover:border-pink-400' : ''} ${botaoEventosClicado ? 'hover:border-orange-400' : ''} ${botaoResumoClicado ? 'hover:border-yellow-400' : ''} ${botaoAreasClicado ? 'hover:border-green-400' : ''} ${botaoPesquisadoresClicado ? 'hover:border-red-400' : ''} ${botaoPatentesClicado ? 'group-hover:border-cyan-400' : ''} ${isOpen && pesquisaInput.length >= 3 ? 'rounded-tl-2xl' : 'rounded-l-2xl'}`}>
                
                <MagnifyingGlass size={20} className={`text-gray-400 min-w-[52px] ${botaoTermosClicado ? 'group-hover:text-blue-400' : ''} ${botaoResumoClicado ? 'group-hover:text-yellow-400' : ''} ${botaoLivrosCapitulosClicado ? 'group-hover:text-pink-400' : ''} ${botaoEventosClicado ? 'group-hover:text-orange-400' : ''} ${botaoAreasClicado ? 'group-hover:text-green-400' : ''} ${botaoPesquisadoresClicado ? 'group-hover:text-red-400' : ''} ${botaoPatentesClicado ? 'group-hover:text-cyan-400' : ''}`} />
                <div className='flex gap-2 mx-2'>
                {itensSelecionados.map((valor, index) => {
                    return(
                        <li key={index} className={`whitespace-nowrap gap-2   border-[1px] inline-flex h-10 items-center px-4 text-gray-400 rounded-lg text-xs font-bold ${botaoTermosClicado ? 'border-blue-400 bg-blue-100' : ''} ${botaoLivrosCapitulosClicado ? 'border-pink-400 bg-[#FFF5FB]' : ''} ${botaoEventosClicado ? 'border-orange-400 bg-[#FFF2E6]' : ''} ${botaoResumoClicado ? 'border-yellow-400 bg-[#FFFAE6]' : ''} ${botaoAreasClicado ? 'border-green-400 bg-[#F4FAEC]' : ''} ${botaoPesquisadoresClicado ? 'border-red-400 bg-[#FEE9E9]' : ''} ${botaoPatentesClicado ? 'border-cyan-400 bg-[#E9F4F4]' : ''}`}>{valor.replace(/;/g, ' ')}
                    <button onClick={() => handleRemoverSelecionado(index)}><X size={16} className={`text-gray-400 transition-all ${botaoTermosClicado ? 'hover:text-blue-400' : ''} ${botaoLivrosCapitulosClicado ? 'hover:text-pink-400' : ''} ${botaoEventosClicado ? 'hover:text-orange-400' : ''} ${botaoResumoClicado ? 'hover:text-yellow-400' : ''} ${botaoAreasClicado ? 'hover:text-green-400' : ''} ${botaoPesquisadoresClicado ? 'hover:text-red-400' : ''} ${botaoPatentesClicado ? 'hover:text-cyan-400' : ''}`} /></button>
                </li>
                    )
                })}
                </div>
                    <input
                    type="text"
                    value={pesquisaInput}
                    onChange={(e) => setPesquisaInput(e.target.value)}
                    onClick={() => setIsOpen(true)}
                    onFocus={() => setIsOpen(!isOpen)}
                    
                    name=""
                    placeholder={
                        `${botaoResumoClicado ? 'Pesquise por uma ou mais palavras no resumo do pesquisador (Ex: Robótica, educação, indústria)' : ''} ${botaoTermosClicado ? 'Pesquise um ou mais termos nos artigos do pesquisador (Ex: Robótica, educação, indústria)' : ''} ${botaoAreasClicado ? 'Pesquise uma ou mais áreas de especialidade (Ex: Astronomia, Ciência de dados)' : ''} ${botaoPesquisadoresClicado ? 'Pesquise o nome de um ou mais pesquisador(es)' : ''} ${botaoPatentesClicado ? 'Pesquise uma ou mais palavras nas patentes do pesquisador (Ex: energia, modelo, sistema)' : ''} ${botaoLivrosCapitulosClicado ? 'Pesquise uma ou mais palavras nos livros e capítulos do pesquisador do pesquisador (Ex: anatomia, Bahia, científica)' : ''} ${botaoEventosClicado ? 'Pesquise uma ou mais palavras nas participação em eventos do pesquisador (Ex: Congresso, SBPC, energia)' : ''}`
                    }
                    id="" className={`${isOpen && pesquisaInput.length >= 3 ? 'bg-[#F9F9F9]' : 'bg-white'} flex flex-1 h-full outline-none`} />

                    {valorDigitadoPesquisaDireta != `` || valoresSelecionadosExport != `` ? (
                        <div onClick={() => limparPesquisa()} className={`outline-none cursor-pointer text-sm rounded-xl text-gray-400 flex items-center border-[1px] justify-center border-white gap-2  font-semibold transition hover:bg-gray-100 w-[38px] whitespace-nowrap h-[38px] mr-2`}>
                        <Trash size={16} className="" />
                        </div>
                    ):(``)}
                    </div>
                </div>

                
            <Tabs>
              <TabList className={` ${isOpen && pesquisaInput.length >= 3 ? 'bg-[#F9F9F9]' : 'bg-white'}  p-2 flex gap-2  border-[1px] border-gray-300 border-l-0
            ${isOpen && pesquisaInput.length >= 3 ? 'rounded-tr-2xl' : 'rounded-r-2xl'}`}>

                <Tab  className={`outline-none cursor-pointer text-sm rounded-xl text-gray-400 flex items-center  justify-center  gap-2  font-semibold transition ${botaoTermosClicado ? "activeTermos px-4 py-2" : ('hover:bg-gray-100 w-[38px]')}`} onClick={handleClickTermos} name="buttontermos">
                  <Quotes size={16} className="" />
                  {selectedTab === 0 && botaoTermosClicado && <span>Termo</span>}
                </Tab>

                <Tab  className={`outline-none cursor-pointer text-sm rounded-xl text-gray-400 flex items-center  justify-center  gap-2  font-semibold transition ${botaoResumoClicado ? "activeResumo px-4 py-2" : ('hover:bg-gray-100 w-[38px]')}`} onClick={handleClickResumo} name="buttonresumo">
                  <TextAlignLeft size={16} className="" />
                  {selectedTab === 1 && botaoResumoClicado && <span>Resumo</span>}
                </Tab>

                <Tab className={` whitespace-nowrap outline-none cursor-pointer text-sm text-gray-400 rounded-xl flex items-center gap-2 justify-center font-semibold  transition ${botaoLivrosCapitulosClicado ? "activeLivrosCapitulos px-4 py-2" : ('hover:bg-gray-100 w-[38px]')}`} onClick={handleClickLivrosCapitulos} >
                  <Books size={16} className="" />
                  {selectedTab === 5 && botaoLivrosCapitulosClicado && <span>Livros e capítulos</span>}
                </Tab>

                <Tab  className={` whitespace-nowrap outline-none cursor-pointer text-sm text-gray-400 rounded-xl flex items-center gap-2 justify-center font-semibold  transition ${botaoEventosClicado ? "activeEventos px-4 py-2" : ('hover:bg-gray-100 w-[38px]')}`} onClick={handleClickEventos} >
                  <Ticket size={16} className="" />
                  {selectedTab === 6 && botaoEventosClicado && <span>Participação em eventos</span>}
                </Tab>

                <Tab  className={`outline-none cursor-pointer text-sm text-gray-400 rounded-xl flex items-center gap-2 justify-center font-semibold  transition ${botaoAreasClicado ? "activeAreas px-4 py-2" : ('hover:bg-gray-100 w-[38px]')}`} onClick={handleClickAreas}>
                  <Lightbulb size={16} className="" />
                  {selectedTab === 2 && botaoAreasClicado && <span>Áreas</span>}
                </Tab>

                <Tab  className={` outline-none cursor-pointer text-sm text-gray-400 rounded-xl flex items-center gap-2 justify-center font-semibold  transition ${botaoPatentesClicado ? "activePatente px-4 py-2" : ('hover:bg-gray-100 w-[38px]')}`} onClick={handleClickPatentes} >
                  <Copyright size={16} className="" />
                  {selectedTab === 4 && botaoPatentesClicado && <span>Patente</span>}
                </Tab>

                <Tab  className={` outline-none cursor-pointer text-sm text-gray-400 rounded-xl flex items-center gap-2 justify-center  font-semibold  transition ${botaoPesquisadoresClicado ? "activePesquisadores px-4 py-2" : ('hover:bg-gray-100 w-[38px]')}`} onClick={handleClickPesquisadores} >
                  <IdentificationCard size={16} className="" />
                  {selectedTab === 3 && botaoPesquisadoresClicado && <span>Nome</span>}
                </Tab>


                <div className='flex items-center justify-center'>
                  <div className={`absolute z[-999] animate-ping gap-4 text-white rounded-xl h-[28px] w-[28px] justify-center hover:bg-blue-500  font-medium transition ${botaoTermosClicado ? 'bg-blue-400' : ''} ${botaoAreasClicado ? 'bg-green-400' : ''} ${botaoLivrosCapitulosClicado ? 'bg-pink-400' : ''} ${botaoEventosClicado ? 'bg-orange-400' : ''} ${botaoResumoClicado ? 'bg-yellow-400' : ''} ${botaoPesquisadoresClicado ? 'bg-red-400' : ''} ${botaoPatentesClicado ? 'bg-cyan-400' : ''}`}></div>
                  <div onClick={handleClick} className={`cursor-pointer flex z-[999] relative  items-center gap-4 text-white rounded-xl h-[38px] w-[38px] justify-center  font-medium transition ${botaoTermosClicado ? 'bg-blue-400' : ''} ${botaoResumoClicado ? 'bg-yellow-400' : ''} ${botaoAreasClicado ? 'bg-green-400' : ''} ${botaoEventosClicado ? 'bg-orange-400' : ''} ${botaoLivrosCapitulosClicado ? 'bg-pink-400' : ''} ${botaoPesquisadoresClicado ? 'bg-red-400' : ''} ${botaoPatentesClicado ? 'bg-cyan-400' : ''}`}><Funnel size={16} className="text-white" /></div>
                </div>

              </TabList>

            </Tabs>
            </div>



            {pesquisaInput.length <= 2 ? (
            <div></div>
          ) : (
            <div id='teste'
              className={`rounded-b-2xl  bg-[#f9f9f9] z-[9999999999] flex-col  relative p-6  border-[1px] border-gray-300 border-t-0 ${isOpen ? 'block' : 'hidden'
                }`}



            >
              <div className='grid grid-cols-3 gap-4'>
                <div className='block  w-full ' >
                <ul>
          
        </ul>
                  <p className='mb-4'>Termo</p>
                  {filteredResults.slice(0, 5).map((resultado, index) => {
                    if(resultado.type_ == "ARTICLE") {
                        return (
                            <li
                                key={resultado.term}
                                className="checkboxLabel group list-none inline-flex mr-4 mb-4 group overflow-hidden"
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                <label className="group-checked:bg-blue-400 cursor-pointer border-[1px] bg-blue-100 border-blue-400 hover:text-blue-400 flex h-10 items-center px-4 text-gray-400 rounded-lg text-xs font-bold hover:border-blue-400 hover:bg-blue-100">
                                <span className="text-center block">{resultado.term.replace(/;/g, ' ')}</span>
                                <input
                                    type="checkbox"
                                    name={resultado.term}
                                    className="absolute hidden group"
                                    checked={itensSelecionados.includes(resultado.term)}
                                    id={resultado.term}
                                    onChange={handleCheckboxChangeInput}
                                    onClick={handleClickTermos}
                                />
                                </label>
                            </li>
                        )
                    }
                  })}
                  <p className='mb-4'>Resumo</p>
                  {filteredResults.slice(0, 5).map((resultado, index) => {
                    if(resultado.type_ == "ABSTRACT") {
                        return (
                            <li
                                key={resultado.term}
                                className="checkboxLabel group list-none inline-flex mr-4 mb-4 group overflow-hidden"
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                <label className="group-checked:bg-blue-400 cursor-pointer border-[1px] bg-blue-100 border-blue-400 hover:text-blue-400 flex h-10 items-center px-4 text-gray-400 rounded-lg text-xs font-bold hover:border-blue-400 hover:bg-blue-100">
                                <span className="text-center block">{resultado.term.replace(/;/g, ' ')}</span>
                                <input
                                    type="checkbox"
                                    name={resultado.term}
                                    className="absolute hidden group"
                                    checked={itensSelecionados.includes(resultado.term)}
                                    id={resultado.term}
                                    onChange={handleCheckboxChangeInput}
                                    onClick={handleClickResumo}
                                />
                                </label>
                            </li>
                        )
                    }
                  })}

                  <p className='mb-4'>Participação em eventos</p>
                  {filteredResults.slice(0, 5).map((resultado, index) => {
                    if(resultado.type_ == "SPEAKER") {
                        return (
                            <li
                                key={resultado.term}
                                className="checkboxLabel group list-none inline-flex mr-4 mb-4 group overflow-hidden"
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                <label className="group-checked:bg-blue-400 cursor-pointer border-[1px] bg-blue-100 border-blue-400 hover:text-blue-400 flex h-10 items-center px-4 text-gray-400 rounded-lg text-xs font-bold hover:border-blue-400 hover:bg-blue-100">
                                <span className="text-center block">{resultado.term.replace(/;/g, ' ')}</span>
                                <input
                                    type="checkbox"
                                    name={resultado.term}
                                    className="absolute hidden group"
                                    checked={itensSelecionados.includes(resultado.term)}
                                    id={resultado.term}
                                    onChange={handleCheckboxChangeInput}
                                    onClick={handleClickEventos}
                                />
                                </label>
                            </li>
                        )
                    }
                  })}
                </div>

                <div className='block  w-full' >
                  <p className='mb-4'>Área</p>
                  

                <p className='mb-4'>Patentes</p>
                {filteredResults.slice(0, 5).map((resultado, index) => {
                    if(resultado.type_ == "PATENT") {
                        return (
                            <li
                                key={resultado.term}
                                className="checkboxLabel group list-none inline-flex mr-4 mb-4 group overflow-hidden"
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                <label className="group-checked:bg-blue-400 cursor-pointer border-[1px] bg-blue-100 border-blue-400 hover:text-blue-400 flex h-10 items-center px-4 text-gray-400 rounded-lg text-xs font-bold hover:border-blue-400 hover:bg-blue-100">
                                <span className="text-center block">{resultado.term.replace(/;/g, ' ')}</span>
                                <input
                                    type="checkbox"
                                    name={resultado.term}
                                    className="absolute hidden group"
                                    checked={itensSelecionados.includes(resultado.term)}
                                    id={resultado.term}
                                    onChange={handleCheckboxChangeInput}
                                    onClick={handleClickPatentes}
                                />
                                </label>
                            </li>
                        )
                    }
                  })}
                </div>



                <div className='block  w-full ' >
                  <p className='mb-4'>Nome</p>
                  {filteredResults.slice(0, 5).map((resultado, index) => {
                    if(resultado.type_ == "NAME") {
                        return (
                            <li
                                key={resultado.term}
                                className="checkboxLabel group list-none inline-flex mr-4 mb-4 group overflow-hidden"
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                <label className="group-checked:bg-blue-400 cursor-pointer border-[1px] bg-blue-100 border-blue-400 hover:text-blue-400 flex h-10 items-center px-4 text-gray-400 rounded-lg text-xs font-bold hover:border-blue-400 hover:bg-blue-100">
                                <span className="text-center block">{resultado.term.replace(/;/g, ' ')}</span>
                                <input
                                    type="checkbox"
                                    name={resultado.term}
                                    className="absolute hidden group"
                                    checked={itensSelecionados.includes(resultado.term)}
                                    id={resultado.term}
                                    onChange={handleCheckboxChangeInput}
                                    onClick={handleClickPesquisadores}
                                />
                                </label>
                            </li>
                        )
                    }
                  })}


                  <p className='mb-4'>Livros e capítulos</p>
                  {filteredResults.slice(0, 5).map((resultado, index) => {
                    if(resultado.type_ == "BOOK_CHAPTER") {
                        return (
                            <li
                                key={resultado.term}
                                className="checkboxLabel group list-none inline-flex mr-4 mb-4 group overflow-hidden"
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                <label className="group-checked:bg-blue-400 cursor-pointer border-[1px] bg-blue-100 border-blue-400 hover:text-blue-400 flex h-10 items-center px-4 text-gray-400 rounded-lg text-xs font-bold hover:border-blue-400 hover:bg-blue-100">
                                <span className="text-center block">{resultado.term.replace(/;/g, ' ')}</span>
                                <input
                                    type="checkbox"
                                    name={resultado.term}
                                    className="absolute hidden group"
                                    checked={itensSelecionados.includes(resultado.term)}
                                    id={resultado.term}
                                    onChange={handleCheckboxChangeInput}
                                    onClick={handleClickLivrosCapitulos}
                                />
                                </label>
                            </li>
                        )
                    }
                  })}

                </div>
              </div>
            </div>
          )}

        </div>

                {valoresSelecionadosExport == "" && valoresSelecionadosNuvem == "" ? (
                  <div className='testeeeaq mt-4 flex gap-6 items-center'>
                    <div onClick={() => setEstadoFiltro(!EstadoFiltro)} className="w-fit cursor-pointer h-10 whitespace-nowrap flex items-center gap-4 bg-blue-400 text-white rounded-xl px-4 py-2 justify-center hover:bg-blue-500 text-sm font-medium transition">
                        {EstadoFiltro ? (
                          <X size={16} className="text-white" /> 
                        ): (
                          <SlidersHorizontal size={16} className="text-white" />
                        )} Filtros
                    </div>

                    <div className='w-[1px] bg-gray-300 h-8'></div>

                   
                    <div className=' flex gap-3 items-center'>
                    <p className='text-gray-400 text-sm font-bold'>Sugestões:</p>
                    <div className='gap-4 flex'>{filteredSugestoes.map((resultado, index) => {
                  
                        return (
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
                                    checked={itensSelecionados.includes(resultado.term)}
                                    id={resultado.term}
                                    onChange={handleCheckboxChangeInput}
                                    onClick={handleClickTermos}
                                />
                                </label>
                            </li>
                        )
                    
                  })}</div>
                    </div>
                    </div>
                    ):(
                  <div></div>
                )}

        </div>
    )
}