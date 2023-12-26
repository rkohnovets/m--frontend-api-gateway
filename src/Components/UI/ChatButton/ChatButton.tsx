import './test.css'
import { Chat, UserChatInfo } from "../../../Types/ChatTypes.tsx";
import {useEffect, useState} from "react";
import { auth_api_https, backend_api_https } from "../../../config.ts";
import {UserInfo, useAuth} from "../../../Auth/AuthContext.tsx";
import {NavLink} from "react-router-dom";
import { Loader } from '../Loader.tsx';

const ChatButton = (userChatInfo: UserChatInfo) => {
    const { jwt, user } = useAuth()

    const [ chat, setChat ] = useState<Chat | null>(null)

    if(!jwt)
        return (<p>You are not authenticated</p>)

    const chatId = userChatInfo.chat

    const fetchData = async () => {
        let response = await fetch(backend_api_https + '/chats/' + chatId, {
            method: 'GET',
            mode: 'cors',
            headers: { "Authorization": jwt }
        })

        if(response.ok) {
            const body: Chat = await response.json()
            setChat(body)
            return body
        } else {
            let text = await response.text()
            alert("Code " + response.status + ", message: " + text)
        }
    }

    const fetchUser = async (id: string) => {
        const url = auth_api_https + '/profile/id/' + id

        let response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: { "Authorization": jwt }
        })

        if(response.ok) {
            const userInfo: UserInfo = await response.json()
            return userInfo
        } else {
            let text = await response.text()
            throw `Error from server: code ${response.status}, message from server: ${text}`
        }
    }

    const [ chatName, setChatName ] = useState<string | null>(null)
    const initChatName = async (chat: Chat | undefined) => {
        if(!chat)
            return
        if(chat?.name) {
            setChatName(chat.name)
            return
        }
        if(chat.type == 'TWOPERSONS') {
            let otherUserId = ""
            for(let chatUser of chat.users)
                if(chatUser.user != user!.id)
                    otherUserId = chatUser.user
            const otherUser = await fetchUser(otherUserId)
            const name = "Chat with " + (otherUser.name 
                ? `${otherUser.name} (@${otherUser.username})` 
                : `@${otherUser.username}`)
            setChatName(name)
            return
        }
        setChatName("Unnamed chat")
    }

    useEffect(() => {
        fetchData()
            .then((chat) => initChatName(chat))
            .catch(console.error)
    }, [])

    if(!chat)
        return (<p>Loading...</p>)

    return (
        <NavLink to={'/chats/' + chat.id} className="chatButton my-1 rounded-2xl h-12 bg-indigo-100 active:bg-indigo-400  hover:bg-indigo-200">
            <div className='m-2 rounded-full bg-indigo-700 text-white flex items-center justify-center'>
                <p>img</p>
            </div>
            <div className='m-2 text-indigo-500 flex items-center'>
                <p>{chatName ?? <Loader/>}</p>
            </div>
            <div className='m-2 rounded-full bg-indigo-700 text-white flex items-center justify-center'>
                <p>cnt</p>
            </div>
        </NavLink>
    )
}

export default ChatButton