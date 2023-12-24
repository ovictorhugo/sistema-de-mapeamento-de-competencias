import { useContext } from "react";
import { ContentIndicators } from "../components/ContentIndicators";
import { Footer } from "../components/Footer";
import { UserContext } from "../contexts/context";

export function Indicators() {
  
    return  (
        <div>
          <ContentIndicators/>
          <Footer/>
        </div>
    )
}