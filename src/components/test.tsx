import { ArrowRight, BookmarkSimple, CaretLeft, ChalkboardTeacher, CursorText, GraduationCap, Lightbulb, MagnifyingGlass, Star, TextAlignLeft } from "phosphor-react";
import { UserContext } from "../contexts/context";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";

import il_1 from '../assets/il_1.png';

type GraduateProgram = {
    area: string
    code: string
    graduate_program_id: string
    modality: string
    name: string
    rating: string
    type: string
}

interface PalavrasChaves {
  term: string;
  among: number;
}

interface Post {
  frequency: string
  term: string
  checked: boolean
  area_expertise: string
  area_specialty: string
}

export function ContentStepOne() {
    const {urlGeral, setUrlGeral} = useContext(UserContext);
    const [botaoPesquisadoresClicado, setBotaoPesquisadoresClicado] = useState(false)
    const [botaoTermosClicado, setBotaoTermosClicado] = useState(true)
    const [botaoResumoClicado, setBotaoResumoClicado] = useState(false)
    const [botaoAreasClicado, setBotaoAreasClicado] = useState(false)

    const [pesquisaInput, setPesquisaInput] = useState('');

    function handlePesquisaChange(event: React.ChangeEvent<HTMLInputElement>) {
      const valorDigitado = event.target.value;
      setPesquisaInput(valorDigitado);

      setResultados([])
    }

    const urlGraduateProgram = `${urlGeral}/graduate_program?institution_id=fdd8b743-9664-4177-84ca-757146a93580`;

    const [graduateProgram, setGraduatePogram] = useState<GraduateProgram[]>([]);

    const {idGraduateProgram, setIdGraduateProgram} = useContext(UserContext)

    function handleClick(name: string) {
      setIdGraduateProgram(name);
    }

    const [resultados, setResultados] = useState<Post []>([]);

    let urlTerms = urlGeral + `/originals_words?initials=&type=ARTICLE`;
    const pesquisaInputFormatado = pesquisaInput.trim().replace(/\s+/g, ";");

    if(botaoTermosClicado) {
      urlTerms = urlGeral + `/originals_words?initials=${pesquisaInputFormatado}&type=ARTICLE`;
    }

    if(botaoResumoClicado) {
      urlTerms = urlGeral + `/originals_words?initials=${pesquisaInputFormatado}&type=ABSTRACT`;
    }

    if(botaoAreasClicado) {
      urlTerms = urlGeral + `/area_specialitInitials?initials=${pesquisaInput}&area=`;
    }

    console.log('urlTerms' + urlTerms)

    useEffect(() => {

    fetch(urlTerms, {
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
          term: post.term
        }));
        setResultados([]);
        setResultados(newData);
      })
      .catch((err) => {
        console.log(err.message);
      });
    }, [urlTerms]);

    // Termos 
    const [itensSelecionados, setItensSelecionados] = useState<string[]>([]);
      
    const checkboxItems = resultados.map((resultado) => (
      <li
        key={resultado.term}
        className="checkboxLabel group list-none inline-flex mr-4 mb-4 group overflow-hidden"
        onMouseDown={(e) => e.preventDefault()}
      >
        <label className="group-checked:bg-blue-400 cursor-pointer border-[1px] bg-white border-gray-300 flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold hover:border-blue-400 hover:bg-blue-100">
          <span className="text-center block">{botaoResumoClicado || botaoTermosClicado ? (resultado.term):('')}
                                              {botaoAreasClicado ? (`${resultado.area_specialty} | ${resultado.area_expertise}` ): ('')}</span>
          <input
            type="checkbox"
            name={resultado.term}
            className="absolute hidden group"
      
            id={resultado.term}
          />
        </label>
      </li>
    ));

    //Se o botão Termos for clicado
  const handleClickTermos = () => {
    setBotaoPesquisadoresClicado(false);
    setBotaoTermosClicado(true);
    setBotaoAreasClicado(false);
    setBotaoResumoClicado(false)

    setResultados([])
    setPesquisaInput('')
  };

  const handleClickResumo = () => {
    setBotaoPesquisadoresClicado(false);
    setBotaoResumoClicado(true);
    setBotaoAreasClicado(false);
    setBotaoTermosClicado(false)

    setResultados([])
    setPesquisaInput('')
  };

  const handleClickAreas = () => {
    setBotaoAreasClicado(true);
    setBotaoPesquisadoresClicado(false);
    setBotaoTermosClicado(false);
    setBotaoResumoClicado(false)

    setResultados([])
    setPesquisaInput('')
  };

  //

    console.log("idprogram" + idGraduateProgram)

    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await fetch(urlGraduateProgram, {
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
                setGraduatePogram(data);
              }
            } catch (err) {
              console.log(err);
            } finally {
    
            }
          };
        fetchData();
      }, [urlGraduateProgram]);

      const [div2Visible, setDiv2Visible] = useState(false);

      const handleOpenDiv2 = () => {
        setDiv2Visible(true);
      };

      const handleCloseDiv2 = () => {
        setDiv2Visible(false);
      };

    return  (
      <div className=" flex flex-col justify-center h-full   min-h-screen">
      <div id="div1" className={`px-6 md:px-16 flex gap-12  mr-24 ${div2Visible ? '': ''}` }>

            <div className=" overflow-x-hidden w-[720px]  flex  left-0 ">
              <div className="block  w-full overflow-x-auto whitespace-nowrap pb-4 element">
                {graduateProgram.map(props => {
                    return(
                      <li
                    key={props.graduate_program_id}
                    className=" checkboxLabel group list-none h-full inline-flex mr-4 group w-[350px]"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <label className={`justify-between w-full p-6 flex-col cursor-pointer border-[1px] bg-white border-gray-300 flex text-gray-400 rounded-md text-xs font-bold hover:border-blue-400 hover:bg-blue-100 ${idGraduateProgram === props.graduate_program_id ? 'activeTab' : ''}`}>
                      <div className="flex flex-col">
                        <div className="border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium w-fit mb-4">{props.area}</div>
                        <span className=" whitespace-normal text-base text-gray-400 mb-2 font-bold">{props.name}</span>
                        <p className="font-medium">{props.code}</p>
                      </div>

                      <div className="flex gap-2 mt-8 flex-wrap">
                      {props.type.split(';').map((value, index) => {
                        const ratingValues = props.rating.split(';');
                        const ratingDoutorado = ratingValues[0]; // Valor correspondente a DOUTORADO
                        const ratingMestrado = ratingValues[1]; // Valor correspondente a MESTRADO

                        return (
                          <div
                            key={index}
                            className={`py-2 px-4 text-white w-fit rounded-md text-xs font-bold flex gap-2 items-center ${
                              value.includes('MESTRADO') ? 'bg-blue-200' : 'bg-blue-300'
                            }`}
                          >
                            <GraduationCap size={12} className="textwhite" />
                            {value.trim()}
                             <p className=" flex gap-2 items-center"><Star size={12} className="textwhite" /> {props.type.split(';').length == 2 ? (value.includes('MESTRADO') ? ratingMestrado : ratingDoutorado): (props.rating)}</p>
                          </div>
                        );
                      })}

                      <div className="bg-blue-400 py-2 px-4 text-white rounded-md text-xs font-bold flex gap-2 items-center">
                        <BookmarkSimple size={12} className="textwhite" />
                        {props.modality}
                      </div>
                    </div>


                      <input
                        type="checkbox"
                        name={props.name}
                        className="absolute hidden group"
                        onClick={() => handleClick(props.graduate_program_id)}
                        id={props.name}
                        
                      />
                    </label>
                  </li>
                    )
                  })}
              </div>
           </div>



           <div className="flex flex-col justify-center">
            <h1 className="text-5xl mb-4 font-medium max-w-[450px] ">Escolha o programa de pós-graduação</h1>
              <p className="mb-12  text-lg text-gray-400">Isso nos ajudará a filtrar sua pesquisa</p>

              <div className="flex gap-4">
                  <Link to={"/search"} className="w-fit whitespace-nowrap flex items-center gap-4 bg-blue-400 text-white rounded-full px-6 py-2 justify-center hover:bg-blue-500  font-medium transition">
                      <ArrowRight size={16} className="text-white" /> Avançar
                  </Link>

                  <button onClick={handleOpenDiv2} className=" w-fit whitespace-nowrap flex items-center gap-4 bg-blue-400 text-white rounded-full px-6 py-2 justify-center hover:bg-blue-500 font-medium transition">
              <ArrowRight size={16} className="text-white" /> Avançar
            </button>
              </div>
           </div>

              
            </div>

            <div onClick={handleOpenDiv2} className={`fixed top-0 right-0 ${div2Visible ? 'pl-24': 'cursor-pointer w-24 h-screen bg-blue-300  bg-opacity-20 backdrop-blur-lg shadow-2xl'}`}>
              
            {div2Visible ? (
              <div id="div2" className="relative flex-1 bg-blue-300 p-16 pt-20 w-full h-screen shadow-2xl bg-opacity-20 backdrop-blur-lg">
                <div className="flex items-center">
                              <div className={`rounded-l-full flex items-center bg-white h-14 group w-full  text-base font-medium  justify-center transition border-[1px] border-gray-300 ${botaoTermosClicado ? 'hover:border-[#005399]' : ''} ${botaoResumoClicado ? 'hover:border-red-400' : ''} ${botaoAreasClicado ? 'hover:border-[#8FC53E]' : ''} ${botaoPesquisadoresClicado ? 'hover:border-[#20BDBE]' : ''}`}>
                                <MagnifyingGlass size={20} className={`text-gray-400 min-w-[52px] ${botaoTermosClicado ? 'group-hover:text-[#005399]' : ''} ${botaoResumoClicado ? 'group-hover:text-red-400' : ''} ${botaoAreasClicado ? 'group-hover:text-[#8FC53E]' : ''} ${botaoPesquisadoresClicado ? 'group-hover:text-[#20BDBE]' : ''}`}/>
                                <input 
                                type="text" 
                                value={pesquisaInput} 
                                onChange={handlePesquisaChange} 
                                name="" 
                                placeholder={
                                  `${botaoResumoClicado ? 'Pesquise por uma ou mais palavras no resumo do pesquisador (Ex: Robótica, educação, indústria)' : ''} ${botaoTermosClicado ? 'Pesquise um ou mais termos (Ex: Robótica, educação, indústria)' : ''} ${botaoAreasClicado ? 'Pesquise uma ou mais áreas de especialidade (Ex: Astronomia, Ciência de dados)' : ''} ${botaoPesquisadoresClicado ? 'Pesquise o nome de um ou mais pesquisador(es)' : ''}`
                                }
                                id="" className="w-full h-full outline-none" />
                              </div>

                              <div className={`bg-white  p-2 flex gap-2  border-[1px] border-gray-300 border-l-0 rounded-r-full`}>

                                <div onClick={handleClickTermos}  className={`outline-none cursor-pointer text-sm rounded-full text-gray-400 flex items-center border-[1px] border-white gap-2 px-4 py-2 font-semibold transition ${botaoTermosClicado ? "activeTermos" : ('')}`}>
                                  <CursorText size={16} className="text-gray-400"/>
                                  Termo
                                </div>

                                <div onClick={handleClickResumo} className={`outline-none cursor-pointer text-sm rounded-full text-gray-400 flex items-center border-[1px] border-white gap-2 px-4 py-2 font-semibold transition ${botaoResumoClicado ? "activeResumo" : ('')}`} >
                                  <TextAlignLeft size={16} className="text-gray-400"/>
                                  Resumo
                                </div>

                                <div onClick={handleClickAreas} className={`outline-none cursor-pointer text-sm text-gray-400 rounded-full flex items-center gap-2 px-4 py-2 font-semibold  transition ${botaoAreasClicado ? "activeAreas" : ('')}`}>
                                  <Lightbulb size={16} className="text-gray-400"/>
                                  Áreas
                                </div>
                              </div>
                            </div>
                
                <div className=" ">
                  <h2 className="mb-4 text-2xl font-medium text-gray-400">Palavra em <strong className="font-bold text-white bg-blue-400">{botaoResumoClicado ? "resumo" : (botaoAreasClicado ? "áreas" : "termo")}</strong></h2>
                  {pesquisaInput.length == 0 ? (<p className="text-gray-400 mb-8">Mostrando as 50 palavras mais frequentes, digite para aparecer mais</p>): ('')}
                    {checkboxItems}
                </div>
                
              </div>
            ): (
              <div className="h-full flex items-center z-[99999999]">
                <CaretLeft size={24} className="text-white ml-4 animate-pulse"/>
              </div>
            )}
            
            </div>

            <img src={il_1} alt="" className={`fixed bottom-0 right-0 w-[400px] ${div2Visible ? 'hidden': ''}` } />
          
        </div>
    )
}