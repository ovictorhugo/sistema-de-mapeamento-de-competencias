import { Check, GoogleLogo } from "phosphor-react";
import { render } from "react-dom";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { LogoSimcc } from "./LogoSimcc";

interface AuthWrapperProps {
    title: string;
    subtitle: string;
    link: string;
    textLink: any;
    children: any;
}

export function AuthWrapper(props: AuthWrapperProps) {
        return  (
            <div className="flex relative min-h-[100vh] px-6 md:px-16 py-4 items-center">
                <div className="flex-1 flex items-center">
                <Link to={`/`} className=" h-[50px] w-fit">
                <LogoSimcc />
                </Link>
                </div>
                <div className="w-[480px] bg-white rounded-xl p-14 h-[min-content]">
                    <h1 className="max-w-[600px] text-left text-4xl font-bold ">{props.title}</h1>
                    <div className="flex mt-2 mb-8">
                        <p className=" max-w-[600px] text-base font-semibold mr-1">{props.subtitle}</p>
                        <Link to={props.link}><p className=" max-w-[600px] text-base text-blue-400 font-semibold hover:text-blue-500 transition-colors">{props.textLink}</p></Link>
                    </div>
    
                    {props.children}
    
                    
                </div>
            </div>
        );

}