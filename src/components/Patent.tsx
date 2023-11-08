import { CalendarBlank, Check, Copyright, SpinnerGap } from "phosphor-react"

type Patente = {
    id: string,
    grant_date: string,
    title: string,
    year: string,
}


export function Patent(props: Patente) {

    return (
        <div className="w-full  hover:shadow-md transition rounded-md border-[1px] border-gray-300 p-6 flex gap-4 items-center">
            <div id="mudarCorDiv" className={` h-10 w-10 rounded-md  whitespace-nowrap flex items-center justify-center border-[1px] border-gray-300`}>
                <Copyright size={18} className="text-gray-400 whitespace-nowrap  w-10" />

            </div>
            <div>
                <h3 className="flex mb-4 text-base font-medium">{props.title}</h3>
                <div className="flex gap-4">
                    <div className={` py-2 px-4 text-white rounded-md text-xs font-bold  flex gap-2 items-center w-fit ${props.grant_date == "NaT" || props.grant_date == "None" ? ('bg-red-400') : ('bg-green-400')}`}>
                        {props.grant_date == "NaT" || props.grant_date == "None" ? (
                            <SpinnerGap size={12} className="textwhite" />
                        ) : (
                            <Check size={12} className="textwhite" />
                        )}
                        {props.grant_date == 'NaT' || props.grant_date == "None" ? "Sem concessão" : props.grant_date}</div>
                    <div className={`border-[1px] border-gray-300 py-2 px-4 text-gray-400 rounded-md text-xs font-bold flex gap-2 items-center w-fit `}><CalendarBlank size={12} /> {props.year}</div>
                    <div className={`border-[1px] border-gray-300 py-2 px-4 text-gray-400 rounded-md text-xs font-bold flex gap-2 items-center w-fit `}><CalendarBlank size={12} /> {props.id}</div>
                </div>

            </div>
        </div>
    )
}