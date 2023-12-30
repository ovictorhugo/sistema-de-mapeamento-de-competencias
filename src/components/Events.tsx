import { Book, BookOpen, CalendarBlank, File, Graph, IdentificationBadge, LinkBreak, Quotes, Ticket } from "phosphor-react";
import { UserContext } from '../contexts/context'
import { useEffect, useState, useContext } from "react";
import unorm from 'unorm';

type Publicacao = {
    event_name: string
    id: string
    nature: string
    participation: string
    year: string
}

const naturezaColor: { [key: string]: string } = {
    'Oficina': 'bg-[#174EA6]',
    'Simpósio': 'bg-[#1A73E8]',
    'Seminário': 'bg-[#8AB4F8]',
    'Congresso': 'bg-[#29ABE2]',
    'Encontro': 'bg-[#1B1464]',
    'Outra': 'bg-cyan-400',

  }


export function Eventos(props: Publicacao) {


    const { isOn, setIsOn } = useContext(UserContext)

    const {distinct, setDistinct} = useContext(UserContext)
    const { botaoLivrosCapitulosClicado, setBotaoLivrosCapitulosClicado } = useContext(UserContext);
    const { valoresSelecionadosExport, setValoresSelecionadosExport } = useContext(UserContext);
    const { valorDigitadoPesquisaDireta, setValorDigitadoPesquisaDireta } = useContext(UserContext);
    const { valoresSelecionadosPopUp, setValoresSelecionadosPopUp } = useContext(UserContext)
    const { botaoPatentesClicado, setBotaoPatentesClicado } = useContext(UserContext);
    const { botaoEventosClicado, setBotaoEventosClicado } = useContext(UserContext);
    
    const normalizedTitle = props.event_name
    .replace(/&quot;/g, '"')
    .replace(/&#10;/g, '\n')
    .toLowerCase();

    const ignoredWords = ['a', 'do', 'da', 'o', 'os', 'as', 'de', "e", "i", 'na', 'du', 'em']; // Adicionar outras palavras que devem ser ignoradas

    return (
        <div key={props.id} id="id_perfil" className={`group bg-white  justify-between border-solid border-gray-300 border-[1px] flex rounded-xl hover:shadow-md transition  `}>
            <div className={`h-full w-2 min-w-[8px] rounded-l-lg ${naturezaColor[props.nature as keyof typeof naturezaColor]}` }></div>
           
            <div className="flex justify-between flex-col h-full p-6 w-full">
                <div>
                <div className="flex">
                  

                    <div>
                        <h4 className="text-base font-medium ">
                        {botaoEventosClicado == false || valoresSelecionadosPopUp == ``   ? (
    `${props.event_name.toUpperCase()}`
  ) : (
    normalizedTitle
      .split(/[\s.,;?!]+/)
      .map((word, index) => {
        const formattedWord = unorm.nfkd(word).replace(/[^\w\s]/gi, '');
        const formattedValoresSelecionadosExport = unorm.nfkd(valoresSelecionadosExport).replace(/[^\w\s]/gi, '').toLowerCase();
        const formattedValorDigitadoPesquisaDireta = unorm.nfkd(valorDigitadoPesquisaDireta).replace(/[^\w\s]/gi, '').toLowerCase();
        const alphabet = Array.from({ length: 26 }, (_, index) => String.fromCharCode('a'.charCodeAt(0) + index));
        const ignoredWords = [...alphabet, 'do', 'da', 'o', 'os', 'as', 'de', 'e', 'i', 'na', 'du', 'em', ')', '('];
        let formattedSpan;

        if (
          (formattedValoresSelecionadosExport.includes(formattedWord) ||
          formattedValorDigitadoPesquisaDireta.includes(formattedWord)) &&
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
                        </h4>
                        <div className="flex items-center gap-2">
                            <CalendarBlank size={16} className="text-gray-400" />
                            <p className="text-[13px]  text-gray-500">{props.year}</p>
                        </div>
                    </div>

                </div>

            </div>

            <div className={`flex  flex-col flex-nowrap bottom-0 relative  ${isOn ? "ml-6" : ""}`}>

            

                <div className="flex  gap-4 items-center justify-between relative bottom-0S flex-wrap w-full">
                    <div className="flex gap-3 mt-8 w-full">

                        <p className="text-gray-400 rounded-md text-xs font-medium flex items-center ">{props.id}</p>
                        <div className=" flex gap-3 flex-wrap ml-auto">
                            


                            <div className="border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium gap-2 items-center"> <Ticket size={16} className="text-gray-400" /> {props.nature}</div>
                            <div className="border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium gap-2 items-center"> <IdentificationBadge size={16} className="text-gray-400" /> {props.participation}</div>

                            

                           
                        </div>

                    </div>
                </div>
            </div>



        </div>
    </div>
    )
};