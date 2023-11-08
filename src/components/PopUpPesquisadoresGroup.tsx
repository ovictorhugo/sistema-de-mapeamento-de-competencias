import { ArrowLeft, Buildings, ChartLine, PaperPlaneTilt, Plus, Question, Trash, X } from "phosphor-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { Pesquisador } from "./Pesquisador"
import { UserContext } from '../contexts/context'

import Cookies from "js-cookie";
import { Logo } from "./Logo";

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
  estadoChecked: boolean,
}

export function PopUpPesquisadoresGroup() {

  const [researcher, setResearcher] = useState<Research[]>([]); // Define o estado vazio no início
  const [isLoading, setIsLoading] = useState(false);

  const handleClearCookie = () => {
    Cookies.remove("itensSelecionados");
    setResearcher([]);
    console.log("LIMPADO")
  };

  // BTN MOSTRAR RESULTADOS 

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

 





  return (
    <div className="z-[99999999999] rounded-md p-4 pb-0 h-full items-center justify-center bg-white border-[1px] border-gray-300 ">
      <div className="flex gap-4 w-full pb-4 justify-between items-center min-w-full">
        <p className="text-gray-400">Pesquisadores selecionados para consulta</p>

        <div onClick={handleClearCookie} className="cursor-pointer rounded-full hover:bg-gray-100 h-[38px] w-[38px] transition-all flex items-center justify-center">
          <Trash size={24} className={" transition-all text-gray-400"} />
        </div>
      </div>
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
  )
}