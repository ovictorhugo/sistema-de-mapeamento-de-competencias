import { ChartLine, LinkBreak, PaperPlaneTilt, Question } from "phosphor-react";
import { Logo } from "./Logo";
import SearchChat from "./SearchChat";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/context";
import { Pesquisadores } from "./Pesquisadores";


export function ChatContent() {

    const { valoresSelecionadosExport, setValoresSelecionadosExport } = useContext(UserContext);



    const valoresSelecionadosJSX = valoresSelecionadosExport.split(';').map((valor, index) => (
        <li key={index} className='whitespace-nowrap gap-2 bg-blue-100 border-blue-400 border-[1px] inline-flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold'>{valor.replace(/;/g, ' ')}

        </li>
    ));



    return (
        <div className="h-full items-center flex-col justify-center w-full px-6 md:px-16">
            <div className={` w-full mb-4 h-20 justify-center items-center flex top-0`}>
                <div className=" w-full flex items-center h-12 ">
                    <Link to={"/"} className="h-[25px] "><Logo /></Link>

                    <div className="flex px-6 h-full">
                        <Link to={"/discover"} className="flex items-center h-full border-y-[2px] border-[#f9f9f9] hover:border-b-blue-400 text-gray-400 text-sm font-bold transition mr-6 gap-2"><PaperPlaneTilt size={16} className="text-gray-400" />Descobrir</Link>
                        <Link to={"/indicators"} className="flex items-center h-full border-y-[2px] border-[#f9f9f9] hover:border-b-blue-400 text-gray-400 text-sm font-bold transition mr-6 gap-2"> <ChartLine size={16} className="text-gray-400" />Indicadores</Link>
                        <Link to={""} className="flex items-center h-full border-y-[2px] border-[#f9f9f9] hover:border-b-blue-400 text-gray-400 text-sm font-bold transition mr-6 gap-2"><Question size={16} className="text-gray-400" />Dúvidas frequentes</Link>
                    </div>
                </div>
            </div>

            <div className="flex flex-col ">
                <div className="max-w-[400px] w-fit p-8 border-[1px] border-gray-300 rounded-xl mb-6 rounded-tl-none text-gray-400">Bem-vindo ao SIMCC</div>
                <div className="max-w-[400px] w-fit p-8 border-[1px] border-gray-300 rounded-xl mb-6 rounded-tl-none text-gray-400">Experimente pesquisar um termo e veja o que a plataforma pode filtrar para você.</div>
                <div className="max-w-[400px] w-fit p-8 border-[1px] border-gray-300 rounded-xl mb-6 rounded-tl-none text-gray-400">Você pode procurar os termos existente no <a href="" className="text-blue-400 font-bold flex gap-2 items-center">dicionário de palavras <LinkBreak size={16} className="text-blue-400" /></a></div>

                {valoresSelecionadosExport != "" ? (
                    <div className=" transition-all duration-500 items-center gap-4 max-w-[400px] ml-auto right-0 float-right relative w-fit p-8 border-[1px] border-blue-400 rounded-xl mb-6 rounded-tr-none text-gray-400 flex">Pesquisar pelo termo {valoresSelecionadosJSX}</div>
                ) : (
                    <div></div>
                )}

                <div className="transition-all duration-500 items-center gap-4 max-w-[400px] w-fit p-8 border-[1px] border-gray-300 rounded-xl mb-6 rounded-tl-none text-gray-400">Certo! Deseja pesquisa pelo termo pelos artigos ou resumo do pesquisador?</div>

            </div>

            {valoresSelecionadosExport != "" ? (
                <Pesquisadores />
            ) : (
                <div></div>
            )}


            <div className="fixed bottom-0 right-0  w-full px-[8%] bg-gradient-to-t from-[#f9f9f9] from-90% ">
                <SearchChat />
            </div>
        </div>
    )
}