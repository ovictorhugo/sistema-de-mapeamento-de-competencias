import { Header } from "./Header";
import bg_cidades from '../assets/bg_cities.png';
import { useContext, useEffect, useState } from "react";
import { Pesquisador } from "./Pesquisador";
import { Plus, UserList } from "phosphor-react";
import { UserContext } from "../contexts/context";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

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
    image: string
    graduation: string,
    patent: string,
    software: string,
    brand: string,
    lattes_update: Date,
  }

  

export function VisualizacaoCidades() {
    const [researcher, setResearcher] = useState<Research[]>([]);
    const { urlGeral, setUrlGeral } = useContext(UserContext);
    const { cidadeSelecionada, setCidadeSelecionada } = useContext(UserContext);

    let urlTermPesquisadores = `${urlGeral}researcher?terms=educacao&university=&type=ARTICLE&graduate_program_id=`;

    useEffect(() => {
        const fetchData = async () => {
       
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
          
          }
        };
        fetchData();
      }, [urlTermPesquisadores]);

      const randomIndex = Math.floor(Math.random() * researcher.length);

      const randomResearcher = researcher[randomIndex];

    return  (
        <div>
         <Header/>

         <div className="absolute right-32 top-[200px] w-[400px] z-[-999] scale-75">
      
                  <div  className=" group justify-end flex w-full transition-all" >

<label
         
          className={`z-[99] absolute m-6 ml-auto hidden group-hover:flex cursor-pointer float-right items-center gap-4 bg-blue-400 hover:bg-blue-500 text-white rounded-xl h-[38px] w-[38px] justify-center  font-medium transition`}
        >
          <Plus size={16} className="text-white" />
          <input
            type="checkbox"
            className="absolute hidden"
       
           
          />
        </label>

                    <div className="relative w-full">
                    {randomResearcher ? (
        <Pesquisador
          among={randomResearcher.among}
          articles={randomResearcher.articles}
          book={randomResearcher.book}
          book_chapters={randomResearcher.book_chapters}
          id={randomResearcher.id}
          name={randomResearcher.name}
          university={randomResearcher.university}
          lattes_id={randomResearcher.lattes_id}
          area={randomResearcher.area}
          abstract={randomResearcher.abstract}
          lattes_10_id={randomResearcher.lattes_10_id}
          city={randomResearcher.city}
          orcid={randomResearcher.orcid}
          image={randomResearcher.image}
          graduation={randomResearcher.graduation}
          patent={randomResearcher.patent}
          software={randomResearcher.software}
          brand={randomResearcher.brand}
          lattes_update={randomResearcher.lattes_update}
        />
      ) : (
        ``
      )}
                    </div>
                  </div>
              
         </div>
         <div style={{ backgroundImage: `url(${bg_cidades})` }} className="w-full px-16 pt-24 flex flex-col items-center justify-center h-screen bg-cover bg-no-repeat bg-bottom">
         <h1 className="z-[999] text-5xl text-center mb-4 font-medium max-w-[800px] ">Pesquise os <strong className="bg-red-400 text-white font-normal">
         dados e pesquisadores
        </strong>{" "}
        com o filtro por cidade
      </h1>
          <p className=" z-[999] max-w-[700px]  text-lg text-center text-gray-400">Veja os dados de produção de energia e comércio associados com a produção dos pesquisadores </p>

   

         </div>

        {cidadeSelecionada == "" ? (``):(
           <div className="min-h-screen w-full px-16 mt-16">

<div className="flex gap-4 items-center w-full">
        <div className="">
        <h1 className="text-left max-w-[350px] min-w-[350px]  font-medium text-3xl ">
           Visão geral de <strong className="bg-red-400 text-white font-medium">{cidadeSelecionada}</strong>
        </h1>
        <p className="text-sm text-gray-400 mt-2">Informações referentes as instituições e pesquisadores da cidade</p>
        </div>

        <div className=" h-24 flex items-center justify-center  gap-4">
        <div className="h-24 w-24 flex items-center  ">
       
        </div>

      <p className="text-sm text-gray-400  flex-1">Porcentagem de pesquisadores das universidades estaduais em relação ao estado</p>
        </div>

        <div className="grid grid-cols-4 gap-4 w-full">

            <div className="flex flex-col w-full items-end">
                <p className="text-gray-400">Total de pesquisadores</p>
                <h3 className="text-6xl font-medium"></h3>
            </div>

            <div className="flex flex-col w-full items-end">
                <p className="text-gray-400">Total de instituições</p>
                <h3 className="text-6xl font-medium"></h3>
            </div>

            <div className="flex flex-col w-full items-end">
                <p className="text-gray-400">Total de patentes</p>
                <h3 className="text-6xl font-medium"></h3>
            </div>

           
        </div>
        </div>









           <div className="flex gap-4">
              <UserList size={24} className="text-gray-400" />
              <p className="text-gray-400">Pesquisadores de {cidadeSelecionada}</p>
            </div>







           </div>
        )}
        </div>
    )
}