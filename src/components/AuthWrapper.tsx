import { Check, GoogleLogo } from "phosphor-react";
import { render } from "react-dom";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { LogoSimcc } from "./LogoSimcc";
import Typical from 'react-typical'
import { useState } from "react";

interface AuthWrapperProps {
    title: string;
    subtitle: string;
    link: string;
    textLink: any;
    children: any;
  
}

export function AuthWrapper(props: AuthWrapperProps) {

    const [uni, setUni] = useState([
        { id: 1, itens: 'https://www.ufba.br/sites/portal.ufba.br/files/brasao_ufba.jpg', name: `UFBA` },
        { id: 2, itens: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Bras%C3%A3o_da_UNEB.png', name: `UNEB` },
        { id: 3, itens: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Bras%C3%A3o_UESC.svg/1200px-Bras%C3%A3o_UESC.svg.png', name: `UESC` },
        { id: 4, itens: 'https://www.ufrb.edu.br/ascom/images/documentos/marca/01_-_Preferencial.png', name: `UFRB` },
        { id: 5, itens: 'https://www.gov.br/participamaisbrasil/blob/ver/15486?w=0&h=0', name: `UFSB` },
        { id: 6, itens: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Instituto_Federal_da_Bahia_-_Marca_Vertical_2015.svg/1200px-Instituto_Federal_da_Bahia_-_Marca_Vertical_2015.svg.png', name: `IFBA` },
        { id: 7, itens: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Bras%C3%A3o_da_UFOB.png', name: `UFOB` },
        { id: 8, itens: 'https://upload.wikimedia.org/wikipedia/commons/d/db/Bras%C3%A3o_da_UEFS.png', name: `UEFS` },
        { id: 10, itens: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Bras%C3%A3o-uesb.jpg', name: `UESB` },
        { id: 11, itens: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Instituto_Federal_Baiano_-_Marca_Vertical_2015.svg/640px-Instituto_Federal_Baiano_-_Marca_Vertical_2015.svg.png', name: `IF Baiano` },
        { id: 12, itens: 'data:image/png;base64,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', name: `CIMATEC` },
      ]);

    const isAdmin = location.pathname === `/admin`
        return  (
            <div className="flex relative min-h-[100vh] px-6 md:px-16 py-4 items-center">
                <div className="flex-1 z-[999999] flex-col flex justify-center">
                <Link to={`/`} className=" h-[50px] w-fit z-[999] mb-8">
                <LogoSimcc />
                </Link>

                <div>
                    <h1 className={` text-4xl font-medium max-w-[750px]   ${isAdmin ? (`text-gray-400`):(`text-white`)}`}>Uma <strong className="bg-blue-400 text-white font-medium">plataforma</strong> para</h1>
                <h1 className={` ${isAdmin ? (`text-gray-400`):(`text-white`)} text-4xl mb-4 font-medium max-w-[750px] `}>
                <Typical
        steps={['encontrar pesquisadores', 3000, 'ver produções científicas', 3000, 'fazer baremas de avaliação', 3000, 'analisar dados da pós-graduação', 3000, 'olhar produções técnicas', 3000,]}
        loop={Infinity}
        wrapper="p"
        
      />
                </h1>
                </div>

                {isAdmin ? (
                    <div className="flex gap-4 mt-8 max-w-[800px] flex-wrap">
                        {uni.map(props => {
                            return(
                                <div className="h-28 w-28 border bg-white border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center">
    <img className="object-cover h-full " src={props.itens} alt="" />
    <p className="text-gray-400 text-sm mt-2">{props.name}</p>
</div>

                            )
                        })}
                        
                    </div>
                ): (``)}
                </div>
                <div className="w-[480px] bg-white  rounded-xl p-14 h-[min-content]">
                    <h1 className="max-w-[600px] text-left text-4xl font-bold ">{props.title}</h1>
                    <div className="flex mt-2 mb-8">
                        <p className=" max-w-[600px] text-gray-400 text-base font-semibold mr-1">{props.subtitle}</p>
                        <Link to={props.link}><p className=" max-w-[600px] text-base text-blue-400 font-semibold hover:text-blue-500 transition-colors">{props.textLink}</p></Link>
                    </div>
    
                    {props.children}
    
                   <p className=" w-full  text-center text-sm  font-semibold transition-colors mt-4 text-gray-400">Universidade ou Instituição?  <Link to={`/admin`}><strong className="text-blue-400 hover:text-blue-500"> Módulo Administrativo</strong></Link></p>
                </div>
            </div>
        );

}