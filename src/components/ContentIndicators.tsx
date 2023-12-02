import { Header } from "./Header";

export function ContentIndicators() {

    return (
        <div>
            <Header />


            <div className="w-full h-[100vh]">
                <iframe
                    title="Report Section"
                    className="w-full h-full pt-24 bg-[#f9f9f9]"
                    src="https://app.powerbi.com/view?r=eyJrIjoiNTEwMjUxMzktMzZjYS00ZjM1LWJhYzYtZDY3Y2I2YzE1ZGRiIiwidCI6IjcyNjE3ZGQ4LTM3YTUtNDJhMi04YjIwLTU5ZDJkMGM1MDcwNyJ9"
                ></iframe>
            </div>

        </div>
    )
}