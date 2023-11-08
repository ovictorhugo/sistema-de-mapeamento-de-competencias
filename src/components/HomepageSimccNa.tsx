import BrazilMap from "./BrazilMap";


export function HomepageSimccNa() {

    return  (
        <div>
          
            <div className="w-screen h-screen max-h-screen overflow-hidden absolute justify-end flex ">
            <div className="h-[150%] ml-auto relative right-[-320px] top-[-150px] ">
            <BrazilMap/>
            </div>
            </div>
        </div>
    )
}