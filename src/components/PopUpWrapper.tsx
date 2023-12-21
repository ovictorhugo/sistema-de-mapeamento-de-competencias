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

export function PopUpWrapper(props: AuthWrapperProps) {
        return  (
            <div className="h-screen w-full flex items-center justify-center fixed top-0 left-0 z-[999999]">
                <div className="h-[100vh] bg-[#000]   bg-opacity-30 backdrop-blur-md w-full absolute top-0 left-0 "></div>

                <div className="py-24 h-full w-full px-40 md:px-64 z-[9]">
                <div className="bg-white border-gray-300 border rounded-xl h-full w-full p-6">
                {props.children}
                </div>
                
                </div>
            </div>
        );

}