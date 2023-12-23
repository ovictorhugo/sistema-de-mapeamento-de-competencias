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



export function Orientacoes(props: Publicacao) {


    const { isOn, setIsOn } = useContext(UserContext)

    return (
        <div className="flex border-solid bg-white  border-gray-300 border-[1px] rounded-xl hover:shadow-md transition">
            <div className={`h-full w-2 min-w-[8px] rounded-l-lg ${props.status == "Em andamento" ? ('bg-[#FCB712]') : ('bg-green-400')}` }></div>

            <div key={props.id} id="id_perfil" className={`group  justify-between flex p-6   ${isOn ? "items-center justify-center flex" : "flex-col items-baseline"}`}>
            <div>
                <div className="flex">
                

                    <div className="flex flex-col">
                        <h4 className="text-base font-medium  flex flex-wrap whitespace-normal ">{props.title.toUpperCase()}</h4>
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


            <div className={`flex w-fit  flex-col ${isOn ? "ml-6" : ""}`}>


                <div className="flex w-fit gap-4 items-center justify-between relative bottom-0S">
                    <div className="flex gap-3 w-fit">
                        <div className=" flex gap-3 flex-wrap w-fit">
                            
                            <div className="qualis border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium gap-2 items-center w-fit"><Paperclip size={16} className="text-gray-400" />  <div className="flex-1">{props.nature}</div></div>


                            <div className="border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium gap-2 items-center"> <Quotes size={16} className="text-gray-400" /> {props.type}</div>


                        </div>

                    </div>
                </div>
            </div>



        </div>
        </div>
    )
};