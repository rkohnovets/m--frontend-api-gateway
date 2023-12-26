import { Loader } from "./Loader.tsx";

type FormSubmitButtonProps = {
    text: string,
    disabled: boolean
}

export const FormSubmitButton = ({text, disabled} : FormSubmitButtonProps) => {
    return (
        <button type="submit" disabled={disabled} className="w-full
            bg-indigo-700 hover:bg-pink-700 active:bg-pink-900
            text-white font-semibold py-2 px-4 my-2 rounded
            disabled:active:bg-gray-700 disabled:bg-gray-700
            inline-flex justify-center items-center">
            
            <p className="block">{text}</p>
            {disabled && <Loader widthTailwind="w-4" heightTailwind="h-4"/>}
        </button>
    );
}