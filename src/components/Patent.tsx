import { CalendarBlank, Check, Copyright, SpinnerGap, Stamp } from "phosphor-react"
import { useContext } from "react";
import { UserContext } from "../contexts/context";

import unorm from 'unorm';

type Patente = {
    id: string,
    grant_date: string,
    title: string,
    year: string,
}


export function Patent(props: Patente) {

    const { valoresSelecionadosExport, setValoresSelecionadosExport } = useContext(UserContext);
    const { valorDigitadoPesquisaDireta, setValorDigitadoPesquisaDireta } = useContext(UserContext);
    const { valoresSelecionadosPopUp, setValoresSelecionadosPopUp } = useContext(UserContext)
    const { botaoPatentesClicado, setBotaoPatentesClicado } = useContext(UserContext);

    const normalizedTitle = props.title
    .replace(/&quot;/g, '"')
    .replace(/&#10;/g, '\n')
    .toLowerCase();


    return (
        <div className="hover:shadow-md transition rounded-xl border-[1px] border-gray-300 flex">
        <div className={`h-full w-2 min-w-[8px] rounded-l-xl ${props.grant_date == "NaT" || props.grant_date == "None" ? ('bg-red-400') : ('bg-green-400')}` }></div>
        <div className="w-full   p-6 flex gap-4 items-center">
            <div id="mudarCorDiv" className={` h-10 w-10 rounded-md  whitespace-nowrap flex items-center justify-center border-[1px] border-gray-300`}>
                <Copyright size={18} className="text-gray-400 whitespace-nowrap  w-10" />

            </div>
            <div>
                <h3 className="flex mb-4 text-base font-medium flex-wrap  gap-1">
               
  {botaoPatentesClicado == false || valoresSelecionadosPopUp == `` ? (
    `${props.title.toUpperCase()}`
  ) : (
    normalizedTitle
      .split(/[\s.,;?!]+/)
      .map((word, index) => {
        const formattedWord = unorm.nfkd(word).replace(/[^\w\s]/gi, '');
        const alphabet = Array.from({ length: 26 }, (_, index) => String.fromCharCode('a'.charCodeAt(0) + index));
        const ignoredWords = [...alphabet, 'do', 'da', 'o', 'os', 'as', 'de', 'e', 'i', 'na', 'du', 'em', ')', '('];
        let formattedSpan;

        if (
          (valoresSelecionadosExport.includes(formattedWord) ||
            valorDigitadoPesquisaDireta.includes(formattedWord)) &&
          !ignoredWords.includes(formattedWord)
        ) {
          formattedSpan = (
            <span key={index} className="text-blue-400 font-bold">
              {word.toUpperCase()}{' '}
            </span>
          );
        } else {
          formattedSpan = <span key={index}>{word.toUpperCase()}{' '} </span>;
        }

        return formattedSpan;
      })
   
  )}

                </h3>
                <div className="flex gap-4">
                    <div className={` py-2 px-4 text-white rounded-md text-xs font-bold  flex gap-2 items-center w-fit ${props.grant_date == "NaT" || props.grant_date == "None" ? ('bg-red-400') : ('bg-green-400')}`}>
                        {props.grant_date == "NaT" || props.grant_date == "None" ? (
                            <SpinnerGap size={12} className="textwhite" />
                        ) : (
                            <Check size={12} className="textwhite" />
                        )}
                        {props.grant_date == 'NaT' || props.grant_date == "None" ? "Sem concessão" : props.grant_date}</div>
                    <div className={`border-[1px] border-gray-300 py-2 px-4 text-gray-400 rounded-md text-xs font-bold flex gap-2 items-center w-fit `}><CalendarBlank size={12} /> {props.year}</div>
                    <div className={`border-[1px] border-gray-300 py-2 px-4 text-gray-400 rounded-md text-xs font-bold flex gap-2 items-center w-fit `}><Stamp size={12} /> {props.id}</div>
                </div>

            </div>
        </div>
        </div>
    )
}