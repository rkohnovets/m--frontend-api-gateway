import { useState } from 'react'
import { InputWithLabel} from "../UI/InputWithLabel.tsx"
import { FormSubmitButton } from "../UI/FormSubmitButton.tsx"
import { useAuth } from '../../Auth/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import type { RegisterOrLoginInfo } from "../../Auth/AuthContext";

export const LoginForm = () => {
    let [username, setUsername] = useState('')
    let [password, setPassword] = useState('')
    let [formDisabled, setFormDisabled] = useState(false)
    let [userMessage, setUserMessage] = useState<string | null>(null)

    let navigate = useNavigate()
    let location = useLocation()
    let auth = useAuth()
    
    // 1) если нас редиректнуло на страницу логина,
    // то нужно будет потом редиректнуть назад,
    // на страницу, куда хотел зайти пользователь
    // 2) если же мы сами перешли на страницу логина,
    // то после входа нужно будет перейти на главную страницу
    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        setFormDisabled(true)
        setUserMessage(null)

        // без useState можно было бы вытаскивать значения из формы так:
        //let formData = new FormData(event.currentTarget);
        //let username = formData.get("username") as string;

        let loginData : RegisterOrLoginInfo = {
            username: username,
            password: password
        }
        
        try {
            // если логин произошёл успешно, но редиректим на путь из from
            // replace: true означает, что в истории не будет записано, что мы заходили на страницу входа
            // (чтоб нельзя было залогиненным уже перейти назад на страницу входа, что было бы нелогично)
            const result = await auth.signIn(
                loginData,
                () => navigate(from, { replace: true })
            )

            if(!result.succeeded)
                setUserMessage(result.message)
        } catch(ex) {
            alert(ex)
        } finally {
            setFormDisabled(false)
        }
    };

    const redirectToRegisterPage = () => {
        // хитрая штука - редиректит на страницу регистрации,
        // но страничка регистрации увидит, откуда мы пришли
        // на страницу входа в приложение
        // (крч на путь из переменной from, которая определена выше)
        navigate('/register', {
            state: { from: location.state?.from },
            replace: true
        })
    }

    const formBlockStyle = 'flex flex-col max-w-xs w-full bg-indigo-100 rounded px-5 py-3 mx-auto mt-2'
    const indigoText = 'text-indigo-500'
    return (
        <>
            { (from !== "/") &&
                (<div className={`${formBlockStyle} ${indigoText}`}>
                    You must log in to view the page at: {from}
                </div>) }
            { (userMessage) &&
                (<div className={`${formBlockStyle} text-red-500`}>
                    {userMessage}
                </div>) }
            <div className={formBlockStyle}>
                <form onSubmit={handleSubmit} autoComplete='off'>
                    <InputWithLabel
                        name="username" labelText='Username' type='text'
                        onChange={(new_val) => setUsername(new_val)} value={username}/>
                    <InputWithLabel
                        name="password" labelText='Password' type='password'
                        onChange={(new_val) => setPassword(new_val)} value={password}/>
                    <FormSubmitButton text='Log In' disabled={formDisabled}/>    
                </form>

            </div>
            <div className='flex flex-row-reverse max-w-xs w-full mx-auto mt-2'>
                <a className="cursor-pointer bg-indigo-100 rounded px-4 py-1 text-indigo-700 hover:text-pink-700 text-sm float-right mr-0 ml-2"
                   onClick={redirectToRegisterPage}>
                    Create Account
                </a>
            </div>
        </>
    );
}