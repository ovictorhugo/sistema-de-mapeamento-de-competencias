import { Pesquisador } from "./Pesquisador"
import { useEffect, useState, useContext } from "react";
import { UserContext } from '../contexts/context'
import { Link } from "react-router-dom";
import { CaretCircleLeft, CaretCircleRight, CaretDown, ChartLine, FileArrowDown, FileCsv, ListDashes, ListNumbers, PaperPlaneTilt, Plus, Rows, SquaresFour, User, UserList, X } from "phosphor-react";
import Carregando from "./Carregando";

import Cookies from "js-cookie";

import indicadores from '../assets/indicadores.png';
import woman from '../assets/woman.png';
import footer from '../assets/footer.png';

import { useLocation } from 'react-router-dom';

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
  image: string,
  graduation: string,
  patent: string,
  software: string,
  brand: string,
  lattes_update: Date,
}

export function HomeInicial() {
  const [isLoading, setIsLoading] = useState(false);
  const { urlTermExport, setUrlTermExport } = useContext(UserContext);
  const { urlGeral, setUrlGeral } = useContext(UserContext);


  const [researcher, setResearcher] = useState<Research[]>([]);
  const [researcher2, setResearcher2] = useState<Research[]>([]);

  //background
  const { idGraduateProgram, setIdGraduateProgram } = useContext(UserContext)
  let urlTermPesquisadores = `${urlGeral}researcherName?name=&graduate_program_id=${idGraduateProgram}`

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


  return (
    <div className="w-full px-6 md:px-16 mt-6 mb-24">
      <div id="contentPesquisador" className={`grid grid-cols-1 md:grid-cols-2 gap-6  m-[0 auto] w-full lg:grid-cols-3 2xl:grid-cols-4`}>
      <div className="flex gap-4 w-full pb-8 justify-between items-center min-w-full">
            <div className="flex gap-4">
              <ListNumbers size={24} className="text-gray-400 whitespace-nowrap min-h-8" />
              <p className="text-gray-400">Quadro geral de docentes do programa de pós-graduação.  Aqui estão informações sobre os professores e pesquisadores envolvidos no programa.</p>
            </div>

          </div>

        {researcher.map((user, index) => (
          <div key={user.id} className=" group justify-end flex w-full transition-all" >

            <div className="relative w-full">
              <Pesquisador
                among={user.among}
                articles={user.articles}
                book={user.book}
                book_chapters={user.book_chapters}
                id={user.id}
                name={user.name}
                university={user.university}
                lattes_id={user.lattes_id}
                area={user.area}
                abstract={user.abstract}
                lattes_10_id={user.lattes_10_id}
                city={user.city}
                orcid={user.orcid}
                image={user.image}
                graduation={user.graduation}
                patent={user.patent}
                software={user.software}
                brand={user.brand}
                lattes_update={user.lattes_update}
              />
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}