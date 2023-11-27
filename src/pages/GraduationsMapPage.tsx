import { Header } from "../components/Header";
import { MapProfnit } from "../components/MapProfnit";
import { Route, useParams } from 'react-router-dom';
import { Footer } from "../components/Footer";
import { Graduations } from "../components/Graduations";

export function GraduationsMapPage() {

    const { userId } = useParams<{
        userId: string;
  
      }>();

    return  (
        <div>
            <Header/>
            <Graduations id={userId || ''}/>
            <Footer/>
          
        </div>
    )
}