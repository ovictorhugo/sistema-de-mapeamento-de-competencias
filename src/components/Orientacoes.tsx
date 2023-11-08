import { AppWindow, Book, BookOpen, CalendarBlank, Check, File, Graph, LinkBreak, Paperclip, Quotes, SpinnerGap, User } from "phosphor-react";
import { UserContext } from '../contexts/context'
import { useEffect, useState, useContext } from "react";

type Publicacao = {
    id: string,
    nature: string,
    oriented: string,
    status: string,
    title: string,
    type: string,
    year: string
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

export function Orientacoes(props: Publicacao) {


    const { isOn, setIsOn } = useContext(UserContext)

    return (
        <div key={props.id} id="id_perfil" className={`group bg-white  justify-between border-solid border-gray-300 border-[1px] flex p-6 rounded-md hover:shadow-md transition  ${isOn ? "items-center justify-center flex" : "flex-col items-baseline"}`}>
            <div>
                <div className="flex">
                    <div className="flex flex-col justify-center">
                        <div id="mudarCorDiv" className={` h-10 w-10 rounded-md mr-4 border-[1px] border-gray-300 whitespace-nowrap flex items-center justify-center `}>
                            <File size={18} className="text-gray-400 whitespace-nowrap  w-10" />


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

            <div className={` py-2  my-4   text-gray-400 flex rounded-md text-sm font-medium gap-2 items-center ${isOn ? "mt-0 pt-0" : ""}`}>
                <User size={16} className="textwhite" />  Orientando: {props.oriented}
            </div>


            <div className={`flex  flex-col whitespace-nowrap ${isOn ? "ml-6" : ""}`}>




                <div className="flex  gap-4 items-center justify-between relative bottom-0S">
                    <div className="flex gap-3">
                        <div className=" flex gap-3 flex-wrap">
                            <div className={` py-2 px-4 text-white rounded-md text-xs font-bold  flex gap-2 items-center w-fit ${props.status == "Em andamento" ? ('bg-[#FCB712]') : ('bg-green-400')}`}>
                                {props.status == "Em andamento" ? (
                                    <SpinnerGap size={12} className="textwhite" />
                                ) : (
                                    <Check size={12} className="textwhite" />
                                )}
                                {props.status}</div>
                            <div className="qualis border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium gap-2 items-center"><Paperclip size={16} className="text-gray-400" />  {props.nature}</div>


                            <div className="border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium gap-2 items-center"> <Quotes size={16} className="text-gray-400" /> {props.type}</div>


                        </div>

                    </div>
                </div>
            </div>



        </div>
    )
};