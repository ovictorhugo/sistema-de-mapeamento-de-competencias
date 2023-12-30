import { CalendarBlank, File, Graph, LinkBreak, Quotes } from "phosphor-react";
import { UserContext } from '../contexts/context'
import { useEffect, useState, useContext } from "react";
import unorm from 'unorm';

type Publicacao = {
    id: string,
    doi: string,
    name_periodical: string,
    qualis: "A1" | "A2" | "A3" | "A4" | "B1" | "B2" | "B3" | "B4" | "B5" | "C" | "None" | "NP" | "SQ",
    title: string,
    year: string,
    color: string,
    researcher: string,
    lattes_id: string,
    magazine: string,
    lattes_10_id: string,
    jif: string,
    jcr_link: string
}

let qualisColor = {
    'A1': 'bg-[#006837]',
    'A2': 'bg-[#8FC53E]',
    'A3': 'bg-[#ACC483]',
    'A4': 'bg-[#BDC4B1]',
    'B1': 'bg-[#F15A24]',
    'B2': 'bg-[#F5831F]',
    'B3': 'bg-[#F4AD78]',
    'B4': 'bg-[#F4A992]',
    'B5': 'bg-[#F2D3BB]',
    'C': 'bg-[#EC1C22]',
    'None': 'bg-[#560B11]',
    'SQ': 'bg-[#560B11]'
}



export function Publicacao(props: Publicacao) {
  const { botaoTermosClicado, setBotaoTermosClicado } = useContext(UserContext);
    const { valoresSelecionadosExport, setValoresSelecionadosExport } = useContext(UserContext);
    const { valorDigitadoPesquisaDireta, setValorDigitadoPesquisaDireta } = useContext(UserContext);
    const { valoresSelecionadosPopUp, setValoresSelecionadosPopUp } = useContext(UserContext)
    const {valoresSelecionadosNuvem, setValoresSelecionadosNuvem} = useContext(UserContext)

    useEffect(() => {
        if (props.lattes_10_id == "undefined") {
            props.lattes_10_id = ""
        }
    }, [props.lattes_10_id]);

    const normalizedTitle = props.title
    .replace(/&quot;/g, '"')
    .replace(/&#10;/g, '\n')
    .toLowerCase();

    const {distinct, setDistinct} = useContext(UserContext)

    const { isOn, setIsOn } = useContext(UserContext)
    const ignoredWords = ['a', 'do', 'da', 'o', 'os', 'as', 'de', "e", "i", 'na', 'du', 'em']; // Adicionar outras palavras que devem ser ignoradas

    return (
        <div key={props.id} id="id_perfil" className={`group  flex w-full hover:shadow-md transition border-solid border-gray-300 border-[1px] rounded-xl `}>
            <div className={`h-full w-2 min-w-[8px] rounded-l-lg ${qualisColor[props.qualis as keyof typeof qualisColor]}` }></div>
            <div className={`bg-white rounded-xl  justify-between flex p-4  ${isOn ? "items-center justify-center flex" : "flex-col items-baseline"}`}>
                <div className="flex">
                    <div className="flex flex-col justify-center">
                        <div id="mudarCorDiv" className={` h-10 w-10 rounded-md mr-4 whitespace-nowrap flex items-center justify-center  ${qualisColor[props.qualis as keyof typeof qualisColor]}`}>
                            <File size={28} className="text-white whitespace-nowrap  w-10" />
                            <p className="text-[8px] text-white absolute font-bold mt-[6px]">{props.qualis}</p>

                        </div>
                        <p className="text-gray-400 text-[12px]  mr-4 text-center mt-2 relative">Qualis</p>
                    </div>

                    <div>
                        <h4 className="text-base font-medium ">{props.name_periodical}{props.magazine}</h4>
                        <div className="flex items-center gap-2">
                            <CalendarBlank size={16} className="text-gray-400" />
                            <p className="text-[13px]  text-gray-500">{props.year}</p>
                        </div>
                    </div>

                </div>

                {props.lattes_10_id !== 'K4796572P6' && (
  <div className="pt-6 flex flex-wrap">
<p className="text-gray-400 text-sm font-medium flex-wrap flex gap-1">
  {valoresSelecionadosPopUp === '' && valorDigitadoPesquisaDireta === '' && valoresSelecionadosNuvem === ''  || botaoTermosClicado == false ? (
    `${props.title.toUpperCase()}`
  ) : (
    normalizedTitle
      .split(/[\s.,;?!]+/)
      .map((word, index) => {
        const formattedWord = unorm.nfkd(word).replace(/[^\w\s]/gi, '').toLowerCase();
        const formattedValoresSelecionadosNuvem  = unorm.nfkd(valoresSelecionadosNuvem ).replace(/[^\w\s]/gi, '').toLowerCase();
        const formattedValoresSelecionadosExport = unorm.nfkd(valoresSelecionadosExport).replace(/[^\w\s]/gi, '').toLowerCase();
        const formattedValorDigitadoPesquisaDireta = unorm.nfkd(valorDigitadoPesquisaDireta).replace(/[^\w\s]/gi, '').toLowerCase();
        const alphabet = Array.from({ length: 26 }, (_, index) => String.fromCharCode('a'.charCodeAt(0) + index));
        const ignoredWords = [...alphabet, 'do', 'da', `on`, `com`, 'o', 'os', 'as', 'de', 'e', 'i', 'na', 'du', 'em', ')', '(', 'na', 'a'];
        let formattedSpan;
        
     
        if (
          (formattedValoresSelecionadosNuvem.includes(formattedWord) ||
          formattedValoresSelecionadosExport.includes(formattedWord) ||
          formattedValorDigitadoPesquisaDireta.includes(formattedWord)) &&
          !ignoredWords.includes(formattedWord)
        ) {
          formattedSpan = (
            <span key={index} className="text-blue-400 font-bold">
              {word.toUpperCase()}{' '}
            </span>
          );
        } else {
          formattedSpan = <span key={index}>{word.toUpperCase()} </span>;
        }

        return formattedSpan;
      })
   
  )}
</p>


  </div>
)}

<div className="my-6">
{props.researcher === "" ||distinct == true ? (
                    <div className="my-8"></div>
                ) : (
                    <a href={`https://lattes.cnpq.br/${props.lattes_id}`} target="_blank" rel="noopener noreferrer" className={` py-2  my-4   text-gray-400 rounded-md text-xs font-medium gap-2 items-center ${isOn ? "mt-0 pt-0" : ""}`}>
                        Aparece no Lattes de
                        <div className="flex mt-2 items-center gap-2">
                            <div className={`border-[1px] border-gray-300 rounded-sm h-6 w-6 bg-cover bg-center bg-no-repeat`} style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id}) ` }}></div>
                            {props.researcher}
                        </div>
                    </a>
                )}
</div>

<div className={`flex  flex-col flex-nowrap  ${isOn ? "ml-6 justify-end" : ""}`}>

                

                <div className="flex  gap-4 items-center justify-between relative bottom-0S flex-wrap">
                    <div className="flex gap-3">
                        <div className={` flex gap-3 flex-wrap ${isOn ? " justify-end" : ""}`}>
                            <div className="qualis border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium gap-2 items-center whitespace-nowrap "><Graph size={16} className="text-gray-400" />  Qualis {props.qualis}</div>


                            <div className="border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium gap-2 items-center"> <Quotes size={16} className="text-gray-400" /> Artigo</div>

                            {props.doi && (
                                <a href={`http://dx.doi.org/${props.doi}`} target="_blank" rel="noopener noreferrer" className="border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium gap-2 items-center whitespace-nowrap "><LinkBreak size={16} className="text-gray-400" />Link Doi</a>
                            )}

                            {props.jif != "None" && (
                                <a href={props.jcr_link} target="_blank" rel="noopener noreferrer" className="border-[1px] cursor-pointer border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium gap-2 items-center  whitespace-nowrap"><LinkBreak size={16} className="text-gray-400" />JCR {props.jif}</a>
                            )}
                        </div>

                    </div>
                </div>
            </div>
            </div>

            



        </div>
    )
};