import { ArrowRight, BookmarkSimple, CaretLeft, ChalkboardTeacher, CursorText, GraduationCap, Lightbulb, MagnifyingGlass, Star, TextAlignLeft } from "phosphor-react";
import { UserContext } from "../contexts/context";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";

import il_1 from '../assets/il_1.png';
import cimatec from '../assets/cimatec.png';
import { Logo } from "./Logo";

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

interface ResearcherId {
  lattes_10_id: string
  lattes: string
  name: string
}

export function ContentStepOne() {
  const { urlGeral, setUrlGeral } = useContext(UserContext);
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

  console.log(urlGraduateProgram)
  const [graduateProgram, setGraduatePogram] = useState<GraduateProgram[]>([]);
  const [ResearcherImage, setResearcherImage] = useState<ResearcherId[]>([])
  const urlResearcherImage = urlGeral + 'researcher_image'

  const { idGraduateProgram, setIdGraduateProgram } = useContext(UserContext)

  useEffect(() => {

    fetch(urlResearcherImage, {
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
        setResearcherImage(newData);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [urlResearcherImage]);

  ///////////////////////////

  function handleClick(name: string) {
    setIdGraduateProgram(name);
  }

  const [resultados, setResultados] = useState<Post[]>([]);

  let urlTerms = urlGeral + `/originals_words?initials=&type=ARTICLE`;
  const pesquisaInputFormatado = pesquisaInput.trim().replace(/\s+/g, ";");

  if (botaoTermosClicado) {
    urlTerms = urlGeral + `/originals_words?initials=${pesquisaInputFormatado}&type=ARTICLE`;
  }

  if (botaoResumoClicado) {
    urlTerms = urlGeral + `/originals_words?initials=${pesquisaInputFormatado}&type=ABSTRACT`;
  }

  if (botaoAreasClicado) {
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
        <span className="text-center block">{botaoResumoClicado || botaoTermosClicado ? (resultado.term) : ('')}
          {botaoAreasClicado ? (`${resultado.area_specialty} | ${resultado.area_expertise}`) : ('')}</span>
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


  //loucura loucura



  const cellSize = '20vh';

  return (
    <div className="backgroundGradient bg-opacity-10 backdrop-blur-sm">
      <div
        id="principal"
        className="h-screen max-h-screen overflow-y-hidden grid grid-cols-5 gap-4 w-[40%] p-4 absolute"
        style={{ maxHeight: "100vh" }}
      >
        {ResearcherImage.map((props, index) => (
          <a
            href={`https://lattes.cnpq.br/${props.lattes}`}
            key={props.lattes_10_id}
            className="whitespace-nowrap bg-cover bg-center bg-no-repeat rounded-md"
            style={{
              backgroundImage:
                index % 3 === 0
                  ? "none"
                  : `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id})`,
              paddingTop: "100%", // Define a proporção 1:1 (quadrado)
            }}
          ></a>
        ))}
      </div>

      <div className=" h-screen justify-center flex flex-col ml-[40%] px-6 md:px-16">
        <div className="flex flex-col justify-center">
          <div className="flex gap-6 items-center mb-8">
            <Link to={"/"} className="h-[30px]  "><Logo /></Link>
            <label htmlFor="" className=" relative  p-2 text-gray-400 rounded-full border-[1px] border-solid border-gray-300 justify-center items-center inline-flex outline-none px-6 bg-white gap-3 text-xs font-medium w-fit transition focus:bg-blue-100">Informações Analíticas da Pós-Graduação</label>
            <Link to={"/"} className="h-[30px] "><img src={cimatec} alt="" className="h-[40px]" /></Link>
          </div>

          <h1 className="text-5xl mb-4 font-medium max-w-[450px] ">Escolha o programa de pós-graduação</h1>
          <p className="  text-lg text-gray-400">Isso nos ajudará a filtrar sua pesquisa</p>

        </div>

        <div className=" overflow-x-hidden w-full  flex  left-0 my-6 ">
          <div className="block  w-full overflow-x-auto whitespace-nowrap pb-4 element">
            {graduateProgram.map(props => {
              return (
                <li
                  key={props.graduate_program_id}
                  className=" checkboxLabel group list-none h-full inline-flex mr-4 group w-[350px]"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <label className={`justify-between w-full p-6 flex-col cursor-pointer border-[1px] bg-white bg-opacity-60 backdrop-blur-sm border-gray-300 flex text-gray-400 rounded-md text-xs font-bold hover:border-blue-400 hover:bg-blue-100 ${idGraduateProgram === props.graduate_program_id ? 'activeTab bg-opacity-80 backdrop-blur-sm' : ''}`}>
                    <div className="flex flex-col">
                      <div className="border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium w-fit mb-4">{props.area}</div>
                      <span className=" whitespace-normal text-base text-gray-400 mb-2 font-bold">{props.name}</span>
                      <p className="font-medium">{props.code}</p>
                    </div>

                    <div className="flex gap-2 mt-8  whitespace-nowrap overflow-x-hidden">
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

        <div className="flex gap-4">
          
          <Link to={"/result"} className="w-fit whitespace-nowrap flex items-center gap-4 bg-blue-400 text-white rounded-full px-6 py-2 justify-center hover:bg-blue-500  font-medium transition">
            <ArrowRight size={16} className="text-white" /> Avançar
          </Link>
        </div>
      </div>

    </div>
  )
}