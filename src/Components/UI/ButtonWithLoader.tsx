import { Loader } from "./Loader.tsx";
import React, { useState } from "react";

type ButtonWithLoaderProps = {
    text: string,
    loadingText: string,
    onClick: () => Promise<void> // async func
    textTailwind?: string,
    bgTailwind?: string
}

const ButtonWithLoader = (props: ButtonWithLoaderProps) => {
    let [isLoading, setIsLoading] = useState(false);

    const handleOnClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setIsLoading(true);
        const button = e.target as HTMLButtonElement
        button.disabled = true;

        await props.onClick();

        setIsLoading(false); 
        button.disabled = false;
    };

    const standardStyle = "inline-flex justify-center border border-transparent " +
        "px-4 py-2 text-sm font-medium focus:outline-none " +
        "disabled:active:bg-gray-300 disabled:bg-gray-300 " +
        "relative items-center";
    const textStyle = (props.textTailwind ?? "text-blue-900 rounded-md") + " ";
    const bgStyle = (props.bgTailwind ?? "bg-blue-100  active:bg-blue-400  hover:bg-blue-200") + " ";

    const buttonStyle = `${standardStyle} ${textStyle} ${bgStyle}`

    return (
        <button type="button" className={buttonStyle} onClick={handleOnClick}>
            {isLoading
            ? <><p className="block">{props.loadingText}</p><Loader/></>
            : <>{props.text}</>}
        </button>
    );
};

export { ButtonWithLoader }