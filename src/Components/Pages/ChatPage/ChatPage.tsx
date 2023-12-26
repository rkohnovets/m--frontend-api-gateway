import styles from './test.module.css'
import { useEffect, useState } from "react"
import { NavLink, useParams } from "react-router-dom"
import { UserInfo, useAuth } from "../../../Auth/AuthContext.tsx"
import { auth_api_https, backend_api_https } from "../../../config.ts"
import { Chat, Message } from "../../../Types/ChatTypes.tsx"
import ThisUserMessageBlock from "./ThisUserMessageBlock.tsx"
import OtherUserMessageBlock from "./OtherUserMessageBlock.tsx"
import { Loader } from '../../UI/Loader.tsx'

type MessagesResponse = {
    items: Message[],
    pageNumber: number,
    totalPages: number
}

const ChatPage = () => {
    const { jwt, user } = useAuth()
    const [ chat, setChat ] = useState<Chat | null>(null)
    const [ messages, setMessages ] = useState<Message[] | null>(null)
    const [ inputText, setInputText ] = useState<string>('')
    const [ errorString, setErrorString ] = useState<string | null>(null)
    const { id : chatId } = useParams()

    if(!jwt || !user)
        return (<p>You are not authenticated</p>)

    const getChatInfo = async () => {
        let response = await fetch(backend_api_https + '/chats/' + chatId, {
            method: 'GET',
            mode: 'cors',
            headers: { "Authorization": jwt }
        })

        if(response.ok) {
            const chatInfo : Chat = await response.json()
            setChat(chatInfo)
            return chatInfo
        } else {
            let text = await response.text()
            throw `Error from server: code ${response.status}, message from server: ${text}`
        }
    }

    const loadMessages = async () => {
        const response = await fetch(backend_api_https + '/messages/' + chatId, {
            method: 'GET',
            mode: 'cors',
            headers: { "Authorization": jwt }
        })

        if(response.ok) {
            const body : MessagesResponse = await response.json()
            //console.log(body)

            setMessages(body.items)
        } else {
            let text = await response.text()
            throw`Error from server: code ${response.status}, message from server: ${text}`
        }
    }

    const createTextMessage = async () => {
        let response = await fetch(backend_api_https + '/messages/' + chatId, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Authorization": jwt,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: inputText })
        })

        if(response.ok) {
            await response.json()
            
            //const message: Message = await response.json()
            //console.log(message)
            // TODO: лучше не заново загружать все сообщения,
            //  а просто добавлять в конец (или в начало)
            //setMessages(curr => [...(curr ?? []), message])
        } else {
            let text = await response.text()
            throw`Error from server: code ${response.status}, message from server: ${text}`
        }
    }

    const handleSendMessage = () => {
        try {
            createTextMessage().then(loadMessages)
        } catch (e) {
            console.error(e)
            setErrorString('Произошла ошибка')
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
        if(!chat) {
            alert('wtf')
            return
        }
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
        try {
            let timerId: number
            getChatInfo()
                .then(initChatName)
                .then(() => timerId = setInterval(loadMessages, 1000))

            return () => clearInterval(timerId)
        } catch (e) {
            console.error(e)
            setErrorString('Произошла ошибка')
        }
    }, [])

    if(errorString)
        return (<p>{errorString}</p>)
    if(!chat || !messages)
        return (<Loader/>)

    return (
        <div className={styles.chatContainer + ' max-w-3xl mx-auto'}>
            <div className={styles.upperPanel + ' bg-indigo-200'}>
                <NavLink to='/chats' className='bg-indigo-300 flex items-center justify-center'>
                    <svg className='mb-1' width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.66088 8.53078C9.95402 8.23813 9.95442 7.76326 9.66178 7.47012C9.36913 7.17698 8.89426 7.17658 8.60112 7.46922L9.66088 8.53078ZM4.47012 11.5932C4.17698 11.8859 4.17658 12.3607 4.46922 12.6539C4.76187 12.947 5.23674 12.9474 5.52988 12.6548L4.47012 11.5932ZM5.51318 11.5771C5.21111 11.2936 4.73648 11.3088 4.45306 11.6108C4.16964 11.9129 4.18475 12.3875 4.48682 12.6709L5.51318 11.5771ZM8.61782 16.5469C8.91989 16.8304 9.39452 16.8152 9.67794 16.5132C9.96136 16.2111 9.94625 15.7365 9.64418 15.4531L8.61782 16.5469ZM5 11.374C4.58579 11.374 4.25 11.7098 4.25 12.124C4.25 12.5382 4.58579 12.874 5 12.874V11.374ZM15.37 12.124V12.874L15.3723 12.874L15.37 12.124ZM17.9326 13.1766L18.4614 12.6447V12.6447L17.9326 13.1766ZM18.25 15.7351C18.2511 16.1493 18.5879 16.4841 19.0021 16.483C19.4163 16.4819 19.7511 16.1451 19.75 15.7309L18.25 15.7351ZM8.60112 7.46922L4.47012 11.5932L5.52988 12.6548L9.66088 8.53078L8.60112 7.46922ZM4.48682 12.6709L8.61782 16.5469L9.64418 15.4531L5.51318 11.5771L4.48682 12.6709ZM5 12.874H15.37V11.374H5V12.874ZM15.3723 12.874C16.1333 12.8717 16.8641 13.1718 17.4038 13.7084L18.4614 12.6447C17.6395 11.8276 16.5267 11.3705 15.3677 11.374L15.3723 12.874ZM17.4038 13.7084C17.9435 14.245 18.2479 14.974 18.25 15.7351L19.75 15.7309C19.7468 14.572 19.2833 13.4618 18.4614 12.6447L17.4038 13.7084Z" fill="#000000"/>
                    </svg>
                </NavLink>
                <div className='bg-indigo-200 flex items-center justify-center'>
                    {chatName ?? <Loader/>}
                </div>
                {/*<div className='bg-indigo-300 flex items-center justify-center'>
                    <p className='mb-2'>...</p>
                </div>*/}
            </div>
            <div className={styles.messagesContainer + ' bg-indigo-50'}>
                {messages.map((message) => (message.sender === user.id)
                    ? (<ThisUserMessageBlock key={message.id} {...message}/>)
                    : (<OtherUserMessageBlock key={message.id} {...message}/>))}
            </div>
            <div className={styles.bottomPanel + ' bg-indigo-200'}>
                <input type='text' className='w-full p-2 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300' onChange={(e) => setInputText(e.target.value)} value={inputText}/>
                <button onClick={handleSendMessage} className='bg-indigo-300 flex items-center justify-center'>
                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 3C12.2652 3 12.5196 3.10536 12.7071 3.29289L19.7071 10.2929C20.0976 10.6834 20.0976 11.3166 19.7071 11.7071C19.3166 12.0976 18.6834 12.0976 18.2929 11.7071L13 6.41421V20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20V6.41421L5.70711 11.7071C5.31658 12.0976 4.68342 12.0976 4.29289 11.7071C3.90237 11.3166 3.90237 10.6834 4.29289 10.2929L11.2929 3.29289C11.4804 3.10536 11.7348 3 12 3Z" fill="#000000"/>
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default ChatPage