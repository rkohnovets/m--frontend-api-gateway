import { useEffect, useState } from "react";
import { backend_api_https } from "../../config.ts";
import { useAuth } from "../../Auth/AuthContext.tsx";
import type { UserChats } from "../../Types/ChatTypes.tsx";
import ChatButton from "../UI/ChatButton/ChatButton.tsx";

const ChatsListPage = () => {
    const { jwt } = useAuth()
    const [ userChats, setUserChats ] = useState<UserChats | null>(null);
    if(!jwt)
        return (<p>You are not authenticated</p>)

    const loadUserChats = async () => {
        let response = await fetch(backend_api_https + '/chats/', {
            method: 'GET',
            mode: 'cors',
            headers: { "Authorization": jwt }
        })

        if(response.ok) {
            const responseBody : UserChats = await response.json()
            setUserChats(responseBody)
        } else {
            let text = await response.text()
            alert("Code " + response.status + ", message: " + text)
        }
    }

    useEffect(() => {
        loadUserChats()
            // make sure to catch any error
            .catch(console.error)
    }, [])

    if(!userChats)
        return (<p>Loading...</p>)

    return (
        <div className="max-w-3xl mx-auto">
            <ChatButton {...userChats.notes}/>
            { userChats.other.map(chat => <ChatButton {...chat}/>)}
        </div>
    )
}

export default ChatsListPage;