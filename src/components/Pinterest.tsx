import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/context";
import Typical from 'react-typical'

interface ResearcherId {
    lattes_10_id: string
    lattes: string
    name: string
    id:string
  }

export function Pinterest() {
    const { urlGeral, setUrlGeral } = useContext(UserContext);

    const [ResearcherImage, setResearcherImage] = useState<ResearcherId[]>([])
    const urlResearcherImage = urlGeral + 'researcher_image'

    const [animationStep, setAnimationStep] = useState(0);

    const steps = [
        { text: 'encontrar pesquisadores', duration: 1000 },
        { text: 'ver produções científicas', duration: 1000 },
        { text: 'fazer baremas de avaliação', duration: 1000 },
        { text: 'analisar dados da pós-graduação', duration: 1000 },
        { text: 'olhar produções técnicas', duration: 1000 },
      ];
    
      useEffect(() => {
        const intervalId = setInterval(() => {
          setAnimationStep((prevStep) => (prevStep + 1) % steps.length);
        }, steps[animationStep].duration || 3000);
    
        return () => clearInterval(intervalId);
      }, [animationStep, steps]);

    useEffect(() => {

        fetch(urlResearcherImage, {
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
            const newData = data.map((post: any) => ({
              ...post,
              term: post.term
            }));
            setResearcherImage(newData);
          })
          .catch((err) => {
            console.log(err.message);
          });
      }, [urlResearcherImage]);

    return  (
        <div className="relative">
            <div className="h-[85vh] max-h-[85vh] overflow-y-hidden px-16 mt-24 flex flex-col items-center">

<h3 className="font-medium text-4xl text-gray-400 text-center mb-4">Uma <strong className="bg-blue-400 text-white font-medium text-4xl">plataforma</strong> para</h3>
<p className={`text-gray-400 text-center w-full text-4xl mb-4 font-medium max-w-[750px]`}>
{steps[animationStep].text}
    </p>

<p className="mb-6 text-gray-400 text-lg text-center max-w-[900px]">O Sistema de Mapeamento de Competências é uma plataforma inovadora para encontrar pesquisadores qualificados. Oferece filtros avançados, análise de produções científicas e técnicas, avaliação personalizada e integração de dados acadêmicos. Essa ferramenta simplifica a seleção, garantindo a escolha dos profissionais mais qualificados para as necessidades específicas.</p>
            <div className="grid grid-cols-7 gap-6 w-full relative -top-32">

           <div className="items-center transition ease-in duration-700 delay-100    flex flex-col w-full gap-6 top-10 relative">
           {ResearcherImage.slice(0, 2).map((props, index) => (
            <div className="w-full h-[300px] border border-gray-300 bg-gray-50 bg-cover bg-center bg-no-repeat rounded-xl"
            style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id}) ` }}
            ></div>
         ))}
           </div>

           <div className="items-center  delay-150 flex flex-col w-full gap-6  top-40 relative">
           {ResearcherImage.slice(4, 6).map((props, index) => (
            <div className="w-full h-[300px] border border-gray-300 bg-gray-50 bg-cover bg-center bg-no-repeat rounded-xl"
            style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id}) ` }}
            ></div>
         ))}
           </div>

           <div className="items-center delay-200 flex flex-col w-full gap-6 top-60 relative">
           {ResearcherImage.slice(8, 10).map((props, index) => (
            <div className="w-full h-[300px] border border-gray-300 bg-gray-50 bg-cover bg-center bg-no-repeat rounded-xl"
            style={{ backgroundImage: `url(${urlGeral}ResearcherData/Image?researcher_id=${props.id}) `}}
            ></div>
         ))}
           </div>

           <div className="items-center delay-300 flex flex-col w-full gap-6  top-[400px] relative">
           {ResearcherImage.slice(12, 14).map((props, index) => (
            <div className="w-full h-[300px] border border-gray-300 bg-gray-50 bg-cover bg-center bg-no-repeat rounded-xl"
            style={{ backgroundImage: `url(${urlGeral}ResearcherData/Image?researcher_id=${props.id}) ` }}
            ></div>
         ))}
           </div>

           <div className="items-center  delay-500 flex flex-col w-full gap-6  top-60 relative">
           {ResearcherImage.slice(16, 18).map((props, index) => (
            <div className="w-full h-[300px] border border-gray-300 bg-gray-50 bg-cover bg-center bg-no-repeat rounded-xl"
            style={{ backgroundImage: `url(${urlGeral}ResearcherData/Image?researcher_id=${props.id}) ` }}
            ></div>
         ))}
           </div>

           <div className="items-center delay-700 flex flex-col w-full gap-6  top-40 relative">
           {ResearcherImage.slice(20, 22).map((props, index) => (
            <div className="w-full h-[300px] border border-gray-300 bg-gray-50 bg-cover bg-center bg-no-repeat rounded-xl"
            style={{ backgroundImage: `url(${urlGeral}ResearcherData/Image?researcher_id=${props.id}) ` }}
            ></div>
         ))}
           </div>

           <div className="items-center delay-1000 flex flex-col w-full gap-6 top-10 relative">
           {ResearcherImage.slice(24, 26).map((props, index) => (
            <div className="w-full h-[300px] border border-gray-300 bg-gray-50 bg-cover bg-center bg-no-repeat rounded-xl"
            style={{ backgroundImage: `url(${urlGeral}ResearcherData/Image?researcher_id=${props.id}) ` }}
            ></div>
         ))}
           </div>
            </div>

            
          
          
        </div>

        <div className="w-full  h-80 relative -top-80 bg-gradient-to-t from-white"></div>
        </div>
    )
}