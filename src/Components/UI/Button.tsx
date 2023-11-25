type ButtonWithLoaderProps = {
    text: string
    disabled: boolean
    onClick: VoidFunction
    textTailwind?: string
    bgTailwind?: string
}

const ButtonWithLoader = (props: ButtonWithLoaderProps) => {
    const standardStyle=
        "inline-flex justify-center border border-transparent " +
        "px-4 py-2 text-sm font-medium focus:outline-none " +
        "disabled:active:bg-gray-300 disabled:bg-gray-300 " +
        "relative items-center";
    const textStyle = (props.textTailwind ?? "text-blue-900 rounded-md");
    const bgStyle = (props.bgTailwind ?? "bg-blue-100  active:bg-blue-400  hover:bg-blue-200");
    const buttonStyle = `${standardStyle} ${textStyle} ${bgStyle}`

    return (
        <button
            type="button" className={buttonStyle}
            onClick={props.onClick}>
            { props.text }
        </button>
    );
};

export { ButtonWithLoader }