import { ContentTerms } from "../components/ContentTerms";
import { Footer } from "../components/Footer";
import { Route, useParams } from 'react-router-dom';

export function Terms() {
    const { program } = useParams<{
        program: string,
    
      }>();

    return  (
        <div>
            <ContentTerms program={program || ''}/>
           <Footer/>
        </div>
    )
}