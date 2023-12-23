import React, { useContext, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { UserContext } from "../contexts/context";
import { ArrowRight, BookmarkSimple, GraduationCap, MagnifyingGlass, MapPin, Star, X } from "phosphor-react";
import { Link } from "react-router-dom";
import { Circle } from "./Circle";
import DropdownMultiSelect from "./DropdownMultiSelect";
import { SvgLines } from "./SvgLines";


import logo_1 from '../assets/logo_1.png';
import logo_2 from '../assets/logo_2.png';
import logo_3 from '../assets/logo_3.png';
import logo_4 from '../assets/logo_4.png';
import logo_5 from '../assets/logo_5.png';
import BrasilMap from "./BrasilMap";



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

interface Props {
  id: string
}

interface GraphNode extends GraduateProgram {
  x: number | undefined;
  y: number | undefined;
}

interface GraphLink {
  source: string;
  target: string;
}

interface Graph {
  nodes: GraphNode[];
  links: GraphLink[];
}

export function ContentProfnit(props: Props) {
  const { urlGeral, setUrlGeral } = useContext(UserContext);
  const { estadoSelecionado, setEstadoSelecionado } = useContext(UserContext);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [graduatePrograms, setGraduatePrograms] = useState<GraduateProgram[]>([]);
  const [selectedGraduateProgramId, setSelectedGraduateProgramId] = useState<string | null>(null);
  const [isSimulationRunning, setIsSimulationRunning] = useState<boolean>(true);

  const { idGraduateProgram, setIdGraduateProgram } = useContext(UserContext);



  const { idVersao, setIdVersao } = useContext(UserContext);
 
  setIdVersao(`2`)

  if(idVersao ==`2` ) {
    setUrlGeral(`http://200.128.66.226:5001/`)
  }

  function handleClick(name: string) {
    setIdGraduateProgram(name);
    
  }
  const [valueInstPesquisa, setValueInstPesquisa] = useState('')
  function handleClickPesquisa(name: string, id: string) {
    setIdGraduateProgram(id);
    setFilterValue(name)
    setValueInstPesquisa(name)
    
  }



  const urlGraduateProgram = `${urlGeral}/graduate_program_profnit?id=${props.id}`;

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


  //OUTRA LÓGICAAAA
 

  const toggleButtonOff = () => {
    setIdGraduateProgram("0");
    setEstadoSelecionado("");
  };

  const toggleButtonOffState = () => {
    setEstadoSelecionado("");
  };


  //pesquisa

  const [filterValue, setFilterValue] = useState("");
  const filteredResults = graduatePrograms.filter(props =>
    props.name.toUpperCase().includes(filterValue.toUpperCase()) ||
    props.instituicao.toUpperCase().includes(filterValue.toUpperCase())
  );

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleFilterChange()
    }
  };


   //
   const [isOpen, setIsOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);
   const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

   
  //idGraduateProgram
  function handleFilterChange(newValue: string) {
    setFilterValue(newValue);
  
    // Inicialize idGraduateProgram como 0 ou outro valor padrão
    let matchedId = '0';
  
    // Verificar se filterValue corresponde a props.name ou props.instituicao em qualquer programa
    graduatePrograms.forEach((program) => {
      if (
        program.name.toUpperCase().includes(newValue.toUpperCase()) ||
        program.instituicao.toUpperCase().includes(newValue.toUpperCase())
      ) {
        matchedId = String(program.graduate_program_id); // Converte o id para string
      
      }
    });
  
    // Definir idGraduateProgram com o id correspondente (ou '0' se não houver correspondência)
    setIdGraduateProgram(matchedId);
  }
  


  return (
    <div className="  overflow-y-hidden  overflow-x-hidden flex items-center">

      <div className="backgroundGradient opacity-60 animate-pulse h-screen w-full backdrop-blur-lg absolute top-0 z-[-9999]">
      </div>

      <div className="h-[70%] absolute z-[-9999]  bottom-0 right-0"><SvgLines/></div>

      <div className="w-full h-screen max-h-screen overflow-y-hidden  overflow-hidden flex items-center absolute "><BrasilMap/></div>

      <div className="px-6 md:px-16 flex justify-center h-screen flex-col  w-fit">
        <div className="h-[350px] absolute z-[-9] ml-16 "><Circle/></div>
        <h1 className="z-[999999] text-4xl mb-4 font-medium max-w-[750px] ">
        <strong className="bg-blue-400 text-white font-normal">
        Escolha um programa
        </strong>{" "}
        e veja o que a plataforma filtra para você.
      </h1>
          <p className=" z-[999999] max-w-[620px]  text-lg text-gray-400">Arraste ou clique em um dos pontos no gráfico para selecionar o programa de pós-graduação. Você também pode escolher pela lista abaixo </p>

          <div className="max-w-[700px] flex-col flex gap-3  mt-6 z-[999999]">
         
          <div className="w-full">
          <div className="flex gap-3 w-full">
          <div className="flex  items-center w-full  justify-center h-10 border-gray-300 border-[1px] rounded-xl bg-white hover:border-blue-400">
                        <MagnifyingGlass size={20} className={`text-gray-400 min-w-[52px] `} />
                        <input
                          type="text"
                          onKeyPress={handleKeyPress}
                          value={filterValue}
                          onChange={e => setFilterValue(e.target.value)}
                          placeholder={`Nome ou sigla da instituição`}
                          className="w-full outline-none text-sm"
                        />
                      </div>

                      <Link onClick={() => handleFilterChange(filterValue)} to={"/result"} className="w-fit h-10 whitespace-nowrap flex items-center gap-4 bg-blue-400 text-white rounded-xl px-6 py-2 justify-center hover:bg-blue-500 text-base font-medium transition">
                        <ArrowRight size={16} className="text-white" /> Avançar
                    </Link>
          </div>

          {filterValue.length <= 2 || filterValue == valueInstPesquisa ? (
            <div></div>
          ) : (
            <div className="rounded-md bg-white absolute mt-3 p-4 gap-4 flex flex-col max-h-[250px] overflow-y-auto elementBarra">
          {filteredResults.map(props => {
        
              return (
                <li
                  key={props.graduate_program_id}
                  className=" checkboxLabel group transition-all list-none inline-flex group w-full"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <label  onClick={() => handleClickPesquisa(props.instituicao, props.graduate_program_id)}  className={`justify-between w-full p-4 flex-col cursor-pointer border-[1px] bg-white bg-opacity-70 backdrop-blur-sm border-gray-300 flex text-gray-400 rounded-md text-xs font-bold hover:border-blue-400 `}>
                    <div className="flex justify-between items-center gap-3">

                    
                    <div className="flex items-center gap-3">
                    <div><img src={`${props.url_image}`} alt="" className="h-12 border-none w-auto whitespace-nowrap"/></div>
                      <div>
                      <span className=" whitespace-normal text-base text-gray-400 mb-2 font-bold">{props.name}</span>
                      <p className="font-medium flex gap-1 items-center"> {props.instituicao}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                    <div className="border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium w-fit bg-white gap-1 items-center"><MapPin size={12} className="" /> {props.city} | {props.state}</div>
                  
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
          )}
          </div>

          <div className=" flex  rounded-md z-[-99] items-center bg-opacity-80 flex-wrap gap-6 mt-4  ">
        <img src={logo_1} className=" relative w-auto h-12"/>
        <img src={logo_2} className=" relative w-auto h-12"/>
        <img src={logo_3} className=" relative w-auto h-12"/>
        <img src={logo_5} className=" relative w-auto h-12"/>
        <img src={logo_4} className=" relative w-auto h-8"/>
        
    </div>
          </div>

          
      </div>

     
       


      

      <div className="fixed  right-0 pr-16 items-center justify-center flex">
      <div className="flex flex-col gap-3 max-h-[470px] overflow-y-auto elementBarra">
        {graduatePrograms.map(props => {
         if (props.state === estadoSelecionado && idGraduateProgram == "0") {
              return (
                <li
                  key={props.graduate_program_id}
                  className=" checkboxLabel group transition-all list-none inline-flex group w-[350px] "
                  onMouseDown={(e) => e.preventDefault()}
                  
                >
                  <label onClick={() => handleClick(props.graduate_program_id)} className={`justify-between w-full p-6 flex-col  cursor-pointer border-[1px] bg-white bg-opacity-70 backdrop-blur-sm border-gray-300 flex text-gray-400 rounded-2xl text-xs font-bold hover:border-blue-400 `}>
                    <div className="flex flex-col">
                    

                    <div className="flex items-center gap-3">
                    <div><img src={`${props.url_image}`} alt="" className="h-16 border-none w-auto whitespace-nowrap flex-1"/></div>
                      <div className="flex flex-1 flex-col">
                      <span className=" whitespace-normal text-base text-gray-400 mb-2 font-bold">{props.name}</span>
                      <p className="font-medium flex gap-1 items-center"> <MapPin size={20} className="textwhite" /> {props.city} | {props.state}</p>
                      </div>
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
                    }
            })}
      </div>
            
      {graduatePrograms.map(props => {
         if (props.graduate_program_id === idGraduateProgram && props.state == estadoSelecionado ) {
              return (
                <li
                  key={props.graduate_program_id}
                  className=" checkboxLabel group transition-all list-none inline-flex group w-[350px] "
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <label className={`justify-between w-full p-6 flex-col cursor-pointer border-[1px] bg-white bg-opacity-70 backdrop-blur-sm border-gray-300 flex text-gray-400 rounded-2xl text-xs font-bold hover:border-blue-400 `}>
                    <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                    <div className="border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium w-fit ">{props.area}</div>
                    <div onClick={toggleButtonOff} className={`cursor-pointer rounded-xl hover:bg-gray-100 h-[38px] w-[38px] transition-all flex items-center justify-center `}>
                        <X size={24} className={'rotate-180 transition-all text-gray-400'} />
                        </div>
                    </div>
                      <div><img src={`${props.url_image}`} alt="" className="h-16 border-none mb-4 w-auto"/></div>
                      <span className=" whitespace-normal text-base text-gray-400 mb-2 font-bold">{props.name}</span>
                      <p className="font-medium">{props.code}</p>

                      <div className="flex gap-3 items-center text-base mt-8 font-medium ">
                      <MapPin size={20} className="textwhite" /> {props.city} | {props.state}
                      </div>

                      <div className="flex gap-2 mt-8 flex-wrap">
                      {props.type.split(';').map((value, index) => {
                        const ratingValues = props.rating.split(';');
                        const ratingDoutorado = ratingValues[0]; // Valor correspondente a DOUTORADO
                        const ratingMestrado = ratingValues[1]; // Valor correspondente a MESTRADO

                        return (
                          <div
                            key={index}
                            className={`py-2 px-4 text-white w-fit rounded-md text-xs font-bold flex gap-2 items-center ${value.includes('MESTRADO') ? 'bg-blue-200' : 'bg-blue-300'
                              }`}
                          >
                            <GraduationCap size={12} className="textwhite" />
                            {value.trim()}
                            <p className=" flex gap-2 items-center"><Star size={12} className="textwhite" /> {props.type.split(';').length == 2 ? (value.includes('MESTRADO') ? ratingMestrado : ratingDoutorado) : (props.rating)}</p>
                          </div>
                        );
                      })}

                      <div className="bg-blue-400 py-2 px-4 text-white rounded-md text-xs font-bold flex gap-2 items-center">
                        <BookmarkSimple size={12} className="textwhite" />
                        {props.modality}
                      </div>
                    </div>
                    </div>

                    <div>
                    <Link to={"/result"}  onClick={() => handleClick(props.graduate_program_id)} className="w-full mt-8 whitespace-nowrap flex items-center gap-4 bg-blue-400 text-white rounded-xl px-6 py-2 justify-center hover:bg-blue-500 text-base font-medium transition">
                        <ArrowRight size={16} className="text-white" /> Avançar
                    </Link>
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
                    }
            })}
      </div>

      
    </div>
  );
}