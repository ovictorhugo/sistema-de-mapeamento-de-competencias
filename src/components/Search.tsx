import React, { useState, useEffect, useContext, useRef } from 'react';
import { ArrowCircleDown, Info, Funnel, User, File, Buildings, MagnifyingGlass, Rows, Lightbulb, X, CursorText, IdentificationCard, TextAlignLeft, CaretRight, CaretLeft, Copyright, SlidersHorizontal } from "phosphor-react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import { UserContext } from '../contexts/context'
import DropdownMultiSelect from './DropdownMultiSelect';
import DropdownMultiSelectArea from './DropdownMltiSelectArea';


interface Post {
  frequency: string
  term: string
  checked: boolean
}

interface Pesquisadores {
  id: string
  name: string
}

interface Area {
  id: string
  area_expertise: string,
  area_specialty: string
}

interface Patente {
  frequency: string
  term: string
}

interface Bigrama {
  freq: number
  word: string
}

function myWrapperFunction() {
  const Search: React.FC = () => {

    const { urlTermExport, setUrlTermExport } = useContext(UserContext);
    const { EstadoFiltro, setEstadoFiltro } = useContext(UserContext);
    const { valoresSelecionadosExport, setValoresSelecionadosExport } = useContext(UserContext);
    const { valorDigitadoPesquisaDireta, setValorDigitadoPesquisaDireta } = useContext(UserContext);
    const { urlGeral, setUrlGeral } = useContext(UserContext);

    //Criação das constantes 
    const [pesquisaInput, setPesquisaInput] = useState('');

    const [posts, setPosts] = useState<Post[]>([]);
    const [resultados, setResultados] = useState<Post[]>([]);
    const [resultadosResumo, setResultadosResumo] = useState<Post[]>([]);
    const [resultadosPesquisadores, setResultadosPesquisadores] = useState<Pesquisadores[]>([]);
    const [resultadosArea, setResultadosArea] = useState<Area[]>([]);
    const [resultadosPatentes, setResultadosPatentes] = useState<Patente[]>([]);
    const [resultadosBigrama, setResultadosBigrama] = useState<Bigrama[]>([]);
    //Atualizar o estado da pesquisa
    function handlePesquisaChange(event: React.ChangeEvent<HTMLInputElement>) {
      const valorDigitado = event.target.value;
      setPesquisaInput(valorDigitado);
    }



    useEffect(() => {
      if (pesquisaInput.trim().length >= 3) {
        setResultados([]);
        setResultadosPesquisadores([]);
        setResultadosArea([]);
        setResultadosPatentes([])
        enviarRequisicao();
      }
    }, [pesquisaInput]);




    function handleClick() {
      setValorDigitadoPesquisaDireta(pesquisaInput.replace(/\s+/g, ";"));
      setIsOpen(false)
    }

    const { enabled, setEnabled } = useContext(UserContext)

    const [type, setType] = useState('ARTICLE')


    useEffect(() => {
      if (enabled === true) {
        setType('ABSTRACT');
      } else {
        setType('ARTICLE');
      }
    }, [enabled]);

    const { idGraduateProgram, setIdGraduateProgram } = useContext(UserContext)

    if(idGraduateProgram == '0') {
      setIdGraduateProgram('')
    }

    //Enviar resultado da pesquisa
    function enviarRequisicao() {
      const pesquisaInputFormatado = pesquisaInput.trim().replace(/\s+/g, ";");
      const url = urlGeral + `/originals_words?initials=${pesquisaInputFormatado}&type=ARTICLE`;
      const urlResumo = urlGeral + `/originals_words?initials=${pesquisaInputFormatado}&type=ABSTRACT&graduate_program_id=${idGraduateProgram}`;
      const urlPesquisador = urlGeral + `/reasercherInitials?initials=${pesquisaInputFormatado}&graduate_program_id=${idGraduateProgram}`
      const urlArea = urlGeral + `/area_specialitInitials?initials=${pesquisaInput.trim()}&area=${selectedOptionsAreas}&graduate_program_id=${idGraduateProgram}`;
      const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
      const urlBigrama = urlGeral +  `secondWord?term=${pesquisaInputFormatado}`
      const urlPatente = urlGeral + `/originals_words?initials=${pesquisaInputFormatado}&type=PATENT`
      console.log('urlResumo', url)

 
     
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
      

      //Resumo

   

        fetch(urlResumo, {
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
            setResultadosResumo([]);
            setResultadosResumo(newData);
          })
          .catch((err) => {
            console.log(err.message);
          });
      

      // Pesquisador
    

        fetch(urlPesquisador, {
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
            ;
            const newDataPesquisadores = data.map((post: Pesquisadores) => ({
              ...post,
              name: post.name.replace(/\s+/g, "%20")
            }));
            setResultadosPesquisadores([]);
            setResultadosPesquisadores(newDataPesquisadores);

          })
          .catch((err) => {
            console.log(err.message);
          });
      


      //Area
    
        fetch(urlArea, {
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
            ;
            const newDataArea = data.map((post: Area) => ({
              ...post,
              name: post.area_specialty.replace(/\s+/g, "%20")
            }));
            setResultadosArea([]);
            setResultadosArea(newDataArea);
          })
          .catch((err) => {
            console.log(err.message);
          });


          //patente
          fetch(urlPatente, {
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
              ;
              const newDataArea = data.map((post: Patente) => ({
                ...post,
                name: post.term.replace(/\s+/g, "%20")
              }));
              setResultadosPatentes([]);
              setResultadosPatentes(newDataArea);
            })
            .catch((err) => {
              console.log(err.message);
            });
            console.log('patente', urlPatente)
      }

     

      

    

    // CHECKBOX ENVIAAAR

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(event.target.checked);
      const name = event.target.name;
      const checked = event.target.checked;
      setResultados(resultados.map(checkbox => {
        if (checkbox.term === name) {
          return { ...checkbox, checked };
        }
        return checkbox;
      }));
    };

    //AHHHHHHHHHHHHH

    const [checked, setChecked] = useState(false);

const { botaoPatentesClicado, setBotaoPatentesClicado } = useContext(UserContext);
    const { botaoPesquisadoresClicado, setBotaoPesquisadoresClicado } = useContext(UserContext);
    const { botaoTermosClicado, setBotaoTermosClicado } = useContext(UserContext);
    const { botaoResumoClicado, setBotaoResumoClicado } = useContext(UserContext);
    const { botaoAreasClicado, setBotaoAreasClicado } = useContext(UserContext);

    //estado btns 
    const [selectedTab, setSelectedTab] = useState(0);

    //Se o botão Pesquisadores for clicado
    const handleClickPesquisadores = () => {
      setBotaoPesquisadoresClicado(true);
      setBotaoPatentesClicado(false)
      setBotaoTermosClicado(false);
      setBotaoAreasClicado(false);
      setBotaoResumoClicado(false)
      //Apagar checkbox ao mudar de aba - termos
      setItensSelecionados([]);
      setAreasSelecionados([]);
      setPesquisaInput('')
      setItensSelecionadosPatente([])
      setItensSelecionadosResumo([])

      setResultadosPesquisadores([])
      setResultados([])
      setResultadosPesquisadores([])
      setResultadosResumo([])
      setResultadosPatentes([])

      setSelectedTab(3);
    };

    //patentes
    const handleClickPatentes = () => {
      setBotaoPesquisadoresClicado(false);
      setBotaoPatentesClicado(true)
      setBotaoTermosClicado(false);
      setBotaoAreasClicado(false);
      setBotaoResumoClicado(false)
      //Apagar checkbox ao mudar de aba - termos
      setItensSelecionados([]);
      setAreasSelecionados([]);
      setPesquisaInput('')
      setItensSelecionadosResumo([])

      setResultadosPesquisadores([])
      setResultados([])
      setResultadosPesquisadores([])
      setResultadosResumo([])

      setSelectedTab(4);
    };

    //Se o botão Termos for clicado
    const handleClickTermos = () => {
      setBotaoPesquisadoresClicado(false);
      setBotaoPatentesClicado(false)
      setBotaoTermosClicado(true);
      setBotaoAreasClicado(false);
      setBotaoResumoClicado(false)
      //Apagar checkbox ao mudar de aba - pesqisadores
      setPesquisadoresSelecionados([]);
      setAreasSelecionados([]);
      setPesquisaInput('')
      setItensSelecionadosResumo([])
      setItensSelecionadosPatente([])

      setResultadosPesquisadores([])
      setResultadosArea([])
      setResultados([])
      setResultadosResumo([])
      setResultadosPatentes([])


      setSelectedTab(0);
    };

    const handleClickResumo = () => {
      setBotaoPesquisadoresClicado(false);
      setBotaoResumoClicado(true);
      setBotaoPatentesClicado(false)
      setBotaoAreasClicado(false);
      setBotaoTermosClicado(false)
      //Apagar checkbox ao mudar de aba - pesqisadores
      setPesquisadoresSelecionados([]);
      setAreasSelecionados([]);
      setPesquisaInput('')
      setItensSelecionados([])
      setItensSelecionadosPatente([])

      setResultadosPesquisadores([])
      setResultadosArea([])
      setResultados([])
      setResultadosResumo([])
      setResultadosPatentes([])

      setSelectedTab(1);

    };

    //Se o botão Areas for clicado
    const handleClickAreas = () => {
      setBotaoAreasClicado(true);
      setBotaoPesquisadoresClicado(false);
      setBotaoPatentesClicado(false)
      setBotaoTermosClicado(false);
      setBotaoResumoClicado(false)
      //Apagar checkbox ao mudar de aba - pesqisadores
      setPesquisadoresSelecionados([]);
  
      setItensSelecionados([]);
      setItensSelecionadosPatente([])
      setItensSelecionadosResumo([])
      setPesquisaInput('')

      setResultadosPesquisadores([])
      setResultados([])
      setResultadosArea([])
      setResultadosPatentes([])
      setResultadosResumo([])

      setSelectedTab(2);
    };

    const handleAutocompleteClick = () => {
      // Sort autocompleteOptions by frequency in descending order
      const sortedOptions = resultadosBigrama.sort((a, b) => b.freq - a.freq);
  
      // Get the most frequent word
      const mostFrequentWord = sortedOptions.length > 0 ? sortedOptions[0].word : '';
  
      // Set the input to the most frequent word
      setPesquisaInput(mostFrequentWord);
  
      // Close the autocomplete dropdown
      setIsOpen(false);
    };

    console.log('resuktados bigrama', resultadosBigrama)
   

    const { idVersao, setIdVersao } = useContext(UserContext);

    const urlGraduateProgram = `${urlGeral}/graduate_program_profnit?id=${idVersao}`;

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


    //CURRET PAGE




    //checkbo

    //checked do input search

    // Lógica para adicionar valor do checbok no input Search e atualizar pesquisa

    // Pesquisador
    const [pesquisadoresSelecionados, setPesquisadoresSelecionados] = useState<string[]>([]);

    const handleCheckboxChangeInputPesquisadores = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name } = event.target;
      const isChecked = event.target.checked;

      setPesquisadoresSelecionados((prevSelecionados) => {
        if (isChecked) {
          return [...prevSelecionados, name];
        } else {
          return prevSelecionados.filter((item) => item !== name);
        }
      });
    };

    const [currentPesquisadores, setCurrentPesquisadores] = useState(1);
    const resultsPerPage = 6;

    const indexOfLastResultPesquisadores = currentPesquisadores * resultsPerPage;
    const indexOfFirstResultPesquisadores = indexOfLastResultPesquisadores - resultsPerPage;
    const totalPagesPesquisadores = Math.ceil(resultadosPesquisadores.length / resultsPerPage);




    const currentResultsPesquisadores = resultadosPesquisadores.slice(indexOfFirstResultPesquisadores, indexOfLastResultPesquisadores);


    const checkboxPesquisadores = currentResultsPesquisadores.map((resultado) => (
      <li
        key={resultado.name}
        className="checkboxLabel group list-none inline-flex mr-4 mb-4 group overflow-hidden"
        onMouseDown={(e) => e.preventDefault()}
      >
        <label className="group-checked:bg-blue-400 cursor-pointer border-[1px] bg-white border-gray-300 flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold hover:border-blue-400 hover:bg-blue-100">
          <span className="text-center block">{resultado.name.replace(/%20/g, ' ')}</span>
          <input
            type="checkbox"
            name={resultado.name}
            className="absolute hidden group"
            checked={pesquisadoresSelecionados.includes(resultado.name)}
            id={resultado.name}
            onChange={handleCheckboxChangeInputPesquisadores}
            onClick={handleClickPesquisadores}
          />
        </label>
      </li>
    ));

    const valoresPesquisadoresSelecionados = pesquisadoresSelecionados.join(';');

    const valoresPesquisadoresSelecionadosJSX = pesquisadoresSelecionados.map((valor, index) => (
      <li key={index} className='whitespace-nowrap gap-2 bg-[#E9F9F9] border-[#20BDBE] border-[1px] inline-flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold'>{valor.replace(/%20/g, ' ')}
        <button onClick={() => handleRemoverSelecionadoPesquisadores(index)}><X size={16} className="text-gray-400 hover:text-blue-400" /></button>
      </li>
    ));

    const handleRemoverSelecionadoPesquisadores = (index: number) => {
      setPesquisadoresSelecionados((prevSelecionados) =>
        prevSelecionados.filter((_, i) => i !== index)
      );
    };

    // Area
    const [areasSelecionados, setAreasSelecionados] = useState<string[]>([]);

    const handleCheckboxChangeInputArea = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name } = event.target;
      const isChecked = event.target.checked;

      setAreasSelecionados((prevSelecionados) => {
        if (isChecked) {
          return [...prevSelecionados, name];
        } else {
          return prevSelecionados.filter((item) => item !== name);
        }
      });
    };

    const [currentArea, setCurrentArea] = useState(1);


    const indexOfLastResultArea = currentArea * resultsPerPage;
    const indexOfFirstResultArea = indexOfLastResultArea - resultsPerPage;
    const totalPages = Math.ceil(resultadosArea.length / resultsPerPage);




    const currentResultsArea = resultadosArea.slice(indexOfFirstResultArea, indexOfLastResultArea);



    const checkboxAreas = currentResultsArea.map((resultado) => (
      <li
        key={resultado.id}
        className="checkboxLabel group list-none inline-flex mr-4 mb-4 group overflow-hidden"
        onMouseDown={(e) => e.preventDefault()}
      >
        <label className="group-checked:bg-blue-400 border-[1px] cursor-pointer bg-white border-gray-300 flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold hover:border-blue-400 hover:bg-blue-100">
          <span className="text-center block">{resultado.area_specialty.replace(/%20/g, ' ')} | {resultado.area_expertise.replace(/%20/g, ' ')}</span>
          <input
            type="checkbox"
            name={`${resultado.area_specialty} | ${resultado.area_expertise}`}
            className="absolute hidden group"
            checked={areasSelecionados.includes(`${resultado.area_specialty} | ${resultado.area_expertise}`)}
            id={resultado.area_specialty}
            onChange={handleCheckboxChangeInputArea}
            onClick={handleClickAreas}
          />
        </label>
      </li>
    ));


    const valoresAreasSelecionados = areasSelecionados.join(';');


    const valoresAreasSelecionadosJSX = areasSelecionados.map((valor, index) => (
      <li
        key={index}
        className="whitespace-nowrap gap-2 bg-[#F4FAEC] border-green-400 border-[1px] inline-flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold"
      >
        {valor}
        <button onClick={() => handleRemoverSelecionadoAreas(index)}>
          <X size={16} className="text-gray-400 hover:text-blue-400" />
        </button>
      </li>
    ));


    const handleRemoverSelecionadoAreas = (index: number) => {
      setAreasSelecionados((prevSelecionados) =>
        prevSelecionados.filter((_, i) => i !== index)
      );
    };


    // Termos 
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

    const checkboxItems = resultados.slice(0, 6).map((resultado) => (
      <li
        key={resultado.term}
        className="checkboxLabel group list-none inline-flex mr-4 mb-4 group overflow-hidden"
        onMouseDown={(e) => e.preventDefault()}
      >
        <label className="group-checked:bg-blue-400 cursor-pointer border-[1px] bg-white border-gray-300 flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold hover:border-blue-400 hover:bg-blue-100">
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
    ));

    let valoresSelecionados = itensSelecionados.join(';');

    const valoresSelecionadosJSX = itensSelecionados.map((valor, index) => (
      <li key={index} className='whitespace-nowrap gap-2 bg-blue-100 border-blue-400 border-[1px] inline-flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold'>{valor.replace(/;/g, ' ')}
        <button onClick={() => handleRemoverSelecionado(index)}><X size={16} className="text-gray-400 hover:text-blue-400" /></button>
      </li>
    ));

    const handleRemoverSelecionado = (index: number) => {
      setItensSelecionados((prevSelecionados) =>
        prevSelecionados.filter((_, i) => i !== index)
      );
    };

    // Resumo
    const [itensSelecionadosResumo, setItensSelecionadosResumo] = useState<string[]>([]);

    const handleCheckboxChangeInputResumo = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name } = event.target;
      const isChecked = event.target.checked;

      setItensSelecionadosResumo((prevSelecionados) => {
        if (isChecked) {
          return [...prevSelecionados, name];
        } else {
          return prevSelecionados.filter((item) => item !== name);
        }
      });
    };

    const checkboxItemsResumo = resultadosResumo.slice(0, 6).map((resultado) => (
      <li
        key={resultado.term}
        className="checkboxLabel group list-none inline-flex mr-4 mb-4 group overflow-hidden"
        onMouseDown={(e) => e.preventDefault()}
      >
        <label className="group-checked:bg-blue-400 cursor-pointer border-[1px] bg-white border-gray-300 flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold hover:border-blue-400 hover:bg-blue-100">
          <span className="text-center block">{resultado.term.replace(/;/g, ' ')}</span>
          <input
            type="checkbox"
            name={resultado.term}
            className="absolute hidden group"
            checked={itensSelecionadosResumo.includes(resultado.term)}
            id={resultado.term}
            onChange={handleCheckboxChangeInputResumo}
            onClick={handleClickResumo}
          />
        </label>
      </li>
    ));
    const valoresResumoSelecionados = itensSelecionadosResumo.join(';');

    const valoresSelecionadosResumoJSX = itensSelecionadosResumo.map((valor, index) => (
      <li key={index} className='whitespace-nowrap gap-2 bg-[#FEE9E9] border-red-400 border-[1px] inline-flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold'>{valor.replace(/;/g, ' ')}
        <button onClick={() => handleRemoverSelecionadoResumo(index)}><X size={16} className="text-gray-400 hover:text-blue-400" /></button>
      </li>
    ));

    const handleRemoverSelecionadoResumo = (index: number) => {
      setItensSelecionadosResumo((prevSelecionados) =>
        prevSelecionados.filter((_, i) => i !== index)
      );
    };

    // Patente
    const [itensSelecionadosPatente, setItensSelecionadosPatente] = useState<string[]>([]);

    const handleCheckboxChangeInputPatente = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name } = event.target;
      const isChecked = event.target.checked;

      setItensSelecionadosPatente((prevSelecionados) => {
        if (isChecked) {
          return [...prevSelecionados, name];
        } else {
          return prevSelecionados.filter((item) => item !== name);
        }
      });
    };

    const checkboxItemsPatente = resultadosPatentes.slice(0, 6).map((resultado) => (
      <li
        key={resultado.term}
        className="checkboxLabel group list-none inline-flex mr-4 mb-4 group overflow-hidden"
        onMouseDown={(e) => e.preventDefault()}
      >
        <label className="group-checked:bg-blue-400 cursor-pointer border-[1px] bg-white border-gray-300 flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold hover:border-blue-400 hover:bg-blue-100">
          <span className="text-center block">{resultado.term.replace(/;/g, ' ')}</span>
          <input
            type="checkbox"
            name={resultado.term}
            className="absolute hidden group"
            checked={itensSelecionadosPatente.includes(resultado.term)}
            id={resultado.term}
            onChange={handleCheckboxChangeInputPatente}
            onClick={handleClickPatentes}
          />
        </label>
      </li>
    ));

    console.log(resultadosPatentes)
    const valoresPatenteSelecionados = itensSelecionadosPatente.join(';');

    const valoresSelecionadosPatenteJSX = itensSelecionadosPatente.map((valor, index) => (
      <li key={index} className='whitespace-nowrap gap-2 bg-[#FEE9E9] border-red-400 border-[1px] inline-flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold'>{valor.replace(/;/g, ' ')}
        <button onClick={() => handleRemoverSelecionadoPatente(index)}><X size={16} className="text-gray-400 hover:text-blue-400" /></button>
      </li>
    ));

    const handleRemoverSelecionadoPatente = (index: number) => {
      setItensSelecionadosPatente((prevSelecionados) =>
        prevSelecionados.filter((_, i) => i !== index)
      );
    };







    //ACABA AQUI

    const [showTabs, setShowTabs] = useState(false);

    //dropdowsn
    const optionsDropdown = ['Universidade Estadual do Sudoeste da Bahia', 'Universidade Estadual de Santa Cruz', 'Universidade do Estado da Bahia', 'Universidade Estadual de Feira de Santana'];
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const { intituicoesSelecionadasCheckbox, setIntituicoesSelecionadasCheckbox } = useContext(UserContext)
    setIntituicoesSelecionadasCheckbox(selectedOptions.join(';'))

    const optionsDropdownAreas = ['CIENCIAS BIOLOGICAS', 'CIENCIAS AGRARIAS', 'CIENCIAS EXATAS E DA TERRA', 'CIENCIAS DA SAUDE', 'CIENCIAS HUMANAS', 'ENGENHARIAS', 'CIENCIAS SOCIAIS APLICADAS', 'LINGUISTICA LETRAS E ARTES', 'OUTROS']
    const [selectedOptionsAreas, setSelectedOptionsAreas] = useState<string[]>([]);
    const { areasSelecionadasCheckbox, setAreasSelecionadasCheckbox } = useContext(UserContext)
    setAreasSelecionadasCheckbox(selectedOptionsAreas.join(';'))

    //
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    useEffect(() => {
      document.addEventListener('click', handleOutsideClick);

      return () => {
        document.removeEventListener('click', handleOutsideClick);
      };
    }, []);


    //

    const handleResetPesquisaInput = () => {
      setPesquisaInput("");
      setResultados([]);
      setResultadosPesquisadores([]);
      setResultadosArea([]);
    };


    setValoresSelecionadosExport(valoresSelecionados);


    if (botaoPesquisadoresClicado) {
      setValoresSelecionadosExport(valoresPesquisadoresSelecionados)
    }

    if (botaoTermosClicado) {

      setValoresSelecionadosExport(valoresSelecionados)

    }

    if (botaoResumoClicado) {
      setValoresSelecionadosExport(valoresResumoSelecionados)
    }

    if (botaoAreasClicado) {
      setValoresSelecionadosExport(valoresAreasSelecionados)
    }

    if (botaoPatentesClicado) {
      setValoresSelecionadosExport(valoresPatenteSelecionados)
    }

   

    useEffect(() => {
      if (pesquisaInput.length == 0) {
        setCurrentArea(1)
        setCurrentPesquisadores(1)
        setValorDigitadoPesquisaDireta('')
      }
    })

    //enter 

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        // Realize a ação de pesquisa aqui, por exemplo, chame uma função de pesquisa
        handleClick();
      }
    };


    //palavras mais pesquisadas
    interface PalavrasChaves {
      term: string;
      among: number;
    }

    const [words, setWords] = useState<PalavrasChaves[]>([]);

  const [isLoading, setIsLoading] = useState(false);

    let urlPalavrasChaves = `${urlGeral}lists_word_researcher?graduate_program_id=${idGraduateProgram}&researcher_id=`

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

  const [itensSelecionadosWords, setItensSelecionadosWords] = useState<string[]>([]);

    const handleCheckboxChangeInputWords = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name } = event.target;
      const isChecked = event.target.checked;

      setItensSelecionadosWords((prevSelecionados) => {
        if (isChecked) {
          return [...prevSelecionados, name];
        } else {
          return prevSelecionados.filter((item) => item !== name);
        }
      });
    };

    const checkboxItemsWords = words.slice(0, 10).map((resultado) => (
      <li
        key={resultado.term}
        className="checkboxLabel group list-none inline-flex group overflow-hidden"
        onMouseDown={(e) => e.preventDefault()}
      >
        <label className="group-checked:bg-blue-400 cursor-pointer border-[1px] bg-white border-gray-300 flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold hover:border-blue-400 hover:bg-blue-100">
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
    ));

    return (
      <div className=' m-[0 auto] w-full px-6 md:px-16 '>

        <div ref={dropdownRef} className='group w-full transition' onChange={() => setIsOpen(isOpen)} onFocus={() => setIsOpen(isOpen)} >
          
          <div className='flex flex-wrap md:flex-nowrap top-6 w-full'>

            <div className='flex w-full flex-col'>
              <div className={`flex bg-white  items-center h-14 group w-full  text-base font-medium  justify-center transition border-[1px] border-gray-300 ${botaoTermosClicado ? 'hover:border-blue-400' : ''} ${botaoResumoClicado ? 'hover:border-red-400' : ''} ${botaoAreasClicado ? 'hover:border-green-400' : ''} ${botaoPesquisadoresClicado ? 'hover:border-[#20BDBE]' : ''} ${isOpen && pesquisaInput.length >= 3 ? 'rounded-tl-2xl' : 'rounded-l-2xl'}`}>
                <MagnifyingGlass size={20} className={`text-gray-400 min-w-[52px] ${botaoTermosClicado ? 'group-hover:text-[#005399]' : ''} ${botaoResumoClicado ? 'group-hover:text-red-400' : ''} ${botaoAreasClicado ? 'group-hover:text-[#8FC53E]' : ''} ${botaoPesquisadoresClicado ? 'group-hover:text-[#20BDBE]' : ''}`} />
                <div className='flex gap-2 mx-2'>{valoresSelecionadosJSX}{valoresPesquisadoresSelecionadosJSX}{valoresSelecionadosPatenteJSX}{valoresAreasSelecionadosJSX}{valoresSelecionadosResumoJSX}</div>
                <input
                  type="text"
                  value={pesquisaInput}
                  onChange={handlePesquisaChange}
                  onClick={() => setIsOpen(true)}
                  onFocus={() => setIsOpen(!isOpen)}
                  onKeyPress={handleKeyPress}
                  name=""
                  placeholder={
                    `${botaoResumoClicado ? 'Pesquise por uma ou mais palavras no resumo do pesquisador (Ex: Robótica, educação, indústria)' : ''} ${botaoTermosClicado ? 'Pesquise um ou mais termos (Ex: Robótica, educação, indústria)' : ''} ${botaoAreasClicado ? 'Pesquise uma ou mais áreas de especialidade (Ex: Astronomia, Ciência de dados)' : ''} ${botaoPesquisadoresClicado ? 'Pesquise o nome de um ou mais pesquisador(es)' : ''}`
                  }
                  id="" className="w-full h-full outline-none" />
              </div>

            </div>

            <Tabs>
              <TabList className={`bg-white  p-2 flex gap-2  border-[1px] border-gray-300 border-l-0
            ${isOpen && pesquisaInput.length >= 3 ? 'rounded-tr-2xl' : 'rounded-r-2xl'}`}>

                <Tab selected={selectedTab === 0} className={`outline-none cursor-pointer text-sm rounded-xl text-gray-400 flex items-center border-[1px] justify-center border-white gap-2  font-semibold transition ${botaoTermosClicado ? "activeTermos px-4 py-2" : ('hover:bg-gray-100 w-[38px]')}`} onClick={handleClickTermos} name="buttontermos">
                  <CursorText size={16} className="" />
                  {selectedTab === 0 && botaoTermosClicado && <span>Termo</span>}
                </Tab>

                <Tab selected={selectedTab === 1} className={`outline-none cursor-pointer text-sm rounded-xl text-gray-400 flex items-center border-[1px] justify-center border-white gap-2  font-semibold transition ${botaoResumoClicado ? "activeResumo px-4 py-2" : ('hover:bg-gray-100 w-[38px]')}`} onClick={handleClickResumo} name="buttonresumo">
                  <TextAlignLeft size={16} className="" />
                  {selectedTab === 1 && botaoResumoClicado && <span>Resumo</span>}
                </Tab>

                <Tab selected={selectedTab === 2} className={`outline-none cursor-pointer text-sm text-gray-400 rounded-xl flex items-center gap-2 justify-center font-semibold  transition ${botaoAreasClicado ? "activeAreas px-4 py-2" : ('hover:bg-gray-100 w-[38px]')}`} onClick={handleClickAreas}>
                  <Lightbulb size={16} className="" />
                  {selectedTab === 2 && botaoAreasClicado && <span>Áreas</span>}
                </Tab>

                <Tab selected={selectedTab === 4} className={` outline-none cursor-pointer text-sm text-gray-400 rounded-xl flex items-center gap-2 justify-center font-semibold  transition ${botaoPatentesClicado ? "activePatente px-4 py-2" : ('hover:bg-gray-100 w-[38px]')}`} onClick={handleClickPatentes} >
                  <Copyright size={16} className="" />
                  {selectedTab === 4 && botaoPatentesClicado && <span>Patente</span>}
                </Tab>

                <Tab selected={selectedTab === 3} className={` outline-none cursor-pointer text-sm text-gray-400 rounded-xl flex items-center gap-2 justify-center  font-semibold  transition ${botaoPesquisadoresClicado ? "activePesquisadores px-4 py-2" : ('hover:bg-gray-100 w-[38px]')}`} onClick={handleClickPesquisadores} >
                  <IdentificationCard size={16} className="" />
                  {selectedTab === 3 && botaoPesquisadoresClicado && <span>Nome</span>}
                </Tab>


                <div className='flex items-center justify-center'>
                  <div className={`absolute z[-999] animate-ping gap-4 text-white rounded-xl h-[28px] w-[28px] justify-center hover:bg-blue-500  font-medium transition ${botaoTermosClicado ? 'bg-blue-400' : ''} ${botaoAreasClicado ? 'bg-green-400' : ''} ${botaoResumoClicado ? 'bg-yellow-400' : ''} ${botaoPesquisadoresClicado ? 'bg-red-400' : ''} ${botaoPatentesClicado ? 'bg-cyan-400' : ''}`}></div>
                  <div onClick={handleClick} className={`cursor-pointer flex z-[999] relative  items-center gap-4 text-white rounded-xl h-[38px] w-[38px] justify-center  font-medium transition ${botaoTermosClicado ? 'bg-blue-400' : ''} ${botaoResumoClicado ? 'bg-yellow-400' : ''} ${botaoAreasClicado ? 'bg-green-400' : ''} ${botaoPesquisadoresClicado ? 'bg-red-400' : ''} ${botaoPatentesClicado ? 'bg-cyan-400' : ''}`}><Funnel size={16} className="text-white" /></div>
                </div>

              </TabList>



            </Tabs>

          </div>


          {pesquisaInput.length <= 2 ? (
            <div></div>
          ) : (
            <div id='teste'
              className={`rounded-b-lg z-[9999999999] flex-col  relative p-6 bg-white border-[1px] border-gray-300 border-t-0 ${isOpen ? 'block' : 'hidden'
                }`}



            >
              <div className='grid grid-cols-3 gap-4'>
                <div className='block  w-full ' >
                <ul>
          {resultadosBigrama.map((option) => (
            <li key={option.word} onClick={handleAutocompleteClick}>
              {option.word}
            </li>
          ))}
        </ul>
                  <p className='mb-4'>Termo</p>
                  {checkboxItems || <p className='text-gray-500 text-lg'>num</p>}
                  <p className='mb-4'>Resumo</p>
                  {checkboxItemsResumo || <p className='text-gray-500 text-lg'>num</p>}
                </div>

                <div className='block  w-full' >
                  <p className='mb-4'>Área</p>
                  {checkboxAreas || <p className='text-gray-500 text-lg'>num</p>}
                  {resultadosArea.length === 0 ? (
                    <div></div>
                  ) : (
                    <div className=" flex gap-4 w-full ">
                      <button
                        className="flex items-center gap-4 bg-blue-400 text-white rounded-full px-2 py-2 justify-center hover:bg-blue-500 mb-6 font-medium transition"
                        onClick={() => {

                          setCurrentArea(currentArea - 1);

                        }}
                        style={{
                          backgroundColor: currentArea === 1 ? '#ccc' : '#005399',
                          opacity: currentArea === 1 ? '0.5' : '1',
                        }}
                        disabled={currentArea === 1}
                      >
                        <CaretLeft size={16} className="text-white" />
                      </button>

                      <button
                        className="flex items-center gap-4 bg-blue-400 text-white rounded-full px-2 py-2 justify-center hover:bg-blue-500 mb-6 font-medium transition"
                        onClick={() => {

                          setCurrentArea(currentArea + 1);

                        }}
                        style={{
                          backgroundColor: indexOfLastResultArea >= resultadosArea.length ? '#ccc' : '#005399',
                          opacity: indexOfLastResultArea >= resultadosArea.length ? '0.5' : '1',
                        }}
                        disabled={indexOfLastResultArea >= resultadosArea.length}
                      >
                        <CaretRight size={16} className="text-white" />
                      </button>

                      
                    </div>
                  )}

<p className='mb-4'>Patentes</p>
                  {checkboxItemsPatente || <p className='text-gray-500 text-lg'>num</p>}
                </div>



                <div className='block  w-full ' >
                  <p className='mb-4'>Nome</p>
                  {checkboxPesquisadores || <p className='text-gray-500 text-lg'>num</p>}
                  {resultadosPesquisadores.length === 0 ? (
                    <div></div>
                  ) : (
                    <div className="mb-9 flex gap-4 w-full ">
                      <button
                        className="flex items-center gap-4 bg-blue-400 text-white rounded-full px-2 py-2 justify-center hover:bg-blue-500 mb-6 font-medium transition"
                        onClick={() => {
                          setCurrentPesquisadores(currentPesquisadores - 1);

                        }}
                        style={{
                          backgroundColor: currentPesquisadores === 1 ? '#ccc' : '#005399',
                          opacity: currentPesquisadores === 1 ? '0.5' : '1',
                        }}
                        disabled={currentPesquisadores === 1}
                      >
                        <CaretLeft size={16} className="text-white" />
                      </button>

                      <button
                        className="flex items-center gap-4 bg-blue-400 text-white rounded-full px-2 py-2 justify-center hover:bg-blue-500 mb-6 font-medium transition"
                        onClick={() => {
                          setCurrentPesquisadores(currentPesquisadores + 1);

                        }}
                        style={{
                          backgroundColor: indexOfLastResultPesquisadores >= resultadosPesquisadores.length ? '#ccc' : '#005399',
                          opacity: indexOfLastResultPesquisadores >= resultadosPesquisadores.length ? '0.5' : '1',
                        }}
                        disabled={indexOfLastResultPesquisadores >= resultadosPesquisadores.length}
                      >
                        <CaretRight size={16} className="text-white" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        
                  <div className='testeeeaq mt-4 flex gap-6 items-center'>
                    <div onClick={() => setEstadoFiltro(true)} className="w-fit cursor-pointer h-10 whitespace-nowrap flex items-center gap-4 bg-blue-400 text-white rounded-xl px-4 py-2 justify-center hover:bg-blue-500 text-sm font-medium transition">
                        <SlidersHorizontal size={16} className="text-white" /> Filtros
                    </div>

                    <div className='w-[1px] bg-gray-300 h-8'></div>

                    {valoresSelecionadosExport == "" ? (
                    <div className=' flex gap-3 items-center'>
                    <p className='text-gray-400 text-sm font-bold'>Sugestões:</p>
                    <div className='gap-4 flex'>{checkboxItemsWords}</div>
                    </div>
                    ):(
                  <div></div>
                )}
                    
                  </div>
                

      </div>
    );
  };

  return Search;

}
export default myWrapperFunction();