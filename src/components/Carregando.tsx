import Lottie from "lottie-react";
import loading from "./loading.json";


function Carregando() {

  
  return (
    <div className="w-28">
       <Lottie animationData={loading} loop={true}/>
    </div>
  );
}

export default Carregando;