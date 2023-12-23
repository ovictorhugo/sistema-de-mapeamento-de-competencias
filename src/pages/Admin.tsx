import { ChatContent } from "../components/ChatContent";
import { Dashboard } from "../components/Dashboard";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

export function Admin() {

    return  (
        <div>
            <Header/>
          <Dashboard/>
          <Footer/>
        </div>
    )
}