import { ArrowSquareOut, Buildings, CaretRight, Download, FileCsv, GraduationCap, LinkBreak, LinkSimple, MapPin, Plus, PuzzlePiece, User, X } from "phosphor-react";
import { Link } from "react-router-dom";
import { PopUp } from "./PopUp";
import { useEffect, useState, useContext, useRef } from "react";
import { UserContext } from "../contexts/context";

interface PesquisadorProps {
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
  lattes_update: Date
}

export function Pesquisador(props: PesquisadorProps) {
  const articlesNum: number = Number(props.articles);
  const bookNum: number = Number(props.book);
  const chaptersNum: number = Number(props.book_chapters);
  const production: number = articlesNum + bookNum + chaptersNum;
  const { urlGeral, setUrlGeral } = useContext(UserContext);

  const { botaoPesquisadoresClicado, setBotaoPesquisadoresClicado } = useContext(UserContext);
  const { botaoTermosClicado, setBotaoTermosClicado } = useContext(UserContext);
  const { botaoAreasClicado, setBotaoAreasClicado } = useContext(UserContext);
  const { botaoResumoClicado, setBotaoResumoClicado } = useContext(UserContext);
  const { botaoLivrosCapitulosClicado, setBotaoLivrosCapitulosClicado } = useContext(UserContext);
  const { botaoEventosClicado, setBotaoEventosClicado } = useContext(UserContext);
  const { botaoPatentesClicado, setBotaoPatentesClicado } = useContext(UserContext);
  // habilitar/ desabilitar div
  const [isVisible, setIsVisible] = useState(false);

  //testes de proximo btn

  const { valoresSelecionadosExport, setValoresSelecionadosExport } = useContext(UserContext);
  const { valorDigitadoPesquisaDireta, setValorDigitadoPesquisaDireta } = useContext(UserContext);
  const { pesquisadoresSelecionadosGroupBarema, setPesquisadoresSelecionadosGroupBarema } = useContext(UserContext);


  const { valoresSelecionadosPopUp, setValoresSelecionadosPopUp } = useContext(UserContext)
  console.log("valoresSelecionadosPopUp" + valoresSelecionadosPopUp)

  let urlPublicacoesPorPesquisador = `${urlGeral}bibliographic_production_researcher?terms=${valoresSelecionadosPopUp}&researcher_id=${props.id}&type=ARTICLE&qualis=`;



  const [jsonData, setJsonData] = useState<any[]>([]);
  const [downloadReady, setDownloadReady] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(urlPublicacoesPorPesquisador, {
          mode: 'cors',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600',
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        setJsonData(data);
        setDownloadReady(true);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [urlPublicacoesPorPesquisador]);

  const convertJsonToCsv = (json: any[]): string => {
    const items = json;
    const replacer = (key: string, value: any) => (value === null ? '' : value); // Handle null values
    const header = Object.keys(items[0]);
    const csv = [
      '\uFEFF' + header.join(';'), // Add BOM and CSV header
      ...items.map((item) =>
        header.map((fieldName) => JSON.stringify(item[fieldName], replacer)).join(';')
      ) // CSV data
    ].join('\r\n');

    return csv;
  };

  const handleDownloadJson = async () => {
    try {
      const csvData = convertJsonToCsv(jsonData);
      const blob = new Blob([csvData], { type: 'text/csv;charset=windows-1252;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${props.name}.csv`;
      link.href = url;
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  //pesqisadores selecionados


  //pop up visível 

  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  // outras variáveis de estado necessárias

  const { EstadoFiltro, setEstadoFiltro } = useContext(UserContext);
  // Outros códigos do componente

  // Função para exibir o PopUp
  const handleOpenPopUp = () => {
    setIsPopUpVisible(true);
    setEstadoFiltro(false)
  };


  const handleClosePopUp = () => {
    setIsPopUpVisible(false);
    setEstadoFiltro(false)
    setValoresSelecionadosPopUp(valoresSelecionadosExport);
  };

  const { idVersao, setIdVersao } = useContext(UserContext);

  const { isOn, setIsOn } = useContext(UserContext)

  //links

  let linkTo = `/researcher/${props.id}`;

  if (botaoAreasClicado && valoresSelecionadosExport != "") {
    linkTo = `/researcher/${idVersao}/${props.id}/${valoresSelecionadosExport}/areas`;
  } else if (botaoTermosClicado && valoresSelecionadosExport != "") {
    linkTo = `/researcher/${idVersao}/${props.id}/${valoresSelecionadosExport}/terms`;
  } else if (botaoResumoClicado && valoresSelecionadosExport != "") {
    linkTo = `/researcher/${idVersao}/${props.id}/${valoresSelecionadosExport}/abstract`;
  } else {
    // Define um valor padrão caso nenhuma variável corresponda
    linkTo = `/researcher/${idVersao}/${props.id}`;
  }

  return (

    <div className="w-auto relative " >

      <Link to={linkTo} target="_blank" className={`absolute z-[9]  top-6 hidden group-hover:flex cursor-pointer items-center gap-4 bg-blue-400 hover:bg-blue-500 text-white rounded-xl h-[38px] w-[38px] justify-center  font-medium transition right-20  ${valoresSelecionadosExport != '' ? "right-20" : "right-6"}`}>
        <ArrowSquareOut size={16} className="text-white" />
      </Link>

      <div onClick={handleOpenPopUp} id="id_perfil" className={`cursor-pointer group bg-white  border-gray-300 border-[1px]  items-center rounded-2xl hover:shadow-md transition w-full   ${isOn && valoresSelecionadosExport != '' ? "flex items-center justify-between" : "flex flex-col"}`}>
        <div  className={`bg-cover bg-top bg-no-repeat backdrop-blur-md backdrop-brightness-150 h-28 bg-gray-400 rounded-t-xl  w-full ${isOn && valoresSelecionadosExport != '' ? "hidden" : "flex "}`} style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id}) ` }}>
          <div className={`bg-[#000000] bg-opacity-30 absolute backdrop-blur-sm w-full h-full rounded-t-xl`}></div>

        </div>
        <div className={`flex ${isOn && valoresSelecionadosExport != '' ? "" : "flex-col"}`}>
          <div className={`flex items-center ${isOn && valoresSelecionadosExport != '' ? "" : "flex-col  "}`}>

            <div className={`whitespace-nowrap  bg-cover bg-center bg-no-repeat h-20 w-20 bg-white rounded-xl border-4 border-white  relative ${isOn && valoresSelecionadosExport != '' ? "" : "top-[-40px]  mb-3"}`} style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id}) ` }}>


            </div>

            <div className={`flex  flex-col mx-6  relative ${isOn && valoresSelecionadosExport != '' ? "top-0 ml-6" : "top-[-30px] items-center"}`}>
              <h4 className={`text-lg font-medium  mb-1 ${isOn && valoresSelecionadosExport != '' ? "text-left" : " px-8 text-center"}`}>{props.name}</h4>
              <div className="flex items-center gap-2 overflow-hidden truncate">
                {props.image == "None" ? (
                  <Buildings size={16} className="text-gray-500" />
                ) : (
                  <img src={props.image} alt="" className="h-6" />

                )}
                <p className="text-[14px]  w-full whitespace-normal h-6 text-center text-gray-500 truncate">{props.university}</p>
              </div>
            </div>

          </div>

          {valoresSelecionadosExport != "" || valorDigitadoPesquisaDireta != "" ? (
            <div className="w-full overflow-x-hidden ">
              <div id="main" className={`flex-wrap mx-4 flex h-full  gap-3 items-center overflow-x-hidden whitespace-nowrap ${isOn && valoresSelecionadosExport != '' ? "ml-6 justify-start" : "mb-2 items-center justify-center"}`}>
              {props.area != '' ? (
                  props.area.split(';').map((value, index) => (
                    <li
                      key={index}
                      className={`py-2 whitespace-nowrap px-4 rounded-md text-xs font-bold flex gap-2 text-white items-center ${value.includes('CIENCIAS AGRARIAS') ? 'bg-red-400' : value.includes('CIENCIAS EXATAS E DA TERRA') ? 'bg-green-400' : value.includes('CIENCIAS DA SAUDE') ? 'bg-[#20BDBE]' : value.includes('CIENCIAS HUMANAS') ? 'bg-[#F5831F]' : value.includes('CIENCIAS BIOLOGICAS') ? 'bg-[#EB008B]' : value.includes('ENGENHARIAS') ? 'bg-[#FCB712]' : value.includes('CIENCIAS SOCIAIS APLICADAS') ? 'bg-[#009245]' : value.includes('LINGUISTICA LETRAS E ARTES') ? 'bg-[#A67C52]' : value.includes('OUTROS') ? 'bg-[#1B1464]' : 'bg-[#000]'} `}
                    >
                      <PuzzlePiece size={12} className="text-white" /> {value.trim()}
                    </li>
                  ))
                ): ('')}
                {props.city != "None" ? (
                  <div className="bg-blue-400 py-2 px-4 text-white rounded-md text-xs font-bold flex gap-2 items-center"><MapPin size={12} className="textwhite" /> {props.city}</div>
                ):('')}

              </div>
            </div>
          ) : (
            <div id="main" className={`flex-wrap flex h-full  gap-3 items-center overflow-x-hidden whitespace-nowrap ${isOn && valoresSelecionadosExport != '' ? "ml-6 justify-start" : "items-center justify-center"}`}>
            
            {props.city != "None" ? (
              <div className="bg-blue-400 py-2 px-4 text-white rounded-md text-xs font-bold flex gap-2 items-center"><MapPin size={12} className="textwhite" /> {props.city}</div>
            ):('')}

            {props.graduation != "None" ? (
              <div className="bg-blue-400 py-2 px-4 text-white rounded-md text-xs font-bold flex gap-2 items-center"><GraduationCap size={12} className="textwhite" /> {props.graduation}</div>
            ):('')}

          </div>
          )}

        </div>
        <div className={` border-t py-8 border-gray-300 whitespace-nowrap  flex items-center justify-center rounded-md ${isOn && valoresSelecionadosExport != '' ? "float-right right-0 relative top-0 items-center flex justify-center" : " mt-5 w-full flex-col mx-4 "}`}>

        {valoresSelecionadosExport != "" || valorDigitadoPesquisaDireta != "" ? (
          
            <div className="flex gap-3 relative mb-6">
              {(botaoTermosClicado && props.among != 0) || (botaoAreasClicado && props.among != null) || (botaoLivrosCapitulosClicado && props.among != null) ? (
                <div className="text-blue-400 flex text-sm font-bold gap-3">
                  {props.among} ocorrências
                  <p className="text-sm  text-blue-400">|</p>
                </div>
              ) : (
                <head></head>
              )}
              <div className=" text-blue-400 text-sm font-bold">{production} produções</div>

            </div>

           
        ) : (
          <head></head>
        )}

        <div className="flex flex-1 gap-4 items-center justify-between relative px-4">
              <div className={`flex gap-3 ${isOn && valoresSelecionadosExport != '' ? "" : ""}`}>
                <div className=" border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium">{props.articles} artigos</div>
                <div className="border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium">{props.book} livros</div>
                <div className=" border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium">{props.book_chapters} capítulos de livros</div>
              </div>
            </div>
          </div>

        {isOn ? (
          <head></head>
        ) : (
          <div className="w-full  h-36 absolute bottom-0 hidden group-hover:flex py-6 px-2">
            <div className="bg-white w-full h-full flex justify-center items-center gap-2">
              <a href={`https://lattes.cnpq.br/${props.lattes_id}`} target="blank_" className="bg-blue-400 py-2 px-4 text-white rounded-md text-xs font-bold flex gap-2 items-center w-fit"><LinkSimple size={12} className="textwhite" /> Currículo Lattes</a>
              {props.orcid != "None" ? (
                <a href={`https://orcid.org/${props.orcid}`} target="blank_" className="bg-blue-400 py-2 px-4 text-white rounded-md text-xs font-bold flex gap-2 items-center w-fit"><LinkSimple size={12} className="textwhite" /> ORCID</a>
              ):('')}
            </div>
          </div>
        )}

      </div>

      {isPopUpVisible && (
        <div key={props.id} className={"elementPesquisador flex justify-center transition-all fixed top-0 right-0 pb-24 w-full h-screen bg-[#000] z-[99999] bg-opacity-75 pt-20 overflow-y-auto overflow-x-hidden "}>

          <div className="w-screen h-screen absolute top-0 left-0 " onClick={handleClosePopUp} ></div>
          <PopUp
            isPopUpVisible={isPopUpVisible}
            among={props.among}
            articles={props.articles}
            book={props.book}
            book_chapters={props.book_chapters}
            id={props.id}
            name={props.name}
            university={props.university}
            lattes_id={props.lattes_id}
            area={props.area}
            abstract={props.abstract}
            lattes_10_id={props.lattes_10_id}
            city={props.city}
            orcid={props.orcid}
            image={props.image}
            graduation={props.graduation}
            patent={props.patent}
            software={props.software}
            brand={props.brand}
            lattes_update={props.lattes_update}
          />

          <div className=" pt-20 flex flex-col fixed items-center h-screen right-0 top-0 w-32 z-[9999999]">

            <div className="mb-6 flex flex-col justify-center items-center">
              <div onClick={handleClosePopUp} className="mb-2 h-12 w-12 rounded-2xl bg-white items-center justify-center flex hover:bg-gray-100 cursor-pointer transition-all">
                <X size={16} className="text-gray-500" />
              </div>
              <p className="text-[12px] text-white">Fechar</p>
            </div>



            <div className="mb-6 flex flex-col justify-center items-center">
              <div onClick={handleDownloadJson} className="mb-2 h-12 w-12 rounded-2xl bg-white items-center justify-center flex hover:bg-gray-100 cursor-pointer transition-all">
                <FileCsv size={16} className="text-gray-500" />
              </div>

              <p className="text-[12px] text-white"> CSV</p>
            </div>

            <div className="mb-6 flex flex-col justify-center items-center">
              <Link to={linkTo} target="_blank" className="mb-2 h-12 w-12 rounded-2xl bg-blue-400 items-center justify-center flex hover:bg-blue-500 cursor-pointer transition-all">
                <ArrowSquareOut size={16} className="text-white" />
              </Link>

              <p className="text-[12px] text-white"> Mais info</p>
            </div>

            
          </div>
        </div>
      )}

    </div>
  )
}