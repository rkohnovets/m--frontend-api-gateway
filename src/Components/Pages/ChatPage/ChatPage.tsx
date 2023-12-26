import './test.css'
import { useEffect, useState } from "react";
import {NavLink, useParams} from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext.tsx";
import { backend_api_https } from "../../config.ts";
import { Chat, UserChatInfo } from "../../Types/ChatTypes.tsx";

const ChatPage = () => {
    const { user } = useAuth()
    const [ chat, setChat ] = useState<Chat | null>(null)
    const [ messages, setMessages ] = useState<string[] | null>(null)
    const { id } = useParams()

    if(!user)
        return (<p>You are not authenticated</p>)

    const fetchData = async () => {
        let response = await fetch(backend_api_https + '/chats/' + id, {
            method: 'GET',
            mode: 'cors',
            headers: { "Authorization": `Bearer ${user.jwt}` }
        })

        if(response.ok) {
            const body : Chat = await response.json()
            setChat(body)
        } else {
            let text = await response.text()
            alert("Code " + response.status + ", message: " + text)
        }
    }

    useEffect(() => {
        fetchData().catch(console.error)
    }, [])

    if(!chat)
        return (<p>Loading...</p>)

    return (
        <div>
            
        </div>
    )
}

export default ChatPage