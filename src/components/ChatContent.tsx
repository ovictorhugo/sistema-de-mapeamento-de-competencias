import React, { useContext, useEffect, useState } from 'react';
import { Header } from './Header';
import { Books, Copyright, Funnel, IdentificationCard, Lightbulb, MagnifyingGlass, PaperPlaneTilt, Plus, Quotes, TextAlignLeft, Ticket, Trash, X } from 'phosphor-react';
import compromise from 'compromise';
import nlp from 'compromise'
import { UserContext } from '../contexts/context';
import axios from 'axios';

import {AiChat} from '@nlux/react';
import {useAdapter} from '@nlux/openai-react';
import Typical from 'react-typical'
import {useChat} from 'ai/react'



import { Configuration, OpenAIApi} from 'openai-edge'
import {OpenAIStream, StreamingTextResponse} from 'ai'
import { SvgMaria } from './SvgMaria';


const config = new Configuration({
  apiKey: import.meta.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(config)

console.log(import.meta.env.OPENAI_API_KEY)

// Definindo os tipos disponíveis
type ResourceType =
  | 'Artigo'
  | 'Resumo'
  | 'Nome'
  | 'Livros e capítulos'
  | 'Áreas'
  | 'Participação em eventos'
  | 'Patentes';

  interface PalavrasChaves {
    frequency: string
    term: string
    checked: boolean
    area_expertise: string
    area_specialty: string
  }

  interface Maria {
   role: string
   content: string
  }

  interface Post {
    frequency: string
    term: string
    checked: boolean
    type: string
  }
  
  interface Pesquisadores {
    id: string
    name: string
  }
  
  interface Area {
    id: string
    area_expertise: string,
    area_specialty: string
  }
  
  interface Patente {
    frequency: string
    term: string
  }
  
  interface Bigrama {
    freq: number
    word: string
  }



export function ChatContent() {
  
  const [inputValue, setInputValue] = useState<string>('');
  const [result, setResult] = useState<{ term: string; type: ResourceType } | null>(null);
  const { user, setUser } = useContext(UserContext);
  const [isTab, setIsTab] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<Maria[]>([]);
  const { botaoPatentesClicado, setBotaoPatentesClicado } = useContext(UserContext);
    const { botaoPesquisadoresClicado, setBotaoPesquisadoresClicado } = useContext(UserContext);
    const { botaoTermosClicado, setBotaoTermosClicado } = useContext(UserContext);
    const { botaoResumoClicado, setBotaoResumoClicado } = useContext(UserContext);
    const { botaoAreasClicado, setBotaoAreasClicado } = useContext(UserContext);
    const { botaoLivrosCapitulosClicado, setBotaoLivrosCapitulosClicado } = useContext(UserContext);
    const { botaoEventosClicado, setBotaoEventosClicado } = useContext(UserContext);
    const { urlGeral, setUrlGeral } = useContext(UserContext);

    let now = new Date

    setBotaoTermosClicado(false)

    let hora = now.getHours() + "h" + now.getMinutes()+ "min"

    

    const [words, setWords] = useState<PalavrasChaves[]>([]);

    let urlTerms = urlGeral + `/originals_words?initials=todostermos&type=ARTICLE`;
 


  useEffect(() => {
    const fetchData = async () => {

      try {
        const response = await fetch(urlTerms, {
          mode: 'cors',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600',
            'Content-Type': 'text/plain'
          }
        });
        const data = await response.json();
        if (data) {
          setWords(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
      }
    };
    fetchData();
  }, [urlTerms]);




  ///////////////////////////




  //////////////////////////////////////




  const handleMaria = () => {
    setIsLoading(false)
    try {
      const data =  {
            model: null,
            messages: [
              {
                role: "system",
                content: "Você é um chatbot chamado Maria, e você faz listagens e consultas sobre temas academicos. Fale em português brasil",
            },
              {
                  role: "user",
                  content: inputValue,
              },
            ]
          }
      

      console.log(data);
     
      const urlProgram = urlGeral + 'Maria';

      const fetchData = async () => {
        try {
          const response = await fetch(urlProgram, {
            method: 'POST',
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST',
              'Access-Control-Allow-Headers': 'Content-Type',
              'Access-Control-Max-Age': '3600',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            console.log('Dados enviados com sucesso!');
            setIsLoading(true)
            
          } else {
            console.error('Erro ao enviar dados para o servidor.');
          }

    
          const dataGet = await response.json();
          if (dataGet) {
            setMessages(dataGet);
         
          }
        } catch (err) {
          console.log(err);
        }
      };

      fetchData();
    } catch (error) {
      console.error('Erro ao processar a requisição:', error);
    }
  }

  console.log(`messages`, messages)

   //estado btns 
   const { idGraduateProgram, setIdGraduateProgram } = useContext(UserContext)

   if(idGraduateProgram == '0') {
     setIdGraduateProgram('')
   }


   const [resultados, setResultados] = useState<Post[]>([]);
   const [resultadosResumo, setResultadosResumo] = useState<Post[]>([]);
   const [resultadosLivros, setResultadosLivros] = useState<Post[]>([]);
   const [resultadosEventos, setResultadosEventos] = useState<Post[]>([]);
   const [resultadosPesquisadores, setResultadosPesquisadores] = useState<Pesquisadores[]>([]);
   const [resultadosArea, setResultadosArea] = useState<Area[]>([]);
   const [resultadosPatentes, setResultadosPatentes] = useState<Patente[]>([]);
   const [resultadosBigrama, setResultadosBigrama] = useState<Bigrama[]>([]);

  // pesquisa normal
  function enviarRequisicao() {
    const pesquisaInputFormatado = inputValue.trim().replace(/\s+/g, ";");
  const url = urlGeral + `/originals_words?initials=${pesquisaInputFormatado}&type=ARTICLE`;
  const urlResumo = urlGeral + `/originals_words?initials=${pesquisaInputFormatado}&type=ABSTRACT&graduate_program_id=${idGraduateProgram}`;
  const urlPesquisador = urlGeral + `/reasercherInitials?initials=${pesquisaInputFormatado}&graduate_program_id=${idGraduateProgram}`
  const urlArea = urlGeral + `/area_specialitInitials?initials=${inputValue.trim()}&area=&graduate_program_id=${idGraduateProgram}`;
  const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
  const urlBigrama = urlGeral +  `secondWord?term=${pesquisaInputFormatado}`
  const urlPatente = urlGeral + `/originals_words?initials=${pesquisaInputFormatado}&type=PATENT`
  const urlLivro = urlGeral + `/originals_words?initials=${pesquisaInputFormatado}&type=BOOK`
  const urlEvento = urlGeral + `/originals_words?initials=${pesquisaInputFormatado}&type=SPEAKER`

 
    fetch(url, {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '3600',
        'Content-Type': 'text/plain'

      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const newData = data.map((post: Post) => ({
          ...post,
          term: post.term.replace(/\s+/g, ";")
        }));
        setResultados([]);
        setResultados(newData);
      })
      .catch((err) => {
        console.log(err.message);
      });
  
       //Resumo

    fetch(urlResumo, {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '3600',
        'Content-Type': 'text/plain'

      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const newData = data.map((post: Post) => ({
          ...post,
          term: post.term.replace(/\s+/g, ";")
        }));
        setResultadosResumo([]);
        setResultadosResumo(newData);
      })
      .catch((err) => {
        console.log(err.message);
      });

          //Evento

    fetch(urlEvento, {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '3600',
        'Content-Type': 'text/plain'

      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const newData = data.map((post: Post) => ({
          ...post,
          term: post.term.replace(/\s+/g, ";")
        }));
        setResultadosEventos([]);
        setResultadosEventos(newData);
      })
      .catch((err) => {
        console.log(err.message);
      });

  //Livros e cap



    fetch(urlLivro, {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '3600',
        'Content-Type': 'text/plain'

      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const newData = data.map((post: Post) => ({
          ...post,
          term: post.term.replace(/\s+/g, ";")
        }));
        setResultadosLivros([]);
        setResultadosLivros(newData);
      })
      .catch((err) => {
        console.log(err.message);
      });

  

  // Pesquisador


    fetch(urlPesquisador, {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '3600',
        'Content-Type': 'text/plain'


      }
    })

      .then((response) => response.json())
      .then((data) => {
        ;
        const newDataPesquisadores = data.map((post: Pesquisadores) => ({
          ...post,
          name: post.name.replace(/\s+/g, "%20")
        }));
        setResultadosPesquisadores([]);
        setResultadosPesquisadores(newDataPesquisadores);

      })
      .catch((err) => {
        console.log(err.message);
      });
  


  //Area

    fetch(urlArea, {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '3600',
        'Content-Type': 'text/plain'

      }
    })

      .then((response) => response.json())
      .then((data) => {
        ;
        const newDataArea = data.map((post: Area) => ({
          ...post,
          name: post.area_specialty.replace(/\s+/g, "%20")
        }));
        setResultadosArea([]);
        setResultadosArea(newDataArea);
      })
      .catch((err) => {
        console.log(err.message);
      });


      //patente
      fetch(urlPatente, {
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '3600',
          'Content-Type': 'text/plain'

        }
      })

        .then((response) => response.json())
        .then((data) => {
          ;
          const newDataArea = data.map((post: Patente) => ({
            ...post,
            name: post.term.replace(/\s+/g, "%20")
          }));
          setResultadosPatentes([]);
          setResultadosPatentes(newDataArea);
        })
        .catch((err) => {
          console.log(err.message);
        });
        console.log('patente', urlPatente)
  }

 

  



// CHECKBOX ENVIAAAR

const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setChecked(event.target.checked);
  const name = event.target.name;
  const checked = event.target.checked;
  setResultados(resultados.map(checkbox => {
    if (checkbox.term === name) {
      return { ...checkbox, checked };
    }
    return checkbox;
  }));
};

//AHHHHHHHHHHHHH

const [checked, setChecked] = useState(false);

//estado btns 
const [selectedTab, setSelectedTab] = useState(0);

//Se o botão Pesquisadores for clicado
const handleClickPesquisadores = () => {
  setBotaoPesquisadoresClicado(true);
  setBotaoPatentesClicado(false)
  setBotaoTermosClicado(false);
  setBotaoAreasClicado(false);
  setBotaoResumoClicado(false)
  setBotaoEventosClicado(false)
  setBotaoLivrosCapitulosClicado(false)
  //Apagar checkbox ao mudar de aba - termos

  setResultadosPesquisadores([])
  setResultados([])
  setResultadosPesquisadores([])
  setResultadosResumo([])
  setResultadosPatentes([])
  setResultadosEventos([])
  setResultadosLivros([])

  setSelectedTab(3);
};

//patentes
const handleClickPatentes = () => {
  setBotaoPesquisadoresClicado(false);
  setBotaoPatentesClicado(true)
  setBotaoTermosClicado(false);
  setBotaoAreasClicado(false);
  setBotaoResumoClicado(false)
  setBotaoEventosClicado(false)
  setBotaoLivrosCapitulosClicado(false)

  setResultadosPesquisadores([])
  setResultados([])
  setResultadosPesquisadores([])
  setResultadosResumo([])
  setResultadosPatentes([])
  setResultadosEventos([])
  setResultadosLivros([])
  setSelectedTab(4);
};

//Se o botão Termos for clicado
const handleClickTermos = () => {
  setBotaoPesquisadoresClicado(false);
  setBotaoPatentesClicado(false)
  setBotaoTermosClicado(true);
  setBotaoAreasClicado(false);
  setBotaoResumoClicado(false)
  setBotaoEventosClicado(false)
  setBotaoLivrosCapitulosClicado(false)

  setResultadosPesquisadores([])
  setResultados([])
  setResultadosPesquisadores([])
  setResultadosResumo([])
  setResultadosPatentes([])
  setResultadosEventos([])
  setResultadosLivros([])
  setSelectedTab(0);
};

const handleClickResumo = () => {
  setBotaoPesquisadoresClicado(false);
  setBotaoResumoClicado(true);
  setBotaoPatentesClicado(false)
  setBotaoAreasClicado(false);
  setBotaoTermosClicado(false)
  setBotaoEventosClicado(false)
  setBotaoLivrosCapitulosClicado(false)
  setResultadosPesquisadores([])
  setResultados([])
  setResultadosPesquisadores([])
  setResultadosResumo([])
  setResultadosPatentes([])
  setResultadosEventos([])
  setResultadosLivros([])

  setSelectedTab(1);

};

//Se o botão Areas for clicado
const handleClickAreas = () => {
  setBotaoAreasClicado(true);
  setBotaoPesquisadoresClicado(false);
  setBotaoPatentesClicado(false)
  setBotaoTermosClicado(false);
  setBotaoResumoClicado(false)
  setBotaoEventosClicado(false)
  setBotaoLivrosCapitulosClicado(false)
  //Apagar checkbox ao mudar de aba - pesqisadores

  setResultadosPesquisadores([])
  setResultados([])
  setResultadosPesquisadores([])
  setResultadosResumo([])
  setResultadosPatentes([])
  setResultadosEventos([])
  setResultadosLivros([])
  setSelectedTab(2);
};

//Se o botão Livros for clicado
const handleClickLivrosCapitulos = () => {
  setBotaoAreasClicado(false);
  setBotaoPesquisadoresClicado(false);
  setBotaoPatentesClicado(false)
  setBotaoTermosClicado(false);
  setBotaoResumoClicado(false)
  setBotaoEventosClicado(false)
  setBotaoLivrosCapitulosClicado(true)
  //Apagar checkbox ao mudar de aba - pesqisadores

  setResultadosPesquisadores([])
  setResultados([])
  setResultadosPesquisadores([])
  setResultadosResumo([])
  setResultadosPatentes([])
  setResultadosEventos([])
  setResultadosLivros([])

  setSelectedTab(5);
};

const handleClickEventos = () => {
  setBotaoAreasClicado(false);
  setBotaoPesquisadoresClicado(false);
  setBotaoPatentesClicado(false)
  setBotaoTermosClicado(false);
  setBotaoResumoClicado(false)
  setBotaoEventosClicado(true)
  setBotaoLivrosCapitulosClicado(false)
  //Apagar checkbox ao mudar de aba - pesqisadores

  setResultadosPesquisadores([])
  setResultados([])
  setResultadosArea([])
  setResultadosPatentes([])
  setResultadosResumo([])
  setResultadosLivros([])

  setSelectedTab(6);
};

const handleClickClose = () => {
  setBotaoAreasClicado(false);
  setBotaoPesquisadoresClicado(false);
  setBotaoPatentesClicado(false)
  setBotaoTermosClicado(false);
  setBotaoResumoClicado(false)
  setBotaoEventosClicado(false)
  setBotaoLivrosCapitulosClicado(false)
  //Apagar checkbox ao mudar de aba - pesqisadores

  setResultadosPesquisadores([])
  setResultados([])
  setResultadosArea([])
  setResultadosPatentes([])
  setResultadosResumo([])
  setResultadosLivros([])

  setSelectedTab(0);
  setIsTab(!isTab)
};


const { idVersao, setIdVersao } = useContext(UserContext);

const urlGraduateProgram = `${urlGeral}/graduate_program_profnit?id=${idVersao}`;

useEffect(() => {
const fetchData = async () => {
  try {
    const response = await fetch(urlGraduateProgram, {
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "3600",
        "Content-Type": "text/plain",
      },
    });
    const data = await response.json();
    if (data) {
      
    }
  } catch (err) {
    console.log(err);
  }
};
fetchData();
}, [urlGraduateProgram]);


//CURRET PAGE




//checkbo

//checked do input search

// Lógica para adicionar valor do checbok no input Search e atualizar pesquisa

// Pesquisador
const [pesquisadoresSelecionados, setPesquisadoresSelecionados] = useState<string[]>([]);

const handleCheckboxChangeInputPesquisadores = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { name } = event.target;
  const isChecked = event.target.checked;

  setPesquisadoresSelecionados((prevSelecionados) => {
    if (isChecked) {
      return [...prevSelecionados, name];
    } else {
      return prevSelecionados.filter((item) => item !== name);
    }
  });
};

const [currentPesquisadores, setCurrentPesquisadores] = useState(1);
const resultsPerPage = 6;

const indexOfLastResultPesquisadores = currentPesquisadores * resultsPerPage;
const indexOfFirstResultPesquisadores = indexOfLastResultPesquisadores - resultsPerPage;
const totalPagesPesquisadores = Math.ceil(resultadosPesquisadores.length / resultsPerPage);




const currentResultsPesquisadores = resultadosPesquisadores.slice(indexOfFirstResultPesquisadores, indexOfLastResultPesquisadores);


const checkboxPesquisadores = currentResultsPesquisadores.map((resultado) => (
  <li
    key={resultado.name}
    className="checkboxLabel group list-none inline-flex mr-4 mb-4 group overflow-hidden"
    onMouseDown={(e) => e.preventDefault()}
  >
    <label className="group-checked:bg-blue-400 cursor-pointer border-[1px] bg-blue-100 border-blue-400 hover:text-blue-400 flex h-10 items-center px-4 text-gray-400 rounded-lg text-xs font-bold hover:border-blue-400 hover:bg-blue-100">
      <span className="text-center block">{resultado.name.replace(/%20/g, ' ')}</span>
      <input
        type="checkbox"
        name={resultado.name}
        className="absolute hidden group"
        checked={pesquisadoresSelecionados.includes(resultado.name)}
        id={resultado.name}
        onChange={handleCheckboxChangeInputPesquisadores}
        onClick={handleClickPesquisadores}
      />
    </label>
  </li>
));

const valoresPesquisadoresSelecionados = pesquisadoresSelecionados.join(';');

const valoresPesquisadoresSelecionadosJSX = pesquisadoresSelecionados.map((valor, index) => (
  <li key={index} className='whitespace-nowrap gap-2 bg-[#FEE9E9] border-red-400 border-[1px] inline-flex h-10 items-center px-4 text-gray-400 rounded-lg text-xs font-bold'>{valor.replace(/%20/g, ' ')}
    <button onClick={() => handleRemoverSelecionadoPesquisadores(index)}><X size={16} className="text-gray-400 hover:text-red-400" /></button>
  </li>
));

const handleRemoverSelecionadoPesquisadores = (index: number) => {
  setPesquisadoresSelecionados((prevSelecionados) =>
    prevSelecionados.filter((_, i) => i !== index)
  );
};

// Livro
const [livrosSelecionados, setLivrosSelecionados] = useState<string[]>([]);

const handleCheckboxChangeInputLivros = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { name } = event.target;
  const isChecked = event.target.checked;

  setLivrosSelecionados((prevSelecionados) => {
    if (isChecked) {
      return [...prevSelecionados, name];
    } else {
      return prevSelecionados.filter((item) => item !== name);
    }
  });
};


const checkboxLivros = resultadosLivros.map((resultado) => (
  <li
    key={resultado.term}
    className="checkboxLabel group list-none inline-flex mr-4 mb-4 group overflow-hidden"
    onMouseDown={(e) => e.preventDefault()}
  >
    <label className="group-checked:bg-blue-400 cursor-pointer border-[1px] bg-blue-100 border-blue-400 hover:text-blue-400 flex h-10 items-center px-4 text-gray-400 rounded-lg text-xs font-bold hover:border-blue-400 hover:bg-blue-100">
      <span className="text-center block">{resultado.term.replace(/%20/g, ' ')}</span>
      <input
        type="checkbox"
        name={resultado.term}
        className="absolute hidden group"
        checked={livrosSelecionados.includes(resultado.term)}
        id={resultado.term}
        onChange={handleCheckboxChangeInputLivros}
        onClick={handleClickLivrosCapitulos}
      />
    </label>
  </li>
));

const valoresLivrosSelecionados = livrosSelecionados.join(';');

const valoresLivrosSelecionadosJSX = livrosSelecionados.map((valor, index) => (
  <li key={index} className='whitespace-nowrap gap-2 bg-[#FFF5FB] border-pink-400 border-[1px] inline-flex h-10 items-center px-4 text-gray-400 rounded-lg text-xs font-bold'>{valor.replace(/%20/g, ' ')}
    <button onClick={() => handleRemoverSelecionadoLivros(index)}><X size={16} className="text-gray-400 hover:text-pink-400" /></button>
  </li>
));

const handleRemoverSelecionadoLivros = (index: number) => {
  setLivrosSelecionados((prevSelecionados) =>
    prevSelecionados.filter((_, i) => i !== index)
  );
};

// Area
const [areasSelecionados, setAreasSelecionados] = useState<string[]>([]);

const handleCheckboxChangeInputArea = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { name } = event.target;
  const isChecked = event.target.checked;

  setAreasSelecionados((prevSelecionados) => {
    if (isChecked) {
      return [...prevSelecionados, name];
    } else {
      return prevSelecionados.filter((item) => item !== name);
    }
  });
};

const [currentArea, setCurrentArea] = useState(1);


const indexOfLastResultArea = currentArea * resultsPerPage;
const indexOfFirstResultArea = indexOfLastResultArea - resultsPerPage;
const totalPages = Math.ceil(resultadosArea.length / resultsPerPage);




const currentResultsArea = resultadosArea.slice(indexOfFirstResultArea, indexOfLastResultArea);



const checkboxAreas = currentResultsArea.map((resultado) => (
  <li
    key={resultado.id}
    className="checkboxLabel group list-none inline-flex mr-4 mb-4 group overflow-hidden"
    onMouseDown={(e) => e.preventDefault()}
  >
    <label className="group-checked:bg-blue-400 border-[1px] cursor-pointer bg-blue-100 border-blue-400 hover:text-blue-400 flex h-10 items-center px-4 text-gray-400 rounded-lg text-xs font-bold hover:border-blue-400 hover:bg-blue-100">
      <span className="text-center block">{resultado.area_specialty.replace(/%20/g, ' ')} | {resultado.area_expertise.replace(/%20/g, ' ')}</span>
      <input
        type="checkbox"
        name={`${resultado.area_specialty} | ${resultado.area_expertise}`}
        className="absolute hidden group"
        checked={areasSelecionados.includes(`${resultado.area_specialty} | ${resultado.area_expertise}`)}
        id={resultado.area_specialty}
        onChange={handleCheckboxChangeInputArea}
        onClick={handleClickAreas}
      />
    </label>
  </li>
));


const valoresAreasSelecionados = areasSelecionados.join(';');


const valoresAreasSelecionadosJSX = areasSelecionados.map((valor, index) => (
  <li
    key={index}
    className="whitespace-nowrap gap-2 bg-[#F4FAEC] border-green-400 border-[1px] inline-flex h-10 items-center px-4 text-gray-400 rounded-lg text-xs font-bold"
  >
    {valor}
    <button onClick={() => handleRemoverSelecionadoAreas(index)}>
      <X size={16} className="text-gray-400 hover:text-green-400" />
    </button>
  </li>
));


const handleRemoverSelecionadoAreas = (index: number) => {
  setAreasSelecionados((prevSelecionados) =>
    prevSelecionados.filter((_, i) => i !== index)
  );
};


// Termos 
const [itensSelecionados, setItensSelecionados] = useState<string[]>([]);

const handleCheckboxChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { name } = event.target;
  const isChecked = event.target.checked;

  setItensSelecionados((prevSelecionados) => {
    if (isChecked) {
      return [...prevSelecionados, name];
    } else {
      return prevSelecionados.filter((item) => item !== name);
    }
  });
};

const checkboxItems = resultados.slice(0, 6).map((resultado) => (
  <li
    key={resultado.term}
    className="checkboxLabel group list-none inline-flex mr-4 mb-4 group overflow-hidden"
    onMouseDown={(e) => e.preventDefault()}
  >
    <label className="group-checked:bg-blue-400 cursor-pointer border-[1px] bg-blue-100 border-blue-400 hover:text-blue-400 flex h-10 items-center px-4 text-gray-400 rounded-lg text-xs font-bold hover:border-blue-400 hover:bg-blue-100">
      <span className="text-center block">{resultado.term.replace(/;/g, ' ')}</span>
      <input
        type="checkbox"
        name={resultado.term}
        className="absolute hidden group"
        checked={itensSelecionados.includes(resultado.term)}
        id={resultado.term}
        onChange={handleCheckboxChangeInput}
        onClick={handleClickTermos}
      />
    </label>
  </li>
));

let valoresSelecionados = itensSelecionados.join(';');

const valoresSelecionadosJSX = itensSelecionados.map((valor, index) => (
  <li key={index} className='whitespace-nowrap gap-2 bg-blue-100 border-blue-400 border-[1px] inline-flex h-10 items-center px-4 text-gray-400 rounded-lg text-xs font-bold'>{valor.replace(/;/g, ' ')}
    <button onClick={() => handleRemoverSelecionado(index)}><X size={16} className="text-gray-400 hover:text-blue-400" /></button>
  </li>
));



const handleRemoverSelecionado = (index: number) => {
  setItensSelecionados((prevSelecionados) =>
    prevSelecionados.filter((_, i) => i !== index)
  );
};



// Resumo
const [itensSelecionadosResumo, setItensSelecionadosResumo] = useState<string[]>([]);

const handleCheckboxChangeInputResumo = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { name } = event.target;
  const isChecked = event.target.checked;

  setItensSelecionadosResumo((prevSelecionados) => {
    if (isChecked) {
      return [...prevSelecionados, name];
    } else {
      return prevSelecionados.filter((item) => item !== name);
    }
  });
};

const checkboxItemsResumo = resultadosResumo.slice(0, 6).map((resultado) => (
  <li
    key={resultado.term}
    className="checkboxLabel group list-none inline-flex mr-4 mb-4 group overflow-hidden"
    onMouseDown={(e) => e.preventDefault()}
  >
    <label className="group-checked:bg-blue-400 cursor-pointer border-[1px]  bg-blue-100 border-blue-400 hover:text-blue-400 flex h-10 items-center px-4 text-gray-400 rounded-lg text-xs font-bold hover:border-blue-400 hover:bg-blue-100">
      <span className="text-center block">{resultado.term.replace(/;/g, ' ')}</span>
      <input
        type="checkbox"
        name={resultado.term}
        className="absolute hidden group"
        checked={itensSelecionadosResumo.includes(resultado.term)}
        id={resultado.term}
        onChange={handleCheckboxChangeInputResumo}
        onClick={handleClickResumo}
      />
    </label>
  </li>
));
const valoresResumoSelecionados = itensSelecionadosResumo.join(';');

const valoresSelecionadosResumoJSX = itensSelecionadosResumo.map((valor, index) => (
  <li key={index} className='whitespace-nowrap gap-2 bg-[#FFFAE6] border-yellow-400 border-[1px] inline-flex h-10 items-center px-4 text-gray-400 rounded-lg text-xs font-bold'>{valor.replace(/;/g, ' ')}
    <button onClick={() => handleRemoverSelecionadoResumo(index)}><X size={16} className="text-gray-400 hover:text-yellow-400" /></button>
  </li>
));

const handleRemoverSelecionadoResumo = (index: number) => {
  setItensSelecionadosResumo((prevSelecionados) =>
    prevSelecionados.filter((_, i) => i !== index)
  );
};

// Resumo
const [itensSelecionadosEvento, setItensSelecionadosEvento] = useState<string[]>([]);

const handleCheckboxChangeInputEvento = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { name } = event.target;
  const isChecked = event.target.checked;

  setItensSelecionadosEvento((prevSelecionados) => {
    if (isChecked) {
      return [...prevSelecionados, name];
    } else {
      return prevSelecionados.filter((item) => item !== name);
    }
  });
};

const checkboxItemsEvento = resultadosEventos.slice(0, 6).map((resultado) => (
  <li
    key={resultado.term}
    className="checkboxLabel group list-none inline-flex mr-4 mb-4 group overflow-hidden"
    onMouseDown={(e) => e.preventDefault()}
  >
    <label className="group-checked:bg-blue-400 cursor-pointer border-[1px] bg-blue-100 border-blue-400 hover:text-blue-400 flex h-10 items-center px-4 text-gray-400 rounded-lg text-xs font-bold hover:border-blue-400 hover:bg-blue-100">
      <span className="text-center block">{resultado.term.replace(/;/g, ' ')}</span>
      <input
        type="checkbox"
        name={resultado.term}
        className="absolute hidden group"
        checked={itensSelecionadosEvento.includes(resultado.term)}
        id={resultado.term}
        onChange={handleCheckboxChangeInputEvento}
        onClick={handleClickEventos}
      />
    </label>
  </li>
));
const valoresEventoSelecionados = itensSelecionadosEvento.join(';');

const valoresSelecionadosEventoJSX = itensSelecionadosEvento.map((valor, index) => (
  <li key={index} className='whitespace-nowrap gap-2 bg-[#FFF2E6] border-orange-400 border-[1px] inline-flex h-10 items-center px-4 text-gray-400 rounded-lg text-xs font-bold'>{valor.replace(/;/g, ' ')}
    <button onClick={() => handleRemoverSelecionadoEvento(index)}><X size={16} className="text-gray-400 hover:text-orange-400" /></button>
  </li>
));

const handleRemoverSelecionadoEvento = (index: number) => {
  setItensSelecionadosEvento((prevSelecionados) =>
    prevSelecionados.filter((_, i) => i !== index)
  );
};

// Patente
const [itensSelecionadosPatente, setItensSelecionadosPatente] = useState<string[]>([]);

const handleCheckboxChangeInputPatente = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { name } = event.target;
  const isChecked = event.target.checked;

  setItensSelecionadosPatente((prevSelecionados) => {
    if (isChecked) {
      return [...prevSelecionados, name];
    } else {
      return prevSelecionados.filter((item) => item !== name);
    }
  });
};

const checkboxItemsPatente = resultadosPatentes.slice(0, 6).map((resultado) => (
  <li
    key={resultado.term}
    className="checkboxLabel group list-none inline-flex mr-4 mb-4 group overflow-hidden"
    onMouseDown={(e) => e.preventDefault()}
  >
    <label className="group-checked:bg-blue-400 cursor-pointer border-[1px]   flex h-10 items-center px-4 text-gray-400 rounded-lg text-xs font-bold bg-blue-100 border-blue-400 hover:text-blue-400 hover:border-blue-400 hover:bg-blue-100">
      <span className="text-center block">{resultado.term.replace(/;/g, ' ')}</span>
      <input
        type="checkbox"
        name={resultado.term}
        className="absolute hidden group"
        checked={itensSelecionadosPatente.includes(resultado.term)}
        id={resultado.term}
        onChange={handleCheckboxChangeInputPatente}
        onClick={handleClickPatentes}
      />
    </label>
  </li>
));


const valoresPatenteSelecionados = itensSelecionadosPatente.join(';');

const valoresSelecionadosPatenteJSX = itensSelecionadosPatente.map((valor, index) => (
  <li key={index} className='whitespace-nowrap gap-2 bg-[#E9F4F4] border-cyan-400 border-[1px] inline-flex h-10 items-center px-4 text-gray-400 rounded-lg text-xs font-bold'>{valor.replace(/;/g, ' ')}
    <button onClick={() => handleRemoverSelecionadoPatente(index)}><X size={16} className="text-gray-400 hover:text-cyan-400" /></button>
  </li>
));

const handleRemoverSelecionadoPatente = (index: number) => {
  setItensSelecionadosPatente((prevSelecionados) =>
    prevSelecionados.filter((_, i) => i !== index)
  );
};



useEffect(() => {
  if (inputValue.trim().length >= 1) {

    enviarRequisicao();
  }
}, [inputValue]);


console.log('messages 2',messages)


  return (
    <div>
     <Header/>

     <div className='pt-24 px-16 flex h-screen'>

<div className='h-full w-[350px] border-r border-r-gray-300'>
  fgb
</div>
     

      <div className='w-full'>


      <div className='flex flex-col w-full pl-16'>
        {isLoading && (
          <div  className='flex gap-4 max-w-[650px] mb-6'>
          <div className='h-10 min-w-10 w-10 rounded-xl '>
            <SvgMaria/>
          </div>
          <div className='flex flex-1 flex-col'>
          <div className='flex w-full gap-2 items-center mb-2'><h5 className='font-medium text-gray-400 text-lg'>MarIA</h5><p className='text-xs'> </p></div>
         
          </div>
        </div>
        )}
        {messages.map((message, i) => {
          if (message.role === '|assistant') {
            return (
              <div key={i} className='flex gap-4 max-w-[650px] mb-6'>
                <div className='h-10 min-w-10 w-10 rounded-xl '>
                  <SvgMaria/>
                </div>
                <div className='flex flex-1 flex-col'>
                <div className='flex w-full gap-2 items-center mb-2'><h5 className='font-medium text-gray-400 text-lg'>{message.role == "|assistant" && `MarIA`}</h5><p className='text-xs'> </p></div>
                {message.content}
                </div>
              </div>
            );
          } else if (message.role === '|user') {
            return (
              <div key={i} className='flex gap-4 max-w-[300px] ml-auto mb-6 float-right'>
              
              <div>
              <div className='flex w-full gap-2 ml-auto items-center justify-end mb-2'><p className='text-xs'>           </p><h5 className='font-medium text-gray-400 text-lg'>{message.role == "|user" && `Você`}</h5></div>
              <p className='p-2 px-4 rounded-xl rounded-tr-none  text-white bg-blue-400'>{message.content}</p>
              </div>

              <div className='h-10 whitespace-nowrap min-w-[40px] w-10 rounded-xl border botder-gray-300' style={{ backgroundImage: `url(${user.photoURL})` }}></div>
            </div>
            )
          } else if (message.role === 'system') {
            ``
          }
        })}
      </div>

      <div className='flex flex-col  fixed bottom-0 left-0 w-full pl-[478px] px-16  items-center justify-center'>
      <div className='w-full flex overflow-x-auto whitespace-nowrap'>
      <div className='w-full whitespace-nowrap flex-nowrap flex gap-3 mb-3 overflow-x-auto'>
  {botaoTermosClicado ? checkboxItems :
   botaoResumoClicado ? checkboxItemsResumo :
   botaoAreasClicado ? checkboxAreas :
   botaoPatentesClicado ? checkboxItemsPatente :
   botaoEventosClicado ? checkboxItemsEvento :
   botaoLivrosCapitulosClicado ? checkboxLivros :
   botaoPesquisadoresClicado ? checkboxPesquisadores :
   null}
</div>
      </div>



     <div className={`p-4 border border-gray-300 group rounded-2xl w-full mb-16 min-h-[100px] flex-col transition-all ${botaoTermosClicado ? 'hover:border-blue-400' : ''} ${botaoLivrosCapitulosClicado ? 'hover:border-pink-400' : ''} ${botaoEventosClicado ? 'hover:border-orange-400' : ''} ${botaoResumoClicado ? 'hover:border-yellow-400' : ''} ${botaoAreasClicado ? 'hover:border-green-400' : ''} ${botaoPesquisadoresClicado ? 'hover:border-red-400' : ''} ${botaoPatentesClicado ? 'group-hover:border-cyan-400' : ''}`}>
     <div className={`flex  items-center h-10  w-full  text-base font-medium  justify-center transition  `}>
                <MagnifyingGlass size={20} className={`text-gray-400 min-w-[38px] ${botaoTermosClicado ? 'group-hover:text-blue-400' : ''} ${botaoResumoClicado ? 'group-hover:text-yellow-400' : ''} ${botaoLivrosCapitulosClicado ? 'group-hover:text-pink-400' : ''} ${botaoEventosClicado ? 'group-hover:text-orange-400' : ''} ${botaoAreasClicado ? 'group-hover:text-green-400' : ''} ${botaoPesquisadoresClicado ? 'group-hover:text-red-400' : ''} ${botaoPatentesClicado ? 'group-hover:text-cyan-400' : ''}`} />
              
                <input
                  type="text"
                  onChange={(e) => setInputValue(e.target.value)}
                  name=""
                  placeholder={`Digite sua mensagem para que a MarIA consiga selecionar os pesquisadores`}
                  id="inputQuestion" className={`flex flex-1 h-full outline-none`} />

<div className='flex items-center justify-center'>
  
                  <div className={`absolute z[-999] animate-ping gap-4 text-white rounded-xl h-[28px] w-[28px] justify-center hover:bg-blue-500  font-medium transition ${botaoTermosClicado ? 'bg-blue-400' : ''} ${botaoResumoClicado ? 'bg-yellow-400' : ''} ${botaoAreasClicado ? 'bg-green-400' : ''} ${botaoEventosClicado ? 'bg-orange-400' : ''} ${botaoLivrosCapitulosClicado ? 'bg-pink-400' : ''} ${botaoPesquisadoresClicado ? 'bg-red-400' : ''} ${botaoPatentesClicado ? 'bg-cyan-400' : ''}`}></div>
                  <div onClick={handleMaria} className={`cursor-pointer flex z-[999] relative  items-center gap-4 text-white rounded-xl h-[38px] w-[38px] justify-center  font-medium transition ${botaoTermosClicado ? 'bg-blue-400' : ''} ${botaoResumoClicado ? 'bg-yellow-400' : ''} ${botaoAreasClicado ? 'bg-green-400' : ''} ${botaoEventosClicado ? 'bg-orange-400' : ''} ${botaoLivrosCapitulosClicado ? 'bg-pink-400' : ''} ${botaoPesquisadoresClicado ? 'bg-red-400' : ''} ${botaoPatentesClicado ? 'bg-cyan-400' : ''}`}><PaperPlaneTilt size={16} className="text-white" /></div>
                </div>
              </div>

     <div className='flex mt-2 justify-between items-center w-full'>
<div></div>

<div className='flex gap-2'>
{isTab && (
    <div className='flex gap-2'>
      <div  className={`outline-none cursor-pointer text-sm rounded-xl text-gray-400 flex items-center  justify-center  gap-2  font-semibold transition ${botaoTermosClicado ? "activeTermos px-4 py-2" : ('hover:bg-gray-100 w-[38px]')}`} onClick={handleClickTermos} >
                  <Quotes size={16} className="" />
                  {selectedTab === 0 && botaoTermosClicado && <span>Termo</span>}
                </div>

                <div className={`outline-none cursor-pointer text-sm rounded-xl text-gray-400 flex items-center  justify-center  gap-2  font-semibold transition ${botaoResumoClicado ? "activeResumo px-4 py-2" : ('hover:bg-gray-100 w-[38px]')}`} onClick={handleClickResumo} >
                  <TextAlignLeft size={16} className="" />
                  {selectedTab === 1 && botaoResumoClicado && <span>Resumo</span>}
                </div>

                <div className={` whitespace-nowrap outline-none cursor-pointer text-sm text-gray-400 rounded-xl flex items-center gap-2 justify-center font-semibold  transition ${botaoLivrosCapitulosClicado ? "activeLivrosCapitulos px-4 py-2" : ('hover:bg-gray-100 w-[38px]')}`} onClick={handleClickLivrosCapitulos} >
                  <Books size={16} className="" />
                  {selectedTab === 5 && botaoLivrosCapitulosClicado && <span>Livros e capítulos</span>}
                </div>

                <div  className={` whitespace-nowrap outline-none cursor-pointer text-sm text-gray-400 rounded-xl flex items-center gap-2 justify-center font-semibold  transition ${botaoEventosClicado ? "activeEventos px-4 py-2" : ('hover:bg-gray-100 w-[38px]')}`} onClick={handleClickEventos} >
                  <Ticket size={16} className="" />
                  {selectedTab === 6 && botaoEventosClicado && <span>Participação em eventos</span>}
                </div>

                <div className={`outline-none cursor-pointer text-sm text-gray-400 rounded-xl flex items-center gap-2 justify-center font-semibold  transition ${botaoAreasClicado ? "activeAreas px-4 py-2" : ('hover:bg-gray-100 w-[38px]')}`} onClick={handleClickAreas}>
                  <Lightbulb size={16} className="" />
                  {selectedTab === 2 && botaoAreasClicado && <span>Áreas</span>}
                </div>

                <div  className={` outline-none cursor-pointer text-sm text-gray-400 rounded-xl flex items-center gap-2 justify-center font-semibold  transition ${botaoPatentesClicado ? "activePatente px-4 py-2" : ('hover:bg-gray-100 w-[38px]')}`} onClick={handleClickPatentes} >
                  <Copyright size={16} className="" />
                  {selectedTab === 4 && botaoPatentesClicado && <span>Patente</span>}
                </div>

                <div  className={` outline-none cursor-pointer text-sm text-gray-400 rounded-xl flex items-center gap-2 justify-center  font-semibold  transition ${botaoPesquisadoresClicado ? "activePesquisadores px-4 py-2" : ('hover:bg-gray-100 w-[38px]')}`} onClick={handleClickPesquisadores} >
                  <IdentificationCard size={16} className="" />
                  {selectedTab === 3 && botaoPesquisadoresClicado && <span>Nome</span>}
                </div>
    </div>
  )}

<div onClick={() => handleClickClose()} className={`cursor-pointer flex z-[999] relative  items-center gap-3 text-gray-400  rounded-xl h-[38px] w-[38px] justify-center  font-medium transition ${isTab ? (`bg-gray-100 hover:bg-gray-300`):(`bg-gray-50 hover:bg-gray-100`)}`}>{!isTab ? (<Plus size={16} className="" />):(<X size={16} className="" />)}</div>
<div  className={`cursor-pointer flex z-[999] relative  items-center gap-3 text-gray-400 hover:bg-gray-100 rounded-xl h-[38px] px-4 justify-center  font-medium transition bg-gray-50`}><Trash size={16} className="" />Limpar</div>
</div>
     </div>
     </div>
     </div>

      </div>
     
    
     </div>
    </div>
  );
};


