import { useContext, useEffect, useState } from "react"
import { UserContext } from "../contexts/context"
import { CursorText } from "phosphor-react"
import Carregando from "./Carregando"


type Research = {
    among: number,
    articles: number,
    book: number,
    book_chapters: number,
    id: string,
    name: string,
    university: string,
    lattes_id: string,
    area: string,
    lattes_10_id: string,
    abstract: string,
    city: string,
    orcid: string,
    image: string
    graduation: string,
    patent: string,
    software: string,
    brand: string,
    lattes_update: Date,
    termo:string 
  }


export function Recomendadas() {
    const { botaoTaxonomiaClicado, setBotaoTaxonomiaClicado } = useContext(UserContext)
    const { urlGeral, setUrlGeral } = useContext(UserContext);
    const { valoresSelecionadosExport, setValoresSelecionadosExport} = useContext(UserContext);
    const [researcher, setResearcher] = useState<Research[]>([]);
    const [researcherCountsByTerm, setResearcherCountsByTerm] = useState<{ [termo: string]: number }>({});
    const [isLoading, setIsLoading] = useState(false);

    interface Termo {
        termos: string;
      }

    let Termos: Termo[] = [];

   

      // Atualize o tipo da variável aqui
      Termos = botaoTaxonomiaClicado.split('/').map((termo) => ({ termos: termo }));
 
      console.log(Termos)
    useEffect(() => {
        const fetchData = async () => {
          setIsLoading(true);
      
          try {
            let totalCount = 0;
            const updatedResearcherData: { [termo: string]: Research[] } = {};
            const updatedResearcherCountsByTerm: { [termo: string]: number } = {};
      
            for (const item of Termos) {
              const urlTermPesquisadores = `${urlGeral}researcher?terms=${item.termos}&university=&type=ARTICLE&graduate_program_id=`;
             
              const response = await fetch(urlTermPesquisadores, {
                mode: 'cors',
                headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'GET',
                  'Access-Control-Allow-Headers': 'Content-Type',
                  'Access-Control-Max-Age': '3600',
                  'Content-Type': 'text/plain',
                },
              });
      
              const data = await response.json();
      
              const researchersArray = Array.isArray(data) ? data : Object.values(data);
      
              // Obter apenas os 4 primeiros pesquisadores
              const firstFourResearchers = researchersArray.slice(0, 4);
      
              const uniqueResearchers = Array.from(new Set(firstFourResearchers.map((researcher) => researcher.id))).map(
                (id) => {
                  const researcherWithTerm: Research = {
                    ...firstFourResearchers.find((r) => r.id === id)!,
                    termo: item.termos,
                  };
                  return researcherWithTerm;
                }
              );
      
              updatedResearcherData[item.termos] = uniqueResearchers;
              updatedResearcherCountsByTerm[item.termos] = uniqueResearchers.length;
              totalCount += uniqueResearchers.length;
      
              setResearcher((prevResearcher) => ({
                ...prevResearcher,
                [item.termos]: firstFourResearchers,
              }));

              
      
              setResearcher(updatedResearcherData);
              setResearcherCountsByTerm(updatedResearcherCountsByTerm);
      
        
            }
          } catch (err) {
            console.error(err);
          } finally {
            setIsLoading(false);
          }
        };
      
        if (botaoTaxonomiaClicado.length > 0) {
          fetchData();
        }
      }, []);
      



    return  (
        <div className="flex gap-8 flex-nowrap overflow-x-auto elementBarra pb-4">
        {isLoading ? (
        <div className="flex gap-3 flex-nowrap">
        {Termos.map((props, index) => (
           
             <div className="group-checked:bg-blue-400 whitespace-nowrap cursor-pointer border-[1px] bg-blue-100 border-blue-400 hover:text-blue-400 flex h-10 items-center px-4 text-gray-400 rounded-lg text-xs font-bold hover:border-blue-400 hover:bg-blue-100">
                {props.termos.replace(/;/g, ' ')}
            </div>
          
         )
         )}

         </div>
        ) : (
          Object.keys(researcher)
            .filter((termo) => researcherCountsByTerm[termo] > 3)
            .map((termo, index) => (
              <div key={index} onClick={() => setValoresSelecionadosExport(termo)} className="cursor-pointer">
                <div className="flex h-fit flex-col ">
                  {/* Renderizar a lista de pesquisadores para cada termo */}
      
                  <ul className="flex rounded-r-xl  items-center mb-2" onClick={() => setValoresSelecionadosExport(termo)} >
                    {researcher[termo].slice(0, 1).map((researcher: any, researcherIndex: any) => (
                      <div className=" p-1 border border-blue-400 rounded-2xl" key={researcherIndex}>
                        <div
                          className={`whitespace-nowrap bg-gray-50 flex items-center justify-center bg-cover bg-center bg-no-repeat h-[44px] w-[44px]  rounded-xl border-1 border-white  `}
                          style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${researcher.lattes_10_id}) ` }}
                        >
                          <div className="h-full w-full rounded-xl z-[99] bg-[#000]  bg-opacity-40 flex items-center justify-center">
                            <CursorText size={24} className="text-white" />
                          </div>
                        </div>
                      </div>
                    ))}
      
                    <div className="rounded-r-xl flex ">
                    {researcher[termo].slice(1, 3).map((researcher: any, researcherIndex: any) => (
                      <div
                        className={`whitespace-nowrap bg-gray-50 bg-cover bg-center bg-no-repeat h-10 w-10  border-1 border-white  `}
                        style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${researcher.lattes_10_id}) ` }}
                        key={researcherIndex}
                      ></div>
                    ))}
                    </div>
                  </ul>
      
                  <div className="flex gap-3 items-center max-w-[170px]">
                    {researcherCountsByTerm[termo] - 3 > 0 && (
                      <p className="p-1 px-3 bg-blue-400 whitespace-nowrap rounded-md text-white text-xs font-medium">
                        + {researcherCountsByTerm[termo] - 3}
                      </p>
                    )}
                    <h3 className="font-medium text-xs truncate">{termo.replace(/;/g, ' ')}</h3>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
      
      
     )
}