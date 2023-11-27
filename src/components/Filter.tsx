import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/context';
import { PuzzlePiece, SlidersHorizontal, X } from 'phosphor-react';

export function Filter() {
    const { EstadoFiltro, setEstadoFiltro } = useContext(UserContext);

    const qualisColor: { [key: string]: string } = {
        'CIENCIAS AGRARIAS': 'bg-red-400',
        'CIENCIAS EXATAS E DA TERRA': 'bg-green-400',
        'CIENCIAS DA SAUDE': 'bg-cyan-400',
        'CIENCIAS HUMANAS': 'bg-[#F5831F]',
        'CIENCIAS BIOLOGICAS': 'bg-[#EB008B]',
        'ENGENHARIAS': 'bg-[#FCB712]',
        'CIENCIAS SOCIAIS APLICADAS': 'bg-[#009245]',
        'LINGUISTICA LETRAS E ARTES': 'bg-[#A67C52]',
        'OUTROS': 'bg-[#1B1464]',
      }

      type Qualis = "A1" | "A2" | "A3" | "A4" | "B1" | "B2" | "B3" | "B4" | "B5" | "C" | "SQ" | "NP";

      const [qualis, setQualis] = useState([
        { id: 1, itens: 'CIENCIAS AGRARIAS' },
        { id: 2, itens: 'CIENCIAS EXATAS E DA TERRA' },
        { id: 3, itens: 'CIENCIAS DA SAUDE' },
        { id: 4, itens: 'CIENCIAS HUMANAS' },
        { id: 5, itens: 'CIENCIAS BIOLOGICAS' },
        { id: 6, itens: 'ENGENHARIAS' },
        { id: 7, itens: 'CIENCIAS SOCIAIS APLICADAS' },
        { id: 8, itens: 'LINGUISTICA LETRAS E ARTES' },
        { id: 10, itens: 'OUTROS' },
      ]);

      const [itensSelecionados, setItensSelecionados] = useState<string[]>([]);

      type CheckboxStates = {
        [index: number]: boolean;
      };
    
      const [checkboxStates, setCheckboxStates] = useState<CheckboxStates>({});
    
      const handleCheckboxChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const itemId = event.target.name;
        const isChecked = event.target.checked;
    
        setCheckboxStates((prevStates) => ({ ...prevStates, [itemId]: isChecked }));
    
        setItensSelecionados((prevSelecionados) => {
          const selectedQualis = qualis.find((q) => q.id === parseInt(itemId));
          if (selectedQualis) {
            if (isChecked) {
              return [...prevSelecionados, selectedQualis.itens];
            } else {
              return prevSelecionados.filter((item) => item !== selectedQualis.itens);
            }
          } else {
            // handle the case where selectedQualis is undefined
            return prevSelecionados;
          }
        });
      };
    
      const checkboxQualis = qualis.map((quali) => {
        const isChecked = checkboxStates[quali.id];
        return (
          <li
            key={quali.id}
            className={`checkboxLabel group list-none inline-flex group overflow-hidden`}
            onMouseDown={(e) => e.preventDefault()}
          >
            <label
              className={`  ${qualisColor[quali.itens]}  cursor-pointer  gap-3 flex h-8 items-center px-4 text-white rounded-md text-xs font-bold ${isChecked ? 'activeTab' : ''}`}
            >
              <PuzzlePiece size={12} className="text-white" /> 
              <span className="text-center block">{quali.itens}</span>
              <input
                type="checkbox"
                name={quali.id.toString()}
                className="absolute hidden group"
                onChange={handleCheckboxChangeInput}
                id={quali.itens}
                checked={isChecked}
              />
            </label>
          </li>
        );
      });

  return (
    <div className='' >

        {EstadoFiltro ? (
            <div className='transition  h-screen p-12 z-[9999999999] bg-white  w-[350px] border-r border-r-gray-300'>
                <div className='flex items-center gap-6 justify-between'>
                <div className='flex items-center gap-4'>
                    <SlidersHorizontal size={24} className="text-gray-400" />
                    <p className='text-gray-400 text-lg '>Filtros</p>
                </div>

                <div onClick={() => setEstadoFiltro(false)} className={`cursor-pointer rounded-full hover:bg-gray-100 h-[38px] w-[38px] transition-all flex items-center justify-center `}>
                        <X size={24} className={'rotate-180 transition-all text-gray-400'} />
                        </div>
                </div>

                <div className=''>

                <div className="gap-3 flex flex-wrap ">
              {checkboxQualis}
            </div>
                </div>
            </div>
        ): ('')}
      
      
    </div>
  )
};
