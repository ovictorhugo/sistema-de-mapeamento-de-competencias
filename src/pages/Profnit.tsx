import { Header } from "../components/Header";
import { MapProfnit } from "../components/MapProfnit";
import { Route, useParams } from 'react-router-dom';
import { Footer } from "../components/Footer";

export function Profnit() {

    const { userId } = useParams<{
        userId: string;
  
      }>();

    return  (
        <div>
            <Header/>
            <MapProfnit id={userId || ''}/>
            <Footer/>
          
        </div>
    )
}