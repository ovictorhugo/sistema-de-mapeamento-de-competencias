import { Header } from "../components/Header";
import { MapProfnit } from "../components/MapProfnit";
import { Route, useParams } from 'react-router-dom';
import { Footer } from "../components/Footer";
import { ContentProfnit } from "../components/ContentProfnit";

export function PaginaInicial() {

    const { userId } = useParams<{
        userId: string;
  
      }>();

    return  (
        <div>
            <Header/>
            < MapProfnit id={userId || ''}/>
            <Footer/>
          
        </div>
    )
}