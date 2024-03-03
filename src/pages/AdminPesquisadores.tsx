import { ChatContent } from "../components/ChatContent";
import { DashboardPesquisadores } from "../components/DahboardPesquisadores";
import { Dashboard } from "../components/Dashboard";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

export function AdminPesquisadores() {

    return  (
        <div>
            <Header/>
          <DashboardPesquisadores/>
          <Footer/>
        </div>
    )
}