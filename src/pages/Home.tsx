import { Header } from "../components/Header";
import { Homepage } from "../components/Homepage";
import { Footer } from "../components/Footer";
import { Route, useParams } from 'react-router-dom';


export function Home() {

    const { userId } = useParams<{
        userId: string;
  
      }>();

    return  (
        <div>
          
            <Homepage id={userId || ''}/>
            <Footer/>
        </div>
    )
}