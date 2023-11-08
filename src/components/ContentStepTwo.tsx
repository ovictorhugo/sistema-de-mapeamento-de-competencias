import { ArrowLeft, ArrowRight, BookmarkSimple, ChalkboardTeacher, GraduationCap, Star } from "phosphor-react";
import { UserContext } from "../contexts/context";
import { useEffect, useState, useContext } from "react";
import SearchStepTwo from "./SearchStepTwo";
import { Link } from "react-router-dom";

import il_2 from '../assets/il_2.png';

type GraduateProgram = {
  area: string
  code: string
  graduate_program_id: string
  modality: string
  name: string
  rating: string
  type: string
}


export function ContentStepTwo() {
  const { urlGeral, setUrlGeral } = useContext(UserContext);

  const urlGraduateProgram = `${urlGeral}/graduate_program?institution_id=fdd8b743-9664-4177-84ca-757146a93580`;

  const [graduateProgram, setGraduatePogram] = useState<GraduateProgram[]>([]);

  const { idGraduateProgram, setIdGraduateProgram } = useContext(UserContext)
  const graduateProgramIndex = Number(idGraduateProgram);



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


  return (
    <div className=" md:pl-16 flex flex-col justify-center h-full min-h-screen">

      <div className="flex flex-col mr-[394px]">
        <h1 className="text-4xl  font-medium">Pesquise um termo no programa de pós-graduação </h1>

        <div className="flex mt-4 mb-12">
          {graduateProgram.map(props => {
            if (props.graduate_program_id === idGraduateProgram) {
              return (
                <div className="flex">

                  <div className="flex gap-2  flex-wrap">

                    <div className="border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium w-fit mb-4">{props.area}</div>

                    <div className="border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium w-fit mb-4">{props.name}</div>


                    {props.type.split(';').map((value, index) => {
                      const ratingValues = props.rating.split(';');
                      const ratingDoutorado = ratingValues[0]; // Valor correspondente a DOUTORADO
                      const ratingMestrado = ratingValues[1]; // Valor correspondente a MESTRADO

                      return (
                        <div
                          key={index}
                          className={`py-2 px-4 h-8 text-white w-fit rounded-md text-xs font-bold flex gap-2 items-center ${value.includes('MESTRADO') ? 'bg-blue-200' : 'bg-blue-300'
                            }`}
                        >
                          <GraduationCap size={12} className="textwhite" />
                          {value.trim()}
                          <p className=" flex gap-2 items-center"><Star size={12} className="textwhite" /> {props.type.split(';').length == 2 ? (value.includes('MESTRADO') ? ratingMestrado : ratingDoutorado) : (props.rating)}</p>
                        </div>
                      );
                    })}

                    <div className="bg-blue-400 py-2 h-8 px-4 text-white rounded-md text-xs font-bold flex gap-2 items-center">
                      <BookmarkSimple
                        size={12} className="textwhite" />
                      {props.modality}
                    </div>
                  </div>
                </div>
              )
            } else {
              return null; // Renderizar null para os outros itens que não correspondem ao índice desejado
            }
          })}
        </div>

        <SearchStepTwo />

        <div className="flex gap-4 mt-12">
          <Link to={"/"} className="w-fit whitespace-nowrap flex items-center gap-4 text-blue-400 rounded-full px-6 py-2 justify-center hover:bg-gray-100  font-medium transition">
            <ArrowLeft size={16} className="text-blue-400" /> Voltar
          </Link>

          <Link to={"/result"}>
            <button className="w-fit whitespace-nowrap flex items-center gap-4 bg-blue-400 text-white rounded-full px-6 py-2 justify-center hover:bg-blue-500  font-medium transition">
              <ArrowRight size={16} className="text-white" /> Avançar
            </button>
          </Link>
        </div>
      </div>


      <div className="fixed right-0">

        <div className="h-screen min-w-[300px] bg-blue-300 p-4 "></div>

      </div>
    </div>
  )
}