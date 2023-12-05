import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/context';

export function Footer() {
  const { idVersao, setIdVersao } = useContext(UserContext);
  const [dataModificacao, setDataModificacao] = useState('');

  useEffect(() => {
    const dataAtual = new Date();
    const dataFormatada = `${dataAtual.getDate()}/${dataAtual.getMonth() + 1}/${dataAtual.getFullYear()}`;

    
    setDataModificacao(dataFormatada);
  }, []);

  const [isCloseHidden, setIsCloseHidden] = useState(false); //Produção geral

  return (
    <div className="w-full h-8 bg-white border-t-[1px] border-t-gray-300 fixed bottom-0 left-0 z-[999999999999] justify-between flex">
      <div className="flex items-center h-full px-12 justify-center gap-1">
        {idVersao == '1' || idVersao == '' ? (
          <p className="text-[12px] text-gray-400 font-bold md:flex hidden">Informações Analíticas da Pós-graduação | versão 1.0.1 (beta) | </p>
        ): 
        idVersao == '2' ? (
          <p className="text-[12px] text-gray-400 font-bold md:flex hidden">Sistema de Mapeamento de Competências do Profnit | versão 1.0.1 (beta) | </p>
        ):
        idVersao == '3' ? (
          <p className="text-[12px] text-gray-400 font-bold md:flex hidden">Sistema de Mapeamento de Competências do Programas de Pós Gradação  IFBA | versão 1.0.5 (beta) </p>
        ):
        idVersao == '4'? (
          <p className="text-[12px] text-gray-400 font-bold md:flex hidden">Sistema de Mapeamento de Competências da Bahia | versão 1.0.5 (beta) </p>
        ): ('')}



         
        
      </div>

      <div className="flex items-center h-full px-12 ">
        <p className="text-[12px] text-gray-400 font-bold flex">Atualizado em {dataModificacao}</p>
      </div>
    </div>
  )
};