import React from "react";

type InputWithLabelProps = {
    name: string,
    labelText: string,
    type?: string,
    value?: string | number | undefined,
    onChange: (value: string) => void
}

const InputWithLabel = ({name, labelText, type, value, onChange} : InputWithLabelProps) => {
    const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        onChange(value)
    };

    const labelStyle = 'block text-indigo-500'
    const inputStyle = 'w-full p-2 my-2 text-indigo-700 border-b-2 ' +
        'border-indigo-500 outline-none focus:bg-gray-300'

    return (
        <div>
            <label className={labelStyle} htmlFor={name}> {labelText} </label>
            <input value={value} onChange={handleOnChange}
                className={inputStyle} type={type} name={name}/>
        </div>
    )
}

export { InputWithLabel }