import React from "react";
import { useAuth } from '../../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LogoutForm = () => {
    let navigate = useNavigate();
    let auth = useAuth();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            auth.signOut(() => navigate('/'));
        } catch(ex) {
            alert(ex);
        }
    };

    return (
    <div className="flex py-10 w-full">
        <div className="w-full max-w-xs m-auto bg-indigo-100 rounded p-5">
            <form onSubmit={handleSubmit}>
                <div>          
                    <input value='Log Out' 
                        className="w-full bg-indigo-700 hover:bg-pink-700 
                            text-white font-bold py-2 px-4 rounded" 
                        type="submit"/>
                </div>       
            </form>
        </div>
    </div>);
}