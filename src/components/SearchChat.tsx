import React, { useState, useEffect, useContext, useRef } from 'react';
import { ArrowCircleDown, Info, Funnel, User, File, Buildings, MagnifyingGlass, Rows, Lightbulb, X, CursorText, IdentificationCard, PaperPlaneTilt } from "phosphor-react";
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

interface Props {
  children?: React.ReactNode;
}

function myWrapperFunction() {
  const SearchChat: React.FC = () => {

    const { urlTermExport, setUrlTermExport } = useContext(UserContext);
    const { valoresSelecionadosExport, setValoresSelecionadosExport } = useContext(UserContext);
    const { valorDigitadoPesquisaDireta, setValorDigitadoPesquisaDireta } = useContext(UserContext);
    const { urlGeral, setUrlGeral } = useContext(UserContext);

    //Criação das constantes 
    const [pesquisaInput, setPesquisaInput] = useState('');
    const [posts, setPosts] = useState<Post[]>([]);
    const [resultados, setResultados] = useState<Post[]>([]);
    const [resultadosPesquisadores, setResultadosPesquisadores] = useState<Pesquisadores[]>([]);
    const [resultadosArea, setResultadosArea] = useState<Area[]>([]);
    //Atualizar o estado da pesquisa
    function handlePesquisaChange(event: React.ChangeEvent<HTMLInputElement>) {
      const valorDigitado = event.target.value;
      setPesquisaInput(valorDigitado);
    }



    useEffect(() => {
      if (pesquisaInput.length >= 3) {
        setResultados([]);
        setResultadosPesquisadores([]);
        setResultadosArea([]);
        enviarRequisicao();
      }
    }, [pesquisaInput]);




    function handleClick() {
      setValorDigitadoPesquisaDireta(pesquisaInput.replace(/\s+/g, ";"));
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


    //Enviar resultado da pesquisa
    function enviarRequisicao() {
      const pesquisaInputFormatado = pesquisaInput.replace(/\s+/g, ";");
      const url = urlGeral + `/originals_words?initials=${pesquisaInputFormatado}&type=${type}`;
      const urlPesquisador = urlGeral + "/reasercherInitials?initials=" + pesquisaInputFormatado;
      const urlArea = urlGeral + `/area_specialitInitials?initials=${pesquisaInput}&area=${selectedOptionsAreas}`;
      const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
      console.log("url areaaaa " + urlArea);

      if (botaoTermosClicado) {
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
      }

      // Pesquisador

      if (botaoPesquisadoresClicado) {
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

        console.log('EDDDDD ' + urlPesquisador);
      }

      //Area

      if (botaoAreasClicado) {
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


      }
    }



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

    console.log("resultadosPesquisadores" + resultadosPesquisadores)

    const checkboxPesquisadores = resultadosPesquisadores.map((resultado) => (
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
            onClick={() => handleResetPesquisaInput()}
          />
        </label>
      </li>
    ));

    const valoresPesquisadoresSelecionados = pesquisadoresSelecionados.join(';');
    console.log('Pesquisadores selecionados' + valoresPesquisadoresSelecionados)

    const valoresPesquisadoresSelecionadosJSX = pesquisadoresSelecionados.map((valor, index) => (
      <li key={index} className='whitespace-nowrap gap-2 bg-blue-100 border-blue-400 border-[1px] inline-flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold'>{valor.replace(/%20/g, ' ')}
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

    console.log("resultadosAreas" + resultadosArea)

    const checkboxAreas = resultadosArea.map((resultado) => (
      <li
        key={resultado.id}
        className="checkboxLabel group list-none inline-flex mr-4 mb-4 group overflow-hidden"
        onMouseDown={(e) => e.preventDefault()}
      >
        <label className="group-checked:bg-blue-400 border-[1px] cursor-pointer bg-white border-gray-300 flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold hover:border-blue-400 hover:bg-blue-100">
          <span className="text-center block">{resultado.area_specialty.replace(/%20/g, ' ')} | {resultado.area_expertise.replace(/%20/g, ' ')}</span>
          <input
            type="checkbox"
            name={resultado.area_specialty}
            className="absolute hidden group"
            checked={areasSelecionados.includes(resultado.area_specialty)}
            id={resultado.area_specialty}
            onChange={handleCheckboxChangeInputArea}
            onClick={() => handleResetPesquisaInput()}
          />
        </label>
      </li>
    ));


    const valoresAreasSelecionados = areasSelecionados.join(';');


    const valoresAreasSelecionadosJSX = areasSelecionados.map((valor, index) => (
      <li key={index} className='whitespace-nowrap gap-2 bg-blue-100 border-blue-400 border-[1px] inline-flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold'>{valor.replace(/%20/g, ' ')}
        <button onClick={() => handleRemoverSelecionadoAreas(index)}><X size={16} className="text-gray-400 hover:text-blue-400" /></button>
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

    const checkboxItems = resultados.map((resultado) => (
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
            onClick={() => handleResetPesquisaInput()}
          />
        </label>
      </li>
    ));

    const handleResetPesquisaInput = () => {
      setPesquisaInput("");
      setResultados([]);
      setResultadosPesquisadores([]);
      setResultadosArea([]);
    };


    let valoresSelecionados = itensSelecionados.join(';');
    setValoresSelecionadosExport(valoresSelecionados);


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

    const { botaoPesquisadoresClicado, setBotaoPesquisadoresClicado } = useContext(UserContext);
    const { botaoTermosClicado, setBotaoTermosClicado } = useContext(UserContext);
    const { botaoAreasClicado, setBotaoAreasClicado } = useContext(UserContext);


    //Se o botão Pesquisadores for clicado
    const handleClickPesquisadores = () => {
      setBotaoPesquisadoresClicado(true);
      setBotaoTermosClicado(false);
      setBotaoAreasClicado(false);
      //Apagar checkbox ao mudar de aba - termos
      setItensSelecionados([]);
      setAreasSelecionados([]);
      setPesquisaInput('')

      setResultadosPesquisadores([])
      setResultados([])
      setResultadosPesquisadores([])
    };

    //Se o botão Termos for clicado
    const handleClickTermos = () => {
      setBotaoPesquisadoresClicado(false);
      setBotaoTermosClicado(true);
      setBotaoAreasClicado(false);
      //Apagar checkbox ao mudar de aba - pesqisadores
      setPesquisadoresSelecionados([]);
      setAreasSelecionados([]);
      setPesquisaInput('')

      setResultadosPesquisadores([])
      setResultadosArea([])
      setResultados([])
    };

    //Se o botão Areas for clicado
    const handleClickAreas = () => {
      setBotaoAreasClicado(true);
      setBotaoPesquisadoresClicado(false);
      setBotaoTermosClicado(false);
      //Apagar checkbox ao mudar de aba - pesqisadores
      setPesquisadoresSelecionados([]);
      setItensSelecionados([]);
      setPesquisaInput('')

      setResultadosPesquisadores([])
      setResultados([])
      setResultadosArea([])
    };

    if (botaoPesquisadoresClicado) {
      setValoresSelecionadosExport(valoresPesquisadoresSelecionados)
    }

    if (botaoTermosClicado) {

      setValoresSelecionadosExport(valoresSelecionados)

    }

    if (botaoAreasClicado) {
      setValoresSelecionadosExport(valoresAreasSelecionados)
    }








    //ACABA AQUI

    const [showTabs, setShowTabs] = useState(false);

    //estado btns 
    const [selectedTab, setSelectedTab] = useState(0);

    //dropdowsn
    const optionsDropdown = ['Universidade Estadual do Sudoeste da Bahia', 'Universidade Estadual de Santa Cruz', 'Universidade do Estado da Bahia', 'Universidade Estadual de Feira de Santana'];
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const { intituicoesSelecionadasCheckbox, setIntituicoesSelecionadasCheckbox } = useContext(UserContext)
    setIntituicoesSelecionadasCheckbox(selectedOptions.join(';'))
    console.log("instituiçõesSelecionadas" + intituicoesSelecionadasCheckbox)

    const optionsDropdownAreas = ['CIENCIAS BIOLOGICAS', 'CIENCIAS AGRARIAS', 'CIENCIAS EXATAS E DA TERRA', 'CIENCIAS DA SAUDE', 'CIENCIAS HUMANAS', 'ENGENHARIAS', 'CIENCIAS SOCIAIS APLICADAS', 'LINGUISTICA LETRAS E ARTES', 'OUTROS']
    const [selectedOptionsAreas, setSelectedOptionsAreas] = useState<string[]>([]);
    const { areasSelecionadasCheckbox, setAreasSelecionadasCheckbox } = useContext(UserContext)
    setAreasSelecionadasCheckbox(selectedOptionsAreas.join(';'))

    return (
      <div className=' m-[0 auto] w-full px-6 md:px-16'>

        <form className='group w-full transition ' onFocus={() => setShowTabs(true)} onBlur={() => setShowTabs(false)}>
          <div className="">
            <div className='relative  w-full'>

            </div>

            <div className="bg-[#F9F9F9] gap-4 mt-4  justify-center transition overflow-x-hidden w-full  flex  left-0  m-auto" onMouseDown={(e) => e.preventDefault()} >
              <div className='block  w-full overflow-x-auto whitespace-nowrap element ' >
                {checkboxItems || <p className='text-gray-500 text-lg'>num</p>}
              </div>

            </div>

          </div>

          <div className='flex  top-6 w-full  bg-white rounded-full border-[1px] border-gray-300 hover:border-blue-400 focus:border-blue-400'>

            <div className=" flex  items-center  group w-full  text-base font-medium   rounded-l-full  justify-center transition ">
              <MagnifyingGlass size={20} className="text-gray-400 group-hover:text-blue-400 min-w-[52px]" />
              <div className='flex gap-2 mx-2'>{valoresSelecionadosJSX}{valoresPesquisadoresSelecionadosJSX}{valoresAreasSelecionadosJSX}</div>
              <input type="text" value={pesquisaInput} onChange={handlePesquisaChange} name="" placeholder="Procure um tema, pesquisador ou artigo..." id="" className="w-full h-full outline-none" />
            </div>

            <Tabs>
              <div className='p-2 flex gap-2 rounded-r-full '>


                <div className='flex items-center justify-center'>
                  <div className='absolute z[-999] animate-ping gap-4 bg-blue-400 text-white rounded-full h-[28px] w-[28px] justify-center hover:bg-blue-500  font-medium transition'></div>
                  <div onClick={handleClick} className='cursor-pointer flex z-[999] relative  items-center gap-4 bg-blue-400 text-white rounded-full h-[38px] w-[38px] justify-center hover:bg-blue-500  font-medium transition'><PaperPlaneTilt size={16} className="text-white" /></div>
                </div>

              </div>

            </Tabs>

          </div>

          <div className='gap-6 left-0  py-6 m-auto flex relative border-b-[1px] border-b-gray-300'>

            {botaoTermosClicado ? (
              <div className='flex gap-2  items-center '>
                <strong className='text-gray-500 text-sm'>Termos em:</strong>
                <p className="text-gray-400 text-sm">artigos</p>
                <label className="inline-flex relative items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={enabled}
                    readOnly
                  />
                  <div
                    onClick={() => {
                      setEnabled(!enabled);
                    }}
                    className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-400"
                  ></div>
                </label>
                <p className="text-gray-400 text-sm">resumos</p>
              </div>
            ) : (
              <head></head>
            )}

            <div className='flex items-center gap-4'>

              {botaoAreasClicado ? (
                <DropdownMultiSelectArea
                  options={optionsDropdownAreas}
                  selectedOptions={selectedOptionsAreas}
                  setSelectedOptionsAreas={setSelectedOptionsAreas}
                />
              ) : (
                <head></head>
              )}

              <DropdownMultiSelect
                options={optionsDropdown}
                selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions}
              />
            </div>

          </div>

        </form>

      </div>
    );
  };

  return SearchChat;

}
export default myWrapperFunction();