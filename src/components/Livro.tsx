import { Book, BookOpen, CalendarBlank, File, Graph, LinkBreak, Quotes } from "phosphor-react";
import { UserContext } from '../contexts/context'
import { useEffect, useState, useContext } from "react";

type Publicacao = {
    id: string,
    title: string,
    year: string,
    isbn: string,
    publishing_company: string
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
    'NP': 'bg-[#560B11]'
}

export function Livro(props: Publicacao) {


    const { isOn, setIsOn } = useContext(UserContext)

    const {distinct, setDistinct} = useContext(UserContext)

    const ignoredWords = ['a', 'do', 'da', 'o', 'os', 'as', 'de', "e", "i", 'na', 'du', 'em']; // Adicionar outras palavras que devem ser ignoradas

    return (
        <div key={props.id} id="id_perfil" className={`group bg-white  justify-between border-solid border-gray-300 border-[1px] flex p-6 rounded-md hover:shadow-md transition  ${isOn ? "items-center justify-center flex" : "flex-col items-baseline"}`}>
            <div className="flex justify-between flex-col h-full">
                <div>
                <div className="flex">
                    <div className="flex flex-col justify-center">
                        <div id="mudarCorDiv" className={` h-10 w-10 border-gray-300 border rounded-md mr-4 whitespace-nowrap flex items-center justify-center`}>
                            <Book size={20} className="text-gray-400 whitespace-nowrap  w-10" />

                        </div>
                    </div>

                    <div>
                        <h4 className="text-base font-medium ">{props.publishing_company}</h4>
                        <div className="flex items-center gap-2">
                            <CalendarBlank size={16} className="text-gray-400" />
                            <p className="text-[13px]  text-gray-500">{props.year}</p>
                        </div>
                    </div>

                </div>

                <div className="pt-6 flex flex-wrap">
    <p className="text-gray-400 text-sm font-medium flex-wrap flex gap-1"><p/>
   {props.title}
    </p>
                </div>
            </div>

            <div className={`flex  flex-col flex-nowrap bottom-0 relative  ${isOn ? "ml-6" : ""}`}>

            

                <div className="flex  gap-4 items-center justify-between relative bottom-0S flex-wrap">
                    <div className="flex gap-3 mt-8">
                        <div className=" flex gap-3 flex-wrap">
                            


                            <div className="border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium gap-2 items-center"> <Quotes size={16} className="text-gray-400" /> Livro</div>

                            {props.isbn && (
                                <a href={`https://www.cblservicos.org.br/isbn/pesquisa/?page=1&q=${props.isbn}&filtrar_por%5B0%5D=todos&ord%5B0%5D=relevancia&dir%5B0%5D=asc`} target="_blank"  className="border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium gap-2 items-center whitespace-nowrap "><LinkBreak size={16} className="text-gray-400" />ISBN {props.isbn}</a>
                            )}

                           
                        </div>

                    </div>
                </div>
            </div>



        </div>
    </div>
    )
};