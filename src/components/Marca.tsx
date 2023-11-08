import { AppWindow, Book, BookOpen, CalendarBlank, File, Graph, LinkBreak, PenNib, Quotes } from "phosphor-react";
import { UserContext } from '../contexts/context'
import { useEffect, useState, useContext } from "react";

type Publicacao = {
    id: string,
    title: string,
    year: string,
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

export function Marca(props: Publicacao) {


    const { isOn, setIsOn } = useContext(UserContext)

    return (
        <div key={props.id} id="id_perfil" className={`items-center group bg-white  justify-center border-solid border-gray-300 border-[1px] flex p-6 rounded-md hover:shadow-md transition  ${isOn ? "items-center justify-center flex" : "flex-col items-baseline"}`}>
            <div className="w-full">
                <div className="flex">
                    <div className="flex flex-col justify-center">
                        <div id="mudarCorDiv" className={` h-10 w-10 rounded-md mr-4 whitespace-nowrap flex items-center justify-center border-[1px] border-gray-300`}>
                            <PenNib size={18} className="text-gray-400 whitespace-nowrap  w-10" />

                        </div>

                    </div>

                    <div>
                        <h4 className="text-base font-medium ">{props.title}</h4>
                        <div className="flex items-center gap-2">
                            <CalendarBlank size={16} className="text-gray-400" />
                            <p className="text-[13px]  text-gray-500">{props.year}</p>
                        </div>
                    </div>

                </div>


            </div>

            <div className={`flex  flex-col whitespace-nowrap ${isOn ? "ml-6" : ""}`}>


            </div>



        </div>
    )
};