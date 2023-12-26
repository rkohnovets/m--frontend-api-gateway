import { Fragment, useState } from "react";
import styles from './ProfileInput.module.css'
import { Loader } from "../Loader";

type ProfileInputProps = {
    multiline?: boolean
    editable: boolean
    name: string
    labelText: string
    type?: string
    value?: string | number | undefined
    onChange: (value: string) => void
    onSubmit: () => Promise<void> // async func
}

const ProfileInput = ({multiline, editable, name, labelText, type, value, onChange, onSubmit} : ProfileInputProps) => {
    const [ disabled, setDisabled ] =  useState<boolean>(true)
    const [ loading, setLoading ] = useState<boolean>(false)

    const handeEditButton = () => setDisabled(false)

    //const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    const handleSubmitButton = async () => {
        setLoading(true)

        await onSubmit()
        //await sleep(1000)

        setLoading(false)
        setDisabled(true)
    }

    const labelStyle = 'block text-indigo-500'
    const inputStyle = 'w-full p-2 text-indigo-700 border-b-2 border-indigo-500 outline-none bg-white ' +
        'focus:bg-gray-300'

    const editSvgIcon = (
        <svg className='h-4' viewBox="0 0 512 512">
            <path 
                fill='white'
                d="M387.182,0L0,387.181V512h124.818L512,124.819L387.182,0z M104.879,463.858H48.142v-56.735l282.303-282.303l56.735,56.735 L104.879,463.858z M364.486,90.78l22.694-22.694l56.737,56.734l-22.696,22.696L364.486,90.78z"/>
        </svg>
    )
    const editButton = (
        <div onClick={handeEditButton} className='flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700'>
            {editSvgIcon}
        </div>
    )
    const submitSvgIcon = (
        <svg className='h-4' viewBox="0 0 548.873 548.873">
            <polygon fill="white" points="449.34,47.966 195.46,301.845 99.533,205.917 0,305.449 95.928,401.378 195.46,500.907 294.99,401.378 548.873,147.496 "/>
        </svg>
    )
    const submitButton = (
        <div onClick={handleSubmitButton} className='flex items-center justify-center bg-lime-500 hover:bg-lime-600 active:bg-lime-700'>
            {submitSvgIcon}
        </div>
    )

    const loadingButton = (
        <div className='flex items-center justify-center bg-slate-500'>
            <Loader/>
        </div>
    )

    const getButton = () => {
        if(!editable)
            return <Fragment/>
        if(loading)
            return loadingButton
        if(disabled)
            return editButton
        else
            return submitButton
    }

    const button = getButton()

    const divStyle = editable ? styles.inputAndButtonContainer : ''

    return (
        <div>
            <label className={labelStyle} htmlFor={name}> {labelText} </label>
            <div className={'  ' + divStyle}>
                { !multiline ?
                (<input value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}
                    className={inputStyle} type={type} name={name}/>) : 
                (<textarea value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}
                    className={inputStyle + ' min-h-[100px]'} name={name}/>)}
                {button}
            </div>
        </div>
    )
}

export default ProfileInput