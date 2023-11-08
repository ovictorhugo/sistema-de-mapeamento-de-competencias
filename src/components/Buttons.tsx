import { Link } from "react-router-dom";

interface ButtonProps {
    text: string;
    type: string;
    icon?: JSX.Element;
    link: string;
    className: string;
}

export function Button(props: ButtonProps) {

    return (
        <div className="m-0">
            {props.type == 'contained' ? (
                <Link to={props.link} className=" ${props.className} p-3 m-0 text-xs bg-blue-400 text-white flex w-min items-center rounded-lg font-bold uppercase gap-2 justify-center hover:bg-blue-500 transition-colors">
                    {props.text}
                </Link>
            ) : (
                <Link to={props.link} className="p-3 text-xs text-green-400 border border-green-400 flex items-center rounded font-bold uppercase gap-2 justify-center hover:bg-green-400 hover:text-white transition-colors">
                    {props.icon}{props.text}
                </Link>
            )}
        </div>
    );
}