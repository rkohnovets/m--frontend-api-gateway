type LoaderProps = {
    // for example, "w-4"
    widthTailwind?: string,
    // for example, "h-4"
    heightTailwind?: string
}

const Loader = ({widthTailwind, heightTailwind}: LoaderProps) => {
    const w = widthTailwind ?? "w-4"
    const h = heightTailwind ?? "h-4"
    const loaderStyle = `m-1 animate-spin inline-block ${w} ${h}` +
            `border-4 border-black border-l-transparent rounded-full`
    return (
        <div className="flex justify-center items-center">
            <div className={loaderStyle}/>
        </div>
    );
}

export { Loader }