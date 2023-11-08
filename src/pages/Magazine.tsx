import { ContentMagazine } from "../components/ContentMagazine";
import { Footer } from "../components/Footer";
import { Route, useParams } from 'react-router-dom';
export function Magazine() {
  const { program } = useParams<{
    program: string,

  }>();
    return  (
        <div>
          <ContentMagazine program={program || ''}/>
          <Footer/>
        </div>
    )
}