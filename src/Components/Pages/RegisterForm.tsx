import { useState } from 'react';
import { InputWithLabel } from '../UI/InputWithLabel';
import { FormSubmitButton } from '../UI/FormSubmitButton';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Auth/AuthContext';
import type { RegisterOrLoginInfo } from "../../Auth/AuthContext";

export const RegisterForm = () => {
    let [username, setUsername] = useState('');
    let [password, setPassword] = useState('');
    let [confirmPassword, setConfirmPassword] = useState('');
    let [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    let [userMessage, setUserMessage] = useState<string | null>(null)

    let navigate = useNavigate();
    let location = useLocation();
    let auth = useAuth();

    let from = location.state?.from?.pathname || "/";

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(password != confirmPassword) {
            setUserMessage('Passwords are not equal')
            return
        }
        
        setSubmitButtonDisabled(true);
        setUserMessage(null)

        let registerData: RegisterOrLoginInfo = {
            username: username,
            password: password
        }

        try {
            const result = await auth.signUp(
                registerData,
                () => navigate(from, { replace: true })
            )

            if(!result.succeeded) {
                if(result.message.startsWith("USERMESSAGE ")) {
                    const message = result.message.substring(12)
                    setUserMessage(message)
                }
                else {
                    console.log(result.message)
                    setUserMessage('Ошибка на стороне сервера')
                }
            }
        } catch(ex) {
            alert(ex)
        } finally {
            setSubmitButtonDisabled(false)
        }
    };

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
                    {userMessage.split('\n').map(str => <p className='text-left'>{str}</p>)}
                </div>) }
            <div className={formBlockStyle}>
                <form onSubmit={handleSubmit} autoComplete='off'>
                    <InputWithLabel name="username" labelText='Username' type='text'
                        onChange={(new_val) => setUsername(new_val)} value={username}/>
                    <InputWithLabel name="password" labelText='Password' type='password'
                        onChange={(new_val) => setPassword(new_val)} value={password}/>
                    <InputWithLabel name="confirm_password" labelText='Confirm Password' type='password'
                        onChange={(new_val) => setConfirmPassword(new_val)} value={confirmPassword}/>
                    <FormSubmitButton text='Register' disabled={submitButtonDisabled}/>
                </form>
            </div>
        </>
    );
}