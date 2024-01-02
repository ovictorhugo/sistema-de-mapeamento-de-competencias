import { CaretRight, ChartLine, GitBranch, GraduationCap } from "phosphor-react";
import { Footer } from "../components/Footer";
import { LandingPage } from "../components/LandingPage";
import { Link } from "react-router-dom";

export function GridHome() {

    return  (
        <div className="grid grid-cols-3 gap-6 ">
          
        <Link to={'/programas-graduacao'} className="rounded-xl transition-all hover:scale-[95%] flex gap-8 min-h-[300px] bg-[#F4FAEC] p-6 items-center justify-between">
            <div className="flex flex-1 flex-col">
            <GraduationCap size={32} className="text-green-400 mb-8" />
            <h3 className="font-medium text-xl mb-2 text-gray-400">Veja os programas de  pós-graduação da Bahia</h3>
            <p className="text-base text-gray-400">A plataforma também permite uma busca focada apenas no programa de pós-graduação, permitindo que se encontre os pesquisadores atuantes, assim como as métricas é os índices de produção.</p>
            </div>

            <CaretRight size={20} className="text-green-400" />
        </Link >

        <Link to={'/taxonomia'} className="rounded-xl transition-all hover:scale-[95%] flex gap-8 min-h-[300px] bg-[#E9F4F4] p-6 items-center justify-between">
            <div className="flex flex-1 flex-col">
            <GitBranch size={32} className="text-cyan-400 mb-8 rotate-180" />
            <h3 className="font-medium text-xl mb-2 text-gray-400"> Agrupe termos de pesquisa com a taxonomia</h3>
            <p className="text-base text-gray-400">Como uma forma de organizar os dados de pesquisa e suprir lacunas terminológicas, o Simcc disponibiliza a página de “taxonomia”. Ao pesquisar um tema a taxonomia agrupa todos os termos relacionados</p>
            </div>

            <CaretRight size={20} className="text-cyan-400" />
        </Link >

        <Link to={'/indicators'} className="rounded-xl transition-all hover:scale-[95%] flex gap-8 min-h-[300px] bg-[#FFF5FB] p-6 items-center justify-between">
            <div className="flex flex-1 flex-col">
            <ChartLine size={32} className="text-pink-400 mb-8 " />
            <h3 className="font-medium text-xl mb-2 text-gray-400">Analise os indicadores das universidades estaduais</h3>
            <p className="text-base text-gray-400">Veja a quantidade de artigos produzidos tendo a divisão por universidade ou pesquisador. Você também pode observar os estrato qualis e as produções técnicas </p>
            </div>

            <CaretRight size={20} className="text-pink-400" />
        </Link >
        </div>
    )
}