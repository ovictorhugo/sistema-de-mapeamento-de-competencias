import { useLocation } from "react-router-dom";
import { Header } from "./Header";

export function ContentIndicators() {

    const location = useLocation();

    // Verifica se a URL é "/programa-teste"
    const isProgramaTeste = location.pathname === `/indicators-pos`;

    return (
        <div>
            <Header />


            <div className="w-full h-[100vh]">
                {isProgramaTeste ? (
                    <iframe
                    title="Report Section"
                    className="w-full h-full pt-24 bg-[#f9f9f9]"
                    src="https://app.powerbi.com/view?r=eyJrIjoiYTllNWFhYmUtNzVlYi00ZDNjLTgwMzItM2M3MGIzMzZjOGFiIiwidCI6IjcyNjE3ZGQ4LTM3YTUtNDJhMi04YjIwLTU5ZDJkMGM1MDcwNyJ9"
                ></iframe>
                ): (
                    <iframe
                    title="Report Section"
                    className="w-full h-full pt-24 bg-[#f9f9f9]"
                    src="https://app.powerbi.com/view?r=eyJrIjoiNTEwMjUxMzktMzZjYS00ZjM1LWJhYzYtZDY3Y2I2YzE1ZGRiIiwidCI6IjcyNjE3ZGQ4LTM3YTUtNDJhMi04YjIwLTU5ZDJkMGM1MDcwNyJ9"
                ></iframe>
                )}
                
            </div>

        </div>
    )
}