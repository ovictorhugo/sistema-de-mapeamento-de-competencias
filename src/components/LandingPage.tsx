import { Link } from "react-router-dom";
import { Ilustracao } from "./Ilustracao";
import { Logo } from "./Logo";
import { ChartLine, CursorText, Funnel, HouseSimple, Lightbulb, MagnifyingGlass, PaperPlaneTilt, Plus, Question, TextAlignLeft, User, X, YoutubeLogo } from "phosphor-react";
import { Header } from "./Header";

import woman from '../assets/woman.png';

export function LandingPage() {

    return (
        <div className="h-screen">
            <Header />

            <div className="w-full overflow-hidden  absolute z-[-999]">
                <Ilustracao />

                <div className=" relative h-[400px] top-[-400px] bg-gradient-to-t from-[#f9f9f9]"></div>
            </div>

            <div className="h-[75vh] mt-20 flex flex-col justify-center items-center">
                <h1 className="text-center z-10 text-black lg:leading-[3.5rem] max-w-[800px] font-light text-5xl mb-4">Saiba como <strong className="bg-red-400 text-white hover:bg-red-500 transition duration-500">pesquisar na plaforma</strong> e achar resultados de forma rápida</h1>
                <p className="text-center text-lg max-w-[800px] text-gray-400">Pesquise e filtre as informações dos pesquisadores, publicações e instituições da rede de Universidade Estaduais. Melhore sua eficiência na busca por informações com dicas simples e úteis</p>

                <div className="mt-10 flex gap-4">
                    <Link to={"/"} className=" h-10 whitespace-nowrap flex items-center gap-4 bg-blue-400 text-white rounded-full px-6 py-2 justify-center hover:bg-blue-500  font-medium transition" ><HouseSimple size={16} className="text-white" /> Página Inicial</Link>
                    <Link to={"/indicators"} className=" h-10 whitespace-nowrap flex items-center gap-4  text-blue-400 rounded-full px-6 py-2 justify-center hover:bg-gray-100  font-medium transition" ><ChartLine size={16} className="text-blue-400" /> Indicadores</Link>
                </div>
            </div>

            <div className="w-full flex justify-center  px-6 md:px-16">
                <div className=" p-24 m-[0 auto] w-full rounded-lg bg-blue-400 items-center grid grid-cols-2 gap-12 bg-opacity-10 backdrop-blur-sm">
                    <div>
                        <h3 className="text-3xl font-bold text-gray-400 max-w-[500px] mb-4">O que a plataforma pode <strong className="bg-blue-400 text-white">fazer</strong> e como ela pode te <strong className="bg-blue-400 text-white">auxiliar</strong>?</h3>
                        <p className=" text-gray-400 mb-8">O Sistema de Mapeamento de Competências da Bahia é uma plataforma desenvolvida com o objetivo de auxiliar na seleção e filtragem de pesquisadores das universidades estaduais. Esta plataforma tem um potencial facilitar o processo de identificação e escolha dos profissionais mais qualificados em suas respectivas áreas de atuação.</p>

                        <Link to={"/indicators"} className="w-fit whitespace-nowrap flex items-center gap-4 bg-blue-400 text-white rounded-full px-6 py-2 justify-center hover:bg-blue-500  font-medium transition">
                            <YoutubeLogo size={16} className="text-white" /> Assistir vídeo
                        </Link>
                    </div>

                    <div className="flex-1 h-full flex items-center"> <img src={woman} alt="" className="w-full" /> </div>

                </div>
            </div>

            <div className="grid grid-cols-2 py-24 gap-12">
                <div className="w-full max-w-[640px] ml-auto">
                    <h3 className="font-light text-4xl mb-4">1. Use <strong className="bg-blue-400 text-white hover:bg-blue-500 transition duration-500">palavras-chave</strong> específicas</h3>
                    <p className="text-lg text-gray-400">
                        Tente usar palavras-chave específicas que descrevem o tópico que você está procurando. Por exemplo, em vez de pesquisar por "robótica", pesquise por "robótica educacional".
                    </p>
                </div>


                <div className="flex items-center justify-end">
                    <div className={`flex bg-white  scale-125 left-[-60px] relative  items-center h-14 group  text-base font-medium  justify-center transition border-[1px] border-gray-300  rounded-l-full`}>
                        <MagnifyingGlass size={20} className={`text-gray-400 min-w-[52px] `} />
                        <div className='flex gap-2 mx-2'></div>
                        <input
                            type="text"
                            name=""
                            placeholder={'Pesquise um termo, resumo, área ou pesquisador'}
                            id=""
                            className="min-w-[400px] w-full h-full outline-none" />
                    </div>
                </div>

            </div>


            <div className="grid grid-cols-2 py-24 gap-12">
                <div className="flex items-center h-full ">
                    <div className='bg-white scale-125 pl-12 h-[52px] p-2 flex gap-2 rounded-r-full border-[1px] border-gray-300 border-l-0'>

                        <div className="cursor-pointer text-sm rounded-full text-gray-400 flex items-center border-[1px] border-white gap-2 px-4 py-2 font-semibold hover:bg-blue-100 transition" >
                            <CursorText size={16} className="text-gray-400" />
                            Termos
                        </div>

                        <div className="cursor-pointer text-sm rounded-full text-gray-400 flex items-center border-[1px] border-white gap-2 px-4 py-2 font-semibold hover:bg-blue-100 transition" >
                            <TextAlignLeft size={16} className="text-gray-400" />
                            Resumo
                        </div>

                        <div className="cursor-pointer text-sm text-gray-400 rounded-full flex items-center gap-2 px-4 py-2 font-semibold hover:bg-blue-100 transition" >
                            <Lightbulb size={16} className="text-gray-400" />
                            Áreas
                        </div>

                        <div className="cursor-pointer text-sm text-gray-400 rounded-full flex items-center gap-2  px-4 py-2 font-semibold hover:bg-blue-100 transition"  >
                            <User size={16} className="text-gray-400" />
                            Pesquisadores
                        </div>

                        <div className='flex items-center justify-center'>
                            <div className='absolute z[-999] animate-ping gap-4 bg-blue-400 text-white rounded-full h-[28px] w-[28px] justify-center hover:bg-blue-500  font-medium transition'></div>
                            <div className='cursor-pointer flex z-[999] relative  items-center gap-4 bg-blue-400 text-white rounded-full h-[38px] w-[38px] justify-center hover:bg-blue-500  font-medium transition'><Funnel size={16} className="text-white" /></div>
                        </div>

                    </div>
                </div>

                <div className="w-full max-w-[640px] mr-auto">
                    <h3 className="font-light text-4xl mb-4">2. Use <strong className="bg-blue-400 text-white hover:bg-blue-500 transition duration-500">filtros</strong> de pesquisa</h3>
                    <p className="text-lg text-gray-400">
                        Você pode usar os filtros de pesquisa na plataforma para limitar os resultados da pesquisa com base em diferentes critérios, como buscar por Pesquisador específico, filtrar por área ou usando as palavras-chaves no termo.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 py-24">
                <div className="w-full max-w-[640px] ml-auto">
                    <h3 className="font-light text-4xl mb-4">3. Use <strong className="bg-blue-400 text-white hover:bg-blue-500 transition duration-500">palavras-chave</strong> específicas</h3>
                    <p className="text-lg text-gray-400">
                        Tente usar palavras-chave específicas que descrevem o tópico que você está procurando. Por exemplo, em vez de pesquisar por "robótica", pesquise por "robótica educacional".
                    </p>
                </div>

                <div className="">


                </div>
            </div>
        </div>
    )
}