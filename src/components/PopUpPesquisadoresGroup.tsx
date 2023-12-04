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

  // BTN MOSTRAR RESULTADOS 

  const { botaoPesquisadoresClicado, setBotaoPesquisadoresClicado } = useContext(UserContext);
  const { urlGeral, setUrlGeral } = useContext(UserContext);
  const { pesquisadoresSelecionadosGroupBarema, setPesquisadoresSelecionadosGroupBarema } = useContext(UserContext);




  return (
    <div></div>
  )
}