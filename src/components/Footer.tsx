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
    <div className="w-full h-8 bg-white border-t-[1px] border-t-gray-300 fixed bottom-0 left-0 z-[9999] justify-between flex">
      <div className="flex items-center h-full px-12 justify-center gap-1">
        {idVersao == '1' || idVersao == '' ? (
          <p className="text-[12px] text-gray-400 font-bold md:flex hidden">Informações Analíticas da Pós-graduação | versão 1.0.1 (beta) | </p>
        ): 
        idVersao == '2' ? (
          <p className="text-[12px] text-gray-400 font-bold md:flex hidden">Sistema de Mapeamento de Competências do Profnit | versão 1.0.1 (beta) | </p>
        ):
        idVersao == '3' ? (
          <p className="text-[12px] text-gray-400 font-bold md:flex hidden">Sistema de Mapeamento de Competências do Programas de Pós Gradação  IFBA | versão 1.0.1 (beta) | </p>
        ):
        idVersao == '4'? (
          <p className="text-[12px] text-gray-400 font-bold md:flex hidden">Sistema de Mapeamento de Competências da Bahia | versão 1.0.1 (beta) | </p>
        ): ('')}
        <p onClick={() => setIsCloseHidden(!isCloseHidden)} className='text-[12px] text-gray-400 font-bold md:flex hidden hover:text-blue-400 cursor-pointer'> Créditos</p>


          {isCloseHidden == true ? (
            <div className='fixed border border-gray-300 bottom-10 left-[450px] bg-white min-h-[30px] py-4 rounded-xl min-w-[250px] transition-all'>
              <h5 className='mb-2 font-bold text-gray-400 px-4'>Créditos</h5>
              <p className='text-gray-400 text-[12px] font-medium mb-1 px-4 py-2 w-full hover:bg-blue-400 transition-all hover:text-white cursor-pointer'>Victor Hugo de Jesus Oliveira</p>
              <p className='text-gray-400 text-[12px] font-medium mb-1 px-4 py-2 w-full hover:bg-blue-400 transition-all hover:text-white cursor-pointer'>Matheus Souza dos Santos</p>
              <p className='text-gray-400 text-[12px] font-medium mb-1 px-4 py-2 w-full hover:bg-blue-400 transition-all hover:text-white cursor-pointer'>Eduardo Manuel de Freitas Jorge</p>
              <p className='text-gray-400 text-[12px] font-medium mb-1 px-4 py-2 w-full hover:bg-blue-400 transition-all hover:text-white cursor-pointer'>Gesil Sampaio Amarante Segundo</p>
              <p className='text-gray-400 text-[12px] font-medium mb-1 px-4 py-2 w-full hover:bg-blue-400 transition-all hover:text-white cursor-pointer'>Gleidson de Meireles Costa</p>
            </div>
          ): ('')}
        
      </div>

      <div className="flex items-center h-full px-12 ">
        <p className="text-[12px] text-gray-400 font-bold flex">Atualizado em {dataModificacao}</p>
      </div>
    </div>
  )
};