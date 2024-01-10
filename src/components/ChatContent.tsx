import React, { useContext, useEffect, useState } from 'react';
import { Header } from './Header';
import { Funnel, MagnifyingGlass, PaperPlaneTilt } from 'phosphor-react';
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



export function ChatContent() {
  
  const [inputValue, setInputValue] = useState<string>('');
  const [result, setResult] = useState<{ term: string; type: ResourceType } | null>(null);
  const { user, setUser } = useContext(UserContext);

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

  const processInput = () => {
    const doc = nlp(inputValue)

    console.log(doc)

     // Restante do código permanece inalterado
     let type= '';
     let term: string = '';

    if(doc.has('artigos') || doc.has('artigo') || doc.has('article') || doc.has('articles')) {
      setBotaoPatentesClicado(false)
      setBotaoPesquisadoresClicado(false)
      setBotaoTermosClicado(true)
      setBotaoResumoClicado(false)
      setBotaoAreasClicado(false)
      setBotaoLivrosCapitulosClicado(false)
      setBotaoEventosClicado(false)
      type = 'Termos em artigos';
    
    }

    if(doc.has('resumo') || doc.has('resumos') || doc.has('abstract') || doc.has('abstracts')) {
      setBotaoPatentesClicado(false)
      setBotaoPesquisadoresClicado(false)
      setBotaoTermosClicado(false)
      setBotaoResumoClicado(true)
      setBotaoAreasClicado(false)
      setBotaoLivrosCapitulosClicado(false)
      setBotaoEventosClicado(false)
      type = 'Resumo';
    }

    if(doc.has('patente') || doc.has('patentes') || doc.has('patent') || doc.has('patents')) {
      setBotaoPatentesClicado(true)
      setBotaoPesquisadoresClicado(false)
      setBotaoTermosClicado(false)
      setBotaoResumoClicado(false)
      setBotaoAreasClicado(false)
      setBotaoLivrosCapitulosClicado(false)
      setBotaoEventosClicado(false)
      type = 'Patente';
    }

    if(doc.has('evento') || doc.has('eventos') || doc.has('congressos') || doc.has('congresso') || doc.has('oficinas') || doc.has('oficina') || doc.has('seminários') || doc.has('seminário')) {
      setBotaoPatentesClicado(false)
      setBotaoPesquisadoresClicado(false)
      setBotaoTermosClicado(false)
      setBotaoResumoClicado(false)
      setBotaoAreasClicado(false)
      setBotaoLivrosCapitulosClicado(false)
      setBotaoEventosClicado(true)
      type = 'Participação em eventos';
    }
    let test = doc.verbs().toPastTense()
 

    const palavrasInput = inputValue.toLowerCase().split(/\s+/);

    const substantivosInput = palavrasInput.filter((palavra) => {
      const termo = nlp(palavra);
      return termo.nouns().length > 0;
    });

    const palavrasComuns = words.filter((word: any) => palavrasInput.includes(word.term) && word.type == `ARTICLE`);
   
    console.log(words);
      console.log('Palavras comuns:', palavrasComuns);
     

    // Use compromise para analisar as palavras e extrair informações relevantes
    const terms = doc.nouns().out('array');
    const verbs = doc.verbs().out('array');
    const adjectives = doc.adjectives().out('array');
    const prepositions = doc.prepositions().out('array');
    

   
  };




  const handleMaria = () => {
    try {
      const data =  {
            model: null,
            messages: [
              {
                role: "system",
                content: "Você é um chatbot chamado Maria, e você faz listagens e consultas sobre temas academicos. Fale em portugues e de maneia amigável",
            },
              {
                  role: "user",
                  content: inputValue,
              },
            ]
          }
      

      console.log(data);
      setInputValue('')
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
            
          } else {
            console.error('Erro ao enviar dados para o servidor.');
          }

          const dataGet = await response.json();
        if (dataGet && dataGet.messages) {
          // Adicione as novas mensagens às existentes
          setMessages((prevMessages) => [...prevMessages, ...dataGet.messages]);
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
 
  return (
    <div>
     <Header/>

     <div className='pt-24 px-16 flex'>

<div className='h-full w-[350px] border-r border-r-gray-300'>
  fgb
</div>
     

      <div>


      <div className='flex flex-col'>
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

              <div className='h-10 w-10 rounded-xl border botder-gray-300' style={{ backgroundImage: `url(${user.photoURL})` }}></div>
            </div>
            )
          } else {
            ``
          }
        })}
      </div>

      <div className='flex fixed bottom-0 left-0 w-full pl-[414px] px-16 items-center justify-center'>
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

     
     </div>
     </div>

      </div>
     
    
     </div>
    </div>
  );
};


