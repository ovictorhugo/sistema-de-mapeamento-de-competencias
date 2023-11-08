import { Header } from "./Header";

export function ContentIndicators() {

    return (
        <div>
            <Header />


            <div className="w-full h-[100vh]">
                <iframe
                    title="Report Section"
                    className="w-full h-full pt-24 bg-[#f9f9f9]"
                    src="https://app.powerbi.com/view?r=eyJrIjoiNDVmOTVlNjctMWMzNC00NmFmLTlkZjMtNmZhM2U2NWQxNTljIiwidCI6IjcyNjE3ZGQ4LTM3YTUtNDJhMi04YjIwLTU5ZDJkMGM1MDcwNyJ9"
                ></iframe>
            </div>

        </div>
    )
}